import { connection } from "next/server";
import { sendDueRenewalReminders } from "@/lib/renewal-reminders";

// Rappels légaux avant renouvellement des abonnements annuels (loi Chatel).
// Appelée chaque jour par la tâche GitHub « Réveil de la base ». Sans danger si
// quelqu'un d'autre l'appelle : chaque abonné n'est prévenu qu'une fois par an.
export async function GET() {
  await connection();
  try {
    const sent = await sendDueRenewalReminders();
    return Response.json({ ok: true, envoyes: sent }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("[rappels] Échec :", error);
    return Response.json({ ok: false }, { status: 500, headers: { "Cache-Control": "no-store" } });
  }
}
