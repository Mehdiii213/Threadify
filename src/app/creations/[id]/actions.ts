"use server";

import { refresh } from "next/cache";
import { GenerationError, generateContent } from "@/lib/generation";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/session";

export type GenerateState = { error?: string };

// Appelée via useActionState (l'état précédent, passé en 2e argument, est ignoré).
export async function generateCreation(creationId: string): Promise<GenerateState> {
  const { user } = await requireSession();

  // Seul le propriétaire peut générer sa création.
  const creation = await prisma.creation.findFirst({
    where: { id: creationId, userId: user.id },
    select: { id: true, sourceType: true, sourceText: true, format: true },
  });
  if (!creation) return { error: "Création introuvable." };

  try {
    const { content, model } = await generateContent(creation);
    await prisma.creation.update({
      where: { id: creation.id },
      data: { content, model, status: "GENERE", generatedAt: new Date() },
    });
  } catch (error) {
    if (error instanceof GenerationError) return { error: error.message };
    console.error("[generateCreation]", error);
    return { error: "Une erreur inattendue est survenue. Réessayez." };
  }

  refresh(); // réaffiche la page avec le nouveau contenu
  return {};
}
