import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { LEGAL, isPlaceholder } from "@/lib/legal";

/** Mise en page commune des pages légales. */
export function LegalPage({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <main className="flex flex-1 flex-col bg-zinc-50 text-zinc-900">
      <SiteHeader />
      <article className="mx-auto w-full max-w-3xl flex-1 px-6 py-10">
        <Link href="/" className="text-sm font-medium text-violet-700 hover:underline">
          ← Accueil
        </Link>
        <h1 className="mt-4 text-3xl font-bold tracking-tight">{title}</h1>
        <p className="mt-1 text-sm text-zinc-500">Dernière mise à jour : {LEGAL.lastUpdate}</p>
        <div className="mt-8 space-y-8 rounded-2xl border border-zinc-200 bg-white p-7 text-[15px] leading-relaxed text-zinc-700 shadow-sm [&_h2]:mb-2 [&_h2]:text-lg [&_h2]:font-bold [&_h2]:text-zinc-900 [&_li]:mt-1 [&_p+p]:mt-2 [&_a]:font-medium [&_a]:text-violet-700 [&_a]:underline [&_ul]:list-disc [&_ul]:pl-5">
          {children}
        </div>
      </article>
    </main>
  );
}

/** Affiche une information légale ; surlignée en jaune tant qu'elle reste à compléter. */
export function Fill({ value }: { value: string }) {
  return isPlaceholder(value) ? <mark className="rounded bg-yellow-200 px-1 text-zinc-900">{value}</mark> : <>{value}</>;
}
