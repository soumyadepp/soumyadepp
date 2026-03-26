import { notFound } from "next/navigation";
import { getAllBlogs, getBlogBySlug } from "@/lib/blogs";
import BlogMarkdown from "@/components/BlogMarkdown";
import { Clock, ArrowLeft, Tag } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllBlogs().map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const blog = getBlogBySlug(slug);
  if (!blog) return {};
  return {
    title: `${blog.title} | Soumyadeep Ghosh`,
    description: blog.excerpt,
  };
}

function formatDate(dateStr: string) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const blog = getBlogBySlug(slug);
  if (!blog) notFound();

  return (
    <main className="min-h-screen bg-background">
      {/* Back */}
      <div className="max-w-3xl mx-auto px-6 pt-28 pb-2">
        <Link
          href="/blogs"
          className="inline-flex items-center gap-1.5 font-mono text-xs text-zinc-400 hover:text-sky-500 dark:hover:text-sky-400 transition-colors group"
        >
          <ArrowLeft size={13} className="group-hover:-translate-x-0.5 transition-transform" />
          all posts
        </Link>
      </div>

      {/* Hero */}
      <header className="max-w-3xl mx-auto px-6 pt-6 pb-12 border-b border-zinc-200/60 dark:border-zinc-800/60">
        {/* Tags */}
        <div className="flex items-center gap-2 flex-wrap mb-5">
          <Tag size={12} className="text-zinc-400" />
          {blog.tags.map((tag) => (
            <span
              key={tag}
              className="font-mono text-[11px] text-sky-600 dark:text-sky-400/80 bg-sky-500/8 border border-sky-500/15 dark:border-sky-500/10 px-2.5 py-0.5 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-zinc-900 dark:text-zinc-50 leading-[1.15] mb-6">
          {blog.title}
        </h1>

        <p className="text-zinc-500 dark:text-zinc-400 text-base leading-relaxed mb-8 max-w-xl">
          {blog.excerpt}
        </p>

        <div className="flex items-center gap-5 text-xs font-mono text-zinc-400">
          <span>{formatDate(blog.date)}</span>
          <span className="flex items-center gap-1.5">
            <Clock size={11} />
            {blog.readTime} min read
          </span>
        </div>
      </header>

      {/* Banner image */}
      {blog.coverImage && (
        <div className="max-w-3xl mx-auto px-6 pt-10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={blog.coverImage}
            alt={blog.title}
            className="w-full h-auto rounded-xl border border-zinc-200 dark:border-zinc-800"
          />
        </div>
      )}

      {/* Markdown content */}
      <div className="max-w-3xl mx-auto px-6 py-14">
        <BlogMarkdown content={blog.content} />
      </div>

      {/* Footer nav */}
      <div className="border-t border-zinc-200/60 dark:border-zinc-800/60 mt-8">
        <div className="max-w-3xl mx-auto px-6 py-10">
          <Link
            href="/blogs"
            className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-sky-500 dark:hover:text-sky-400 transition-colors group"
          >
            <ArrowLeft size={15} className="group-hover:-translate-x-0.5 transition-transform" />
            Back to all posts
          </Link>
        </div>
      </div>
    </main>
  );
}
