// Adresse publique du site (BETTER_AUTH_URL, ex. https://threadify.fr en production).
export function siteUrl() {
  return (process.env.BETTER_AUTH_URL || "http://localhost:3000").replace(/\/$/, "");
}

export const SITE_DESCRIPTION =
  "Écrivez une idée ou collez un article : Threadify crée un carrousel Instagram ou LinkedIn designé, ou un thread X, prêt à publier.";
