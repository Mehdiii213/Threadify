// Informations légales de l'éditeur (étape 8a), affichées dans les pages
// /mentions-legales, /cgv et /confidentialite, et utilisées pour la TVA.
// Les valeurs entre crochets sont À COMPLÉTER avant la mise en ligne
// (elles s'affichent surlignées en jaune sur le site tant qu'elles restent ainsi).
// Ces pages sont des modèles : une relecture par un professionnel est conseillée.

export const LEGAL = {
  siteName: "Threadify",
  editor: {
    name: "[Votre nom et prénom, ou nom de la société]",
    status: "[Statut : micro-entreprise / EI / SASU…]",
    siret: "[Numéro SIRET]",
    address: "[Adresse postale]",
    email: "[Adresse e-mail de contact]",
    publicationDirector: "[Nom du directeur de la publication]",
    vatNumber: "[N° de TVA intracommunautaire, si vous en avez un]",
  },
  // Régime de TVA : "franchise" = TVA non applicable (art. 293 B du CGI),
  // "tva20" = prix TTC avec TVA à 20 %.
  vatRegime: "tva20" as "franchise" | "tva20",
  // Médiateur de la consommation (obligatoire pour vendre à des particuliers).
  mediator: "[Nom et site web du médiateur de la consommation choisi]",
  host: {
    name: "Vercel Inc.",
    address: "440 N Barranca Ave #4133, Covina, CA 91723, États-Unis",
    website: "https://vercel.com",
  },
  lastUpdate: "10 novembre 2026",
};

/** Taux de TVA appliqué aux abonnements (0 en franchise en base). */
export function vatRate() {
  return LEGAL.vatRegime === "franchise" ? 0 : 0.2;
}

/** Mention à afficher à côté des prix. */
export function vatMention() {
  return LEGAL.vatRegime === "franchise" ? "TVA non applicable, art. 293 B du CGI" : "Prix TTC (TVA 20 % incluse)";
}

/** Une valeur est-elle encore à compléter ? */
export function isPlaceholder(value: string) {
  return value.startsWith("[") && value.endsWith("]");
}
