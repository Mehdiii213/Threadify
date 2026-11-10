import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { AuthCard } from "@/components/auth-card";
import { ResetPasswordForm } from "@/components/password-forms";

export const metadata: Metadata = { title: "Nouveau mot de passe", robots: { index: false } };

// Ouverte depuis le lien de l'e-mail : Better Auth vérifie le lien puis redirige
// ici avec ?token=… (lien valide) ou ?error=INVALID_TOKEN (lien expiré ou déjà utilisé).
export default function NouveauMotDePassePage({ searchParams }: PageProps<"/nouveau-mot-de-passe">) {
  return (
    <AuthCard title="Nouveau mot de passe" subtitle="Choisissez le mot de passe de votre compte Threadify.">
      <Suspense fallback={<p className="text-sm text-zinc-500">Chargement…</p>}>
        <Content searchParams={searchParams} />
      </Suspense>
    </AuthCard>
  );
}

async function Content({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const sp = await searchParams;
  const token = typeof sp.token === "string" ? sp.token : null;
  if (!token || sp.error) {
    return (
      <div className="space-y-4">
        <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          Ce lien n&apos;est plus valable (il a expiré ou a déjà servi). Demandez-en un nouveau.
        </p>
        <Link href="/mot-de-passe-oublie" className="block text-center text-sm font-semibold text-violet-700 hover:underline">
          Recevoir un nouveau lien →
        </Link>
      </div>
    );
  }
  return <ResetPasswordForm token={token} />;
}
