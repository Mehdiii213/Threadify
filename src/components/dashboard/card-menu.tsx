"use client";

import { useRef, useTransition } from "react";
import {
  deleteCreation,
  duplicateCreation,
  moveCreation,
  renameCreation,
  type ActionResult,
} from "@/app/espace/actions";

type Folder = { id: string; name: string };

const item = "block w-full px-3 py-2 text-left text-sm text-zinc-700 hover:bg-zinc-100 disabled:opacity-50";

export function CardMenu({
  creationId,
  title,
  folderId,
  folders,
}: {
  creationId: string;
  title: string;
  folderId: string | null;
  folders: Folder[];
}) {
  const [pending, start] = useTransition();
  const details = useRef<HTMLDetailsElement>(null);

  // Referme le menu dès qu'une action est choisie (même si elle est annulée ensuite).
  const close = () => details.current?.removeAttribute("open");

  function run(action: () => Promise<ActionResult>) {
    start(async () => {
      const result = await action();
      if (!result.ok) window.alert(result.error);
    });
  }

  return (
    <details ref={details} className="relative">
      <summary
        aria-label={`Actions pour « ${title} »`}
        className="flex h-8 w-8 cursor-pointer list-none items-center justify-center rounded-lg text-lg leading-none text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 [&::-webkit-details-marker]:hidden"
      >
        {pending ? "…" : "⋯"}
      </summary>
      <div className="absolute right-0 z-20 mt-1 w-56 overflow-hidden rounded-xl border border-zinc-200 bg-white py-1 shadow-lg">
        <button
          type="button"
          className={item}
          onClick={() => {
            close();
            const next = window.prompt("Nouveau titre de la création :", title);
            if (next !== null) run(() => renameCreation(creationId, next));
          }}
        >
          ✏️ Renommer
        </button>
        <div className="border-t border-zinc-100 px-3 pt-2 pb-1 text-xs font-semibold text-zinc-500">Déplacer vers</div>
        <button type="button" className={item} disabled={folderId === null} onClick={() => (close(), run(() => moveCreation(creationId, null)))}>
          {folderId === null ? "✓ " : ""}Sans dossier
        </button>
        {folders.map((f) => (
          <button
            key={f.id}
            type="button"
            className={item}
            disabled={folderId === f.id}
            onClick={() => (close(), run(() => moveCreation(creationId, f.id)))}
          >
            {folderId === f.id ? "✓ " : "📁 "}
            {f.name}
          </button>
        ))}
        <div className="border-t border-zinc-100" />
        <button type="button" className={item} onClick={() => (close(), run(() => duplicateCreation(creationId)))}>
          📄 Dupliquer
        </button>
        <button
          type="button"
          className={`${item} text-red-700 hover:bg-red-50`}
          onClick={() => {
            close();
            if (window.confirm(`Supprimer définitivement « ${title} » ? Cette action est irréversible.`)) {
              run(() => deleteCreation(creationId));
            }
          }}
        >
          🗑️ Supprimer
        </button>
      </div>
    </details>
  );
}
