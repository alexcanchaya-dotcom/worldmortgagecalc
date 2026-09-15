import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

const paths = ["/", "/about", "/contact", "/privacy-policy", "/terms", "/disclaimer", "/ireland"];

export default function sitemap(): MetadataRoute.Sitemap {
  return paths.map((path) => ({
    url: `${siteUrl}${path === "/" ? "/" : path}`,
    lastModified: new Date(),
    changeFrequency: path === "/" || path === "/ireland" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : 0.6,
  }));
}
