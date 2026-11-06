"use client";

import { useActionState } from "react";
import { generateCreation, type GenerateState } from "@/app/creations/[id]/actions";

export function GenerateButton({ creationId, regenerate }: { creationId: string; regenerate: boolean }) {
  const [state, formAction, pending] = useActionState<GenerateState>(
    generateCreation.bind(null, creationId),
    {},
  );

  return (
    <form action={formAction} className="space-y-3">
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
            L&apos;IA écrit votre contenu, cela prend généralement 10 à 60 secondes…
          </span>
        )}
      </div>
      {state.error && !pending && (
        <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {state.error}
        </p>
      )}
    </form>
  );
}
