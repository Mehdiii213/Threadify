import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { ManageButton, UpgradeButton } from "@/components/billing-buttons";
import { SiteHeader } from "@/components/site-header";
import {
  annualBillingEnabled,
  billingEnabled,
  getActiveSubscription,
  getUsage,
  scheduledEnd,
  syncSubscriptionFromStripe,
} from "@/lib/billing";
import { formatDate } from "@/lib/creations";
import { ANNUAL_DISCOUNT_PERCENT, PLANS, formatEuros } from "@/lib/plans";
import { AFFILIATION } from "@/lib/affiliation-config";
import { isEligibleForReferralDiscount } from "@/lib/affiliation";
import { requireSession } from "@/lib/session";

export const metadata: Metadata = { title: "Mon abonnement", robots: { index: false } };

export default function AbonnementPage({ searchParams }: PageProps<"/abonnement">) {
  return (
    <main className="flex flex-1 flex-col bg-zinc-50 text-zinc-900">
      <SiteHeader />
      <section className="mx-auto w-full max-w-3xl flex-1 px-6 py-10">
        <Link href="/espace" className="text-sm font-medium text-violet-700 hover:underline">
          ← Mon espace
        </Link>
        <h1 className="mt-4 text-3xl font-bold tracking-tight">Mon abonnement</h1>
        <Suspense fallback={<p className="mt-6 text-zinc-500">Chargement…</p>}>
          <Subscription searchParams={searchParams} />
        </Suspense>
      </section>
    </main>
  );
}

async function Subscription({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const [{ user }, sp] = await Promise.all([requireSession(), searchParams]);
  await syncSubscriptionFromStripe(user.id);
  const [usage, sub, referralDiscount] = await Promise.all([
    getUsage(user.id),
    getActiveSubscription(user.id),
    isEligibleForReferralDiscount(user.id),
  ]);
  const plan = PLANS[usage.plan];
  const billingOn = billingEnabled();
  const annualOn = annualBillingEnabled();
  const isAnnual = sub?.billingInterval === "year";
  const paidPlans = ["pro", "expert"] as const;
  const percent = usage.limit ? Math.min(100, Math.round((usage.used / usage.limit) * 100)) : 0;

  return (
    <div className="mt-6 space-y-6">
      {sp.paiement === "ok" && (
        <p role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          ✓ Merci ! Votre paiement a bien été pris en compte.
          {usage.plan === "gratuit" && " L'activation peut prendre quelques secondes : rechargez la page si votre offre n'apparaît pas encore."}
        </p>
      )}

      <div className="rounded-2xl border border-zinc-200 bg-white p-7 shadow-sm">
        <p className="text-sm text-zinc-500">Offre actuelle</p>
        <p className="mt-1 flex items-baseline gap-3">
          <span className="text-2xl font-bold">{plan.label}</span>
          <span className="text-zinc-500">
            {isAnnual ? `${formatEuros(plan.annualPrice)} / an (abonnement annuel)` : `${formatEuros(plan.price)} / mois`}
          </span>
        </p>
        {sub && (scheduledEnd(sub) ?? sub.periodEnd) && (
          <p className="mt-2 text-sm text-zinc-600">
            {scheduledEnd(sub)
              ? `Résiliée : reste active jusqu'au ${formatDate(scheduledEnd(sub)!)}, puis retour à l'offre Gratuite.`
              : `Prochain renouvellement le ${formatDate(sub.periodEnd!)}.`}
          </p>
        )}

        <div className="mt-6">
          <div className="flex items-baseline justify-between text-sm">
            <span className="font-medium">Générations ce mois-ci</span>
            <span className="tabular-nums text-zinc-700">
              {usage.limit === null ? `${usage.used} · illimitées` : `${usage.used} / ${usage.limit}`}
            </span>
          </div>
          {usage.limit !== null && (
            <div className="mt-2 h-3 overflow-hidden rounded-full bg-zinc-100" role="progressbar" aria-valuenow={usage.used} aria-valuemax={usage.limit}>
              <div
                className={`h-full rounded-full ${percent >= 100 ? "bg-red-500" : "bg-violet-600"}`}
                style={{ width: `${percent}%` }}
              />
            </div>
          )}
          <p className="mt-2 text-xs text-zinc-500">Le compteur repart à zéro le 1er de chaque mois. Chaque génération ou régénération compte.</p>
        </div>
      </div>

      {usage.plan === "gratuit" && referralDiscount && (
        <p className="rounded-xl border border-violet-200 bg-violet-50 px-4 py-3 text-sm text-violet-900">
          🎁 Parrainage : <strong>−{AFFILIATION.referralDiscountPercent} % sur votre premier mois</strong> (en annuel : l&apos;équivalent, soit{" "}
          {formatEuros(PLANS.pro.price * 0.2)} sur Pro et {formatEuros(PLANS.expert.price * 0.2)} sur Expert), appliqués automatiquement sur la page
          de paiement.
        </p>
      )}

      {usage.plan === "gratuit" && (
        <div className="grid gap-4 sm:grid-cols-2">
          {paidPlans.map((id) => (
            <div key={id} className="space-y-3 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
              <p className="font-bold">{PLANS[id].label}</p>
              <UpgradeButton
                plan={id}
                label={`Mensuel — ${formatEuros(PLANS[id].price)} / mois`}
                enabled={billingOn}
                variant={id === "pro" ? "primary" : "secondary"}
              />
              {annualOn && (
                <UpgradeButton
                  plan={id}
                  annual
                  label={`Annuel — ${formatEuros(PLANS[id].annualPrice)} / an (−${ANNUAL_DISCOUNT_PERCENT} %)`}
                  enabled={billingOn}
                  variant="secondary"
                />
              )}
            </div>
          ))}
        </div>
      )}

      {usage.plan !== "gratuit" && !isAnnual && annualOn && !(sub && scheduledEnd(sub)) && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
          <p className="font-semibold text-emerald-900">
            Passez à l&apos;annuel et économisez {formatEuros(plan.price * 12 - plan.annualPrice)} par an (−{ANNUAL_DISCOUNT_PERCENT} %)
          </p>
          <p className="mt-1 text-sm text-emerald-800">
            {formatEuros(plan.annualPrice)} par an au lieu de {formatEuros(plan.price * 12)}. Le temps restant de votre mois en cours est déduit
            automatiquement.
          </p>
          <div className="mt-3 max-w-sm">
            <UpgradeButton
              plan={usage.plan}
              annual
              label={`Passer à l'annuel — ${formatEuros(plan.annualPrice)} / an`}
              enabled={billingOn}
            />
          </div>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        {usage.plan !== "gratuit" && <ManageButton enabled={billingOn} />}
        <Link
          href="/tarifs"
          className="rounded-xl border border-zinc-300 bg-white px-4 py-3 text-center font-semibold text-zinc-700 hover:bg-zinc-100"
        >
          Comparer les offres
        </Link>
      </div>

      {!billingOn && (
        <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Le paiement n&apos;est pas encore configuré : ajoutez les clés Stripe dans le fichier .env (voir le guide de l&apos;étape 7).
        </p>
      )}
    </div>
  );
}
