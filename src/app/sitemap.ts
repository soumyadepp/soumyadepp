import type { MetadataRoute } from "next";
import { NAV, SITE } from "@/content/site";
import { projects } from "@/data/projects";
import { talks } from "@/data/talks";
import { getAllBlogs } from "@/lib/blogs";

/**
 * Lists every public page for search engines.
 *
 * Returns:
 *   The home page, each section, and every project, talk and blog post.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    "/",
    ...NAV.map((item) => item.href),
    ...projects.map((project) => `/projects/${project.slug}`),
    ...talks.map((talk) => `/talks/${talk.id}`),
  ];
  const pages: MetadataRoute.Sitemap = paths.map((path) => ({
    url: new URL(path, SITE.url).toString(),
  }));
  const posts = getAllBlogs().map((post) => ({
    url: new URL(`/blogs/${post.slug}`, SITE.url).toString(),
    lastModified: post.date || undefined,
  }));
  return [...pages, ...posts];
}
