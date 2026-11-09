import type { Metadata } from "next";
import { Suspense } from "react";
import { PlanCards } from "@/components/plan-cards";
import { SiteHeader } from "@/components/site-header";
import { billingEnabled, getUserPlan } from "@/lib/billing";
import { EXPERT_HOURLY_LIMIT } from "@/lib/plans";
import { getSession } from "@/lib/session";

export const metadata: Metadata = { title: "Tarifs — Threadify" };

export default function TarifsPage() {
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
            <CardsForVisitor />
          </Suspense>
        </div>
        <p className="mt-8 text-center text-xs text-zinc-500">
          Prix TTC, prélevés chaque mois. * Usage raisonnable : {EXPERT_HOURLY_LIMIT} générations par heure au maximum.
          Paiement sécurisé par Stripe.
        </p>
      </section>
    </main>
  );
}

async function CardsForVisitor() {
  const session = await getSession();
  const plan = session ? await getUserPlan(session.user.id) : null;
  return <PlanCards currentPlan={plan} billingOn={billingEnabled()} />;
}

function PlanCardsFallback() {
  return <div className="h-96 animate-pulse rounded-2xl bg-zinc-100" />;
}
