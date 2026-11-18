"use server";

import { refresh } from "next/cache";
import { isAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/session";

/**
 * Enregistre un virement fait à la main à un affilié : toutes ses commissions
 * disponibles passent à « Versée », et les remboursements survenus après un
 * précédent versement sont déduits du montant.
 */
export async function markPayoutDone(affiliateId: string): Promise<{ error?: string }> {
  const { user } = await requireSession();
  if (!isAdmin(user.email)) return { error: "Action réservée à l'administrateur." };

  const now = new Date();
  const result = await prisma.$transaction(async (tx) => {
    const ready = await tx.commission.findMany({
      where: { affiliateId, status: "PENDING", availableAt: { lte: now } },
      select: { id: true, amountCents: true },
    });
    const reversed = await tx.commission.findMany({ where: { affiliateId, status: "REVERSED" }, select: { id: true, amountCents: true } });
    const amountCents =
      ready.reduce((s, c) => s + c.amountCents, 0) - reversed.reduce((s, c) => s + c.amountCents, 0);
    if (amountCents <= 0) return { error: "Rien à verser pour cet affilié." };
    const payout = await tx.payout.create({ data: { affiliateId, amountCents } });
    await tx.commission.updateMany({ where: { id: { in: ready.map((c) => c.id) } }, data: { status: "PAID", payoutId: payout.id } });
    // Remboursement après versement : déduit de ce virement, il ne compte plus.
    await tx.commission.updateMany({ where: { id: { in: reversed.map((c) => c.id) } }, data: { status: "CANCELLED" } });
    return {};
  });
  if (!result.error) refresh();
  return result;
}
