import "server-only";
import { betterAuth } from "better-auth";
import { APIError } from "better-auth/api";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { stripe } from "@better-auth/stripe";
import { sendResetPasswordEmail, sendVerificationEmail } from "@/lib/email";
import { prisma } from "@/lib/prisma";
import { stripeClient } from "@/lib/stripe";

// Paiement Stripe (étape 7) : activé seulement si les clés sont dans .env,
// pour que le site fonctionne aussi sans compte Stripe configuré.
const stripePlugins = stripeClient
  ? [
      stripe({
        stripeClient,
        stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET ?? "",
        createCustomerOnSignUp: true,
        subscription: {
          enabled: true,
          plans: [
            { name: "pro", priceId: process.env.STRIPE_PRICE_PRO, limits: { generations: 100 } },
            { name: "expert", priceId: process.env.STRIPE_PRICE_EXPERT, limits: { generations: null } },
          ],
        },
      }),
    ]
  : [];

// Configuration serveur de Better Auth.
// Secret et URL viennent de BETTER_AUTH_SECRET / BETTER_AUTH_URL (.env).
export const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: "postgresql" }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    maxPasswordLength: 128,
    autoSignIn: true, // connecté directement après l'inscription
    // Étape 8a : « Mot de passe oublié » (lien valable 1 heure). Après le
    // changement, toutes les sessions ouvertes sont déconnectées.
    sendResetPassword: async ({ user, url }) => {
      await sendResetPasswordEmail(user.email, user.name, url);
    },
    revokeSessionsOnPasswordReset: true,
  },
  // Étape 8a : vérification de l'adresse e-mail. Le compte est utilisable tout
  // de suite, mais les générations par l'IA attendent la confirmation
  // (voir generateCreation) — évite les comptes avec de fausses adresses.
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    expiresIn: 60 * 60 * 24, // 24 heures
    sendVerificationEmail: async ({ user, url }) => {
      await sendVerificationEmail(user.email, user.name, url);
    },
  },
  user: {
    // Étape 8a : « Supprimer mon compte » (droit à l'effacement, RGPD).
    // Créations, dossiers et sessions sont supprimés en cascade par la base.
    deleteUser: {
      enabled: true,
      beforeDelete: async (user) => {
        await cancelStripeSubscriptions(user.id);
      },
    },
  },
  // Étape 8a : limitation des tentatives (anti-force brute), stockée en base.
  // Sans effet dans npm run dev (activée seulement en production).
  rateLimit: {
    storage: "database",
    window: 60,
    max: 100,
    customRules: {
      "/sign-in/email": { window: 60 * 5, max: 5 },
      "/sign-up/email": { window: 60 * 60, max: 5 },
      "/request-password-reset": { window: 60 * 15, max: 3 },
      "/send-verification-email": { window: 60 * 15, max: 3 },
      "/delete-user": { window: 60 * 5, max: 5 },
    },
  },
  // nextCookies doit rester le dernier plugin : il permet de poser les cookies
  // de session depuis les Server Actions.
  plugins: [...stripePlugins, nextCookies()],
});

/** Résilie immédiatement les abonnements Stripe d'un compte supprimé (factures conservées chez Stripe). */
async function cancelStripeSubscriptions(userId: string) {
  const subs = await prisma.subscription.findMany({
    where: { referenceId: userId, status: { in: ["active", "trialing", "past_due", "incomplete", "unpaid"] } },
    select: { stripeSubscriptionId: true },
  });
  if (stripeClient) {
    for (const s of subs) {
      if (!s.stripeSubscriptionId) continue;
      try {
        await stripeClient.subscriptions.cancel(s.stripeSubscriptionId);
      } catch (error) {
        // Abonnement déjà supprimé chez Stripe : on continue. Toute autre erreur
        // arrête la suppression, pour ne jamais laisser un abonnement payant actif.
        if ((error as { code?: string }).code === "resource_missing") continue;
        console.error("[suppression de compte] Résiliation Stripe impossible :", error);
        throw new APIError("INTERNAL_SERVER_ERROR", {
          message: "STRIPE_CANCEL_FAILED",
          code: "STRIPE_CANCEL_FAILED",
        });
      }
    }
  }
  await prisma.subscription.deleteMany({ where: { referenceId: userId } });
}

export type Session = typeof auth.$Infer.Session;
