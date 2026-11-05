import "server-only";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

/** Session courante (ou null). À appeler dans un composant placé sous <Suspense>. */
export async function getSession() {
  return auth.api.getSession({ headers: await headers() });
}

/** Session obligatoire : redirige vers /connexion si l'utilisateur n'est pas connecté. */
export async function requireSession() {
  const session = await getSession();
  if (!session) redirect("/connexion");
  return session;
}
