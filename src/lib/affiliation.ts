import "server-only";
import type Stripe from "stripe";
import { AFFILIATION, normalizeReferralCode } from "@/lib/affiliation-config";
import { PLANS, type PlanId } from "@/lib/plans";
import { vatRate } from "@/lib/legal";
import { prisma } from "@/lib/prisma";
import { stripeClient } from "@/lib/stripe";

// ─── Codes de parrainage ──────────────────────────────────────────────────────

const ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789"; // sans 0/O, 1/I/L (lisibles)

function randomSuffix(length: number) {
  const bytes = crypto.getRandomValues(new Uint8Array(length));
  return Array.from(bytes, (b) => ALPHABET[b % ALPHABET.length]).join("");
}

/** Code personnel de l'affilié (créé à la première demande) : prénom + 4 caractères, ex. CAMILLE7K2Q. */
export async function getOrCreateReferralCode(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { referralCode: true, name: true } });
  if (!user) throw new Error("Utilisateur introuvable");
  if (user.referralCode) return user.referralCode;
  const base =
    normalizeReferralCode(
      user.name
        .split(/\s+/)[0]
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, ""), // retire les accents
    ).slice(0, 10) || "AMI";
  for (let i = 0; i < 10; i++) {
    const code = `${base}${randomSuffix(4)}`;
    try {
      const { count } = await prisma.user.updateMany({ where: { id: userId, referralCode: null }, data: { referralCode: code } });
      if (count === 1) return code;
    } catch {
      // Code déjà pris par un autre compte (très rare) : on réessaie avec un autre.
    }
    // Créé en parallèle par une autre requête ?
    const again = await prisma.user.findUnique({ where: { id: userId }, select: { referralCode: true } });
    if (again?.referralCode) return again.referralCode;
  }
  throw new Error("Impossible de créer un code de parrainage");
}

/** Affilié correspondant à un code (ou null). */
export async function findAffiliateByCode(code: string) {
  const c = normalizeReferralCode(code);
  if (c.length < 4) return null;
  return prisma.user.findUnique({ where: { referralCode: c }, select: { id: true, name: true } });
}

/** Le compte a-t-il droit à la réduction de parrainage (filleul, jamais abonné) ? */
export async function isEligibleForReferralDiscount(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { referredById: true } });
  if (!user?.referredById) return false;
  const previous = await prisma.subscription.count({ where: { referenceId: userId, stripeSubscriptionId: { not: null } } });
  return previous === 0;
}

// Coupon Stripe « −20 % sur le 1er mois », créé automatiquement s'il n'existe pas
// (identifiant fixe : fonctionne en mode test comme en mode réel).
const COUPON_ID = `THREADIFY_PARRAINAGE_${AFFILIATION.referralDiscountPercent}`;

export async function ensureReferralCoupon() {
  if (!stripeClient) return null;
  try {
    await stripeClient.coupons.retrieve(COUPON_ID);
  } catch (error) {
    if ((error as { code?: string }).code !== "resource_missing") throw error;
    await stripeClient.coupons.create({
      id: COUPON_ID,
      percent_off: AFFILIATION.referralDiscountPercent,
      duration: "once",
      name: `Parrainage −${AFFILIATION.referralDiscountPercent} % (1er mois)`,
    });
  }
  return COUPON_ID;
}

/**
 * Filleul en abonnement annuel : réduction fixe égale à 20 % d'UN mois
 * (3 € sur Pro, 4,60 € sur Expert), et non 20 % de toute l'année.
 */
export async function ensureAnnualReferralCoupon(plan: PlanId) {
  if (!stripeClient || plan === "gratuit") return null;
  const amountOff = Math.round(PLANS[plan].price * 100 * (AFFILIATION.referralDiscountPercent / 100));
  const id = `THREADIFY_PARRAINAGE_ANNUEL_${plan.toUpperCase()}_${amountOff}`;
  try {
    await stripeClient.coupons.retrieve(id);
  } catch (error) {
    if ((error as { code?: string }).code !== "resource_missing") throw error;
    await stripeClient.coupons.create({
      id,
      amount_off: amountOff,
      currency: "eur",
      duration: "once",
      name: `Parrainage (−${AFFILIATION.referralDiscountPercent} % d'un mois)`,
    });
  }
  return id;
}

// ─── Commissions ──────────────────────────────────────────────────────────────

function addMonths(date: Date, months: number) {
  const d = new Date(date);
  d.setMonth(d.getMonth() + months);
  return d;
}

/**
 * Relit chez Stripe les factures payées (et remboursées) d'un filleul et met à
 * jour ses commissions. Appelée par le webhook Stripe en ligne, et à
 * l'ouverture des pages Affiliation quand le webhook n'est pas configuré (local).
 */
