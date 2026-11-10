import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

// /robots.txt : les moteurs de recherche n'indexent que les pages publiques.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/admin/", "/espace", "/creer", "/creations/", "/abonnement", "/compte", "/nouveau-mot-de-passe"],
    },
    sitemap: `${siteUrl()}/sitemap.xml`,
  };
}
