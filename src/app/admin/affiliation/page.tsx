import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { PayoutButton } from "@/components/payout-button";
import { SiteHeader } from "@/components/site-header";
import { isAdmin } from "@/lib/admin";
import { AFFILIATION, formatCents, formatDay } from "@/lib/affiliation-config";
import { getAffiliateBalance, syncAffiliateCommissions, webhookConfigured } from "@/lib/affiliation";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export const metadata: Metadata = { title: "Affiliés", robots: { index: false, follow: false } };

export default function AdminAffiliationPage() {
  return (
    <main className="flex flex-1 flex-col bg-zinc-50 text-zinc-900">
      <SiteHeader />
      <section className="mx-auto w-full max-w-5xl flex-1 px-6 py-10">
        <Suspense fallback={<p className="text-zinc-500">Chargement…</p>}>
          <Affiliates />
        </Suspense>
      </section>
    </main>
  );
}

async function Affiliates() {
  // Non connecté ou non administrateur : « Page introuvable », comme /admin/couts.
  const session = await getSession();
  if (!session || !isAdmin(session.user.email)) notFound();
  if (!webhookConfigured()) await syncAffiliateCommissions();

  const now = new Date();
  const affiliates = await prisma.user.findMany({
    where: { OR: [{ referrals: { some: {} } }, { commissions: { some: {} } }, { payouts: { some: {} } }] },
    select: { id: true, email: true, name: true, referralCode: true, _count: { select: { referrals: true } } },
  });
  const rows = (
    await Promise.all(affiliates.map(async (a) => ({ ...a, balance: await getAffiliateBalance(a.id, now) })))
  ).sort((x, y) => y.balance.availableCents - x.balance.availableCents);
  const payouts = await prisma.payout.findMany({
    orderBy: { createdAt: "desc" },
    take: 20,
    include: { affiliate: { select: { email: true } } },
  });
  const total = rows.reduce(
    (t, r) => ({ pending: t.pending + r.balance.pendingCents, available: t.available + r.balance.availableCents, paid: t.paid + r.balance.paidCents }),
    { pending: 0, available: 0, paid: 0 },
  );

  return (
    <>
      <p className="text-xs font-semibold tracking-wide text-violet-700 uppercase">Administration · visible par vous seul</p>
      <h1 className="mt-1 text-3xl font-bold tracking-tight">Affiliés</h1>
      <p className="mt-2 text-sm text-zinc-600">
        Faites le virement vous-même (RIB demandé à l&apos;affilié par e-mail, facture s&apos;il est professionnel), puis cliquez sur «
        Marquer comme versé ». Seuil de versement : {formatCents(AFFILIATION.payoutThresholdCents)}.{" "}
        <Link href="/admin/couts" className="font-semibold text-violet-700 hover:underline">
          Voir les coûts →
        </Link>
      </p>

      <div className="mt-6 grid grid-cols-3 gap-3">
        {[
          ["En attente (30 jours)", total.pending],
          ["À verser", total.available],
          ["Déjà versé", total.paid],
        ].map(([label, v]) => (
          <div key={label} className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
            <p className="text-xs font-medium text-zinc-500">{label}</p>
            <p className="mt-1 text-2xl font-bold tabular-nums">{formatCents(v as number)}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-zinc-200 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead className="text-left text-xs text-zinc-500">
            <tr>
              <th className="px-4 py-3 font-medium">Affilié</th>
              <th className="px-3 py-3 font-medium">Code</th>
              <th className="px-3 py-3 text-right font-medium">Filleuls</th>
              <th className="px-3 py-3 text-right font-medium">En attente</th>
              <th className="px-3 py-3 text-right font-medium">À verser</th>
              <th className="px-3 py-3 text-right font-medium">Versé</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {rows.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-zinc-500">
                  Aucun affilié n&apos;a encore parrainé de compte.
                </td>
              </tr>
            )}
            {rows.map((r) => (
              <tr key={r.id} className={r.balance.availableCents >= AFFILIATION.payoutThresholdCents ? "bg-emerald-50" : ""}>
                <td className="px-4 py-2.5">
                  <div className="font-medium">{r.name}</div>
                  <div className="text-xs text-zinc-500">{r.email}</div>
                </td>
                <td className="px-3 py-2.5 font-mono text-xs">{r.referralCode}</td>
                <td className="px-3 py-2.5 text-right tabular-nums">{r._count.referrals}</td>
                <td className="px-3 py-2.5 text-right tabular-nums">{formatCents(r.balance.pendingCents)}</td>
                <td className="px-3 py-2.5 text-right font-semibold tabular-nums">{formatCents(r.balance.availableCents)}</td>
                <td className="px-3 py-2.5 text-right tabular-nums">{formatCents(r.balance.paidCents)}</td>
                <td className="px-4 py-2.5 text-right">
                  {r.balance.availableCents > 0 && (
                    <PayoutButton affiliateId={r.id} amount={formatCents(r.balance.availableCents)} email={r.email} />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {payouts.length > 0 && (
        <div className="mt-6 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
          <h2 className="font-bold">Derniers versements</h2>
          <ul className="mt-3 space-y-1 text-sm text-zinc-700">
            {payouts.map((p) => (
              <li key={p.id}>
                {formatDay(p.createdAt)} — {formatCents(p.amountCents)} à {p.affiliate.email}
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}
