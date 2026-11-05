import { toNextJsHandler } from "better-auth/next-js";
import { auth } from "@/lib/auth";

// Point d'entrée de Better Auth : /api/auth/* (inscription, connexion, session…)
export const { GET, POST } = toNextJsHandler(auth);
