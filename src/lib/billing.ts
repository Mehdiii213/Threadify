import "server-only";
import { EXPERT_DAILY_LIMIT, EXPERT_HOURLY_LIMIT, PLANS, isPlanId, type PlanId } from "@/lib/plans";
import { prisma } from "@/lib/prisma";
import { stripeClient } from "@/lib/stripe";

// Abonnement et quotas côté serveur.

/** Paiement configuré ? (clé Stripe et identifiants des prix présents dans .env) */
export function billingEnabled() {
  return Boolean(
    process.env.STRIPE_SECRET_KEY && process.env.STRIPE_PRICE_PRO && process.env.STRIPE_PRICE_EXPERT,
  );
}

/** Abonnement payant en cours (actif, en essai, ou résilié mais encore payé jusqu'à la fin de la période). */
export async function getActiveSubscription(userId: string) {
  return prisma.subscription.findFirst({
    where: { referenceId: userId, status: { in: ["active", "trialing"] } },
    orderBy: { periodStart: "desc" },
  });
}

/**
 * Résiliation programmée ? Stripe l'indique de deux façons selon l'origine :
 * `cancel_at_period_end` (ancienne méthode, API) ou une date `cancel_at`
 * (méthode du portail client Stripe). Renvoie la date de fin, ou null.
 */
export function scheduledEnd(sub: { cancelAtPeriodEnd: boolean | null; cancelAt: Date | null; periodEnd: Date | null }) {
  if (sub.cancelAt) return sub.cancelAt;
  if (sub.cancelAtPeriodEnd) return sub.periodEnd;
  return null;
}

export async function getUserPlan(userId: string): Promise<PlanId> {
  const sub = await getActiveSubscription(userId);
  const plan = sub?.plan.toLowerCase();
  return isPlanId(plan) ? plan : "gratuit";
}

export function monthStart(now = new Date()) {
  return new Date(now.getFullYear(), now.getMonth(), 1);
}

export async function getUsage(userId: string) {
  const plan = await getUserPlan(userId);
  const used = await prisma.generationEvent.count({ where: { userId, createdAt: { gte: monthStart() } } });
  const limit = PLANS[plan].monthlyGenerations;
  return { plan, used, limit, remaining: limit === null ? null : Math.max(0, limit - used) };
}

/** Vérifie qu'une génération est permise ; renvoie un message en français sinon. */
export async function checkQuota(userId: string): Promise<{ ok: true } | { ok: false; error: string; upgrade: boolean }> {
  const usage = await getUsage(userId);
  if (usage.limit !== null && usage.used >= usage.limit) {
    const label = PLANS[usage.plan].label;
    return {
      ok: false,
      upgrade: usage.plan !== "expert",
      error:
        usage.plan === "gratuit"
          ? `Vous avez utilisé vos ${usage.limit} générations gratuites ce mois-ci. Passez à une offre payante pour continuer.`
          : `Vous avez utilisé les ${usage.limit} générations de l'offre ${label} ce mois-ci. Passez à l'offre Expert pour des générations illimitées.`,
    };
  }
  if (usage.plan === "expert") {
    const lastHour = await prisma.generationEvent.count({
      where: { userId, createdAt: { gte: new Date(Date.now() - 60 * 60 * 1000) } },
    });
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const lastDay = await prisma.generationEvent.count({ where: { userId, createdAt: { gte: today } } });
    if (lastDay >= EXPERT_DAILY_LIMIT) {
      return {
        ok: false,
        upgrade: false,
        error: `Vous avez atteint la limite d'usage raisonnable de ${EXPERT_DAILY_LIMIT} générations aujourd'hui. Elle sera remise à zéro demain.`,
      };
    }
    if (lastHour >= EXPERT_HOURLY_LIMIT) {
      return {
        ok: false,
        upgrade: false,
        error: `Beaucoup de générations en peu de temps (${EXPERT_HOURLY_LIMIT} par heure maximum). Réessayez dans un moment.`,
      };
    }
  }
  return { ok: true };
}

export async function recordGeneration(
  userId: string,
  creationId: string,
  usage?: { model: string; inputTokens: number; outputTokens: number; costUsd: number },
) {
  await prisma.generationEvent.create({ data: { userId, creationId, ...usage } });
}

/**
 * Met à jour l'abonnement local d'après Stripe (résiliation, renouvellement…).
 * En production, les webhooks Stripe s'en chargent ; cette synchronisation à la
 * visite de « Mon abonnement » évite d'installer la Stripe CLI pour tester en local.
 */
export async function syncSubscriptionFromStripe(userId: string) {
  if (!stripeClient) return;
  const subs = await prisma.subscription.findMany({
    where: { referenceId: userId, stripeSubscriptionId: { not: null }, status: { in: ["active", "trialing", "past_due"] } },
  });
  for (const sub of subs) {
    try {
      const remote = await stripeClient.subscriptions.retrieve(sub.stripeSubscriptionId!);
      const item = remote.items.data[0];
      const date = (s?: number | null) => (s ? new Date(s * 1000) : null);
      await prisma.subscription.update({
        where: { id: sub.id },
        data: {
          status: remote.status,
          cancelAtPeriodEnd: remote.cancel_at_period_end,
          cancelAt: date(remote.cancel_at),
          canceledAt: date(remote.canceled_at),
          endedAt: date(remote.ended_at),
          periodStart: date(item?.current_period_start) ?? sub.periodStart,
          periodEnd: date(item?.current_period_end) ?? sub.periodEnd,
        },
      });
    } catch (error) {
      console.error("[abonnement] Synchronisation Stripe impossible :", error instanceof Error ? error.message : error);
    }
  }
}
