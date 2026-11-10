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
  INVALID_TOKEN: "Ce lien n'est plus valable. Demandez-en un nouveau.",
  TOKEN_EXPIRED: "Ce lien a expiré. Demandez-en un nouveau.",
  EMAIL_ALREADY_VERIFIED: "Votre adresse e-mail est déjà confirmée.",
  SESSION_EXPIRED: "Par sécurité, reconnectez-vous puis recommencez.",
  CREDENTIAL_ACCOUNT_NOT_FOUND: "Aucun mot de passe n'est associé à ce compte.",
  STRIPE_CANCEL_FAILED:
    "Votre abonnement n'a pas pu être résilié automatiquement, le compte n'a donc pas été supprimé. Réessayez dans un instant.",
  TOO_MANY_REQUESTS: "Trop de tentatives. Par sécurité, patientez quelques minutes puis réessayez.",
};

export function authErrorMessage(error: { code?: string; status?: number } | null | undefined) {
  if (!error) return "Une erreur inattendue est survenue.";
  if (error.code && messages[error.code]) return messages[error.code];
  if (error.status === 429) return messages.TOO_MANY_REQUESTS;
  return "Une erreur inattendue est survenue. Réessayez.";
}
