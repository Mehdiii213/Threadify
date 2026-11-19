import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { generateForUser } from "@/lib/generate-creation";

// Génération par l'IA en « flux » (étape 8b) : sur l'offre gratuite de Netlify,
// une requête silencieuse est coupée après 10 secondes, alors qu'une réponse qui
// envoie des données au fur et à mesure peut durer bien plus longtemps. On
// renvoie donc tout de suite un flux, on y écrit un espace toutes les 2 secondes
// pendant que l'IA travaille, puis le résultat final (une ligne JSON).
export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return Response.json({ error: "Votre session a expiré : reconnectez-vous." }, { status: 401 });

  let creationId = "";
  try {
    const body = (await request.json()) as { creationId?: unknown };
    creationId = typeof body.creationId === "string" ? body.creationId : "";
  } catch {
    // corps illisible : traité juste en dessous
  }
  if (!creationId) return Response.json({ error: "Création introuvable." }, { status: 400 });

  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      controller.enqueue(encoder.encode(" "));
      const heartbeat = setInterval(() => {
        try {
          controller.enqueue(encoder.encode(" "));
        } catch {
          // flux déjà fermé (visiteur parti)
        }
      }, 2000);
      try {
        const result = await generateForUser(session.user, creationId);
        controller.enqueue(encoder.encode(`\n${JSON.stringify(result)}\n`));
      } finally {
        clearInterval(heartbeat);
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store, no-transform",
      "X-Accel-Buffering": "no",
    },
  });
}
