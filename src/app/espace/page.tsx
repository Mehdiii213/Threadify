import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { CardMenu } from "@/components/dashboard/card-menu";
import { FolderNav } from "@/components/dashboard/folder-nav";
import { SignOutButton } from "@/components/sign-out-button";
import { SiteHeader } from "@/components/site-header";
import { SlideThumbnail } from "@/components/slide";
import type { CreationFormat, Prisma } from "@/generated/prisma/client";
import { readContent } from "@/lib/content";
import { FORMAT_LABELS, excerpt, formatDate } from "@/lib/creations";
import { readDesign } from "@/lib/design";
import { PAGE_SIZE, displayTitle } from "@/lib/organisation";
import { getUsage } from "@/lib/billing";
import { PLANS } from "@/lib/plans";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/session";

export const metadata: Metadata = { title: "Mon espace — Threadify" };

// ─── Filtres lus dans l'adresse : ?dossier=…&format=…&statut=…&etiquette=…&q=…&page=… ───

const FORMAT_FILTERS: { key: string; label: string; value?: CreationFormat }[] = [
  { key: "", label: "Tous les formats" },
  { key: "instagram", label: "Instagram", value: "CARROUSEL_INSTAGRAM" },
  { key: "linkedin", label: "LinkedIn", value: "CARROUSEL_LINKEDIN" },
  { key: "thread", label: "Threads X", value: "THREAD_X" },
];
const STATUS_FILTERS = [
  { key: "", label: "Toutes" },
  { key: "generee", label: "Générées" },
  { key: "brouillon", label: "Brouillons" },
];

type Filters = { dossier: string; format: string; statut: string; etiquette: string; q: string; page: number };

function readFilters(sp: Record<string, string | string[] | undefined>): Filters {
  const one = (k: string) => (typeof sp[k] === "string" ? (sp[k] as string) : "");
  return {
    dossier: one("dossier"),
    format: FORMAT_FILTERS.some((f) => f.key === one("format")) ? one("format") : "",
    statut: STATUS_FILTERS.some((f) => f.key === one("statut")) ? one("statut") : "",
    etiquette: one("etiquette").slice(0, 40),
    q: one("q").trim().slice(0, 100),
    page: Math.max(1, Math.floor(Number(one("page")) || 1)),
  };
}

