"use client";

import { useState, useTransition } from "react";
import { moveCreation, renameCreation, setCreationTags, type ActionResult } from "@/app/espace/actions";
import { TAGS_MAX, TAG_MAX, TITLE_MAX, normalizeTags } from "@/lib/organisation";

type Props = {
  creationId: string;
  title: string | null;
  suggestedTitle: string;
  folderId: string | null;
  folders: { id: string; name: string }[];
  tags: string[];
  knownTags: string[];
};

const field =
  "w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-200";

export function OrganisationPanel({ creationId, title, suggestedTitle, folderId, folders, tags, knownTags }: Props) {
  const [titleValue, setTitleValue] = useState(title ?? "");
  const [tagList, setTagList] = useState(tags);
  const [tagInput, setTagInput] = useState("");
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);
  const [pending, start] = useTransition();

  function run(action: () => Promise<ActionResult>, okText: string) {
    start(async () => {
      const result = await action();
      setMessage(result.ok ? { ok: true, text: okText } : { ok: false, text: result.error });
    });
  }

  function saveTitle() {
    if (titleValue.trim() === (title ?? "").trim()) return;
    run(() => renameCreation(creationId, titleValue), "✓ Titre enregistré");
  }
  function saveTags(next: string[]) {
    const clean = normalizeTags(next);
    setTagList(clean);
    run(() => setCreationTags(creationId, clean), "✓ Étiquettes enregistrées");
  }
  function addTag() {
    if (!tagInput.trim()) return;
    if (tagList.length >= TAGS_MAX) {
      setMessage({ ok: false, text: `${TAGS_MAX} étiquettes maximum.` });
      return;
    }
    saveTags([...tagList, ...tagInput.split(",")]);
    setTagInput("");
  }

  return (
    <div className="grid gap-4 rounded-xl border border-zinc-200 bg-zinc-50 p-4 sm:grid-cols-3">
      <label className="space-y-1">
        <span className="text-xs font-semibold text-zinc-600">Titre</span>
        <input
          value={titleValue}
          onChange={(e) => setTitleValue(e.target.value)}
          onBlur={saveTitle}
          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), e.currentTarget.blur())}
          maxLength={TITLE_MAX}
          placeholder={suggestedTitle}
          className={field}
        />
      </label>

      <label className="space-y-1">
        <span className="text-xs font-semibold text-zinc-600">Dossier</span>
        <select
          defaultValue={folderId ?? ""}
          onChange={(e) => run(() => moveCreation(creationId, e.target.value || null), "✓ Dossier modifié")}
          className={field}
        >
          <option value="">Sans dossier</option>
          {folders.map((f) => (
            <option key={f.id} value={f.id}>
              {f.name}
            </option>
          ))}
        </select>
        {folders.length === 0 && (
          <span className="block text-xs text-zinc-500">Créez vos dossiers depuis « Mon espace ».</span>
        )}
      </label>

      <div className="space-y-1">
        <span className="text-xs font-semibold text-zinc-600">Étiquettes</span>
        <div className="flex flex-wrap gap-1.5">
          {tagList.map((t) => (
            <span key={t} className="flex items-center gap-1 rounded-full bg-sky-50 px-2 py-0.5 text-xs text-sky-800">
              #{t}
              <button
                type="button"
                onClick={() => saveTags(tagList.filter((x) => x !== t))}
                aria-label={`Retirer l'étiquette ${t}`}
                className="text-sky-600 hover:text-red-700"
              >
                ×
              </button>
            </span>
          ))}
        </div>
        <div className="flex gap-1.5">
          <input
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === ",") {
                e.preventDefault();
                addTag();
              }
            }}
            maxLength={TAG_MAX}
            list={`tags-${creationId}`}
            placeholder="ex. conseils"
            aria-label="Nouvelle étiquette"
            className={field}
          />
          <datalist id={`tags-${creationId}`}>
            {knownTags.filter((t) => !tagList.includes(t)).map((t) => (
              <option key={t} value={t} />
            ))}
          </datalist>
          <button
            type="button"
            onClick={addTag}
            className="shrink-0 rounded-lg border border-zinc-300 bg-white px-3 text-sm font-semibold hover:bg-zinc-100"
          >
            Ajouter
          </button>
        </div>
      </div>

      <p role="status" className={`text-xs sm:col-span-3 ${message ? (message.ok ? "text-emerald-700" : "text-red-700") : "text-zinc-500"}`}>
        {pending ? "Enregistrement…" : message?.text ?? "Les changements sont enregistrés automatiquement."}
      </p>
    </div>
  );
}
