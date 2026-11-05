"use client";

import Link from "next/link";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { authErrorMessage } from "@/lib/auth-errors";

type Mode = "inscription" | "connexion";

const inputClass =
  "w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-zinc-900 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-200";

export function AuthForm({ mode }: { mode: Mode }) {
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const isSignUp = mode === "inscription";

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") ?? "").trim();
    const password = String(form.get("password") ?? "");

    setPending(true);
    const { error } = isSignUp
      ? await authClient.signUp.email({
          name: String(form.get("name") ?? "").trim(),
          email,
          password,
        })
      : await authClient.signIn.email({ email, password });
    setPending(false);

    if (error) {
      setError(authErrorMessage(error));
      return;
    }
    // Nouveau compte : direction la première création ; reconnexion : l'espace.
    // Navigation complète (et non router.push) : le routeur client garde en
    // mémoire les redirections vues avant la connexion (ex. /creer -> /inscription)
    // et les rejouerait. Recharger la page repart d'un état propre.
    window.location.assign(isSignUp ? "/creer" : "/espace");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate={false}>
      {isSignUp && (
        <label className="block space-y-1.5">
          <span className="text-sm font-medium text-zinc-700">Prénom ou nom</span>
          <input name="name" type="text" required autoComplete="name" className={inputClass} />
        </label>
      )}
      <label className="block space-y-1.5">
        <span className="text-sm font-medium text-zinc-700">Adresse e-mail</span>
        <input name="email" type="email" required autoComplete="email" className={inputClass} />
      </label>
      <label className="block space-y-1.5">
        <span className="text-sm font-medium text-zinc-700">Mot de passe</span>
        <input
          name="password"
          type="password"
          required
          minLength={isSignUp ? 8 : undefined}
          autoComplete={isSignUp ? "new-password" : "current-password"}
          className={inputClass}
        />
        {isSignUp && <span className="text-xs text-zinc-500">8 caractères minimum.</span>}
      </label>

      {error && (
        <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-lg bg-violet-600 px-4 py-2.5 font-semibold text-white shadow-lg shadow-violet-600/20 hover:bg-violet-700 disabled:opacity-60"
      >
        {pending ? "Un instant…" : isSignUp ? "Créer mon compte" : "Se connecter"}
      </button>

      <p className="text-center text-sm text-zinc-600">
        {isSignUp ? (
          <>
            Déjà un compte ?{" "}
            <Link href="/connexion" className="font-semibold text-violet-700 hover:underline">
              Se connecter
            </Link>
          </>
        ) : (
          <>
            Pas encore de compte ?{" "}
            <Link href="/inscription" className="font-semibold text-violet-700 hover:underline">
              Créer un compte
            </Link>
          </>
        )}
      </p>
    </form>
  );
}
