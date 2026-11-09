// Offres d'abonnement de Threadify (partagé client/serveur).

export type PlanId = "gratuit" | "pro" | "expert";

export const PLANS: Record<
  PlanId,
  { label: string; price: number; monthlyGenerations: number | null; watermark: boolean; tagline: string }
> = {
  gratuit: { label: "Gratuit", price: 0, monthlyGenerations: 3, watermark: true, tagline: "Pour découvrir Threadify" },
  pro: { label: "Pro", price: 12, monthlyGenerations: 100, watermark: false, tagline: "Pour publier chaque semaine" },
  expert: { label: "Expert", price: 19, monthlyGenerations: null, watermark: false, tagline: "Pour les gros volumes" },
};

/** Garde-fou anti-abus de l'offre Expert (« illimité ») : générations max par heure. */
export const EXPERT_HOURLY_LIMIT = 30;

export const PAID_PLANS = ["pro", "expert"] as const;

export function isPlanId(value: unknown): value is PlanId {
  return value === "gratuit" || value === "pro" || value === "expert";
}
