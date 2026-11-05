"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/session";
import { SOURCE_LIMITS, isCreationFormat, isSourceType } from "@/lib/creations";

export type CreateCreationState = {
  errors?: { sourceText?: string; format?: string; form?: string };
  values?: { sourceType: string; sourceText: string; format: string };
};

export async function createCreation(
  _prevState: CreateCreationState,
  formData: FormData,
): Promise<CreateCreationState> {
  const { user } = await requireSession();

  const sourceType = String(formData.get("sourceType") ?? "");
  const sourceText = String(formData.get("sourceText") ?? "").trim();
  const format = String(formData.get("format") ?? "");
  const values = { sourceType, sourceText, format };

  if (!isSourceType(sourceType)) {
    return { values, errors: { form: "Choisissez « Une idée » ou « Un article »." } };
  }

  const errors: NonNullable<CreateCreationState["errors"]> = {};
  const { min, max } = SOURCE_LIMITS[sourceType];
  const what = sourceType === "IDEE" ? "Votre idée" : "Votre article";
  if (sourceText.length < min) {
    errors.sourceText = `${what} doit faire au moins ${min} caractères (actuellement ${sourceText.length}).`;
  } else if (sourceText.length > max) {
    errors.sourceText = `${what} ne doit pas dépasser ${max.toLocaleString("fr-FR")} caractères.`;
  }
  if (!isCreationFormat(format)) {
    errors.format = "Choisissez un format.";
  }
  if (errors.sourceText || errors.format || !isCreationFormat(format)) {
    return { values, errors };
  }

  const creation = await prisma.creation.create({
    data: { userId: user.id, sourceType, sourceText, format },
    select: { id: true },
  });

  redirect(`/creations/${creation.id}`);
}
