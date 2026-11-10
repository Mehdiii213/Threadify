import "server-only";

// Envoi des e-mails transactionnels (étape 8a) via l'API de Resend (resend.com),
// appelée directement avec fetch : aucune dépendance supplémentaire.
// Sans RESEND_API_KEY (par exemple sur votre ordinateur), l'e-mail n'est pas
// envoyé : son contenu et son lien s'affichent dans la fenêtre noire (npm run dev).

const FROM = process.env.EMAIL_FROM || "Threadify <onboarding@resend.dev>";

type Email = { to: string; subject: string; intro: string; button: string; url: string; outro: string };

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}

function render({ intro, button, url, outro }: Email) {
  const text = `${intro}\n\n${button} : ${url}\n\n${outro}\n\n— Threadify`;
  const html = `<!doctype html><html lang="fr"><body style="margin:0;background:#f4f4f5;font-family:Arial,Helvetica,sans-serif;color:#18181b">
<div style="max-width:520px;margin:0 auto;padding:32px 16px">
  <p style="font-size:22px;font-weight:bold;margin:0 0 24px">Thread<span style="color:#7c3aed">ify</span></p>
  <div style="background:#ffffff;border:1px solid #e4e4e7;border-radius:16px;padding:28px">
    <p style="font-size:15px;line-height:1.6;margin:0 0 24px">${escapeHtml(intro)}</p>
    <a href="${escapeHtml(url)}" style="display:inline-block;background:#7c3aed;color:#ffffff;text-decoration:none;font-weight:bold;padding:12px 20px;border-radius:10px">${escapeHtml(button)}</a>
    <p style="font-size:13px;line-height:1.6;color:#71717a;margin:24px 0 0">${escapeHtml(outro)}</p>
    <p style="font-size:12px;line-height:1.5;color:#a1a1aa;margin:16px 0 0;word-break:break-all">Si le bouton ne fonctionne pas, copiez ce lien dans votre navigateur :<br>${escapeHtml(url)}</p>
  </div>
</div></body></html>`;
  return { text, html };
}

/** Envoie un e-mail. Ne lève jamais d'erreur : un échec est journalisé (l'inscription ne doit pas échouer pour autant). */
export async function sendEmail(email: Email): Promise<boolean> {
  const { text, html } = render(email);
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.log(
      `\n[e-mail] (non envoyé : RESEND_API_KEY absente du .env)\n  À : ${email.to}\n  Objet : ${email.subject}\n  Lien : ${email.url}\n`,
    );
    return false;
  }
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from: FROM, to: [email.to], subject: email.subject, text, html }),
    });
    if (!res.ok) {
      console.error(`[e-mail] Échec de l'envoi (${res.status}) :`, await res.text());
      return false;
    }
    return true;
  } catch (error) {
    console.error("[e-mail] Impossible de joindre le service d'e-mails :", error);
    return false;
  }
}

export function sendVerificationEmail(to: string, name: string, url: string) {
  return sendEmail({
    to,
    subject: "Confirmez votre adresse e-mail — Threadify",
    intro: `Bonjour ${name}, bienvenue sur Threadify ! Pour activer votre compte et lancer vos premières générations, confirmez votre adresse e-mail.`,
    button: "Confirmer mon adresse",
    url,
    outro: "Ce lien est valable 24 heures. Si vous n'avez pas créé de compte sur Threadify, ignorez simplement cet e-mail.",
  });
}

export function sendResetPasswordEmail(to: string, name: string, url: string) {
  return sendEmail({
    to,
    subject: "Réinitialisez votre mot de passe — Threadify",
    intro: `Bonjour ${name}, vous avez demandé à changer le mot de passe de votre compte Threadify. Cliquez sur le bouton ci-dessous pour en choisir un nouveau.`,
    button: "Choisir un nouveau mot de passe",
    url,
    outro: "Ce lien est valable 1 heure. Si vous n'êtes pas à l'origine de cette demande, ignorez cet e-mail : votre mot de passe reste inchangé.",
  });
}
