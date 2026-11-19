import "server-only";
import { checkQuota, recordGeneration } from "@/lib/billing";
import { GenerationError, generateContent } from "@/lib/generation";
import { prisma } from "@/lib/prisma";

export type GenerateState = { ok?: boolean; error?: string; upgrade?: boolean; verify?: boolean };

/**
 * Génère (ou régénère) le contenu d'une création pour son propriétaire :
 * vérifications (propriétaire, adresse confirmée, quota) AVANT d'appeler l'IA,
 * puis enregistrement du contenu et du coût.
 */
export async function generateForUser(
  user: { id: string; emailVerified: boolean },
  creationId: string,
): Promise<GenerateState> {
  const creation = await prisma.creation.findFirst({
    where: { id: creationId, userId: user.id },
    select: { id: true, sourceType: true, sourceText: true, format: true },
  });
  if (!creation) return { error: "Création introuvable." };

  // Étape 8a : l'IA (qui coûte) n'est disponible qu'aux adresses e-mail confirmées.
  if (!user.emailVerified) {
    return {
      error: "Confirmez d'abord votre adresse e-mail : cliquez sur le lien reçu par e-mail lors de votre inscription.",
      verify: true,
    };
  }

  // Quotas de l'offre (étape 7).
  const quota = await checkQuota(user.id);
  if (!quota.ok) return { error: quota.error, upgrade: quota.upgrade };

  try {
    const { content, model, usage } = await generateContent(creation);
    await prisma.creation.update({
      where: { id: creation.id },
      data: { content, model, status: "GENERE", generatedAt: new Date() },
    });
    await recordGeneration(user.id, creation.id, usage);
    return { ok: true };
  } catch (error) {
    if (error instanceof GenerationError) return { error: error.message };
    console.error("[generation]", error);
    return { error: "Une erreur inattendue est survenue. Réessayez." };
  }
}
