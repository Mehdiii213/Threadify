"use server";

import { refresh } from "next/cache";
import { z } from "zod";
import {
  SLIDES_MAX,
  TEXTE_MAX,
  TITRE_MAX,
  TWEETS_MAX,
  TWEET_MAX,
  readContent,
  tweetLength,
} from "@/lib/content";
import { DesignSchema } from "@/lib/design";
import { checkQuota, recordGeneration } from "@/lib/billing";
import { GenerationError, generateContent } from "@/lib/generation";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/session";

export type GenerateState = { error?: string; upgrade?: boolean };

// Appelée via useActionState (l'état précédent, passé en 2e argument, est ignoré).
export async function generateCreation(creationId: string): Promise<GenerateState> {
  const { user } = await requireSession();

  // Seul le propriétaire peut générer sa création.
  const creation = await prisma.creation.findFirst({
    where: { id: creationId, userId: user.id },
    select: { id: true, sourceType: true, sourceText: true, format: true },
  });
  if (!creation) return { error: "Création introuvable." };

  // Quotas de l'offre (étape 7) : vérifiés AVANT d'appeler l'IA (qui coûte).
  const quota = await checkQuota(user.id);
  if (!quota.ok) return { error: quota.error, upgrade: quota.upgrade };

  try {
    const { content, model } = await generateContent(creation);
    await prisma.creation.update({
      where: { id: creation.id },
      data: { content, model, status: "GENERE", generatedAt: new Date() },
    });
    await recordGeneration(user.id, creation.id);
  } catch (error) {
    if (error instanceof GenerationError) return { error: error.message };
    console.error("[generateCreation]", error);
    return { error: "Une erreur inattendue est survenue. Réessayez." };
  }

  refresh(); // réaffiche la page avec le nouveau contenu
  return {};
}

// ─── Étape 4 : enregistrement des modifications (textes + design) ─────────────

const SlidesInput = z
  .array(
    z.object({
      titre: z.string().trim().max(TITRE_MAX, `Un titre fait ${TITRE_MAX} caractères maximum.`),
      texte: z.string().trim().max(TEXTE_MAX, `Un texte de slide fait ${TEXTE_MAX} caractères maximum.`),
    }),
  )
  .min(1, "Le carrousel doit garder au moins une slide.")
  .max(SLIDES_MAX, `Le carrousel compte ${SLIDES_MAX} slides maximum.`)
  .refine((slides) => slides.every((s) => s.titre || s.texte), "Une slide ne peut pas être entièrement vide.");

const TweetsInput = z
  .array(z.string().trim().min(1, "Un tweet ne peut pas être vide."))
  .min(1, "Le thread doit garder au moins un tweet.")
  .max(TWEETS_MAX, `Le thread compte ${TWEETS_MAX} tweets maximum.`)
  .refine((tweets) => tweets.every((t) => tweetLength(t) <= TWEET_MAX), `Chaque tweet fait ${TWEET_MAX} caractères maximum.`);

export type SaveResult = { ok: true } | { ok: false; error: string };

async function findOwned(creationId: string) {
  const { user } = await requireSession();
  return prisma.creation.findFirst({
    where: { id: creationId, userId: user.id },
    select: { id: true, format: true, content: true },
  });
}

export async function saveCarousel(creationId: string, input: { slides: unknown; design: unknown }): Promise<SaveResult> {
  const creation = await findOwned(creationId);
  if (!creation || creation.format === "THREAD_X" || !readContent(creation.content)) {
    return { ok: false, error: "Création introuvable." };
  }
  const slides = SlidesInput.safeParse(input.slides);
  if (!slides.success) return { ok: false, error: slides.error.issues[0].message };
  const design = DesignSchema.safeParse(input.design);
  if (!design.success) return { ok: false, error: design.error.issues[0].message };

  await prisma.creation.update({
    where: { id: creation.id },
    data: { content: { type: "carrousel", slides: slides.data }, design: design.data },
  });
  return { ok: true };
}

export async function saveThread(creationId: string, input: { tweets: unknown }): Promise<SaveResult> {
  const creation = await findOwned(creationId);
  if (!creation || creation.format !== "THREAD_X" || !readContent(creation.content)) {
    return { ok: false, error: "Création introuvable." };
  }
  const tweets = TweetsInput.safeParse(input.tweets);
  if (!tweets.success) return { ok: false, error: tweets.error.issues[0].message };

  await prisma.creation.update({
    where: { id: creation.id },
    data: { content: { type: "thread", tweets: tweets.data } },
  });
  return { ok: true };
}
