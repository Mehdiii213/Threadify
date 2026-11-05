import { createAuthClient } from "better-auth/react";

// Client Better Auth pour les composants "use client".
// Sans baseURL, il appelle /api/auth sur le même domaine que la page.
export const authClient = createAuthClient();
