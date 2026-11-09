import { excerpt } from "@/lib/creations";
import { readContent } from "@/lib/content";

// Règles d'organisation des créations (titres, dossiers, étiquettes).
// Partagé client/serveur.

export const TITLE_MAX = 80;
export const FOLDER_NAME_MAX = 40;
export const FOLDERS_MAX = 50;
export const TAG_MAX = 30;
export const TAGS_MAX = 10;
export const PAGE_SIZE = 12;

/** Titre affiché : celui choisi par l'utilisateur, sinon déduit du contenu. */
export function displayTitle(creation: { title: string | null; content: unknown; sourceText: string }) {
  if (creation.title?.trim()) return creation.title.trim();
  const content = readContent(creation.content);
  if (content?.type === "carrousel" && content.slides[0]?.titre) return excerpt(content.slides[0].titre, 70);
  if (content?.type === "thread" && content.tweets[0]) return excerpt(content.tweets[0], 70);
  return excerpt(creation.sourceText, 70);
}

/** Nettoie une liste d'étiquettes : espaces, « # », doublons (sans tenir compte des majuscules). */
export function normalizeTags(tags: string[]) {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const raw of tags) {
    const tag = raw.replace(/^#+/, "").replace(/\s+/g, " ").trim().slice(0, TAG_MAX);
    const key = tag.toLocaleLowerCase("fr");
    if (tag && !seen.has(key)) {
      seen.add(key);
      result.push(tag);
    }
  }
  return result.slice(0, TAGS_MAX);
}
