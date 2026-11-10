import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { SiteHeader } from "@/components/site-header";
import { LEGAL, vatRate } from "@/lib/legal";
import { isAdmin, usdToEurRate } from "@/lib/admin";
import { PLANS, isPlanId, type PlanId } from "@/lib/plans";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

// Page réservée à l'administrateur (ADMIN_EMAILS) : aucun lien n'y mène, et
// toute autre personne obtient la page 404 « Page introuvable ».
export const metadata: Metadata = { title: "Coûts", robots: { index: false, follow: false } };

const STRIPE_FEE_RATE = 0.015; // carte européenne (estimation)
const STRIPE_FEE_FIXED = 0.25; // € par paiement (estimation)

const eur = new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" });
const usd = new Intl.NumberFormat("fr-FR", { style: "currency", currency: "USD", maximumFractionDigits: 4 });
const int = new Intl.NumberFormat("fr-FR");

/** Revenu net mensuel d'un abonné : prix TTC − TVA − frais Stripe estimés. */
function netRevenue(plan: PlanId) {
  const price = PLANS[plan].price;
  if (price === 0) return 0;
  return price / (1 + vatRate()) - (price * STRIPE_FEE_RATE + STRIPE_FEE_FIXED);
}

function monthRange(param: string | undefined) {
  const now = new Date();
  const match = param?.match(/^(\d{4})-(\d{2})$/);
  const year = match ? Number(match[1]) : now.getFullYear();
  const month = match ? Number(match[2]) - 1 : now.getMonth();
  const start = new Date(year, month, 1);
  const end = new Date(year, month + 1, 1);
  const key = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
  return {
    start,
    end,
    label: new Intl.DateTimeFormat("fr-FR", { month: "long", year: "numeric" }).format(start),
    prev: key(new Date(year, month - 1, 1)),
    next: end <= now ? key(end) : null,
  };
}

export default function CoutsPage({ searchParams }: PageProps<"/admin/couts">) {
  return (
    <main className="flex flex-1 flex-col bg-zinc-50 text-zinc-900">
      <SiteHeader />
      <section className="mx-auto w-full max-w-6xl flex-1 px-6 py-10">
        <Suspense fallback={<p className="text-zinc-500">Chargement…</p>}>
          <Costs searchParams={searchParams} />
        </Suspense>
      </section>
    </main>
  );
}

