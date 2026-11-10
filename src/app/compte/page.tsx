import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { ChangePasswordForm, DeleteAccountForm, ResendVerificationButton } from "@/components/password-forms";
import { SiteHeader } from "@/components/site-header";
import { getActiveSubscription } from "@/lib/billing";
import { formatDate } from "@/lib/creations";
import { requireSession } from "@/lib/session";

export const metadata: Metadata = { title: "Mon compte", robots: { index: false } };

export default function ComptePage() {
  return (
    <main className="flex flex-1 flex-col bg-zinc-50 text-zinc-900">
      <SiteHeader />
      <section className="mx-auto w-full max-w-3xl flex-1 px-6 py-10">
        <Link href="/espace" className="text-sm font-medium text-violet-700 hover:underline">
          ← Mon espace
        </Link>
        <h1 className="mt-4 text-3xl font-bold tracking-tight">Mon compte</h1>
        <Suspense fallback={<p className="mt-6 text-zinc-500">Chargement…</p>}>
          <Account />
        </Suspense>
      </section>
    </main>
  );
}

const card = "rounded-2xl border border-zinc-200 bg-white p-7 shadow-sm";

async function Account() {
  const { user } = await requireSession();
  const sub = await getActiveSubscription(user.id);

  return (
    <div className="mt-6 space-y-6">
      <div className={card}>
        <h2 className="text-lg font-bold">Informations</h2>
        <dl className="mt-4 grid gap-x-6 gap-y-3 text-sm sm:grid-cols-[auto_1fr]">
          <dt className="text-zinc-500">Nom</dt>
          <dd className="font-medium">{user.name}</dd>
          <dt className="text-zinc-500">Adresse e-mail</dt>
          <dd className="font-medium">
            {user.email}{" "}
            {user.emailVerified ? (
              <span className="ml-1 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-800">✓ Confirmée</span>
            ) : (
              <span className="ml-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-800">À confirmer</span>
            )}
          </dd>
          <dt className="text-zinc-500">Membre depuis</dt>
          <dd className="font-medium">{formatDate(user.createdAt)}</dd>
        </dl>
        {!user.emailVerified && (
          <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4">
            <p className="mb-3 text-sm text-amber-900">
              Confirmez votre adresse pour pouvoir générer du contenu avec l&apos;IA. Vous n&apos;avez rien reçu ? Renvoyez l&apos;e-mail :
            </p>
            <ResendVerificationButton email={user.email} />
          </div>
        )}
        <p className="mt-5 text-sm">
          <Link href="/abonnement" className="font-semibold text-violet-700 hover:underline">
            Voir mon abonnement →
          </Link>
        </p>
      </div>

      <div className={card}>
        <h2 className="text-lg font-bold">Changer de mot de passe</h2>
        <div className="mt-4">
          <ChangePasswordForm />
        </div>
      </div>

      <div className="rounded-2xl border border-red-200 bg-white p-7 shadow-sm">
        <h2 className="text-lg font-bold text-red-700">Supprimer mon compte</h2>
        <div className="mt-4">
          <DeleteAccountForm hasSubscription={Boolean(sub)} />
        </div>
      </div>
    </div>
  );
}
