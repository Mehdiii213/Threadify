import { z } from "zod";

// Réglages de design d'un carrousel, stockés dans Creation.design.
// Fichier partagé : utilisable côté serveur ET dans les composants "use client".

export const SLIDE_WIDTH = 1080;
export const SLIDE_HEIGHT = 1350;

export const TEMPLATES = [
  { value: "minimal", label: "Minimal", description: "Fond clair, sobre et élégant" },
  { value: "audacieux", label: "Audacieux", description: "Couleur pleine, gros titres" },
  { value: "degrade", label: "Dégradé", description: "Fond en dégradé, moderne" },
] as const;
export type TemplateId = (typeof TEMPLATES)[number]["value"];

export const FONTS = [
  { value: "inter", label: "Inter", description: "Moderne et très lisible" },
  { value: "montserrat", label: "Montserrat", description: "Géométrique et affirmée" },
  { value: "poppins", label: "Poppins", description: "Ronde et chaleureuse" },
  { value: "playfair", label: "Playfair Display", description: "Élégante, avec empattements" },
] as const;
export type FontId = (typeof FONTS)[number]["value"];

export type Colors = { background: string; text: string; accent: string };

export const PALETTES: { name: string; colors: Colors }[] = [
  { name: "Violet", colors: { background: "#F5F3FF", text: "#1E1B4B", accent: "#7C3AED" } },
  { name: "Nuit", colors: { background: "#0F172A", text: "#F8FAFC", accent: "#38BDF8" } },
  { name: "Corail", colors: { background: "#FFF1EC", text: "#3B1F1A", accent: "#F25F4C" } },
  { name: "Sapin", colors: { background: "#0F2E24", text: "#F0FDF4", accent: "#34D399" } },
  { name: "Soleil", colors: { background: "#FFFBEB", text: "#1C1917", accent: "#F59E0B" } },
  { name: "Noir & blanc", colors: { background: "#FFFFFF", text: "#111111", accent: "#111111" } },
];

const hex = z.string().regex(/^#[0-9a-fA-F]{6}$/, "Couleur invalide");

export const DesignSchema = z.object({
  template: z.enum(["minimal", "audacieux", "degrade"]),
  font: z.enum(["inter", "montserrat", "poppins", "playfair"]),
  colors: z.object({ background: hex, text: hex, accent: hex }),
  author: z.object({
    show: z.boolean(),
    name: z.string().max(40, "Le nom affiché fait 40 caractères maximum."),
    handle: z.string().max(30, "Le @pseudo fait 30 caractères maximum."),
  }),
});
export type Design = z.infer<typeof DesignSchema>;

export function defaultDesign(userName: string): Design {
  return {
    template: "minimal",
    font: "inter",
    colors: PALETTES[0].colors,
    author: { show: true, name: userName.slice(0, 40), handle: "" },
  };
}

/** Relit le design stocké ; valeurs par défaut s'il est absent ou invalide. */
export function readDesign(value: unknown, userName: string): Design {
  const parsed = DesignSchema.safeParse(value);
  return parsed.success ? parsed.data : defaultDesign(userName);
}

/** Initiale affichée dans la pastille de la signature : la première lettre du nom. */
export function initial(name: string) {
  const letter = name.trim().replace(/^@/, "").match(/\p{L}|\p{N}/u)?.[0] ?? "?";
  return letter.toUpperCase();
}

/** Luminance relative (0 = noir, 1 = blanc) d'une couleur #RRGGBB. */
function luminance(color: string) {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(color.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** Rapport de contraste entre deux couleurs (norme WCAG : de 1 à 21). */
function contrast(a: string, b: string) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

/** Couleur de texte la plus lisible (#FFFFFF ou #111111) sur un fond donné. */
export function readableOn(background: string) {
  return contrast(background, "#FFFFFF") >= contrast(background, "#111111") ? "#FFFFFF" : "#111111";
}