export async function syncReferredUserCommissions(referredUserId: string) {
  if (!stripeClient) return;
  const user = await prisma.user.findUnique({
    where: { id: referredUserId },
    select: { id: true, referredById: true, stripeCustomerId: true },
  });
  if (!user?.referredById || !user.stripeCustomerId || user.referredById === user.id) return;

  const [invoices, charges] = await Promise.all([
    stripeClient.invoices.list({ customer: user.stripeCustomerId, status: "paid", limit: 100, expand: ["data.payments"] }),
    stripeClient.charges.list({ customer: user.stripeCustomerId, limit: 100 }),
  ]);

  // Paiements remboursés (même partiellement) : la commission est annulée.
  const refunded = new Set<string>();
  for (const ch of charges.data) {
    if (ch.amount_refunded > 0) {
      refunded.add(ch.id);
      if (typeof ch.payment_intent === "string") refunded.add(ch.payment_intent);
    }
  }
  const isRefunded = (inv: Stripe.Invoice) =>
    (inv.payments?.data ?? []).some((p) => {
      const ref = p.payment.payment_intent ?? p.payment.charge;
      const id = typeof ref === "string" ? ref : ref?.id;
      return id ? refunded.has(id) : false;
    });

  const paid = invoices.data
    .filter((inv) => inv.amount_paid > 0 && inv.status_transitions.paid_at)
    .map((inv) => ({ inv, paidAt: new Date(inv.status_transitions.paid_at! * 1000) }))
    .sort((a, b) => a.paidAt.getTime() - b.paidAt.getTime());
  if (paid.length === 0) return;

  // Fenêtre de 12 mois à partir du tout premier paiement du filleul.
  const existingFirst = await prisma.commission.findFirst({
    where: { referredUserId: user.id },
    orderBy: { paidAt: "asc" },
    select: { paidAt: true },
  });
  const first = existingFirst && existingFirst.paidAt < paid[0].paidAt ? existingFirst.paidAt : paid[0].paidAt;
  const windowEnd = addMonths(first, AFFILIATION.durationMonths);

  for (const { inv, paidAt } of paid) {
    if (paidAt >= windowEnd || !inv.id) continue;
    const wasRefunded = isRefunded(inv);
    const existing = await prisma.commission.findUnique({ where: { stripeInvoiceId: inv.id } });
    if (!existing) {
      const baseCents = Math.round(inv.amount_paid / (1 + vatRate()));
      await prisma.commission.create({
        data: {
          affiliateId: user.referredById,
          referredUserId: user.id,
          stripeInvoiceId: inv.id,
          paidAt,
          availableAt: new Date(paidAt.getTime() + AFFILIATION.holdDays * 86_400_000),
          paidCents: inv.amount_paid,
          baseCents,
          amountCents: Math.round(baseCents * AFFILIATION.commissionRate),
          status: wasRefunded ? "CANCELLED" : "PENDING",
        },
      });
    } else if (wasRefunded && existing.status === "PENDING") {
      await prisma.commission.update({ where: { id: existing.id }, data: { status: "CANCELLED" } });
    } else if (wasRefunded && existing.status === "PAID") {
      await prisma.commission.update({ where: { id: existing.id }, data: { status: "REVERSED" } });
    }
  }
}

/** Synchronise tous les filleuls d'un affilié (ou de tous les affiliés si affiliateId est omis). */
export async function syncAffiliateCommissions(affiliateId?: string) {
  if (!stripeClient) return;
  const referred = await prisma.user.findMany({
    where: { referredById: affiliateId ?? { not: null }, stripeCustomerId: { not: null } },
    select: { id: true },
  });
  for (const r of referred) {
    try {
      await syncReferredUserCommissions(r.id);
    } catch (error) {
      console.error("[affiliation] Synchronisation impossible :", error instanceof Error ? error.message : error);
    }
  }
}

/**
 * Webhook Stripe en service ? Seulement en production avec un secret renseigné.
 * Sinon (en local, npm run dev), on relit Stripe à l'ouverture des pages.
 */
export function webhookConfigured() {
  return process.env.NODE_ENV === "production" && Boolean(process.env.STRIPE_WEBHOOK_SECRET?.startsWith("whsec_"));
}

/** Webhook Stripe : un paiement ou un remboursement d'un client met à jour ses commissions. */
export async function handleStripeEventForAffiliation(event: Stripe.Event) {
  let customer: string | Stripe.Customer | Stripe.DeletedCustomer | null | undefined;
  if (event.type === "invoice.paid") customer = event.data.object.customer;
  else if (event.type === "charge.refunded") customer = event.data.object.customer;
  else return;
  const customerId = typeof customer === "string" ? customer : customer?.id;
  if (!customerId) return;
  const user = await prisma.user.findFirst({ where: { stripeCustomerId: customerId }, select: { id: true } });
  if (user) await syncReferredUserCommissions(user.id);
}

// ─── Soldes ───────────────────────────────────────────────────────────────────

export type AffiliateBalance = {
  pendingCents: number; // en attente (moins de 30 jours)
  availableCents: number; // prêt à être versé (déduction faite des remboursements après versement)
  paidCents: number; // déjà versé
};

export async function getAffiliateBalance(affiliateId: string, now = new Date()): Promise<AffiliateBalance> {
  const [commissions, payouts] = await Promise.all([
    prisma.commission.findMany({
      where: { affiliateId, status: { in: ["PENDING", "REVERSED"] } },
      select: { status: true, amountCents: true, availableAt: true },
    }),
    prisma.payout.aggregate({ where: { affiliateId }, _sum: { amountCents: true } }),
  ]);
  let pendingCents = 0;
  let availableCents = 0;
  for (const c of commissions) {
    if (c.status === "REVERSED") availableCents -= c.amountCents;
    else if (c.availableAt > now) pendingCents += c.amountCents;
    else availableCents += c.amountCents;
  }
  return { pendingCents, availableCents, paidCents: payouts._sum.amountCents ?? 0 };
}

/** Masque une adresse e-mail : ca•••@gmail.com (le filleul reste anonyme pour l'affilié). */
export function maskEmail(email: string) {
  const [local, domain] = email.split("@");
  return `${local.slice(0, 2)}•••@${domain ?? ""}`;
}
