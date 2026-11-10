import Link from "next/link";
import { LEGAL } from "@/lib/legal";

// Pied de page commun (étape 8a) : liens légaux obligatoires.
export function SiteFooter() {
  return (
    <footer className="border-t border-zinc-200 bg-white">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-3 px-6 py-6 text-sm text-zinc-500 sm:flex-row sm:items-center sm:justify-between">
        <p>
          © Thread<span className="text-violet-600">ify</span> — carrousels et threads par IA
        </p>
        <nav aria-label="Informations légales" className="flex flex-wrap gap-x-5 gap-y-2">
          <Link href="/tarifs" className="hover:text-violet-700">
            Tarifs
          </Link>
          <Link href="/mentions-legales" className="hover:text-violet-700">
            Mentions légales
          </Link>
          <Link href="/cgv" className="hover:text-violet-700">
            Conditions générales
          </Link>
          <Link href="/confidentialite" className="hover:text-violet-700">
            Confidentialité
          </Link>
          {!LEGAL.editor.email.startsWith("[") && (
            <a href={`mailto:${LEGAL.editor.email}`} className="hover:text-violet-700">
              Contact
            </a>
          )}
        </nav>
      </div>
    </footer>
  );
}
