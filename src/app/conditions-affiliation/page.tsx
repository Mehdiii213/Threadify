import type { Metadata } from "next";
import Link from "next/link";
import { Fill, LegalPage } from "@/components/legal-page";
import { AFFILIATION, formatCents } from "@/lib/affiliation-config";
import { LEGAL } from "@/lib/legal";

export const metadata: Metadata = { title: "Conditions du programme d'affiliation" };

export default function ConditionsAffiliationPage() {
  const e = LEGAL.editor;
  const rate = `${AFFILIATION.commissionRate * 100} %`;
  return (
    <LegalPage title="Conditions du programme d'affiliation">
      <section>
        <h2>1. Principe</h2>
        <p>
          Tout titulaire d&apos;un compte {LEGAL.siteName} devient affilié et dispose d&apos;un lien et d&apos;un code de parrainage
          personnels (page « Affiliation » de son espace). Une personne qui crée son compte avec ce lien ou ce code devient son
          « filleul ». Le programme est proposé par <Fill value={e.name} /> et peut être modifié ou arrêté à tout moment ; les commissions
          déjà acquises restent dues.
        </p>
      </section>

      <section>
        <h2>2. Avantage du filleul</h2>
        <p>
          Le filleul bénéficie de −{AFFILIATION.referralDiscountPercent} % sur le premier mois de son premier abonnement payant (Pro ou
          Expert). Le parrainage doit être indiqué lors de la création du compte ; il ne peut pas être ajouté ensuite.
        </p>
      </section>

      <section>
        <h2>3. Commission de l&apos;affilié</h2>
        <ul>
          <li>
            {rate} du montant <strong>hors taxes</strong> réellement payé par le filleul (réduction déduite), sur chaque paiement de ses{" "}
            {AFFILIATION.durationMonths} premiers mois d&apos;abonnement à compter de son premier paiement.
          </li>
          <li>
            Chaque commission est « en attente » pendant {AFFILIATION.holdDays} jours, puis devient « disponible ». Un paiement remboursé
            (rétractation, litige…) annule la commission correspondante ; si elle avait déjà été versée, elle est déduite des gains
            suivants.
          </li>
          <li>
            Sont exclus : le parrainage de soi-même, la création de comptes fictifs, la publicité sur la marque {LEGAL.siteName} (achat de
            mots-clés), le spam et toute pratique trompeuse. En cas d&apos;abus, les commissions concernées sont annulées et le compte peut
            être exclu du programme.
          </li>
        </ul>
      </section>

      <section>
        <h2>4. Versement</h2>
        <p>
          Dès que les gains disponibles atteignent {formatCents(AFFILIATION.payoutThresholdCents)}, {LEGAL.siteName} contacte
          l&apos;affilié à l&apos;adresse e-mail de son compte et effectue un virement bancaire (RIB demandé à ce moment-là), en général
          sous 30 jours. Les affiliés professionnels (auto-entrepreneur, société) fournissent une facture correspondant au montant versé.
        </p>
        <p>
          Les sommes perçues sont des revenus que l&apos;affilié doit déclarer lui-même auprès de l&apos;administration fiscale et, le cas
          échéant, de l&apos;URSSAF.
        </p>
      </section>

      <section>
        <h2>5. Données personnelles</h2>
        <p>
          L&apos;affilié voit le nombre de ses filleuls et, pour chaque commission, l&apos;adresse e-mail masquée du filleul (ex. «
          ca•••@gmail.com ») et le montant payé. Aucun cookie n&apos;est utilisé pour le suivi : le code est simplement prérempli dans le
          formulaire d&apos;inscription. Voir la <Link href="/confidentialite">politique de confidentialité</Link>.
        </p>
      </section>

      <section>
        <h2>6. Contact</h2>
        <p>
          Pour toute question : <Fill value={e.email} />.
        </p>
      </section>
    </LegalPage>
  );
}
