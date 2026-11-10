import type { Metadata } from "next";
import Link from "next/link";
import { Fill, LegalPage } from "@/components/legal-page";
import { LEGAL } from "@/lib/legal";

export const metadata: Metadata = { title: "Mentions légales" };

export default function MentionsLegalesPage() {
  const e = LEGAL.editor;
  return (
    <LegalPage title="Mentions légales">
      <section>
        <h2>Éditeur du site</h2>
        <p>
          Le site {LEGAL.siteName} est édité par <Fill value={e.name} />, <Fill value={e.status} />.
        </p>
        <ul>
          <li>
            SIRET : <Fill value={e.siret} />
          </li>
          <li>
            Adresse : <Fill value={e.address} />
          </li>
          <li>
            E-mail : <Fill value={e.email} />
          </li>
          {LEGAL.vatRegime === "tva20" ? (
            <li>
              N° de TVA intracommunautaire : <Fill value={e.vatNumber} />
            </li>
          ) : (
            <li>TVA non applicable, article 293 B du Code général des impôts.</li>
          )}
          <li>
            Directeur de la publication : <Fill value={e.publicationDirector} />
          </li>
        </ul>
      </section>

      <section>
        <h2>Hébergement</h2>
        <p>
          Le site est hébergé par {LEGAL.host.name}, {LEGAL.host.address} ({LEGAL.host.website}).
        </p>
      </section>

      <section>
        <h2>Propriété intellectuelle</h2>
        <p>
          La marque {LEGAL.siteName}, le site, son code, ses textes, modèles graphiques et logos sont la propriété de l&apos;éditeur. Toute
          reproduction sans autorisation est interdite. Les contenus créés par les utilisateurs avec {LEGAL.siteName} leur appartiennent (voir
          les <Link href="/cgv">conditions générales</Link>).
        </p>
      </section>

      <section>
        <h2>Données personnelles</h2>
        <p>
          Le traitement de vos données est décrit dans la <Link href="/confidentialite">politique de confidentialité</Link>.
        </p>
      </section>
    </LegalPage>
  );
}
