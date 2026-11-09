"use server";

import { refresh } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/session";
import { FOLDERS_MAX, FOLDER_NAME_MAX, TAGS_MAX, TITLE_MAX, normalizeTags } from "@/lib/organisation";

// Actions du tableau de bord : titres, dossiers, étiquettes, duplication, suppression.
// Chaque action vérifie la session et que l'élément appartient à l'utilisateur.

export type ActionResult = { ok: true; id?: string } | { ok: false; error: string };

const fail = (error: string): ActionResult => ({ ok: false, error });

async function ownedCreation(userId: string, id: string) {
  return prisma.creation.findFirst({ where: { id, userId } });
}

// ─── Créations ────────────────────────────────────────────────────────────────

export async function renameCreation(id: string, title: string): Promise<ActionResult> {
  const { user } = await requireSession();
  if (!(await ownedCreation(user.id, id))) return fail("Création introuvable.");
  const clean = title.trim();
  if (clean.length > TITLE_MAX) return fail(`Le titre fait ${TITLE_MAX} caractères maximum.`);
  await prisma.creation.update({ where: { id }, data: { title: clean || null } });
  refresh();
  return { ok: true };
}

export async function moveCreation(id: string, folderId: string | null): Promise<ActionResult> {
  const { user } = await requireSession();
  if (!(await ownedCreation(user.id, id))) return fail("Création introuvable.");
  if (folderId && !(await prisma.folder.findFirst({ where: { id: folderId, userId: user.id } }))) {
    return fail("Dossier introuvable.");
  }
  await prisma.creation.update({ where: { id }, data: { folderId } });
  refresh();
  return { ok: true };
}

export async function setCreationTags(id: string, tags: string[]): Promise<ActionResult> {
  const { user } = await requireSession();
  if (!(await ownedCreation(user.id, id))) return fail("Création introuvable.");
  if (!Array.isArray(tags) || tags.length > TAGS_MAX * 2) return fail(`${TAGS_MAX} étiquettes maximum.`);
  await prisma.creation.update({ where: { id }, data: { tags: normalizeTags(tags.map(String)) } });
  refresh();
  return { ok: true };
}

export async function duplicateCreation(id: string): Promise<ActionResult> {
  const { user } = await requireSession();
  const c = await ownedCreation(user.id, id);
  if (!c) return fail("Création introuvable.");
  const base = c.title?.trim() || null;
  const copy = await prisma.creation.create({
    data: {
      userId: user.id,
      sourceType: c.sourceType,
      sourceText: c.sourceText,
      format: c.format,
      status: c.status,
      content: c.content ?? undefined,
      design: c.design ?? undefined,
      generatedAt: c.generatedAt,
      model: c.model,
      title: base ? `${base} (copie)`.slice(0, TITLE_MAX) : "Copie",
      folderId: c.folderId,
      tags: c.tags,
    },
    select: { id: true },
  });
  refresh();
  return { ok: true, id: copy.id };
}

export async function deleteCreation(id: string): Promise<ActionResult> {
  const { user } = await requireSession();
  const { count } = await prisma.creation.deleteMany({ where: { id, userId: user.id } });
  if (count === 0) return fail("Création introuvable.");
  refresh();
  return { ok: true };
}

// ─── Dossiers ─────────────────────────────────────────────────────────────────

function checkFolderName(name: string): string | null {
  const clean = name.replace(/\s+/g, " ").trim();
  if (!clean) return null;
  return clean.slice(0, FOLDER_NAME_MAX);
}

export async function createFolder(name: string): Promise<ActionResult> {
  const { user } = await requireSession();
  const clean = checkFolderName(name);
  if (!clean) return fail("Donnez un nom au dossier.");
  if ((await prisma.folder.count({ where: { userId: user.id } })) >= FOLDERS_MAX) {
    return fail(`${FOLDERS_MAX} dossiers maximum.`);
  }
  if (await prisma.folder.findFirst({ where: { userId: user.id, name: { equals: clean, mode: "insensitive" } } })) {
    return fail("Un dossier porte déjà ce nom.");
  }
  const folder = await prisma.folder.create({ data: { userId: user.id, name: clean }, select: { id: true } });
  refresh();
  return { ok: true, id: folder.id };
}

export async function renameFolder(id: string, name: string): Promise<ActionResult> {
  const { user } = await requireSession();
  const clean = checkFolderName(name);
  if (!clean) return fail("Donnez un nom au dossier.");
  if (!(await prisma.folder.findFirst({ where: { id, userId: user.id } }))) return fail("Dossier introuvable.");
  if (
    await prisma.folder.findFirst({
      where: { userId: user.id, name: { equals: clean, mode: "insensitive" }, NOT: { id } },
    })
  ) {
    return fail("Un dossier porte déjà ce nom.");
  }
  await prisma.folder.update({ where: { id }, data: { name: clean } });
  refresh();
  return { ok: true };
}

export async function deleteFolder(id: string): Promise<ActionResult> {
  const { user } = await requireSession();
  // Les créations du dossier sont conservées (folderId remis à vide par la base).
  const { count } = await prisma.folder.deleteMany({ where: { id, userId: user.id } });
  if (count === 0) return fail("Dossier introuvable.");
  refresh();
  return { ok: true };
}
