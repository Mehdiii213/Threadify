import type { CreationFormat, SourceType } from "@/generated/prisma/client";

// Règles et libellés partagés (serveur + client) pour les créations.

export const SOURCE_LIMITS: Record<SourceType, { min: number; max: number }> = {
  IDEE: { min: 10, max: 500 },
  ARTICLE: { min: 200, max: 20000 },
};

export const SOURCE_LABELS: Record<SourceType, string> = {
  IDEE: "Une idée",
  ARTICLE: "Un article",
};

export const FORMATS: {
  value: CreationFormat;
  label: string;
  description: string;
  detail: string;
}[] = [
  {
    value: "CARROUSEL_INSTAGRAM",
    label: "Carrousel Instagram",
    description: "Des slides verticales, lisibles et cohérentes.",
    detail: "Images 1080 × 1350 px",
  },
  {
    value: "CARROUSEL_LINKEDIN",
    label: "Carrousel LinkedIn",
    description: "Un document designé qui se feuillette dans le fil.",
    detail: "PDF 1080 × 1350 px",
  },
  {
    value: "THREAD_X",
    label: "Thread X",
    description: "Votre contenu découpé en tweets percutants.",
    detail: "Tweets de 280 caractères max.",
  },
];

export const FORMAT_LABELS = Object.fromEntries(
  FORMATS.map((f) => [f.value, f.label]),
) as Record<CreationFormat, string>;

export function isSourceType(value: unknown): value is SourceType {
  return value === "IDEE" || value === "ARTICLE";
}

export function isCreationFormat(value: unknown): value is CreationFormat {
  return FORMATS.some((f) => f.value === value);
}

export function excerpt(text: string, length = 140) {
  const clean = text.replace(/\s+/g, " ").trim();
  return clean.length > length ? `${clean.slice(0, length).trimEnd()}…` : clean;
}

const dateFormatter = new Intl.DateTimeFormat("fr-FR", {
  dateStyle: "long",
  timeStyle: "short",
  timeZone: "Europe/Paris",
});

export function formatDate(date: Date) {
  return dateFormatter.format(date);
}
