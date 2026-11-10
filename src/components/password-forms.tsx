"use client";

import Link from "next/link";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { authErrorMessage } from "@/lib/auth-errors";

export const inputClass =
  "w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-zinc-900 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-200";
const buttonClass =
  "w-full rounded-lg bg-violet-600 px-4 py-2.5 font-semibold text-white shadow-lg shadow-violet-600/20 hover:bg-violet-700 disabled:opacity-60";

function ErrorBox({ children }: { children: React.ReactNode }) {
  return (
    <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
      {children}
    </p>
  );
}

/** Page « Mot de passe oublié » : demande l'envoi du lien. */
export function ForgotPasswordForm() {
  const [error, setError] = useState<string | null>(null);
  const [sentTo, setSentTo] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    const email = String(new FormData(event.currentTarget).get("email") ?? "").trim();
    setPending(true);
    const { error } = await authClient.requestPasswordReset({
      email,
      redirectTo: `${window.location.origin}/nouveau-mot-de-passe`,
    });
    setPending(false);
    if (error) return setError(authErrorMessage(error));
    setSentTo(email);
  }

  if (sentTo) {
    return (
      <div role="status" className="space-y-4">
        <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-3 text-sm text-emerald-800">
          ✓ Si un compte existe avec l&apos;adresse <strong>{sentTo}</strong>, un e-mail vient de lui être envoyé avec un lien pour
          choisir un nouveau mot de passe (valable 1 heure). Pensez à regarder dans les courriers indésirables.
        </p>
        <Link href="/connexion" className="block text-center text-sm font-semibold text-violet-700 hover:underline">
          ← Retour à la connexion
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <label className="block space-y-1.5">
        <span className="text-sm font-medium text-zinc-700">Adresse e-mail de votre compte</span>
        <input name="email" type="email" required autoComplete="email" className={inputClass} />
      </label>
      {error && <ErrorBox>{error}</ErrorBox>}
      <button type="submit" disabled={pending} className={buttonClass}>
        {pending ? "Un instant…" : "Recevoir le lien"}
      </button>
      <Link href="/connexion" className="block text-center text-sm font-semibold text-violet-700 hover:underline">
        ← Retour à la connexion
      </Link>
    </form>
  );
}

/** Page « Nouveau mot de passe » : ouverte depuis le lien reçu par e-mail. */
export function ResetPasswordForm({ token }: { token: string }) {
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    const form = new FormData(event.currentTarget);
    const newPassword = String(form.get("password") ?? "");
    if (newPassword !== String(form.get("confirm") ?? "")) return setError("Les deux mots de passe ne sont pas identiques.");
    setPending(true);
    const { error } = await authClient.resetPassword({ newPassword, token });
    setPending(false);
    if (error) return setError(authErrorMessage(error));
    setDone(true);
  }

  if (done) {
    return (
      <div role="status" className="space-y-4">
        <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-3 text-sm text-emerald-800">
          ✓ Votre mot de passe a été changé. Par sécurité, vous avez été déconnecté de tous vos appareils.
        </p>
        <Link href="/connexion" className={`${buttonClass} block text-center`}>
          Se connecter
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <label className="block space-y-1.5">
        <span className="text-sm font-medium text-zinc-700">Nouveau mot de passe</span>
        <input name="password" type="password" required minLength={8} maxLength={128} autoComplete="new-password" className={inputClass} />
        <span className="text-xs text-zinc-500">8 caractères minimum.</span>
      </label>
      <label className="block space-y-1.5">
        <span className="text-sm font-medium text-zinc-700">Confirmez le nouveau mot de passe</span>
        <input name="confirm" type="password" required minLength={8} maxLength={128} autoComplete="new-password" className={inputClass} />
      </label>
      {error && <ErrorBox>{error}</ErrorBox>}
      <button type="submit" disabled={pending} className={buttonClass}>
        {pending ? "Un instant…" : "Enregistrer le nouveau mot de passe"}
      </button>
    </form>
  );
}

