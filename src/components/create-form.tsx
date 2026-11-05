"use client";

import { useActionState, useState } from "react";
import { createCreation, type CreateCreationState } from "@/app/creer/actions";
import { FORMATS, SOURCE_LIMITS } from "@/lib/creations";

type Source = "IDEE" | "ARTICLE";

const placeholders: Record<Source, string> = {
  IDEE: "Ex. : 5 erreurs à éviter quand on lance son entreprise",
  ARTICLE: "Collez ici le texte complet de votre article…",
};

export function CreateForm() {
  const [state, formAction, pending] = useActionState<CreateCreationState, FormData>(
    createCreation,
    {},
  );
  const initialSource: Source = state.values?.sourceType === "ARTICLE" ? "ARTICLE" : "IDEE";
  const [source, setSource] = useState<Source>(initialSource);
  const [text, setText] = useState(state.values?.sourceText ?? "");
  const limits = SOURCE_LIMITS[source];
  const tooLong = text.trim().length > limits.max;

  return (
    <form action={formAction} className="space-y-8">
      <input type="hidden" name="sourceType" value={source} />

      {/* 1. Source */}
      <fieldset className="space-y-3">
        <legend className="mb-3 text-lg font-semibold">1. Votre point de départ</legend>
        <div role="tablist" className="inline-flex rounded-xl bg-zinc-100 p-1">
          {(["IDEE", "ARTICLE"] as const).map((value) => (
            <button
              key={value}
              type="button"
              role="tab"
              aria-selected={source === value}
              onClick={() => setSource(value)}
              className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                source === value ? "bg-white text-violet-700 shadow-sm" : "text-zinc-600 hover:text-zinc-900"
              }`}
            >
              {value === "IDEE" ? "💡 Une idée" : "📄 Un article"}
            </button>
          ))}
        </div>
        <p className="text-sm text-zinc-600">
          {source === "IDEE"
            ? "Une phrase ou quelques lignes : le sujet, l'angle, ce que vous voulez transmettre."
            : "Collez le texte d'un article, d'une newsletter ou d'un billet de blog."}
        </p>
        <textarea
          name="sourceText"
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={source === "IDEE" ? 3 : 12}
          placeholder={placeholders[source]}
          aria-invalid={Boolean(state.errors?.sourceText)}
          className="w-full rounded-xl border border-zinc-300 bg-white p-4 text-zinc-900 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-200"
        />
        <div className="flex items-start justify-between gap-4 text-sm">
          <p role="alert" className="text-red-700">
            {state.errors?.sourceText}
          </p>
          <span className={`shrink-0 tabular-nums ${tooLong ? "text-red-700" : "text-zinc-500"}`}>
            {text.trim().length.toLocaleString("fr-FR")} / {limits.max.toLocaleString("fr-FR")} caractères
          </span>
        </div>
      </fieldset>

      {/* 2. Format */}
      <fieldset>
        <legend className="mb-3 text-lg font-semibold">2. Le format</legend>
        <div className="grid gap-4 sm:grid-cols-3">
          {FORMATS.map((f) => (
            <label
              key={f.value}
              className="cursor-pointer rounded-2xl border-2 border-zinc-200 bg-white p-5 transition hover:border-violet-300 has-[:checked]:border-violet-600 has-[:checked]:bg-violet-50"
            >
              <input
                type="radio"
                name="format"
                value={f.value}
                defaultChecked={state.values?.format === f.value}
                className="sr-only"
              />
              <span className="block font-semibold">{f.label}</span>
              <span className="mt-1 block text-sm text-zinc-600">{f.description}</span>
              <span className="mt-3 block text-xs font-medium text-violet-700">{f.detail}</span>
            </label>
          ))}
        </div>
        <p role="alert" className="mt-2 text-sm text-red-700">
          {state.errors?.format}
        </p>
      </fieldset>

      {state.errors?.form && (
        <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {state.errors.form}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-xl bg-violet-600 px-6 py-3 font-semibold text-white shadow-lg shadow-violet-600/20 hover:bg-violet-700 disabled:opacity-60 sm:w-auto"
      >
        {pending ? "Enregistrement…" : "Continuer →"}
      </button>
    </form>
  );
}
