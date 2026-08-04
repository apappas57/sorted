import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

/**
 * Sitemap for Sorted.
 *
 * Only two public routes exist today. If you add a page, add it here in the
 * same change -- a page missing from the sitemap is a page Google may never
 * find.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: siteConfig.url,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${siteConfig.url}/get-sorted`,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${siteConfig.url}/about`,
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];
}