/** Page « Mon compte » : renvoyer l'e-mail de confirmation. */
export function ResendVerificationButton({ email }: { email: string }) {
  const [state, setState] = useState<"idle" | "pending" | "sent">("idle");
  const [error, setError] = useState<string | null>(null);

  async function resend() {
    setError(null);
    setState("pending");
    const { error } = await authClient.sendVerificationEmail({ email, callbackURL: "/espace?email=confirme" });
    if (error) {
      setState("idle");
      return setError(authErrorMessage(error));
    }
    setState("sent");
  }

  return (
    <div className="space-y-2">
      {state === "sent" ? (
        <p role="status" className="text-sm font-medium text-emerald-700">
          ✓ E-mail envoyé à {email}. Cliquez sur le lien qu&apos;il contient (pensez aux courriers indésirables).
        </p>
      ) : (
        <button
          type="button"
          onClick={resend}
          disabled={state === "pending"}
          className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-700 disabled:opacity-60"
        >
          {state === "pending" ? "Envoi…" : "Renvoyer l'e-mail de confirmation"}
        </button>
      )}
      {error && <ErrorBox>{error}</ErrorBox>}
    </div>
  );
}

/** Page « Mon compte » : changer de mot de passe (en connaissant l'actuel). */
export function ChangePasswordForm() {
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setDone(false);
    const formEl = event.currentTarget;
    const form = new FormData(formEl);
    const newPassword = String(form.get("password") ?? "");
    if (newPassword !== String(form.get("confirm") ?? "")) return setError("Les deux nouveaux mots de passe ne sont pas identiques.");
    setPending(true);
    const { error } = await authClient.changePassword({
      currentPassword: String(form.get("current") ?? ""),
      newPassword,
      revokeOtherSessions: true,
    });
    setPending(false);
    if (error) return setError(authErrorMessage(error));
    formEl.reset();
    setDone(true);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <label className="block space-y-1.5">
        <span className="text-sm font-medium text-zinc-700">Mot de passe actuel</span>
        <input name="current" type="password" required autoComplete="current-password" className={inputClass} />
      </label>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block space-y-1.5">
          <span className="text-sm font-medium text-zinc-700">Nouveau mot de passe</span>
          <input name="password" type="password" required minLength={8} maxLength={128} autoComplete="new-password" className={inputClass} />
        </label>
        <label className="block space-y-1.5">
          <span className="text-sm font-medium text-zinc-700">Confirmation</span>
          <input name="confirm" type="password" required minLength={8} maxLength={128} autoComplete="new-password" className={inputClass} />
        </label>
      </div>
      {error && <ErrorBox>{error}</ErrorBox>}
      {done && (
        <p role="status" className="text-sm font-medium text-emerald-700">
          ✓ Mot de passe changé. Vos autres appareils ont été déconnectés.
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-semibold text-zinc-800 hover:bg-zinc-100 disabled:opacity-60"
      >
        {pending ? "Un instant…" : "Changer le mot de passe"}
      </button>
    </form>
  );
}

/** Page « Mon compte » : suppression définitive (mot de passe + mot SUPPRIMER). */
export function DeleteAccountForm({ hasSubscription }: { hasSubscription: boolean }) {
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    const form = new FormData(event.currentTarget);
    if (String(form.get("confirm") ?? "").trim().toUpperCase() !== "SUPPRIMER") {
      return setError("Tapez le mot SUPPRIMER pour confirmer.");
    }
    setPending(true);
    const { error } = await authClient.deleteUser({ password: String(form.get("password") ?? "") });
    if (error) {
      setPending(false);
      return setError(authErrorMessage(error));
    }
    // Navigation complète : la session n'existe plus (le routeur client garderait l'ancien état).
    // eslint-disable-next-line @next/next/no-location-assign-relative-destination
    window.location.assign("/compte-supprime");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <ul className="list-disc space-y-1 pl-5 text-sm text-zinc-700">
        <li>Toutes vos créations, dossiers et étiquettes sont effacés définitivement.</li>
        {hasSubscription && <li>Votre abonnement est résilié immédiatement (sans remboursement du mois en cours).</li>}
        <li>Cette action est irréversible.</li>
      </ul>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block space-y-1.5">
          <span className="text-sm font-medium text-zinc-700">Votre mot de passe</span>
          <input name="password" type="password" required autoComplete="current-password" className={inputClass} />
        </label>
        <label className="block space-y-1.5">
          <span className="text-sm font-medium text-zinc-700">Tapez SUPPRIMER</span>
          <input name="confirm" type="text" required autoComplete="off" className={inputClass} />
        </label>
      </div>
      {error && <ErrorBox>{error}</ErrorBox>}
      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
      >
        {pending ? "Suppression…" : "Supprimer définitivement mon compte"}
      </button>
    </form>
  );
}
