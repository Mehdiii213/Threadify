import type { Metadata } from "next";
import { Suspense } from "react";
import { PeriodSwitch, PlanCards } from "@/components/plan-cards";
import { SiteHeader } from "@/components/site-header";
import { annualBillingEnabled, billingEnabled, getUserPlan } from "@/lib/billing";
import { EXPERT_DAILY_LIMIT, EXPERT_HOURLY_LIMIT, type BillingPeriod } from "@/lib/plans";
import { vatMention } from "@/lib/legal";
import { getSession } from "@/lib/session";

export const metadata: Metadata = { title: "Tarifs" };

export default function TarifsPage({ searchParams }: PageProps<"/tarifs">) {
  return (
    <main className="flex flex-1 flex-col bg-zinc-50 text-zinc-900">
      <SiteHeader />
      <section className="mx-auto w-full max-w-5xl flex-1 px-6 py-12">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight">Des offres simples, sans engagement</h1>
          <p className="mx-auto mt-3 max-w-2xl text-zinc-600">
            Commencez gratuitement, passez à une offre payante quand vous publiez plus. Résiliable à tout moment.
          </p>
        </div>
        <div className="mt-12">
          <Suspense fallback={<PlanCardsFallback />}>
            <CardsForVisitor searchParams={searchParams} />
          </Suspense>
        </div>
        <p className="mt-8 text-center text-xs text-zinc-500">
          {vatMention()}, prélevés chaque mois (ou chaque année en annuel : paiement en une fois, quotas toujours mensuels). * Usage
          raisonnable : {EXPERT_DAILY_LIMIT} générations par jour et {EXPERT_HOURLY_LIMIT} par heure au maximum.
          Paiement sécurisé par Stripe.
        </p>
      </section>
    </main>
  );
}

async function CardsForVisitor({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const [session, sp] = await Promise.all([getSession(), searchParams]);
  const plan = session ? await getUserPlan(session.user.id) : null;
  // L'annuel n'est proposé que si ses prix Stripe sont configurés.
  const annualOn = annualBillingEnabled() || !billingEnabled();
  const period: BillingPeriod = annualOn && sp.periode === "annuel" ? "annuel" : "mensuel";
  return (
    <div className="space-y-10">
      {annualOn && <PeriodSwitch period={period} />}
      <PlanCards currentPlan={plan} billingOn={billingEnabled()} period={period} />
    </div>
  );
}

function PlanCardsFallback() {
  return <div className="h-96 animate-pulse rounded-2xl bg-zinc-100" />;
}
