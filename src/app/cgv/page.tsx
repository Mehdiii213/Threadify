import type { Metadata } from "next";
import Link from "next/link";
import { Fill, LegalPage } from "@/components/legal-page";
import { LEGAL, vatMention } from "@/lib/legal";
import { EXPERT_DAILY_LIMIT, EXPERT_HOURLY_LIMIT, PLANS } from "@/lib/plans";

export const metadata: Metadata = { title: "Conditions générales d'utilisation et de vente" };

export default function CgvPage() {
  const e = LEGAL.editor;
  return (
    <LegalPage title="Conditions générales d'utilisation et de vente">
      <section>
        <h2>1. Objet</h2>
        <p>
          Les présentes conditions encadrent l&apos;utilisation du service {LEGAL.siteName} et la souscription de ses abonnements. Le service
          est édité par <Fill value={e.name} /> (voir les <Link href="/mentions-legales">mentions légales</Link>). {LEGAL.siteName} permet de
          transformer une idée ou un texte en carrousel (Instagram, LinkedIn) ou en thread X à l&apos;aide d&apos;une intelligence
          artificielle, puis de le modifier et de l&apos;exporter.
        </p>
        <p>La création d&apos;un compte vaut acceptation des présentes conditions.</p>
      </section>

      <section>
        <h2>2. Compte</h2>
        <p>
          Le compte est personnel. Vous vous engagez à fournir une adresse e-mail valide (elle doit être confirmée pour utiliser la génération
          par l&apos;IA) et à garder votre mot de passe confidentiel. Vous pouvez supprimer votre compte à tout moment depuis la page « Mon
          compte ».
        </p>
      </section>

      <section>
        <h2>3. Offres et prix</h2>
        <ul>
          <li>
            <strong>{PLANS.gratuit.label}</strong> : {PLANS.gratuit.monthlyGenerations} générations par mois, images portant la mention « Fait
            avec {LEGAL.siteName} ».
          </li>
          <li>
            <strong>{PLANS.pro.label}</strong> : {PLANS.pro.price} € par mois, {PLANS.pro.monthlyGenerations} générations par mois, sans
            mention.
          </li>
          <li>
            <strong>{PLANS.expert.label}</strong> : {PLANS.expert.price} € par mois, générations illimitées dans la limite d&apos;un usage
            raisonnable ({EXPERT_DAILY_LIMIT} par jour et {EXPERT_HOURLY_LIMIT} par heure au maximum), sans mention.
          </li>
        </ul>
        <p>
          {vatMention()}. Chaque génération ou régénération réussie compte dans le quota du mois calendaire en cours ; les quotas non
          utilisés ne sont pas reportés. Les prix peuvent évoluer : tout changement vous sera annoncé par e-mail au moins 30 jours à
          l&apos;avance et ne s&apos;appliquera qu&apos;au renouvellement suivant.
        </p>
      </section>

      <section>
        <h2>4. Paiement, renouvellement et résiliation</h2>
        <p>
          Le paiement est réalisé par carte bancaire via notre prestataire sécurisé Stripe ; {LEGAL.siteName} n&apos;a jamais accès à vos
          numéros de carte. L&apos;abonnement est mensuel, sans engagement, et se renouvelle automatiquement chaque mois à la date
          anniversaire.
        </p>
        <p>
          Vous pouvez le résilier à tout moment depuis la page « Mon abonnement » : il reste actif jusqu&apos;à la fin de la période déjà
          payée, puis votre compte revient à l&apos;offre Gratuite. Le mois commencé n&apos;est pas remboursé. En cas d&apos;échec de paiement,
          l&apos;abonnement peut être suspendu.
        </p>
      </section>

      <section>
        <h2>5. Droit de rétractation</h2>
        <p>
          Si vous êtes un consommateur, vous disposez en principe d&apos;un délai de 14 jours pour vous rétracter après la souscription. En
          souscrivant, vous demandez que le service commence immédiatement. Si vous vous rétractez dans ce délai, vous écrivez à{" "}
          <Fill value={e.email} /> et vous êtes remboursé du prix, déduction faite de la part correspondant au service déjà fourni
          jusqu&apos;à votre rétractation (article L221-25 du Code de la consommation).
        </p>
      </section>

      <section>
        <h2>6. Contenus et intelligence artificielle</h2>
        <p>
          Les textes que vous fournissez et les contenus générés pour vous vous appartiennent : vous pouvez les publier et les utiliser
          librement, y compris à des fins commerciales. Vous restez responsable de ce que vous publiez et garantissez disposer des droits sur
          les textes que vous importez (par exemple un article).
        </p>
        <p>
          Les contenus sont produits automatiquement par une intelligence artificielle : ils peuvent contenir des erreurs ou des
          approximations. Relisez-les avant publication. Il est interdit d&apos;utiliser {LEGAL.siteName} pour produire des contenus
          illicites, haineux, trompeurs ou portant atteinte aux droits d&apos;autrui, ou de contourner les limites des offres
          (multiplication de comptes, automatisation).
        </p>
      </section>

      <section>
        <h2>7. Disponibilité et responsabilité</h2>
        <p>
          L&apos;éditeur s&apos;efforce d&apos;assurer l&apos;accès au service en continu, sans pouvoir le garantir (maintenance, panne
          d&apos;un prestataire). Sa responsabilité est limitée aux dommages directs et, pour un abonné, au montant payé au cours des 12
          derniers mois. Pensez à exporter vos créations importantes.
        </p>
        <p>
          En cas de manquement grave à ces conditions, l&apos;éditeur peut suspendre ou fermer un compte, après information de
          l&apos;utilisateur sauf urgence.
        </p>
      </section>

      <section>
        <h2>8. Données personnelles</h2>
        <p>
          Voir la <Link href="/confidentialite">politique de confidentialité</Link>.
        </p>
      </section>

      <section>
        <h2>9. Réclamations, médiation et droit applicable</h2>
        <p>
          Pour toute réclamation, écrivez à <Fill value={e.email} />. Si aucune solution n&apos;est trouvée, vous pouvez recourir
          gratuitement au médiateur de la consommation : <Fill value={LEGAL.mediator} />. Les présentes conditions sont soumises au droit
          français.
        </p>
      </section>
    </LegalPage>
  );
}
