import Link from "next/link";
import { Suspense } from "react";
import { getSession } from "@/lib/session";

// En-tête commun : logo + lien de compte (selon la session).
export function SiteHeader({ children }: { children?: React.ReactNode }) {
  return (
    <header className="mx-auto flex w-full max-w-5xl items-center justify-between gap-4 px-6 py-6">
      <Link href="/" className="text-xl font-bold tracking-tight">
        Thread<span className="text-violet-600">ify</span>
      </Link>
      <div className="flex items-center gap-3">
        {children}
        <Link href="/tarifs" className="text-sm font-semibold text-zinc-700 hover:text-violet-700">
          Tarifs
        </Link>
        <Suspense fallback={<span className="h-9 w-24" aria-hidden />}>
          <AccountLink />
        </Suspense>
      </div>
    </header>
  );
}

async function AccountLink() {
  const session = await getSession();
  return session ? (
    <Link
      href="/espace"
      className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-semibold text-white hover:bg-zinc-700"
    >
      Mon espace
    </Link>
  ) : (
    <Link
      href="/connexion"
      className="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-semibold text-zinc-800 hover:bg-zinc-100"
    >
      Connexion
    </Link>
  );
}
