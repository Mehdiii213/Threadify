import "server-only";

// Administrateurs du site : adresses e-mail listées dans ADMIN_EMAILS (.env),
// séparées par des virgules. Jamais écrites dans le code ni sur GitHub.
export function isAdmin(email: string | null | undefined) {
  if (!email) return false;
  const admins = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  return admins.includes(email.trim().toLowerCase());
}

/** Taux de conversion approximatif dollar → euro (modifiable dans .env : USD_EUR_RATE). */
export function usdToEurRate() {
  const rate = Number(process.env.USD_EUR_RATE);
  return Number.isFinite(rate) && rate > 0 ? rate : 0.92;
}
