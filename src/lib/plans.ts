// Offres d'abonnement de Threadify (partagé client/serveur).

export type PlanId = "gratuit" | "pro" | "expert";

export const PLANS: Record<
  PlanId,
  {
    label: string;
    price: number; // € par mois (abonnement mensuel)
    annualPrice: number; // € par an (abonnement annuel, −30 % arrondi — choix du 2026-11-25)
    monthlyGenerations: number | null;
    watermark: boolean;
    tagline: string;
  }
> = {
  gratuit: { label: "Gratuit", price: 0, annualPrice: 0, monthlyGenerations: 3, watermark: true, tagline: "Pour découvrir Threadify" },
  pro: { label: "Pro", price: 15, annualPrice: 126, monthlyGenerations: 100, watermark: false, tagline: "Pour publier chaque semaine" },
  expert: { label: "Expert", price: 23, annualPrice: 193, monthlyGenerations: null, watermark: false, tagline: "Pour les gros volumes" },
};

/** Remise de l'abonnement annuel, affichée sur le site. */
export const ANNUAL_DISCOUNT_PERCENT = 30;

export type BillingPeriod = "mensuel" | "annuel";

/** « 10,50 € » : prix annuel ramené au mois, pour l'affichage. */
export function formatEuros(value: number) {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: Number.isInteger(value) ? 0 : 2,
  }).format(value);
}

/** Garde-fou anti-abus de l'offre Expert (« illimité ») : générations max par heure. */
export const EXPERT_HOURLY_LIMIT = 30;
/** Plafond d'usage raisonnable de l'offre Expert : générations max par jour (choix du 2026-11-09). */
export const EXPERT_DAILY_LIMIT = 100;

export const PAID_PLANS = ["pro", "expert"] as const;

export function isPlanId(value: unknown): value is PlanId {
  return value === "gratuit" || value === "pro" || value === "expert";
}
