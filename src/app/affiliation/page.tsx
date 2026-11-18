import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { CopyButton } from "@/components/copy-button";
import { SiteHeader } from "@/components/site-header";
import { AFFILIATION, REFERRAL_PARAM, formatCents, formatDay } from "@/lib/affiliation-config";
import {
  getAffiliateBalance,
  getOrCreateReferralCode,
  maskEmail,
  syncAffiliateCommissions,
  webhookConfigured,
} from "@/lib/affiliation";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/session";
import { siteUrl } from "@/lib/site";

export const metadata: Metadata = { title: "Affiliation", robots: { index: false } };

export default function AffiliationPage() {
  return (
    <main className="flex flex-1 flex-col bg-zinc-50 text-zinc-900">
      <SiteHeader />
      <section className="mx-auto w-full max-w-4xl flex-1 px-6 py-10">
        <Link href="/espace" className="text-sm font-medium text-violet-700 hover:underline">
          ← Mon espace
        </Link>
        <h1 className="mt-4 text-3xl font-bold tracking-tight">Programme d&apos;affiliation</h1>
        <p className="mt-2 max-w-2xl text-zinc-600">
          Recommandez Threadify : vous gagnez <strong>{AFFILIATION.commissionRate * 100} %</strong> de ce que paient vos filleuls pendant
          leurs <strong>{AFFILIATION.durationMonths} premiers mois</strong>, et ils ont{" "}
          <strong>−{AFFILIATION.referralDiscountPercent} % sur leur premier mois</strong>.
        </p>
        <Suspense fallback={<p className="mt-6 text-zinc-500">Chargement…</p>}>
          <Dashboard />
        </Suspense>
      </section>
    </main>
  );
}

const STATUS_LABEL = {
  PAID: "Versée",
  CANCELLED: "Annulée (remboursement)",
  REVERSED: "Déduite (remboursement après versement)",
} as const;

async function Dashboard() {
  const { user } = await requireSession();
  const code = await getOrCreateReferralCode(user.id);
  if (!webhookConfigured()) await syncAffiliateCommissions(user.id);

  const now = new Date();
  const [balance, referrals, subscribers, commissions] = await Promise.all([
    getAffiliateBalance(user.id, now),
    prisma.user.count({ where: { referredById: user.id } }),
    prisma.user.findMany({ where: { referredById: user.id }, select: { id: true } }).then((rs) =>
      prisma.subscription.count({ where: { referenceId: { in: rs.map((r) => r.id) }, status: { in: ["active", "trialing"] } } }),
    ),
    prisma.commission.findMany({
      where: { affiliateId: user.id },
      orderBy: { paidAt: "desc" },
      take: 50,
      include: { referredUser: { select: { email: true } }, payout: { select: { createdAt: true } } },
    }),
  ]);
  const link = `${siteUrl()}/inscription?${REFERRAL_PARAM}=${code}`;
  const stats: [string, string][] = [
    ["Inscrits avec votre lien", String(referrals)],
    ["Abonnés en ce moment", String(subscribers)],
    ["En attente", formatCents(balance.pendingCents)],
    ["Disponible", formatCents(balance.availableCents)],
    ["Déjà versé", formatCents(balance.paidCents)],
  ];

  return (
    <div className="mt-8 space-y-6">
      <div className="rounded-2xl border border-violet-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold text-zinc-700">Votre lien de parrainage</p>
        <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-center">
          <code data-referral-link="" className="min-w-0 flex-1 truncate rounded-lg bg-zinc-100 px-3 py-2 text-sm text-zinc-800">
            {link}
          </code>
          <CopyButton text={link} label="Copier le lien" />
        </div>
        <p className="mt-3 text-sm text-zinc-600">
          Votre code : <strong className="tracking-wide">{code}</strong> — vos filleuls peuvent aussi le taper dans le formulaire
          d&apos;inscription.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
        {stats.map(([label, value]) => (
          <div key={label} className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
            <p className="text-xs font-medium text-zinc-500">{label}</p>
            <p className="mt-1 text-xl font-bold tabular-nums">{value}</p>
          </div>
        ))}
      </div>

      <p className="rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-700">
        {balance.availableCents >= AFFILIATION.payoutThresholdCents
          ? `🎉 Vous avez atteint ${formatCents(AFFILIATION.payoutThresholdCents)} disponibles : nous vous contacterons à ${user.email} pour organiser le virement.`
          : `Chaque commission devient disponible ${AFFILIATION.holdDays} jours après le paiement de votre filleul. Le virement est fait dès ${formatCents(AFFILIATION.payoutThresholdCents)} disponibles.`}{" "}
        <Link href="/conditions-affiliation" className="font-semibold text-violet-700 hover:underline">
          Conditions du programme
        </Link>
      </p>

      <div className="rounded-2xl border border-zinc-200 bg-white shadow-sm">
        <h2 className="border-b border-zinc-200 px-6 py-4 font-bold">Vos commissions</h2>
        {commissions.length === 0 ? (
          <p className="px-6 py-8 text-center text-sm text-zinc-500">
            Aucune commission pour l&apos;instant. Partagez votre lien : chaque abonnement d&apos;un filleul apparaîtra ici.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-xs text-zinc-500">
                <tr>
                  <th className="px-6 py-2 font-medium">Paiement du filleul</th>
                  <th className="px-3 py-2 font-medium">Filleul</th>
                  <th className="px-3 py-2 text-right font-medium">Montant payé</th>
                  <th className="px-3 py-2 text-right font-medium">Commission</th>
                  <th className="px-6 py-2 font-medium">Statut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {commissions.map((c) => (
                  <tr key={c.id}>
                    <td className="px-6 py-2.5">{formatDay(c.paidAt)}</td>
                    <td className="px-3 py-2.5 text-zinc-600">{c.referredUser ? maskEmail(c.referredUser.email) : "(compte supprimé)"}</td>
                    <td className="px-3 py-2.5 text-right tabular-nums">{formatCents(c.paidCents)}</td>
                    <td className="px-3 py-2.5 text-right font-semibold tabular-nums">{formatCents(c.amountCents)}</td>
                    <td className="px-6 py-2.5">
                      {c.status === "PENDING"
                        ? c.availableAt > now
                          ? `En attente jusqu'au ${formatDay(c.availableAt)}`
                          : "Disponible"
                        : c.status === "PAID" && c.payout
                          ? `Versée le ${formatDay(c.payout.createdAt)}`
                          : STATUS_LABEL[c.status]}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
