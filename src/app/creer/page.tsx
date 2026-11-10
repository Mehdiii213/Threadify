import type { Metadata } from "next";
import { Suspense } from "react";
import { CreateForm } from "@/components/create-form";
import { SiteHeader } from "@/components/site-header";
import { requireSession } from "@/lib/session";

export const metadata: Metadata = { title: "Nouvelle création", robots: { index: false } };

export default function CreerPage() {
  return (
    <main className="flex flex-1 flex-col bg-zinc-50 text-zinc-900">
      <SiteHeader />
      <section className="mx-auto w-full max-w-4xl flex-1 px-6 py-10">
        <h1 className="text-3xl font-bold tracking-tight">Nouvelle création</h1>
        <p className="mt-2 mb-8 text-zinc-600">
          Écrivez une idée ou collez un article, puis choisissez le format à générer.
        </p>
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
          <Suspense fallback={<p className="text-zinc-500">Chargement…</p>}>
            <GuardedForm />
          </Suspense>
        </div>
      </section>
    </main>
  );
}

async function GuardedForm() {
  await requireSession();
  return <CreateForm />;
}
