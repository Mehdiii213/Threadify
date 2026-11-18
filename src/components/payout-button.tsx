"use client";

import { useState, useTransition } from "react";
import { markPayoutDone } from "@/app/admin/affiliation/actions";

export function PayoutButton({ affiliateId, amount, email }: { affiliateId: string; amount: string; email: string }) {
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);
  return (
    <div>
      <button
        type="button"
        disabled={pending}
        onClick={() => {
          if (!window.confirm(`Confirmez-vous avoir fait le virement de ${amount} à ${email} ?`)) return;
          start(async () => {
            const r = await markPayoutDone(affiliateId);
            setError(r.error ?? null);
          });
        }}
        className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
      >
        {pending ? "…" : "Marquer comme versé"}
      </button>
      {error && <p className="mt-1 text-xs text-red-700">{error}</p>}
    </div>
  );
}
