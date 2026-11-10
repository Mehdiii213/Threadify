import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SiteFooter } from "@/components/site-footer";
import { SITE_DESCRIPTION, siteUrl } from "@/lib/site";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  // Chaque page donne son titre (ex. « Tarifs ») : l'onglet affiche « Tarifs — Threadify ».
  title: { default: "Threadify — Carrousels et threads générés par IA", template: "%s — Threadify" },
  description: SITE_DESCRIPTION,
  applicationName: "Threadify",
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: "Threadify",
    title: "Threadify — Carrousels et threads générés par IA",
    description: SITE_DESCRIPTION,
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="fr"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
