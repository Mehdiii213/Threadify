import "server-only";
import { syncSubscriptionFromStripe } from "@/lib/billing";
import { sendRenewalReminderEmail } from "@/lib/email";
import { PLANS, formatEuros, isPlanId } from "@/lib/plans";
import { prisma } from "@/lib/prisma";
import { siteUrl } from "@/lib/site";

const DAY = 86_400_000;
// Loi Chatel : prévenir « au plus tôt trois mois et au plus tard un mois » avant
// le terme. On envoie quand le renouvellement est dans 31 à 45 jours (la tâche
// quotidienne laisse ainsi deux semaines de marge en cas de souci).
const MIN_DAYS = 31;
const MAX_DAYS = 45;

const dateFr = new Intl.DateTimeFormat("fr-FR", { dateStyle: "long", timeZone: "Europe/Paris" });

/**
 * Envoie le rappel de renouvellement aux abonnés annuels concernés, une seule
 * fois par période (champ `renewalReminderFor`). Appelée chaque jour par la
 * tâche GitHub (.github/workflows/reveil-base.yml) via /api/rappels-renouvellement.
 */
export async function sendDueRenewalReminders(now = new Date()) {
  const from = new Date(now.getTime() + MIN_DAYS * DAY);
  const to = new Date(now.getTime() + MAX_DAYS * DAY);
  const candidates = await prisma.subscription.findMany({
    where: { status: { in: ["active", "trialing"] }, billingInterval: "year", periodEnd: { gte: from, lte: to } },
    select: { referenceId: true },
  });
  let sent = 0;
  for (const { referenceId } of candidates) {
    // Relit l'abonnement chez Stripe (résiliation récente, nouvelle date…).
    await syncSubscriptionFromStripe(referenceId);
    const sub = await prisma.subscription.findFirst({
      where: { referenceId, status: { in: ["active", "trialing"] }, billingInterval: "year", periodEnd: { gte: from, lte: to } },
    });
    if (!sub?.periodEnd || sub.cancelAtPeriodEnd || sub.cancelAt) continue; // résilié : pas de renouvellement
    if (sub.renewalReminderFor && sub.renewalReminderFor.getTime() === sub.periodEnd.getTime()) continue; // déjà prévenu
    const plan = sub.plan.toLowerCase();
    const user = await prisma.user.findUnique({ where: { id: referenceId }, select: { email: true, name: true } });
    if (!user || !isPlanId(plan) || plan === "gratuit") continue;
    const ok = await sendRenewalReminderEmail(user.email, user.name, {
      planLabel: PLANS[plan].label,
      amount: formatEuros(PLANS[plan].annualPrice),
      renewalDate: dateFr.format(sub.periodEnd),
      url: `${siteUrl()}/abonnement`,
    });
    if (ok) {
      await prisma.subscription.update({ where: { id: sub.id }, data: { renewalReminderFor: sub.periodEnd } });
      sent++;
    }
  }
  return sent;
}
