import { Inter, Montserrat, Playfair_Display, Poppins } from "next/font/google";
import type { FontId } from "@/lib/design";

// Polices proposées pour les slides (téléchargées et servies par le site lui-même).
const inter = Inter({ subsets: ["latin"], display: "swap" });
const montserrat = Montserrat({ subsets: ["latin"], display: "swap" });
const poppins = Poppins({ subsets: ["latin"], weight: ["400", "600", "800"], display: "swap" });
const playfair = Playfair_Display({ subsets: ["latin"], display: "swap" });

export const SLIDE_FONTS: Record<FontId, { fontFamily: string }> = {
  inter: inter.style,
  montserrat: montserrat.style,
  poppins: poppins.style,
  playfair: playfair.style,
};
