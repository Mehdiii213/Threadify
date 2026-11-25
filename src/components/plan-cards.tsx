import Link from "next/link";
import { UpgradeButton } from "@/components/billing-buttons";
import { ANNUAL_DISCOUNT_PERCENT, PLANS, formatEuros, type BillingPeriod, type PlanId } from "@/lib/plans";

const FEATURES: Record<PlanId, string[]> = {
  gratuit: [
    "3 générations par l'IA par mois",
    "Carrousels Instagram, LinkedIn et threads X",
    "Tous les modèles, couleurs et polices",
    "Téléchargement ZIP / PDF",
    "Mention « Fait avec Threadify » sur les images",
  ],
  pro: [
    "100 générations par l'IA par mois",
    "Tout ce que contient l'offre Gratuite",
    "Images sans mention « Fait avec Threadify »",
    "Dossiers et étiquettes pour vos clients",
  ],
  expert: [
    "Générations illimitées*",
    "Tout ce que contient l'offre Pro",
    "Idéal pour les agences et les gros volumes",
  ],
};

/** Choix « Mensuel / Annuel » de la page Tarifs (simples liens : ?periode=annuel). */
export function PeriodSwitch({ period }: { period: BillingPeriod }) {
  const base = "rounded-full px-5 py-2 text-sm font-semibold";
  return (
    <div className="flex justify-center">
      <div className="inline-flex rounded-full border border-zinc-200 bg-white p-1 shadow-sm" role="group" aria-label="Période de paiement">
        <Link
          href="/tarifs"
          scroll={false}
          aria-current={period === "mensuel" ? "true" : undefined}
          className={`${base} ${period === "mensuel" ? "bg-zinc-900 text-white" : "text-zinc-600 hover:text-zinc-900"}`}
        >
          Mensuel
        </Link>
        <Link
          href="/tarifs?periode=annuel"
          scroll={false}
          aria-current={period === "annuel" ? "true" : undefined}
          className={`${base} ${period === "annuel" ? "bg-zinc-900 text-white" : "text-zinc-600 hover:text-zinc-900"}`}
        >
          Annuel <span className={period === "annuel" ? "text-emerald-300" : "text-emerald-600"}>−{ANNUAL_DISCOUNT_PERCENT} %</span>
        </Link>
      </div>
    </div>
  );
}

/** Les 3 offres côte à côte. currentPlan = null si le visiteur n'est pas connecté. */
export function PlanCards({
  currentPlan,
  billingOn,
  period = "mensuel",
}: {
  currentPlan: PlanId | null;
  billingOn: boolean;
  period?: BillingPeriod;
}) {
  const annual = period === "annuel";
  return (
    <div className="grid gap-6 md:grid-cols-3">
      {(Object.keys(PLANS) as PlanId[]).map((id) => {
        const plan = PLANS[id];
        const highlighted = id === "pro";
        const isCurrent = currentPlan === id;
        const paid = id !== "gratuit";
        const perMonth = annual && paid ? plan.annualPrice / 12 : plan.price;
        return (
          <div
            key={id}
            className={`relative flex flex-col rounded-2xl border bg-white p-7 shadow-sm ${
              highlighted ? "border-violet-500 ring-2 ring-violet-500" : "border-zinc-200"
            }`}
          >
            {highlighted && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-violet-600 px-3 py-1 text-xs font-semibold text-white">
                Le plus choisi
              </span>
            )}
            <h2 className="text-lg font-bold">{plan.label}</h2>
            <p className="text-sm text-zinc-500">{plan.tagline}</p>
            <p className="mt-5">
              {annual && paid && (
                <span className="mr-2 text-xl font-semibold text-zinc-400 line-through">{formatEuros(plan.price)}</span>
              )}
              <span className="text-4xl font-extrabold tracking-tight">{formatEuros(perMonth)}</span>
              <span className="text-zinc-500"> / mois</span>
            </p>
            {annual && paid && (
              <p className="mt-1 text-sm text-emerald-700">
                Facturé {formatEuros(plan.annualPrice)} par an · {formatEuros(plan.price * 12 - plan.annualPrice)} économisés
              </p>
            )}
            <ul className="mt-6 flex-1 space-y-2 text-sm text-zinc-700">
              {FEATURES[id].map((f) => (
                <li key={f} className="flex gap-2">
                  <span className="text-violet-600">✓</span>
                  {f}
                </li>
              ))}
            </ul>
            <div className="mt-7">
              {isCurrent ? (
                <p className="rounded-xl bg-zinc-100 px-4 py-3 text-center font-semibold text-zinc-600">Votre offre actuelle</p>
              ) : currentPlan === null ? (
                <Link
                  href="/inscription"
                  className="block rounded-xl bg-violet-600 px-4 py-3 text-center font-semibold text-white hover:bg-violet-700"
                >
                  {id === "gratuit" ? "Commencer gratuitement" : `Essayer ${plan.label}`}
                </Link>
              ) : !paid ? (
                <p className="rounded-xl border border-zinc-200 px-4 py-3 text-center text-sm text-zinc-500">
                  Pour revenir à l&apos;offre Gratuite, résiliez depuis « Mon abonnement ».
                </p>
              ) : currentPlan === "gratuit" ? (
                <UpgradeButton
                  plan={id}
                  annual={annual}
                  label={annual ? `Passer à ${plan.label} — ${formatEuros(plan.annualPrice)} / an` : `Passer à ${plan.label}`}
                  enabled={billingOn}
                  variant={highlighted ? "primary" : "secondary"}
                />
              ) : (
                <Link
                  href="/abonnement"
                  className="block rounded-xl border border-violet-300 px-4 py-3 text-center font-semibold text-violet-700 hover:bg-violet-50"
                >
                  Changer d&apos;offre
                </Link>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
