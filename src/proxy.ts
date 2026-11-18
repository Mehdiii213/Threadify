import { NextResponse, type NextRequest } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

// Redirection rapide : vérifie seulement la PRÉSENCE du cookie de session.
// La vraie vérification de la session est faite côté serveur dans les pages
// (requireSession), car un cookie peut être expiré ou falsifié.
export function proxy(request: NextRequest) {
  const hasSession = Boolean(getSessionCookie(request));
  const { pathname } = request.nextUrl;

  if (!hasSession) {
    // « Commencer gratuitement » mène à /creer : un visiteur sans compte va s'inscrire.
    if (pathname === "/creer") {
      return NextResponse.redirect(new URL("/inscription", request.url));
    }
    if (pathname.startsWith("/espace") || pathname.startsWith("/creations") || pathname.startsWith("/abonnement") || pathname.startsWith("/compte") || pathname.startsWith("/affiliation")) {
      return NextResponse.redirect(new URL("/connexion", request.url));
    }
  }
  // Seulement pour l'affichage des pages (GET) : juste après l'inscription, la page
  // envoie encore une action serveur (POST, rattachement du parrainage) qui ne
  // doit pas être redirigée.
  if (hasSession && request.method === "GET" && (pathname === "/connexion" || pathname === "/inscription")) {
    return NextResponse.redirect(new URL("/espace", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/espace/:path*", "/creer", "/creations/:path*", "/abonnement", "/compte", "/affiliation", "/connexion", "/inscription"],
};
