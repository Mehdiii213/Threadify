import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

// /sitemap.xml : liste des pages publiques pour les moteurs de recherche.
export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl();
  return [
    { url: `${base}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/tarifs`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/inscription`, changeFrequency: "yearly", priority: 0.6 },
    { url: `${base}/connexion`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/mentions-legales`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${base}/cgv`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${base}/confidentialite`, changeFrequency: "yearly", priority: 0.2 },
  ];
}
