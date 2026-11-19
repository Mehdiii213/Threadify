"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { GenerateState } from "@/lib/generate-creation";

// Appelle /api/generate, qui répond en flux (voir src/app/api/generate/route.ts) :
// des espaces pendant que l'IA travaille, puis une ligne JSON avec le résultat.
async function requestGeneration(creationId: string): Promise<GenerateState> {
  try {
    const res = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ creationId }),
    });
    const text = (await res.text()).trim();
    const last = text.split("\n").pop() ?? "";
    if (!last) return { error: "La génération a été interrompue. Réessayez." };
    return JSON.parse(last) as GenerateState;
  } catch {
    return { error: "La connexion a été interrompue pendant la génération. Vérifiez votre connexion et réessayez." };
  }
}

export function GenerateButton({ creationId, regenerate }: { creationId: string; regenerate: boolean }) {
  const router = useRouter();
  const [state, setState] = useState<GenerateState>({});
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (
      regenerate &&
      !window.confirm("Régénérer remplace les textes actuels, y compris vos modifications. Le design est conservé. Continuer ?")
    ) {
      return;
    }
    setState({});
    setPending(true);
    const result = await requestGeneration(creationId);
    if (result.ok) {
      router.refresh(); // réaffiche la page avec le nouveau contenu
      // pending reste vrai jusqu'au nouveau rendu, qui remplace ce bouton
      setTimeout(() => setPending(false), 1500);
      return;
    }
    setPending(false);
    setState(result);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
        <button
          type="submit"
          disabled={pending}
          className={
            regenerate
              ? "rounded-xl border border-violet-300 bg-white px-5 py-2.5 font-semibold text-violet-700 hover:bg-violet-50 disabled:opacity-60"
              : "rounded-xl bg-violet-600 px-6 py-3 font-semibold text-white shadow-lg shadow-violet-600/20 hover:bg-violet-700 disabled:opacity-60"
          }
        >
          {pending ? "Génération en cours…" : regenerate ? "↻ Régénérer" : "✨ Générer"}
        </button>
        {pending && (
          <span className="flex items-center gap-2 text-sm text-zinc-500" aria-live="polite">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-violet-300 border-t-violet-700" aria-hidden />
            L&apos;IA écrit votre contenu, cela prend généralement 10 à 30 secondes…
          </span>
        )}
      </div>
      {state.error && !pending && (
        <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {state.error}
          {state.verify && (
            <>
              {" "}
              <Link href="/compte" className="font-semibold text-violet-700 underline">
                Renvoyer l&apos;e-mail →
              </Link>
            </>
          )}
          {state.upgrade && (
            <>
              {" "}
              <Link href="/tarifs" className="font-semibold text-violet-700 underline">
                Voir les offres →
              </Link>
            </>
          )}
        </p>
      )}
    </form>
  );
}
