import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { GenerateButton } from "@/components/generate-button";
import { CarouselEditor } from "@/components/carousel-editor";
import { ThreadEditor } from "@/components/thread-editor";
import { SiteHeader } from "@/components/site-header";
import { FORMAT_LABELS, SOURCE_LABELS, excerpt, formatDate } from "@/lib/creations";
import { readContent } from "@/lib/content";
import { readDesign } from "@/lib/design";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/session";

export const metadata: Metadata = { title: "Ma création — Threadify" };

export default function CreationPage({ params }: PageProps<"/creations/[id]">) {
  return (
    <main className="flex flex-1 flex-col bg-zinc-50 text-zinc-900">
      <SiteHeader />
      <section className="mx-auto w-full max-w-6xl flex-1 px-6 py-10">
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

  const content = readContent(creation.content);

  return (
    <>
      <Link href="/espace" className="text-sm font-medium text-violet-700 hover:underline">
        ← Mon espace
      </Link>
      <div className="mt-4 rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
        <p className={`text-sm font-medium ${content ? "text-violet-700" : "text-emerald-700"}`}>
          {content ? "✨ Contenu généré" : "✓ Création enregistrée"}
        </p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight">{FORMAT_LABELS[creation.format]}</h1>
        <p className="mt-1 text-sm text-zinc-500">
          {SOURCE_LABELS[creation.sourceType]} · {formatDate(creation.createdAt)}
        </p>

        <details className="group mt-6 rounded-xl border-l-4 border-violet-400 bg-zinc-50 p-4" open={!content}>
          <summary className="cursor-pointer text-sm font-semibold text-zinc-700">
            Votre texte de départ ({creation.sourceText.length.toLocaleString("fr-FR")} caractères)
          </summary>
          <p className="mt-3 whitespace-pre-line text-zinc-700">{excerpt(creation.sourceText, 600)}</p>
        </details>

        <div className="mt-8">
          <GenerateButton creationId={creation.id} regenerate={Boolean(content)} />
        </div>
      </div>

      {content && (
        <section className="mt-8">
          <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="text-xl font-bold tracking-tight">{content.type === "carrousel" ? "Design et textes" : "Résultat"}</h2>
            {creation.generatedAt && (
              <p className="text-xs text-zinc-500">Généré le {formatDate(creation.generatedAt)}</p>
            )}
          </div>
          {/* key : un nouvel éditeur après chaque génération (repart des nouveaux textes) */}
          {content.type === "carrousel" && creation.format !== "THREAD_X" ? (
            <CarouselEditor
              key={creation.generatedAt?.toISOString()}
              creationId={creation.id}
              initialSlides={content.slides}
              initialDesign={readDesign(creation.design, user.name)}
              format={creation.format}
            />
          ) : content.type === "thread" ? (
            <ThreadEditor key={creation.generatedAt?.toISOString()} creationId={creation.id} initialTweets={content.tweets} />
          ) : null}
        </section>
      )}
    </>
  );
}
