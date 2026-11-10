import type { Metadata } from "next";
import Link from "next/link";
import { AuthCard } from "@/components/auth-card";

export const metadata: Metadata = { title: "Compte supprimé", robots: { index: false } };

export default function CompteSupprimePage() {
  return (
    <AuthCard title="Votre compte a été supprimé" subtitle="Merci d'avoir utilisé Threadify.">
      <p className="text-sm text-zinc-700">
        Vos créations et vos informations personnelles ont été effacées. Si vous aviez un abonnement, il a été résilié et ne sera plus
        prélevé.
      </p>
      <Link href="/" className="mt-6 block text-center text-sm font-semibold text-violet-700 hover:underline">
        Retour à l&apos;accueil
      </Link>
    </AuthCard>
  );
}
