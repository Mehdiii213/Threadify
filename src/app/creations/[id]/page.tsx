import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { SiteHeader } from "@/components/site-header";
import { FORMAT_LABELS, SOURCE_LABELS, excerpt, formatDate } from "@/lib/creations";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/session";

export const metadata: Metadata = { title: "Ma création — Threadify" };

export default function CreationPage({ params }: PageProps<"/creations/[id]">) {
  return (
    <main className="flex flex-1 flex-col bg-zinc-50 text-zinc-900">
      <SiteHeader />
      <section className="mx-auto w-full max-w-3xl flex-1 px-6 py-10">
        <Suspense fallback={<p className="text-zinc-500">Chargement…</p>}>
          <CreationDetails params={params} />
        </Suspense>
      </section>
    </main>
  );
}

async function CreationDetails({ params }: { params: Promise<{ id: string }> }) {
  const [{ id }, { user }] = await Promise.all([params, requireSession()]);

  // Filtre sur userId : une création d'un autre compte renvoie une page 404.
  const creation = await prisma.creation.findFirst({ where: { id, userId: user.id } });
  if (!creation) notFound();

  return (
    <>
      <Link href="/espace" className="text-sm font-medium text-violet-700 hover:underline">
        ← Mon espace
      </Link>
      <div className="mt-4 rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-medium text-emerald-700">✓ Création enregistrée</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight">{FORMAT_LABELS[creation.format]}</h1>
        <p className="mt-1 text-sm text-zinc-500">
          {SOURCE_LABELS[creation.sourceType]} · {formatDate(creation.createdAt)}
        </p>

        <blockquote className="mt-6 rounded-xl border-l-4 border-violet-400 bg-zinc-50 p-4 whitespace-pre-line text-zinc-700">
          {excerpt(creation.sourceText, 600)}
        </blockquote>
        <p className="mt-2 text-xs text-zinc-500">
          {creation.sourceText.length.toLocaleString("fr-FR")} caractères
        </p>

        <div className="mt-8 flex flex-col items-start gap-2 sm:flex-row sm:items-center">
          <button
            type="button"
            disabled
            className="cursor-not-allowed rounded-xl bg-violet-600 px-6 py-3 font-semibold text-white opacity-50"
          >
            ✨ Générer
          </button>
          <span className="text-sm text-zinc-500">Disponible à l&apos;étape suivante.</span>
        </div>
      </div>
    </>
  );
}
