"use client";

import { useEffect, useState, useTransition } from "react";
import { saveCarousel } from "@/app/creations/[id]/actions";
import { SlideThumbnail } from "@/components/slide";
import { SLIDES_MAX, TEXTE_MAX, TITRE_MAX, type Slide } from "@/lib/content";
import { FONTS, PALETTES, TEMPLATES, type Colors, type Design } from "@/lib/design";
import { SLIDE_FONTS } from "@/lib/fonts";

type Props = { creationId: string; initialSlides: Slide[]; initialDesign: Design };

const field =
  "w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-200";
const sectionTitle = "mb-3 text-sm font-semibold text-zinc-900";

export function CarouselEditor({ creationId, initialSlides, initialDesign }: Props) {
  const [slides, setSlides] = useState(initialSlides);
  const [design, setDesign] = useState(initialDesign);
  const [dirty, setDirty] = useState(false);
  const [status, setStatus] = useState<{ ok: boolean; message: string } | null>(null);
  const [saving, startSaving] = useTransition();

  // Prévenir avant de quitter la page avec des modifications non enregistrées.
  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  function changed() {
    setDirty(true);
    setStatus(null);
  }
  function updateDesign(patch: Partial<Design>) {
    setDesign((d) => ({ ...d, ...patch }));
    changed();
  }
  function updateColors(patch: Partial<Colors>) {
    setDesign((d) => ({ ...d, colors: { ...d.colors, ...patch } }));
    changed();
  }
  function updateAuthor(patch: Partial<Design["author"]>) {
    setDesign((d) => ({ ...d, author: { ...d.author, ...patch } }));
    changed();
  }
  function updateSlide(i: number, patch: Partial<Slide>) {
    setSlides((s) => s.map((slide, j) => (j === i ? { ...slide, ...patch } : slide)));
    changed();
  }
  function moveSlide(i: number, delta: -1 | 1) {
    setSlides((s) => {
      const next = [...s];
      [next[i], next[i + delta]] = [next[i + delta], next[i]];
      return next;
    });
    changed();
  }
  function removeSlide(i: number) {
    setSlides((s) => s.filter((_, j) => j !== i));
    changed();
  }
  function addSlide() {
    // Ajoutée avant la dernière slide (l'appel à l'action reste à la fin).
    setSlides((s) => [...s.slice(0, -1), { titre: "Nouvelle slide", texte: "Ton texte ici." }, ...s.slice(-1)]);
    changed();
  }

  function save() {
    startSaving(async () => {
      const result = await saveCarousel(creationId, { slides, design });
      if (result.ok) {
        setDirty(false);
        setStatus({ ok: true, message: "✓ Modifications enregistrées" });
      } else {
        setStatus({ ok: false, message: result.error });
      }
    });
  }

  const currentPalette = PALETTES.find(
    (p) =>
      p.colors.background.toLowerCase() === design.colors.background.toLowerCase() &&
      p.colors.text.toLowerCase() === design.colors.text.toLowerCase() &&
      p.colors.accent.toLowerCase() === design.colors.accent.toLowerCase(),
  );

  return (
    <div className="grid gap-8 lg:grid-cols-[320px_1fr]">
      {/* ── Réglages ─────────────────────────────────────────────── */}
      <aside className="space-y-7 self-start rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm lg:sticky lg:top-6">
        <div>
          <h3 className={sectionTitle}>Modèle</h3>
          <div className="grid grid-cols-3 gap-2">
            {TEMPLATES.map((t) => (
              <button
                key={t.value}
                type="button"
                onClick={() => updateDesign({ template: t.value })}
                aria-pressed={design.template === t.value}
                title={t.description}
                className={`rounded-lg border-2 px-2 py-2 text-xs font-semibold transition ${
                  design.template === t.value
                    ? "border-violet-600 bg-violet-50 text-violet-700"
                    : "border-zinc-200 text-zinc-700 hover:border-violet-300"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 className={sectionTitle}>Palette</h3>
          <div className="grid grid-cols-3 gap-2">
            {PALETTES.map((p) => (
              <button
                key={p.name}
                type="button"
                onClick={() => updateDesign({ colors: p.colors })}
                aria-pressed={currentPalette?.name === p.name}
                className={`flex flex-col items-center gap-1 rounded-lg border-2 p-2 text-[11px] font-medium text-zinc-700 ${
                  currentPalette?.name === p.name ? "border-violet-600 bg-violet-50" : "border-zinc-200 hover:border-violet-300"
                }`}
              >
                <span className="flex overflow-hidden rounded-full ring-1 ring-black/10">
                  {[p.colors.background, p.colors.text, p.colors.accent].map((c, i) => (
                    <span key={i} className="h-5 w-5" style={{ background: c }} />
                  ))}
                </span>
                {p.name}
              </button>
            ))}
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2">
            {(
              [
                ["background", "Fond"],
                ["text", "Texte"],
                ["accent", "Accent"],
              ] as const
            ).map(([key, label]) => (
              <label key={key} className="flex flex-col items-center gap-1 text-xs text-zinc-600">
                <input
                  type="color"
                  value={design.colors[key]}
                  onChange={(e) => updateColors({ [key]: e.target.value.toUpperCase() })}
                  aria-label={`Couleur : ${label}`}
                  className="h-9 w-full cursor-pointer rounded-md border border-zinc-300 bg-white p-0.5"
                />
                {label}
              </label>
            ))}
          </div>
        </div>

        <div>
          <h3 className={sectionTitle}>Police</h3>
          <div className="grid grid-cols-2 gap-2">
            {FONTS.map((f) => (
              <button
                key={f.value}
                type="button"
                onClick={() => updateDesign({ font: f.value })}
                aria-pressed={design.font === f.value}
                title={f.description}
                style={SLIDE_FONTS[f.value]}
                className={`rounded-lg border-2 px-2 py-2 text-sm font-semibold ${
                  design.font === f.value
                    ? "border-violet-600 bg-violet-50 text-violet-700"
                    : "border-zinc-200 text-zinc-800 hover:border-violet-300"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 className={sectionTitle}>Signature</h3>
          <label className="mb-3 flex items-center gap-2 text-sm text-zinc-700">
            <input
              type="checkbox"
              checked={design.author.show}
              onChange={(e) => updateAuthor({ show: e.target.checked })}
              className="h-4 w-4 accent-violet-600"
            />
            Afficher ma signature sur les slides
          </label>
          {design.author.show && (
            <div className="space-y-2">
              <input
                value={design.author.name}
                onChange={(e) => updateAuthor({ name: e.target.value })}
                maxLength={40}
                placeholder="Nom affiché"
                aria-label="Nom affiché"
                className={field}
              />
              <input
                value={design.author.handle}
                onChange={(e) => updateAuthor({ handle: e.target.value.replace(/^@/, "") })}
                maxLength={30}
                placeholder="pseudo (sans @)"
                aria-label="@pseudo"
                className={field}
              />
            </div>
          )}
        </div>

        <div className="border-t border-zinc-200 pt-5">
          <button
            type="button"
            onClick={save}
            disabled={saving || !dirty}
            className="w-full rounded-xl bg-violet-600 px-4 py-3 font-semibold text-white shadow-lg shadow-violet-600/20 hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? "Enregistrement…" : "Enregistrer"}
          </button>
          <p
            role="status"
            className={`mt-2 min-h-5 text-center text-sm ${status ? (status.ok ? "text-emerald-700" : "text-red-700") : "text-zinc-500"}`}
          >
            {status ? status.message : dirty ? "Modifications non enregistrées" : "Tout est enregistré"}
          </p>
        </div>
      </aside>

      {/* ── Slides ───────────────────────────────────────────────── */}
      <div className="space-y-5">
        {slides.map((slide, i) => (
          <div
            key={i}
            className="flex flex-col gap-5 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm sm:flex-row"
          >
            <SlideThumbnail width={260} slide={slide} index={i} total={slides.length} design={design} />
            <div className="flex min-w-0 flex-1 flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-violet-700">
                  Slide {i + 1}
                  {i === 0 ? " · couverture" : i === slides.length - 1 && slides.length > 1 ? " · appel à l'action" : ""}
                </span>
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => moveSlide(i, -1)}
                    disabled={i === 0}
                    aria-label={`Monter la slide ${i + 1}`}
                    className="rounded-md border border-zinc-300 px-2 py-1 text-sm hover:bg-zinc-100 disabled:opacity-30"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    onClick={() => moveSlide(i, 1)}
                    disabled={i === slides.length - 1}
                    aria-label={`Descendre la slide ${i + 1}`}
                    className="rounded-md border border-zinc-300 px-2 py-1 text-sm hover:bg-zinc-100 disabled:opacity-30"
                  >
                    ↓
                  </button>
                  <button
                    type="button"
                    onClick={() => removeSlide(i)}
                    disabled={slides.length <= 1}
                    aria-label={`Supprimer la slide ${i + 1}`}
                    className="rounded-md border border-red-200 px-2 py-1 text-sm text-red-700 hover:bg-red-50 disabled:opacity-30"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
              <label className="space-y-1">
                <span className="text-xs font-medium text-zinc-600">Titre</span>
                <input
                  value={slide.titre}
                  onChange={(e) => updateSlide(i, { titre: e.target.value })}
                  maxLength={TITRE_MAX}
                  className={field}
                />
              </label>
              <label className="flex flex-1 flex-col space-y-1">
                <span className="text-xs font-medium text-zinc-600">Texte</span>
                <textarea
                  value={slide.texte}
                  onChange={(e) => updateSlide(i, { texte: e.target.value })}
                  maxLength={TEXTE_MAX}
                  rows={4}
                  className={`${field} flex-1 resize-y`}
                />
              </label>
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={addSlide}
          disabled={slides.length >= SLIDES_MAX}
          className="w-full rounded-2xl border-2 border-dashed border-zinc-300 py-4 text-sm font-semibold text-zinc-600 hover:border-violet-400 hover:text-violet-700 disabled:opacity-40"
        >
          + Ajouter une slide
        </button>
      </div>
    </div>
  );
}
