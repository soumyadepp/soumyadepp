import type { MetadataRoute } from "next";
import { SITE } from "@/content/site";

/**
 * Lets every crawler in and points it at the sitemap.
 *
 * Returns:
 *   The rules served at /robots.txt.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: "/lab" },
    sitemap: new URL("/sitemap.xml", SITE.url).toString(),
  };
}
