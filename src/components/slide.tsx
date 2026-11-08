import type { CSSProperties } from "react";
import type { Slide as SlideContent } from "@/lib/content";
import { SLIDE_HEIGHT, SLIDE_WIDTH, initial, readableOn, type Design } from "@/lib/design";
import { SLIDE_FONTS } from "@/lib/fonts";

// Une slide dessinée à la taille réelle d'Instagram (1080 × 1350 px).
// Styles « en ligne » et tailles en pixels : ce même composant servira à
// l'export PNG / PDF (étape 5), pour que le fichier soit identique à l'aperçu.

type Props = { slide: SlideContent; index: number; total: number; design: Design };

function palette(design: Design) {
  const { background, text, accent } = design.colors;
  switch (design.template) {
    case "audacieux":
      return { bg: accent, fg: readableOn(accent), accent: readableOn(accent), badgeBg: background, badgeFg: text };
    case "degrade":
      return {
        bg: `linear-gradient(160deg, ${background} 0%, ${background} 35%, color-mix(in srgb, ${accent} 55%, ${background}) 100%)`,
        fg: text,
        accent,
        badgeBg: accent,
        badgeFg: readableOn(accent),
      };
    default:
      return { bg: background, fg: text, accent, badgeBg: accent, badgeFg: readableOn(accent) };
  }
}

export function Slide({ slide, index, total, design }: Props) {
  const c = palette(design);
  const bold = design.template === "audacieux";
  const isCover = index === 0;
  const isLast = index === total - 1 && total > 1;

  const root: CSSProperties = {
    width: SLIDE_WIDTH,
    height: SLIDE_HEIGHT,
    background: c.bg,
    color: c.fg,
    ...SLIDE_FONTS[design.font],
    display: "flex",
    flexDirection: "column",
    padding: 96,
    boxSizing: "border-box",
    overflow: "hidden",
    position: "relative",
  };

  const titleSize = isCover ? (bold ? 112 : 96) : bold ? 80 : 68;

  return (
    // data-slide-root : repère utilisé par l'export (src/lib/export.ts)
    <div style={root} data-slide-root="">
      {/* En-tête : numéro de la slide (sauf couverture) */}
      <div style={{ height: 120, display: "flex", alignItems: "flex-start" }}>
        {!isCover && !isLast && (
          <span style={{ fontSize: bold ? 120 : 96, fontWeight: 800, lineHeight: 1, color: c.accent, opacity: bold ? 0.35 : 1 }}>
            {String(index).padStart(2, "0")}
          </span>
        )}
      </div>

      {/* Contenu */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", overflow: "hidden" }}>
        {!bold && <div style={{ width: 120, height: 12, borderRadius: 6, background: c.accent, marginBottom: 48 }} />}
        <h2
          style={{
            fontSize: titleSize,
            fontWeight: 800,
            lineHeight: 1.12,
            margin: 0,
            letterSpacing: bold ? -2 : -1,
          }}
        >
          {slide.titre}
        </h2>
        {slide.texte && (
          <p
            style={{
              fontSize: isCover ? 44 : 40,
              lineHeight: 1.45,
              margin: "48px 0 0",
              opacity: 0.88,
              ...(isLast
                ? { borderLeft: `10px solid ${c.accent}`, paddingLeft: 40 }
                : {}),
            }}
          >
            {slide.texte}
          </p>
        )}
      </div>

      {/* Pied : signature + pagination */}
      <div style={{ height: 120, display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 32 }}>
        {design.author.show && (design.author.name || design.author.handle) ? (
          <div style={{ display: "flex", alignItems: "center", gap: 24, minWidth: 0 }}>
            <div
              style={{
                width: 80,
                height: 80,
                borderRadius: 40,
                background: c.badgeBg,
                color: c.badgeFg,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 40,
                fontWeight: 800,
                flexShrink: 0,
              }}
            >
              {initial(design.author.name || design.author.handle)}
            </div>
            <div style={{ minWidth: 0 }}>
              {design.author.name && <div style={{ fontSize: 32, fontWeight: 700, lineHeight: 1.2 }}>{design.author.name}</div>}
              {design.author.handle && (
                <div style={{ fontSize: 28, opacity: 0.7, lineHeight: 1.3 }}>@{design.author.handle.replace(/^@/, "")}</div>
              )}
            </div>
          </div>
        ) : (
          <span />
        )}
        <div style={{ fontSize: 30, fontWeight: 700, opacity: 0.75, whiteSpace: "nowrap" }}>
          {isCover && total > 1 ? "Glisse →" : `${index + 1} / ${total}`}
        </div>
      </div>
    </div>
  );
}

/** Affiche une slide réduite à la largeur voulue (en pixels), sans changer son rendu. */
export function SlideThumbnail({ width, ...props }: Props & { width: number }) {
  const scale = width / SLIDE_WIDTH;
  return (
    <div
      style={{ width, height: SLIDE_HEIGHT * scale, overflow: "hidden", borderRadius: 12, flexShrink: 0 }}
      className="shadow-md ring-1 ring-black/5"
    >
      <div style={{ transform: `scale(${scale})`, transformOrigin: "top left", width: SLIDE_WIDTH, height: SLIDE_HEIGHT }}>
        <Slide {...props} />
      </div>
    </div>
  );
}
