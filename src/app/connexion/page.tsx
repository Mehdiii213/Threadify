import type { Metadata } from "next";
import { AuthCard } from "@/components/auth-card";
import { AuthForm } from "@/components/auth-form";

export const metadata: Metadata = { title: "Connexion" };

export default function ConnexionPage() {
  return (
    <AuthCard title="Bon retour !" subtitle="Connectez-vous pour retrouver vos créations.">
      <AuthForm mode="connexion" />
    </AuthCard>
  );
}
