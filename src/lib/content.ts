import { z } from "zod";

// Forme du contenu généré, stocké dans Creation.content.
// Fichier partagé : utilisable côté serveur ET dans les composants "use client".

export const TWEET_MAX = 280;
export const SLIDES_MAX = 15;
export const TWEETS_MAX = 25;
export const TITRE_MAX = 120;
export const TEXTE_MAX = 500;

export const SlideSchema = z.object({
  titre: z.string().describe("Titre court et percutant de la slide"),
  texte: z.string().describe("Texte de la slide, 1 à 3 phrases courtes"),
});

export type Slide = z.infer<typeof SlideSchema>;
export type GeneratedContent =
  | { type: "carrousel"; slides: Slide[] }
  | { type: "thread"; tweets: string[] };

const StoredContentSchema = z.union([
  z.object({ type: z.literal("carrousel"), slides: z.array(SlideSchema) }),
  z.object({ type: z.literal("thread"), tweets: z.array(z.string()) }),
]);

/** Relit le JSON stocké en base ; renvoie null s'il est absent ou invalide. */
export function readContent(value: unknown): GeneratedContent | null {
  const parsed = StoredContentSchema.safeParse(value);
  return parsed.success ? parsed.data : null;
}

/** Longueur « vue » d'un tweet (les emojis comptent pour un caractère ici). */
export function tweetLength(tweet: string) {
  return [...tweet].length;
}
