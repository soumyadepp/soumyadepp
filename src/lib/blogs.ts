import fs from "fs";
import path from "path";
import matter from "gray-matter";

const BLOGS_DIR = path.join(process.cwd(), "content/blogs");
const WORDS_PER_MINUTE = 220;

export interface BlogMeta {
  slug: string;
  title: string;
  date: string;
  tags: string[];
  excerpt: string;
  coverImage: string;
  readTime: number;
}

export interface Blog extends BlogMeta {
  content: string;
}

function readPost(filename: string): { meta: BlogMeta; content: string } {
  const slug = filename.replace(/\.md$/, "");
  const raw = fs.readFileSync(path.join(BLOGS_DIR, filename), "utf-8");
  const { data, content } = matter(raw);
  const meta: BlogMeta = {
    slug,
    title: data.title ?? slug,
    date: data.date ?? "",
    tags: data.tags ?? [],
    excerpt: data.excerpt ?? "",
    coverImage: data.coverImage ?? "",
    readTime: data.readTime ?? readingMinutes(content),
  };
  return { meta, content };
}

function readingMinutes(content: string): number {
  const words = content.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}

/**
 * Lists every post, newest first.
 *
 * Returns:
 *   The frontmatter of each post, without its body.
 */
export function getAllBlogs(): BlogMeta[] {
  if (!fs.existsSync(BLOGS_DIR)) return [];
  return fs
    .readdirSync(BLOGS_DIR)
    .filter((filename) => filename.endsWith(".md"))
    .map((filename) => readPost(filename).meta)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

/**
 * Loads one post by its URL slug.
 *
 * Args:
 *   slug: The file name of the post without its extension.
 *
 * Returns:
 *   The post with its body, or null when no such post exists.
 */
export function getBlogBySlug(slug: string): Blog | null {
  const filename = `${slug}.md`;
  if (!fs.existsSync(path.join(BLOGS_DIR, filename))) return null;
  const { meta, content } = readPost(filename);
  return { ...meta, content };
}

/**
 * Formats a post date as a short month and year.
 *
 * Args:
 *   date: An ISO date string from a post's frontmatter.
 *
 * Returns:
 *   Text such as "Mar 2026", or an empty string when the date is missing.
 */
export function formatMonth(date: string): string {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-GB", {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

/**
 * Formats a post date in full.
 *
 * Args:
 *   date: An ISO date string from a post's frontmatter.
 *
 * Returns:
 *   Text such as "24 March 2026", or an empty string when the date is missing.
 */
export function formatDay(date: string): string {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}
