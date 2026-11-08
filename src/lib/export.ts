"use client";

import { SLIDE_HEIGHT, SLIDE_WIDTH } from "@/lib/design";

// Export des créations, entièrement dans le navigateur de l'utilisateur :
// chaque slide affichée (élément [data-slide-root], 1080 × 1350) est
// « photographiée » telle quelle, puis regroupée en ZIP (PNG) ou en PDF.
// Les bibliothèques sont chargées seulement au moment du clic.

export type Progress = (current: number, total: number) => void;

/** Nom de fichier lisible : « 5 erreurs qui freinent… » → « 5-erreurs-qui-freinent ». */
export function slugify(text: string, max = 40) {
  const slug = text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, max)
    .replace(/-+$/g, "");
  return slug || "creation";
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 10_000);
}

const pad = (n: number) => String(n).padStart(2, "0");

/** Dessine chaque slide dans une image (canvas) de 1080 × 1350 pixels. */
async function renderSlides(nodes: HTMLElement[], onProgress?: Progress) {
  const { domToCanvas } = await import("modern-screenshot");
  await document.fonts.ready; // les polices doivent être chargées avant la « photo »
  const canvases: HTMLCanvasElement[] = [];
  for (const [i, node] of nodes.entries()) {
    onProgress?.(i + 1, nodes.length);
    canvases.push(await domToCanvas(node, { width: SLIDE_WIDTH, height: SLIDE_HEIGHT, scale: 1 }));
  }
  return canvases;
}

function canvasToPng(canvas: HTMLCanvasElement) {
  return new Promise<Blob>((resolve, reject) =>
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error("Image vide"))), "image/png"),
  );
}

export async function exportSlidesZip(nodes: HTMLElement[], baseName: string, onProgress?: Progress) {
  const [canvases, { default: JSZip }] = await Promise.all([renderSlides(nodes, onProgress), import("jszip")]);
  const zip = new JSZip();
  for (const [i, canvas] of canvases.entries()) {
    zip.file(`slide-${pad(i + 1)}.png`, await canvasToPng(canvas));
  }
  downloadBlob(await zip.generateAsync({ type: "blob" }), `threadify-${baseName}.zip`);
}

export async function exportSlidesPdf(nodes: HTMLElement[], baseName: string, onProgress?: Progress) {
  const [canvases, { jsPDF }] = await Promise.all([renderSlides(nodes, onProgress), import("jspdf")]);
  // Une page par slide, au format 1080 × 1350 (images JPEG pour un PDF léger).
  const pdf = new jsPDF({ unit: "px", format: [SLIDE_WIDTH, SLIDE_HEIGHT], hotfixes: ["px_scaling"] });
  canvases.forEach((canvas, i) => {
    if (i > 0) pdf.addPage([SLIDE_WIDTH, SLIDE_HEIGHT], "portrait");
    pdf.addImage(canvas.toDataURL("image/jpeg", 0.92), "JPEG", 0, 0, SLIDE_WIDTH, SLIDE_HEIGHT);
  });
  downloadBlob(pdf.output("blob"), `threadify-${baseName}.pdf`);
}

export async function exportSingleSlide(node: HTMLElement, baseName: string, index: number) {
  const [canvas] = await renderSlides([node]);
  downloadBlob(await canvasToPng(canvas), `threadify-${baseName}-slide-${pad(index + 1)}.png`);
}

export function exportThreadTxt(tweets: string[], baseName: string) {
  const text = tweets.map((t, i) => `${t}\n\n${i + 1}/${tweets.length}`).join("\n\n---\n\n") + "\n";
  downloadBlob(new Blob([text], { type: "text/plain;charset=utf-8" }), `threadify-${baseName}.txt`);
}
