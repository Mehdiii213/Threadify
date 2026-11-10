import type { Metadata } from "next";
import { AuthCard } from "@/components/auth-card";
import { ForgotPasswordForm } from "@/components/password-forms";

export const metadata: Metadata = { title: "Mot de passe oublié" };

export default function MotDePasseOubliePage() {
  return (
    <AuthCard title="Mot de passe oublié ?" subtitle="Indiquez votre adresse e-mail : nous vous envoyons un lien pour en choisir un nouveau.">
      <ForgotPasswordForm />
    </AuthCard>
  );
}