async function Costs({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  // Non connecté ou non administrateur : « Page introuvable », comme une adresse inexistante.
  const [session, sp] = await Promise.all([getSession(), searchParams]);
  if (!session || !isAdmin(session.user.email)) notFound();

  const range = monthRange(typeof sp.mois === "string" ? sp.mois : undefined);
  const rate = usdToEurRate();

  const [byUser, subs] = await Promise.all([
    prisma.generationEvent.groupBy({
      by: ["userId"],
      where: { createdAt: { gte: range.start, lt: range.end } },
      _count: { _all: true },
      _sum: { costUsd: true, inputTokens: true, outputTokens: true },
    }),
    prisma.subscription.findMany({ where: { status: { in: ["active", "trialing"] } }, select: { referenceId: true, plan: true } }),
  ]);
  const planOf = new Map<string, PlanId>();
  for (const s of subs) {
    const p = s.plan.toLowerCase();
    if (isPlanId(p)) planOf.set(s.referenceId, p);
  }
  const userIds = [...new Set([...byUser.map((r) => r.userId), ...planOf.keys()])];
  const users = await prisma.user.findMany({ where: { id: { in: userIds.filter((id): id is string => id !== null) } }, select: { id: true, email: true } });
  const emailOf = new Map(users.map((u) => [u.id, u.email]));
  const statsOf = new Map(byUser.map((r) => [r.userId, r]));

  const rows = userIds
    .map((id) => {
      const st = statsOf.get(id);
      const plan = (id && planOf.get(id)) || "gratuit";
      const costEur = (st?._sum.costUsd ?? 0) * rate;
      const revenue = netRevenue(plan);
      return {
        id,
        // id null : générations de comptes supprimés depuis (historique anonyme)
        email: (id && emailOf.get(id)) || "(compte supprimé)",
        plan,
        generations: st?._count._all ?? 0,
        costUsd: st?._sum.costUsd ?? 0,
        costEur,
        tokens: (st?._sum.inputTokens ?? 0) + (st?._sum.outputTokens ?? 0),
        revenue,
        margin: revenue - costEur,
      };
    })
    .sort((a, b) => b.costEur - a.costEur);

  const totals = rows.reduce(
    (t, r) => ({
      generations: t.generations + r.generations,
      costUsd: t.costUsd + r.costUsd,
      costEur: t.costEur + r.costEur,
      revenue: t.revenue + r.revenue,
    }),
    { generations: 0, costUsd: 0, costEur: 0, revenue: 0 },
  );
  const avg = totals.generations ? totals.costEur / totals.generations : 0;

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold tracking-wide text-violet-700 uppercase">Administration · visible par vous seul</p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight">Coûts de l&apos;IA — {range.label}</h1>
        </div>
        <nav className="flex gap-2 text-sm" aria-label="Mois">
          <Link href={`/admin/couts?mois=${range.prev}`} className="rounded-lg border border-zinc-300 bg-white px-3 py-1.5 hover:bg-zinc-100">
            ← Mois précédent
          </Link>
          {range.next && (
            <Link href={`/admin/couts?mois=${range.next}`} className="rounded-lg border border-zinc-300 bg-white px-3 py-1.5 hover:bg-zinc-100">
              Mois suivant →
            </Link>
          )}
        </nav>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-5">
        {[
          ["Générations", int.format(totals.generations)],
          ["Coût de l'IA", `${eur.format(totals.costEur)}`],
          ["Coût moyen / génération", eur.format(avg)],
          ["Revenus nets (abonnés actifs)", eur.format(totals.revenue)],
          ["Marge", eur.format(totals.revenue - totals.costEur)],
        ].map(([label, value], i) => (
          <div key={label} className={`rounded-2xl border bg-white p-4 shadow-sm ${i === 4 ? (totals.revenue - totals.costEur < 0 ? "border-red-300" : "border-emerald-300") : "border-zinc-200"}`}>
            <p className="text-xs font-medium text-zinc-500">{label}</p>
            <p className="mt-1 text-xl font-bold tabular-nums">{value}</p>
          </div>
        ))}
      </div>
      <p className="mt-2 text-xs text-zinc-500">
        Coût réel facturé par Anthropic : {usd.format(totals.costUsd)} (converti au taux de {rate} € pour 1 $). Revenus nets = prix payé − TVA ({LEGAL.vatRegime === "franchise" ? "franchise : 0 %" : "20 %"}) − frais Stripe estimés
        (1,5 % + 0,25 €). Les générations antérieures à la mise en place du suivi ont un coût de 0.
      </p>

      <div className="mt-8 overflow-x-auto rounded-2xl border border-zinc-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-zinc-200 bg-zinc-50 text-xs text-zinc-500 uppercase">
            <tr>
              <th className="px-4 py-3">Client</th>
              <th className="px-4 py-3">Offre</th>
              <th className="px-4 py-3 text-right">Générations</th>
              <th className="px-4 py-3 text-right">Tokens</th>
              <th className="px-4 py-3 text-right">Coût IA</th>
              <th className="px-4 py-3 text-right">Revenu net</th>
              <th className="px-4 py-3 text-right">Marge</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {rows.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-zinc-500">
                  Aucune génération ni abonnement sur ce mois.
                </td>
              </tr>
            ) : (
              rows.map((r) => (
                <tr key={r.id ?? "supprime"} className={r.margin < 0 ? "bg-red-50" : ""}>
                  <td className="px-4 py-3 font-medium">{r.email}</td>
                  <td className="px-4 py-3">{PLANS[r.plan].label}</td>
                  <td className="px-4 py-3 text-right tabular-nums">{int.format(r.generations)}</td>
                  <td className="px-4 py-3 text-right tabular-nums text-zinc-500">{int.format(r.tokens)}</td>
                  <td className="px-4 py-3 text-right tabular-nums">{eur.format(r.costEur)}</td>
                  <td className="px-4 py-3 text-right tabular-nums">{eur.format(r.revenue)}</td>
                  <td className={`px-4 py-3 text-right font-semibold tabular-nums ${r.margin < 0 ? "text-red-700" : "text-emerald-700"}`}>
                    {eur.format(r.margin)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-xs text-zinc-500">
        Trié du client le plus coûteux au moins coûteux. En rouge : clients non rentables ce mois-ci (les comptes gratuits le sont par nature).
      </p>
    </>
  );
}
