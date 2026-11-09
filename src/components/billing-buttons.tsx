"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import type { PlanId } from "@/lib/plans";

const primary =
  "w-full rounded-xl bg-violet-600 px-4 py-3 font-semibold text-white shadow-lg shadow-violet-600/20 hover:bg-violet-700 disabled:opacity-60";
const secondary =
  "w-full rounded-xl border border-violet-300 bg-white px-4 py-3 font-semibold text-violet-700 hover:bg-violet-50 disabled:opacity-60";

const NOT_CONFIGURED =
  "Le paiement n'est pas encore configuré sur ce site (clés Stripe absentes du fichier .env).";

/** Ouvre la page de paiement Stripe (mode test : carte 4242 4242 4242 4242). */
export function UpgradeButton({ plan, label, enabled, variant = "primary" }: { plan: Exclude<PlanId, "gratuit">; label: string; enabled: boolean; variant?: "primary" | "secondary" }) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function upgrade() {
    if (!enabled) return setError(NOT_CONFIGURED);
    setPending(true);
    setError(null);
    const origin = window.location.origin;
    const { error } = await authClient.subscription.upgrade({
      plan,
      successUrl: `${origin}/abonnement?paiement=ok`,
      cancelUrl: `${origin}/tarifs`,
      locale: "fr",
    });
    // Sans erreur, le navigateur part vers la page de paiement Stripe.
    if (error) {
      console.error("[abonnement]", error);
      setError("Impossible d'ouvrir la page de paiement. Réessayez dans un instant.");
      setPending(false);
    }
  }

  return (
    <div className="space-y-2">
      <button type="button" onClick={upgrade} disabled={pending} className={variant === "primary" ? primary : secondary}>
        {pending ? "Ouverture du paiement…" : label}
      </button>
      {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
    </div>
  );
}

/** Ouvre l'espace client Stripe : carte bancaire, factures, changement d'offre, résiliation. */
export function ManageButton({ enabled }: { enabled: boolean }) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function open() {
    if (!enabled) return setError(NOT_CONFIGURED);
    setPending(true);
    setError(null);
    const { error } = await authClient.subscription.billingPortal({
      returnUrl: `${window.location.origin}/abonnement`,
      locale: "fr",
    });
    if (error) {
      console.error("[abonnement]", error);
      setError("Impossible d'ouvrir l'espace de gestion. Réessayez dans un instant.");
      setPending(false);
    }
  }

  return (
    <div className="space-y-2">
      <button type="button" onClick={open} disabled={pending} className={secondary}>
        {pending ? "Ouverture…" : "Gérer mon abonnement (carte, factures, résiliation)"}
      </button>
      {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
    </div>
  );
}
