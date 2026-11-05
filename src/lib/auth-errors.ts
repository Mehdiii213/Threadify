// Traduction en français des codes d'erreur renvoyés par Better Auth.
const messages: Record<string, string> = {
  USER_ALREADY_EXISTS: "Un compte existe déjà avec cette adresse e-mail.",
  USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL: "Un compte existe déjà avec cette adresse e-mail.",
  INVALID_EMAIL_OR_PASSWORD: "E-mail ou mot de passe incorrect.",
  INVALID_EMAIL: "Adresse e-mail invalide.",
  INVALID_PASSWORD: "Mot de passe incorrect.",
  PASSWORD_TOO_SHORT: "Le mot de passe doit contenir au moins 8 caractères.",
  PASSWORD_TOO_LONG: "Le mot de passe est trop long (128 caractères maximum).",
  USER_NOT_FOUND: "Aucun compte ne correspond à cette adresse e-mail.",
  FAILED_TO_CREATE_USER: "Impossible de créer le compte. Réessayez dans un instant.",
  TOO_MANY_REQUESTS: "Trop de tentatives. Patientez quelques instants puis réessayez.",
};

export function authErrorMessage(error: { code?: string; status?: number } | null | undefined) {
  if (!error) return "Une erreur inattendue est survenue.";
  if (error.code && messages[error.code]) return messages[error.code];
  if (error.status === 429) return messages.TOO_MANY_REQUESTS;
  return "Une erreur inattendue est survenue. Réessayez.";
}
