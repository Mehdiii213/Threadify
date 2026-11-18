import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthCard } from "@/components/auth-card";
import { AuthForm } from "@/components/auth-form";
import { AFFILIATION, REFERRAL_PARAM, normalizeReferralCode } from "@/lib/affiliation-config";
import { findAffiliateByCode } from "@/lib/affiliation";

export const metadata: Metadata = { title: "Créer un compte" };

export default function InscriptionPage({ searchParams }: PageProps<"/inscription">) {
  return (
    <AuthCard title="Créer un compte" subtitle="Gratuit, en moins d'une minute.">
      <Suspense fallback={<AuthForm mode="inscription" />}>
        <SignUpWithReferral searchParams={searchParams} />
      </Suspense>
    </AuthCard>
  );
}

// Étape 9 : lien de parrainage /inscription?ref=CODE (sans cookie : le code est
// simplement prérempli dans le formulaire).
async function SignUpWithReferral({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const sp = await searchParams;
  const raw = sp[REFERRAL_PARAM];
  const code = typeof raw === "string" ? normalizeReferralCode(raw) : "";
  const affiliate = code ? await findAffiliateByCode(code) : null;
  return (
    <>
      {affiliate && (
        <p className="mb-5 rounded-xl border border-violet-200 bg-violet-50 px-4 py-3 text-sm text-violet-900">
          🎁 Vous êtes invité par <strong>{affiliate.name.trim().split(/\s+/)[0]}</strong> : bénéficiez de{" "}
          <strong>−{AFFILIATION.referralDiscountPercent} % sur votre premier mois</strong> d&apos;abonnement Pro ou Expert.
        </p>
      )}
      <AuthForm mode="inscription" referralCode={affiliate ? code : ""} />
    </>
  );
}
