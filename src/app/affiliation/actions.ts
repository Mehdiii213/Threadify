"use server";

import { normalizeReferralCode } from "@/lib/affiliation-config";
import { findAffiliateByCode } from "@/lib/affiliation";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/session";

export type ReferralCheck = { ok: true; inviter: string } | { ok: false; error: string };

function firstName(name: string) {
  return name.trim().split(/\s+/)[0] || "un membre";
}

/** Vérifie un code de parrainage avant l'inscription (page publique). */
export async function checkReferralCode(code: string): Promise<ReferralCheck> {
  const affiliate = await findAffiliateByCode(code);
  if (!affiliate) return { ok: false, error: "Ce code de parrainage n'existe pas. Vérifiez-le ou laissez le champ vide." };
  return { ok: true, inviter: firstName(affiliate.name) };
}

/**
 * Rattache le compte qui vient d'être créé à son parrain. Refusé si le compte a
 * déjà un parrain, a plus de 24 heures, a déjà été abonné, ou s'il s'agit de son propre code.
 */
export async function applyReferral(code: string): Promise<{ ok: boolean }> {
  const { user } = await requireSession();
  const c = normalizeReferralCode(code);
  if (!c) return { ok: false };
  const [me, affiliate, subs] = await Promise.all([
    prisma.user.findUnique({ where: { id: user.id }, select: { referredById: true, createdAt: true, referralCode: true } }),
    findAffiliateByCode(c),
    prisma.subscription.count({ where: { referenceId: user.id, stripeSubscriptionId: { not: null } } }),
  ]);
  if (!me || !affiliate || me.referredById || affiliate.id === user.id || subs > 0) return { ok: false };
  if (Date.now() - me.createdAt.getTime() > 24 * 3600 * 1000) return { ok: false };
  await prisma.user.update({ where: { id: user.id }, data: { referredById: affiliate.id, referredAt: new Date() } });
  return { ok: true };
}
