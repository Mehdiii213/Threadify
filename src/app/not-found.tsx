import Link from "next/link";

// Page 404 en français (adresse inconnue, ou création d'un autre compte).
export default function NotFound() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center bg-zinc-50 px-6 py-24 text-center text-zinc-900">
      <p className="text-sm font-semibold text-violet-700">Erreur 404</p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight">Page introuvable</h1>
      <p className="mt-3 max-w-md text-zinc-600">
        Cette page n&apos;existe pas, ou vous n&apos;avez pas l&apos;autorisation de la voir.
      </p>
      <div className="mt-8 flex gap-3">
        <Link
          href="/espace"
          className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-700"
        >
          Mon espace
        </Link>
        <Link
          href="/"
          className="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-semibold text-zinc-800 hover:bg-zinc-100"
        >
          Accueil
        </Link>
      </div>
    </main>
  );
}
