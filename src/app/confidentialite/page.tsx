import type { Metadata } from "next";
import { Fill, LegalPage } from "@/components/legal-page";
import { LEGAL } from "@/lib/legal";

export const metadata: Metadata = { title: "Politique de confidentialité" };

const PROCESSORS = [
  ["Vercel Inc. (États-Unis)", "Hébergement du site"],
  ["Supabase (serveurs dans l'Union européenne)", "Base de données : compte, créations"],
  ["Anthropic PBC (États-Unis)", "Intelligence artificielle : reçoit le texte à transformer au moment d'une génération"],
  ["Stripe Payments Europe Ltd (Irlande)", "Paiement des abonnements et factures"],
  ["Resend Inc. (États-Unis)", "Envoi des e-mails (confirmation d'adresse, mot de passe oublié)"],
];

export default function ConfidentialitePage() {
  const e = LEGAL.editor;
  return (
    <LegalPage title="Politique de confidentialité">
      <section>
        <h2>Responsable du traitement</h2>
        <p>
          <Fill value={e.name} />, <Fill value={e.address} /> — contact : <Fill value={e.email} />.
        </p>
      </section>

      <section>
        <h2>Données collectées et pourquoi</h2>
        <ul>
          <li>
            <strong>Compte</strong> : nom, adresse e-mail, mot de passe (enregistré sous forme chiffrée, illisible même pour nous). Pour créer
            et sécuriser votre compte (exécution du contrat).
          </li>
          <li>
            <strong>Créations</strong> : les idées et textes que vous saisissez, les contenus générés, vos réglages de design, dossiers et
            étiquettes. Pour fournir le service (exécution du contrat).
          </li>
          <li>
            <strong>Abonnement</strong> : offre choisie, dates, historique des paiements. Les données de carte bancaire sont saisies et
            conservées uniquement chez Stripe. Pour la facturation (exécution du contrat, obligations comptables).
          </li>
          <li>
            <strong>Utilisation</strong> : nombre de générations et leur coût technique. Pour appliquer les quotas des offres (exécution du
            contrat).
          </li>
          <li>
            <strong>Sécurité</strong> : adresse IP et navigateur liés à vos sessions, compteur de tentatives de connexion. Pour protéger les
            comptes contre les accès frauduleux (intérêt légitime).
          </li>
        </ul>
        <p>Vos données ne sont jamais vendues ni utilisées à des fins publicitaires.</p>
      </section>

      <section>
        <h2>Prestataires (sous-traitants)</h2>
        <ul>
          {PROCESSORS.map(([name, role]) => (
            <li key={name}>
              <strong>{name}</strong> : {role}
            </li>
          ))}
        </ul>
        <p>
          Les transferts hors de l&apos;Union européenne sont encadrés par les clauses contractuelles types de la Commission européenne
          et/ou le cadre de protection des données UE–États-Unis (Data Privacy Framework). Selon ses conditions commerciales, Anthropic
          n&apos;utilise pas les données envoyées par notre service pour entraîner ses modèles.
        </p>
      </section>

      <section>
        <h2>Durée de conservation</h2>
        <ul>
          <li>Compte et créations : tant que le compte existe. La suppression du compte efface immédiatement ces données.</li>
          <li>Factures : 10 ans chez Stripe (obligation légale comptable).</li>
          <li>
            Statistiques d&apos;utilisation (nombre et coût des générations) : conservées sans lien avec votre identité après la suppression du
            compte.
          </li>
        </ul>
      </section>

      <section>
        <h2>Cookies</h2>
        <p>
          {LEGAL.siteName} n&apos;utilise que des cookies strictement nécessaires : le cookie de session qui vous garde connecté et ceux du
          formulaire de paiement Stripe (prévention de la fraude). Aucun cookie publicitaire ni de mesure d&apos;audience : aucun
          consentement n&apos;est donc demandé.
        </p>
      </section>

      <section>
        <h2>Vos droits</h2>
        <p>
          Vous disposez d&apos;un droit d&apos;accès, de rectification, d&apos;effacement, de limitation, d&apos;opposition et de portabilité
          de vos données. Vous pouvez supprimer votre compte vous-même depuis la page « Mon compte », exporter vos créations depuis
          l&apos;éditeur, ou écrire à <Fill value={e.email} />. Si vous estimez que vos droits ne sont pas respectés, vous pouvez saisir la
          CNIL (www.cnil.fr).
        </p>
      </section>
    </LegalPage>
  );
}
