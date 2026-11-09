"use client";

import Link from "next/link";
import { useTransition } from "react";
import { createFolder, deleteFolder, renameFolder, type ActionResult } from "@/app/espace/actions";

type Folder = { id: string; name: string; count: number };

export function FolderNav({
  folders,
  active,
  totalCount,
  noFolderCount,
  hrefFor,
}: {
  folders: Folder[];
  active: string | null; // id du dossier, "aucun" ou null (tous)
  totalCount: number;
  noFolderCount: number;
  hrefFor: Record<string, string>; // clé : "" (tous), "aucun" ou id du dossier
}) {
  const [pending, start] = useTransition();

  function run(action: () => Promise<ActionResult>, after?: (r: ActionResult) => void) {
    start(async () => {
      const result = await action();
      if (!result.ok) window.alert(result.error);
      else after?.(result);
    });
  }

  const pill = (isActive: boolean) =>
    `flex items-center justify-between gap-2 rounded-lg px-3 py-2 text-sm ${
      isActive ? "bg-violet-100 font-semibold text-violet-800" : "text-zinc-700 hover:bg-zinc-100"
    }`;
  const activeFolder = folders.find((f) => f.id === active);

  return (
    <nav aria-label="Dossiers" className="space-y-1">
      <h2 className="mb-2 px-3 text-xs font-semibold tracking-wide text-zinc-500 uppercase">Dossiers</h2>
      <Link href={hrefFor[""]} className={pill(active === null)}>
        <span>🗂️ Toutes les créations</span>
        <span className="text-xs text-zinc-500">{totalCount}</span>
      </Link>
      {folders.map((f) => (
        <Link key={f.id} href={hrefFor[f.id]} className={pill(active === f.id)}>
          <span className="truncate">📁 {f.name}</span>
          <span className="text-xs text-zinc-500">{f.count}</span>
        </Link>
      ))}
      <Link href={hrefFor["aucun"]} className={pill(active === "aucun")}>
        <span>📄 Sans dossier</span>
        <span className="text-xs text-zinc-500">{noFolderCount}</span>
      </Link>

      <button
        type="button"
        disabled={pending}
        onClick={() => {
          const name = window.prompt("Nom du nouveau dossier (ex. le nom d'un client) :");
          if (name !== null) run(() => createFolder(name));
        }}
        className="mt-2 w-full rounded-lg border border-dashed border-zinc-300 px-3 py-2 text-left text-sm font-medium text-zinc-600 hover:border-violet-400 hover:text-violet-700 disabled:opacity-50"
      >
        + Nouveau dossier
      </button>

      {activeFolder && (
        <div className="mt-3 flex gap-2 px-1">
          <button
            type="button"
            disabled={pending}
            onClick={() => {
              const name = window.prompt("Nouveau nom du dossier :", activeFolder.name);
              if (name !== null) run(() => renameFolder(activeFolder.id, name));
            }}
            className="text-xs font-medium text-violet-700 hover:underline"
          >
            Renommer le dossier
          </button>
          <button
            type="button"
            disabled={pending}
            onClick={() => {
              if (
                window.confirm(
                  `Supprimer le dossier « ${activeFolder.name} » ? Ses créations ne sont pas supprimées : elles passent « Sans dossier ».`,
                )
              ) {
                run(() => deleteFolder(activeFolder.id), () => window.location.assign(hrefFor[""]));
              }
            }}
            className="text-xs font-medium text-red-700 hover:underline"
          >
            Supprimer le dossier
          </button>
        </div>
      )}
    </nav>
  );
}
