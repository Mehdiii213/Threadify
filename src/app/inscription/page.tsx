import type { Metadata } from "next";
import { AuthCard } from "@/components/auth-card";
import { AuthForm } from "@/components/auth-form";

export const metadata: Metadata = { title: "Créer un compte" };

export default function InscriptionPage() {
  return (
    <AuthCard title="Créer un compte" subtitle="Gratuit, en moins d'une minute.">
      <AuthForm mode="inscription" />
    </AuthCard>
  );
}
