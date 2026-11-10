import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { ManageButton, UpgradeButton } from "@/components/billing-buttons";
import { SiteHeader } from "@/components/site-header";
import { billingEnabled, getActiveSubscription, getUsage, scheduledEnd, syncSubscriptionFromStripe } from "@/lib/billing";
import { formatDate } from "@/lib/creations";
import { PLANS } from "@/lib/plans";
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
  const [usage, sub] = await Promise.all([getUsage(user.id), getActiveSubscription(user.id)]);
  const plan = PLANS[usage.plan];
  const billingOn = billingEnabled();
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
          <span className="text-zinc-500">{plan.price} € / mois</span>
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

      <div className="grid gap-4 sm:grid-cols-2">
        {usage.plan === "gratuit" && (
          <>
            <UpgradeButton plan="pro" label="Passer à Pro — 12 € / mois" enabled={billingOn} />
            <UpgradeButton plan="expert" label="Passer à Expert — 19 € / mois" enabled={billingOn} variant="secondary" />
          </>
        )}
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
