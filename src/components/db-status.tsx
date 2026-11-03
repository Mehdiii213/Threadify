import { connection } from "next/server";
import { prisma } from "@/lib/prisma";

// Vérifie à chaque requête que l'application joint bien PostgreSQL via Prisma.
// `connection()` force l'exécution au moment de la requête (Cache Components).
export async function DbStatus() {
  await connection();

  let ok = false;
  try {
    await prisma.$queryRaw`SELECT 1`;
    ok = true;
  } catch (error) {
    console.error("[DbStatus] Connexion à la base impossible :", error);
  }

  return (
    <StatusPill
      color={ok ? "bg-emerald-500" : "bg-red-500"}
      label={ok ? "Base de données : connectée" : "Base de données : injoignable"}
    />
  );
}

export function StatusPill({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs font-medium text-zinc-600 shadow-sm">
      <span className={`h-2 w-2 rounded-full ${color}`} aria-hidden />
      {label}
    </span>
  );
}
