import { ImageResponse } from "next/og";

// Image d'aperçu quand on partage le lien du site (LinkedIn, WhatsApp, X…).
export const alt = "Threadify — carrousels et threads générés par IA";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 90px",
          background: "linear-gradient(135deg, #faf5ff 0%, #ede9fe 100%)",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", maxWidth: 640 }}>
          <div style={{ display: "flex", fontSize: 44, fontWeight: 800, color: "#18181b" }}>
            Thread<span style={{ color: "#7c3aed" }}>ify</span>
          </div>
          <div style={{ marginTop: 28, fontSize: 64, fontWeight: 800, lineHeight: 1.1, color: "#18181b" }}>
            Une idée → un carrousel prêt à publier
          </div>
          <div style={{ marginTop: 28, fontSize: 30, color: "#52525b" }}>Instagram · LinkedIn · threads X, générés par l&apos;IA en français</div>
        </div>
        <div style={{ display: "flex", position: "relative", width: 300, height: 380 }}>
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 30,
              width: 240,
              height: 300,
              borderRadius: 24,
              background: "#c4b5fd",
            }}
          />
          <div
            style={{
              position: "absolute",
              left: 50,
              top: 0,
              width: 250,
              height: 312,
              borderRadius: 24,
              background: "#7c3aed",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              padding: 32,
              color: "white",
            }}
          >
            <div style={{ width: 70, height: 10, borderRadius: 5, background: "white", marginBottom: 24 }} />
            <div style={{ fontSize: 34, fontWeight: 800, lineHeight: 1.15 }}>5 idées pour tes posts</div>
            <div style={{ marginTop: 20, fontSize: 20, opacity: 0.85 }}>Glisse →</div>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
