import type { Metadata } from "next";
import { Suspense } from "react";
import { SiteHeader } from "@/components/site-header";
import { SignOutButton } from "@/components/sign-out-button";
import { requireSession } from "@/lib/session";

export const metadata: Metadata = { title: "Mon espace — Threadify" };

export default function EspacePage() {
  return (
    <main className="flex flex-1 flex-col bg-zinc-50 text-zinc-900">
      <SiteHeader />
      <section className="mx-auto w-full max-w-5xl flex-1 px-6 py-12">
        <Suspense fallback={<p className="text-zinc-500">Chargement de votre espace…</p>}>
          <Welcome />
        </Suspense>
      </section>
    </main>
  );
}

async function Welcome() {
  const { user } = await requireSession();
  const firstName = user.name.split(" ")[0] || user.name;

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Bonjour {firstName} 👋</h1>
          <p className="mt-2 text-zinc-600">
            Connecté avec <span className="font-medium text-zinc-800">{user.email}</span>
          </p>
        </div>
        <SignOutButton />
      </div>
      <div className="mt-8 rounded-xl border border-dashed border-zinc-300 bg-zinc-50 p-6 text-center text-zinc-500">
        Vos carrousels et threads apparaîtront ici. La création arrive à l&apos;étape suivante.
      </div>
    </div>
  );
}
