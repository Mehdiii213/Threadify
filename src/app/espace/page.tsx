import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { SiteHeader } from "@/components/site-header";
import { SignOutButton } from "@/components/sign-out-button";
import { FORMAT_LABELS, SOURCE_LABELS, excerpt, formatDate } from "@/lib/creations";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/session";

export const metadata: Metadata = { title: "Mon espace — Threadify" };

export default function EspacePage() {
  return (
    <main className="flex flex-1 flex-col bg-zinc-50 text-zinc-900">
      <SiteHeader />
      <section className="mx-auto w-full max-w-5xl flex-1 px-6 py-12">
        <Suspense fallback={<p className="text-zinc-500">Chargement de votre espace…</p>}>
          <Dashboard />
        </Suspense>
      </section>
    </main>
  );
}

async function Dashboard() {
  const { user } = await requireSession();
  const firstName = user.name.split(" ")[0] || user.name;
  const creations = await prisma.creation.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Bonjour {firstName} 👋</h1>
          <p className="mt-2 text-zinc-600">
            Connecté avec <span className="font-medium text-zinc-800">{user.email}</span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/creer"
            className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-violet-600/20 hover:bg-violet-700"
          >
            + Nouvelle création
          </Link>
          <SignOutButton />
        </div>
      </div>

      <h2 className="mt-10 mb-4 text-lg font-semibold">Mes créations</h2>
      {creations.length === 0 ? (
        <div className="rounded-xl border border-dashed border-zinc-300 bg-zinc-50 p-6 text-center text-zinc-500">
          Aucune création pour l&apos;instant.{" "}
          <Link href="/creer" className="font-semibold text-violet-700 hover:underline">
            Lancez-vous !
          </Link>
        </div>
      ) : (
        <ul className="divide-y divide-zinc-200 rounded-xl border border-zinc-200">
          {creations.map((c) => (
            <li key={c.id}>
              <Link
                href={`/creations/${c.id}`}
                className="flex flex-col gap-1 p-4 hover:bg-zinc-50 sm:flex-row sm:items-center sm:gap-4"
              >
                <span className="w-44 shrink-0 text-sm font-semibold text-violet-700">
                  {FORMAT_LABELS[c.format]}
                </span>
                <span className="flex-1 truncate text-zinc-700">{excerpt(c.sourceText, 90)}</span>
                <span className="shrink-0 text-xs text-zinc-500">
                  {SOURCE_LABELS[c.sourceType]} · {formatDate(c.createdAt)}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
