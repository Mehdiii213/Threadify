// Règles du programme d'affiliation (étape 9) — partagé client / serveur.
// Choix de l'utilisateur (2026-11-18) : 30 % pendant les 12 premiers mois,
// tous les comptes sont affiliés, −20 % sur le 1er mois du filleul, virement
// manuel dès 50 €, suivi sans cookie.

export const AFFILIATION = {
  commissionRate: 0.3, // 30 % du montant HT payé par le filleul
  durationMonths: 12, // commissions sur les 12 premiers mois d'abonnement du filleul
  holdDays: 30, // délai avant qu'une commission devienne disponible (remboursements)
  payoutThresholdCents: 5000, // versement à partir de 50 €
  referralDiscountPercent: 20, // réduction du filleul sur son 1er mois
};

export const REFERRAL_PARAM = "ref";

/** Format d'un code : lettres et chiffres, 4 à 20 caractères. */
export function normalizeReferralCode(input: string) {
  return input.trim().toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 20);
}

export function formatCents(cents: number) {
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(cents / 100);
}

const dayFormatter = new Intl.DateTimeFormat("fr-FR", { dateStyle: "long", timeZone: "Europe/Paris" });
export function formatDay(date: Date) {
  return dayFormatter.format(date);
}
