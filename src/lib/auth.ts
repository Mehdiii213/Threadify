import "server-only";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { prisma } from "@/lib/prisma";

// Configuration serveur de Better Auth.
// Secret et URL viennent de BETTER_AUTH_SECRET / BETTER_AUTH_URL (.env).
export const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: "postgresql" }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    maxPasswordLength: 128,
    autoSignIn: true, // connecté directement après l'inscription
  },
  // nextCookies doit rester le dernier plugin : il permet de poser les cookies
  // de session depuis les Server Actions.
  plugins: [nextCookies()],
});

export type Session = typeof auth.$Infer.Session;
