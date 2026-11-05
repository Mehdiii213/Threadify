import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // process.env (et non env()) : `prisma generate`, lancé par `npm install`,
    // doit fonctionner même sans fichier .env. Les commandes qui touchent la
    // base (migrate…) afficheront une erreur claire si DATABASE_URL manque.
    url: process.env.DATABASE_URL,
  },
});