function href(filters: Filters, patch: Partial<Filters>) {
  const next = { ...filters, page: 1, ...patch };
  const params = new URLSearchParams();
  for (const key of ["dossier", "format", "statut", "etiquette", "q"] as const) {
    if (next[key]) params.set(key, next[key]);
  }
  if (next.page > 1) params.set("page", String(next.page));
  const query = params.toString();
  return query ? `/espace?${query}` : "/espace";
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function EspacePage({ searchParams }: PageProps<"/espace">) {
  return (
    <main className="flex flex-1 flex-col bg-zinc-50 text-zinc-900">
      <SiteHeader />
      <section className="mx-auto w-full max-w-6xl flex-1 px-6 pt-4 pb-16">
        <Suspense fallback={<p className="text-zinc-500">Chargement de votre espace…</p>}>
          <Dashboard searchParams={searchParams} />
        </Suspense>
      </section>
    </main>
  );
}

async function Dashboard({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const [{ user }, sp] = await Promise.all([requireSession(), searchParams]);
  const f = readFilters(sp);
  const firstName = user.name.split(" ")[0] || user.name;

  const mine = { userId: user.id };

  const [total, generated, usage, noFolderCount, folderRows, tagRows] = await Promise.all([
    prisma.creation.count({ where: mine }),
    prisma.creation.count({ where: { ...mine, status: "GENERE" } }),
    getUsage(user.id),
    prisma.creation.count({ where: { ...mine, folderId: null } }),
    prisma.folder.findMany({
      where: mine,
      orderBy: { name: "asc" },
      select: { id: true, name: true, _count: { select: { creations: true } } },
    }),
    prisma.creation.findMany({ where: { ...mine, NOT: { tags: { isEmpty: true } } }, select: { tags: true } }),
  ]);
  const folders = folderRows.map((r) => ({ id: r.id, name: r.name, count: r._count.creations }));
  const activeFolder = f.dossier === "aucun" ? "aucun" : folders.some((x) => x.id === f.dossier) ? f.dossier : null;
  const allTags = [...new Set(tagRows.flatMap((r) => r.tags))].sort((a, b) => a.localeCompare(b, "fr"));

  // Filtres combinés
  const where: Prisma.CreationWhereInput = { ...mine };
  if (activeFolder === "aucun") where.folderId = null;
  else if (activeFolder) where.folderId = activeFolder;
  const formatValue = FORMAT_FILTERS.find((x) => x.key === f.format)?.value;
  if (formatValue) where.format = formatValue;
  if (f.statut === "generee") where.status = "GENERE";
  if (f.statut === "brouillon") where.status = "BROUILLON";
  if (f.etiquette) where.tags = { has: f.etiquette };
  if (f.q) {
    where.OR = [
      { title: { contains: f.q, mode: "insensitive" } },
      { sourceText: { contains: f.q, mode: "insensitive" } },
    ];
  }

  const matching = await prisma.creation.count({ where });
  const pages = Math.max(1, Math.ceil(matching / PAGE_SIZE));
  const page = Math.min(f.page, pages);
  const creations = await prisma.creation.findMany({
    where,
    orderBy: { createdAt: "desc" },
    skip: (page - 1) * PAGE_SIZE,
    take: PAGE_SIZE,
    include: { folder: { select: { name: true } } },
  });

  const filtered = Boolean(activeFolder || f.format || f.statut || f.etiquette || f.q);
  const folderHrefs: Record<string, string> = {
    "": href(f, { dossier: "" }),
    aucun: href(f, { dossier: "aucun" }),
    ...Object.fromEntries(folders.map((x) => [x.id, href(f, { dossier: x.id })])),
  };
  const heading =
    activeFolder === "aucun"
      ? "Sans dossier"
      : activeFolder
        ? `📁 ${folders.find((x) => x.id === activeFolder)?.name}`
        : "Mes créations";

  return (
    <>
      {/* En-tête */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Bonjour {firstName} 👋</h1>
          <p className="mt-1 text-zinc-600">
            Connecté avec <span className="font-medium text-zinc-800">{user.email}</span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/creer"
            className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-violet-600/20 hover:bg-violet-700"
          >
            + Nouvelle création
          </Link>
          <SignOutButton />
        </div>
      </div>

      {/* Chiffres clés */}
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          ["Créations", total],
          ["Générées", generated],
          ["Brouillons", total - generated],
        ].map(([label, value]) => (
          <div key={label} className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
            <p className="text-xs font-medium text-zinc-500">{label}</p>
            <p data-stat="" className="mt-1 text-2xl font-bold tabular-nums">{value}</p>
          </div>
        ))}
        <Link href="/abonnement" className="rounded-2xl border border-violet-200 bg-violet-50 p-4 shadow-sm hover:border-violet-400">
          <p className="text-xs font-medium text-violet-800">
            Générations ce mois-ci · offre {PLANS[usage.plan].label}
          </p>
          <p data-stat="" className="mt-1 text-2xl font-bold tabular-nums text-violet-900">
            {usage.used}
            <span className="text-base font-semibold text-violet-700"> / {usage.limit ?? "∞"}</span>
          </p>
        </Link>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[230px_1fr]">
        <aside className="self-start rounded-2xl border border-zinc-200 bg-white p-3 shadow-sm">
          <FolderNav
            folders={folders}
            active={activeFolder}
            totalCount={total}
            noFolderCount={noFolderCount}
            hrefFor={folderHrefs}
          />
        </aside>

        <div className="min-w-0">
          <h2 className="text-xl font-bold tracking-tight">{heading}</h2>

          {/* Filtres */}
          <div className="mt-4 space-y-3">
            <form action="/espace" className="flex gap-2">
              {activeFolder && <input type="hidden" name="dossier" value={activeFolder} />}
              {f.format && <input type="hidden" name="format" value={f.format} />}
              {f.statut && <input type="hidden" name="statut" value={f.statut} />}
              {f.etiquette && <input type="hidden" name="etiquette" value={f.etiquette} />}
              <input
                type="search"
                name="q"
                defaultValue={f.q}
                placeholder="Rechercher dans les titres et les textes…"
                aria-label="Rechercher"
                className="min-w-0 flex-1 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-200"
              />
              <button type="submit" className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-semibold text-white hover:bg-zinc-700">
                Rechercher
              </button>
            </form>
            <FilterRow
              items={FORMAT_FILTERS.map((x) => ({ label: x.label, href: href(f, { format: x.key }), active: f.format === x.key }))}
            />
            <FilterRow
              items={STATUS_FILTERS.map((x) => ({ label: x.label, href: href(f, { statut: x.key }), active: f.statut === x.key }))}
            />
            {allTags.length > 0 && (
              <FilterRow
                items={[
                  { label: "Toutes les étiquettes", href: href(f, { etiquette: "" }), active: !f.etiquette },
                  ...allTags.map((t) => ({ label: `#${t}`, href: href(f, { etiquette: t }), active: f.etiquette === t })),
                ]}
              />
            )}
          </div>

          <p className="mt-4 text-sm text-zinc-500">
            {matching} création{matching > 1 ? "s" : ""}
            {filtered && (
              <>
                {" · "}
                <Link href="/espace" className="font-medium text-violet-700 hover:underline">
                  Effacer les filtres
                </Link>
              </>
            )}
          </p>

          {/* Grille */}
          {creations.length === 0 ? (
            <div className="mt-4 rounded-2xl border border-dashed border-zinc-300 bg-white p-10 text-center text-zinc-500">
              {total === 0 ? (
                <>
                  Aucune création pour l&apos;instant.{" "}
                  <Link href="/creer" className="font-semibold text-violet-700 hover:underline">
                    Lancez-vous !
                  </Link>
                </>
              ) : (
                "Aucune création ne correspond à ces filtres."
              )}
            </div>
          ) : (
            <ul className="mt-4 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {creations.map((c) => {
                const title = displayTitle(c);
                const content = readContent(c.content);
                return (
                  <li key={c.id} className="flex flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition hover:shadow-md">
                    <Link href={`/creations/${c.id}`} className="flex h-64 items-center justify-center bg-zinc-100 p-4" tabIndex={-1} aria-hidden>
                      {content?.type === "carrousel" && content.slides[0] ? (
                        <SlideThumbnail
                          width={176}
                          slide={content.slides[0]}
                          index={0}
                          total={content.slides.length}
                          design={readDesign(c.design, user.name)}
                        />
                      ) : content?.type === "thread" ? (
                        <div className="w-full max-w-60 rounded-xl border border-zinc-200 bg-white p-4 text-sm text-zinc-800 shadow-sm">
                          <p className="mb-2 text-xs font-semibold text-zinc-500">𝕏 · {content.tweets.length} tweets</p>
                          <p className="line-clamp-6">{content.tweets[0]}</p>
                        </div>
                      ) : (
                        <div className="w-full max-w-60 text-center text-sm text-zinc-500">
                          <p className="mb-2 text-2xl">📝</p>
                          <p className="line-clamp-4 italic">{excerpt(c.sourceText, 140)}</p>
                        </div>
                      )}
                    </Link>
                    <div className="flex flex-1 flex-col gap-2 p-4">
                      <div className="flex items-start justify-between gap-2">
                        <Link href={`/creations/${c.id}`} className="line-clamp-2 font-semibold text-zinc-900 hover:text-violet-700">
                          {title}
                        </Link>
                        <CardMenu
                          creationId={c.id}
                          title={title}
                          folderId={c.folderId}
                          folders={folders.map(({ id, name }) => ({ id, name }))}
                        />
                      </div>
                      <div className="flex flex-wrap items-center gap-1.5 text-xs">
                        <span className="rounded-full bg-zinc-100 px-2 py-0.5 font-medium text-zinc-700">{FORMAT_LABELS[c.format]}</span>
                        <span
                          className={`rounded-full px-2 py-0.5 font-semibold ${
                            c.status === "GENERE" ? "bg-violet-100 text-violet-700" : "bg-zinc-100 text-zinc-600"
                          }`}
                        >
                          {c.status === "GENERE" ? "Générée" : "Brouillon"}
                        </span>
                        {c.folder && <span className="rounded-full bg-amber-50 px-2 py-0.5 text-amber-800">📁 {c.folder.name}</span>}
                        {c.tags.map((t) => (
                          <Link key={t} href={href(f, { etiquette: t })} className="rounded-full bg-sky-50 px-2 py-0.5 text-sky-800 hover:bg-sky-100">
                            #{t}
                          </Link>
                        ))}
                      </div>
                      <p className="mt-auto pt-1 text-xs text-zinc-500">{formatDate(c.createdAt)}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}

          {/* Pages */}
          {pages > 1 && (
            <nav aria-label="Pages" className="mt-8 flex items-center justify-center gap-3 text-sm">
              {page > 1 ? (
                <Link href={href(f, { page: page - 1 })} className="rounded-lg border border-zinc-300 bg-white px-3 py-1.5 font-medium hover:bg-zinc-100">
                  ← Page précédente
                </Link>
              ) : (
                <span className="rounded-lg border border-zinc-200 px-3 py-1.5 text-zinc-300">← Page précédente</span>
              )}
              <span className="text-zinc-600">
                Page {page} sur {pages}
              </span>
              {page < pages ? (
                <Link href={href(f, { page: page + 1 })} className="rounded-lg border border-zinc-300 bg-white px-3 py-1.5 font-medium hover:bg-zinc-100">
                  Page suivante →
                </Link>
              ) : (
                <span className="rounded-lg border border-zinc-200 px-3 py-1.5 text-zinc-300">Page suivante →</span>
              )}
            </nav>
          )}
        </div>
      </div>
    </>
  );
}

function FilterRow({ items }: { items: { label: string; href: string; active: boolean }[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((x) => (
        <Link
          key={x.label}
          href={x.href}
          aria-current={x.active ? "page" : undefined}
          className={`rounded-full border px-3 py-1 text-sm ${
            x.active ? "border-violet-600 bg-violet-600 font-semibold text-white" : "border-zinc-300 bg-white text-zinc-700 hover:border-violet-400"
          }`}
        >
          {x.label}
        </Link>
      ))}
    </div>
  );
}
