import "server-only";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { stripe } from "@better-auth/stripe";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";

// Paiement Stripe (étape 7) : activé seulement si les clés sont dans .env,
// pour que le site fonctionne aussi sans compte Stripe configuré.
const stripeKey = process.env.STRIPE_SECRET_KEY;
const stripePlugins = stripeKey
  ? [
      stripe({
        stripeClient: new Stripe(stripeKey),
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
  },
  // nextCookies doit rester le dernier plugin : il permet de poser les cookies
  // de session depuis les Server Actions.
  plugins: [...stripePlugins, nextCookies()],
});

export type Session = typeof auth.$Infer.Session;
