import { Suspense } from "react";
import { DbStatus, StatusPill } from "@/components/db-status";

const formats = [
  {
    title: "Carrousel Instagram",
    description: "Des slides carrées, lisibles et cohérentes, prêtes à poster.",
  },
  {
    title: "Carrousel LinkedIn",
    description: "Un PDF designé qui transforme votre expertise en contenu viral.",
  },
  {
    title: "Thread X",
    description: "Votre idée découpée en tweets percutants, avec une accroche forte.",
  },
];

export default function Home() {
  return (
    <main className="flex flex-1 flex-col bg-zinc-50 text-zinc-900">
      <header className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-6">
        <span className="text-xl font-bold tracking-tight">
          Thread<span className="text-violet-600">ify</span>
        </span>
        <Suspense fallback={<StatusPill color="bg-zinc-300" label="Base de données : vérification…" />}>
          <DbStatus />
        </Suspense>
      </header>

      <section className="mx-auto flex w-full max-w-5xl flex-1 flex-col items-center justify-center px-6 py-16 text-center">
        <p className="mb-4 rounded-full bg-violet-100 px-4 py-1 text-sm font-medium text-violet-700">
          Générateur de carrousels et de threads par IA
        </p>
        <h1 className="max-w-3xl text-4xl font-extrabold tracking-tight sm:text-6xl">
          Une idée. Un carrousel{" "}
          <span className="bg-gradient-to-r from-violet-600 to-fuchsia-500 bg-clip-text text-transparent">
            prêt à publier.
          </span>
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-zinc-600">
          Écrivez une idée ou collez un article : Threadify le transforme en carrousel
          Instagram, LinkedIn ou en thread X designé, en quelques secondes au lieu de
          plusieurs heures.
        </p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <span className="rounded-xl bg-violet-600 px-6 py-3 font-semibold text-white shadow-lg shadow-violet-600/20">
            Bientôt disponible
          </span>
        </div>

        <div className="mt-20 grid w-full gap-6 text-left sm:grid-cols-3">
          {formats.map((format) => (
            <div
              key={format.title}
              className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm"
            >
              <h2 className="font-semibold">{format.title}</h2>
              <p className="mt-2 text-sm text-zinc-600">{format.description}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="py-6 text-center text-sm text-zinc-500">
        © {"2026"} Threadify — Fait en France
      </footer>
    </main>
  );
}
