import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";

// Une seule instance de PrismaClient par processus : en développement,
// le rechargement à chaud de Next.js recréerait sinon un pool de connexions
// à chaque modification de fichier.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

/**
 * En ligne (Netlify), chaque fonction ouvre ses propres connexions : le
 * « Session pooler » de Supabase (port 5432, ~15 connexions sur l'offre
 * gratuite) sature vite → erreurs 500. On passe alors automatiquement par le
 * « Transaction pooler » (même adresse, port 6543), prévu pour de nombreuses
 * connexions courtes. Les migrations (prisma.config.ts) gardent le port 5432.
 */
export function runtimeDatabaseUrl(url = process.env.DATABASE_URL) {
  if (!url || process.env.NODE_ENV !== "production") return url;
  try {
    const u = new URL(url);
    if (u.hostname.endsWith(".pooler.supabase.com") && u.port === "5432") {
      u.port = "6543";
      return u.toString();
    }
  } catch {
    // Adresse illisible : on la laisse telle quelle (l'erreur apparaîtra à la connexion).
  }
  return url;
}

function createPrismaClient() {
  const adapter = new PrismaPg({
    connectionString: runtimeDatabaseUrl(),
    // Peu de connexions par instance : le pooler de Supabase fait le partage.
    max: process.env.NODE_ENV === "production" ? 3 : 10,
    idleTimeoutMillis: 10_000,
  });
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
