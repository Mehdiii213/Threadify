import { connection } from "next/server";
import { prisma } from "@/lib/prisma";

// Adresse de « santé » : fait une toute petite lecture dans la base de données.
// Visitée chaque jour par une tâche GitHub (.github/workflows/reveil-base.yml)
// pour que Supabase (offre gratuite) ne mette pas la base en pause après
// 7 jours sans activité. Ne renvoie aucune donnée.
export async function GET() {
  await connection(); // toujours exécutée à la demande (jamais figée au build)
  try {
    await prisma.$queryRaw`SELECT 1`;
    return Response.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("[sante] Base de données injoignable :", error);
    return Response.json({ ok: false }, { status: 503, headers: { "Cache-Control": "no-store" } });
  }
}
