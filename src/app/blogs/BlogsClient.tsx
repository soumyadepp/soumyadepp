"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, ArrowUpRight, Tag } from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";
import FilterBar from "@/components/ui/FilterBar";
import type { BlogMeta } from "@/lib/blogs";
import Link from "next/link";

const MotionLink = motion(Link);

function formatDate(dateStr: string) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

const PLACEHOLDER_PALETTES = [
  { from: "#0ea5e9", to: "#6366f1" }, // sky → indigo
  { from: "#8b5cf6", to: "#ec4899" }, // violet → pink
  { from: "#14b8a6", to: "#0ea5e9" }, // teal → sky
  { from: "#f59e0b", to: "#ef4444" }, // amber → red
  { from: "#10b981", to: "#3b82f6" }, // emerald → blue
];

function BlogPlaceholder({ title, index }: { title: string; index: number }) {
  const { from, to } =
    PLACEHOLDER_PALETTES[index % PLACEHOLDER_PALETTES.length];
  const initials = title
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  return (
    <div
      className="w-full h-full flex items-center justify-center relative overflow-hidden group-hover:scale-105 transition-transform duration-300"
      style={{ background: `linear-gradient(135deg, ${from}, ${to})` }}
    >
      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)",
          backgroundSize: "12px 12px",
        }}
      />
      <span className="relative font-black text-white/90 text-xl tracking-tight drop-shadow">
        {initials}
      </span>
    </div>
  );
}

export default function BlogsClient({ blogs }: { blogs: BlogMeta[] }) {
  const allTags = ["All", ...Array.from(new Set(blogs.flatMap((b) => b.tags)))];
  const [active, setActive] = useState("All");

  const filtered =
    active === "All" ? blogs : blogs.filter((b) => b.tags.includes(active));

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <PageHeader maxWidth="max-w-5xl">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="font-mono text-sky-500 dark:text-sky-400 text-sm tracking-widest uppercase mb-4"
        >
          Writing
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.07 }}
          className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 mb-6"
        >
          Things I&apos;ve written.
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.14 }}
          className="text-zinc-600 dark:text-zinc-500 max-w-md leading-relaxed mb-10"
        >
          Deep dives on systems, engineering patterns, and lessons learned the
          hard way.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.21 }}
          className="flex flex-wrap gap-10"
        >
          {[
            { value: blogs.length, label: "posts published" },
            { value: allTags.length - 1, label: "topics covered" },
          ].map(({ value, label }) => (
            <div key={label}>
              <p className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">{value}</p>
              <p className="font-mono text-xs text-zinc-500 mt-0.5">{label}</p>
            </div>
          ))}
        </motion.div>
      </PageHeader>

      {/* Tag filter */}
      <FilterBar
        tags={allTags}
        active={active}
        onSelect={setActive}
        layoutId="blogs-filter"
      />

      {/* Blog list */}
      <div className="max-w-5xl mx-auto px-6 py-16">
        <motion.p layout className="font-mono text-xs text-zinc-500 mb-8">
          {filtered.length} post{filtered.length !== 1 ? "s" : ""}
          {active !== "All" ? ` tagged "${active}"` : ""}
        </motion.p>

        <AnimatePresence mode="popLayout">
          <motion.div
            layout
            className="flex flex-col divide-y divide-zinc-100 dark:divide-zinc-800/60"
          >
            {filtered.map((blog, i) => (
              <MotionLink
                key={blog.slug}
                href={`/blogs/${blog.slug}`}
                layout
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.25, delay: i * 0.04 }}
                className="group flex flex-col sm:flex-row sm:items-start gap-4 py-8 hover:bg-zinc-50/50 dark:hover:bg-zinc-900/30 -mx-4 px-4 rounded-xl transition-colors duration-200"
              >
                {/* Mobile-only banner image */}
                <div className="sm:hidden w-full h-36 rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-800">
                  {blog.coverImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={blog.coverImage}
                      alt={blog.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <BlogPlaceholder title={blog.title} index={i} />
                  )}
                </div>

                {/* Date column */}
                <div className="sm:w-32 shrink-0">
                  <span className="font-mono text-xs text-zinc-400 dark:text-zinc-600">
                    {formatDate(blog.date)}
                  </span>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <h2 className="text-zinc-900 dark:text-zinc-100 font-semibold text-lg leading-snug group-hover:text-sky-600 dark:group-hover:text-sky-300 transition-colors duration-200">
                      {blog.title}
                    </h2>
                    <ArrowUpRight
                      size={18}
                      className="shrink-0 mt-0.5 text-zinc-300 dark:text-zinc-700 group-hover:text-sky-500 transition-colors duration-200"
                    />
                  </div>

                  <p className="text-zinc-500 dark:text-zinc-500 text-sm leading-relaxed mt-2 mb-4 line-clamp-2">
                    {blog.excerpt}
                  </p>

                  <div className="flex items-center gap-4 flex-wrap">
                    <span className="flex items-center gap-1.5 font-mono text-xs text-zinc-400">
                      <Clock size={11} />
                      {blog.readTime} min read
                    </span>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <Tag size={11} className="text-zinc-400" />
                      {blog.tags.map((tag) => (
                        <span
                          key={tag}
                          className="font-mono text-[11px] text-sky-600 dark:text-sky-400/70 bg-sky-500/8 border border-sky-500/15 dark:border-sky-500/10 px-2 py-0.5 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Thumbnail */}
                <div className="hidden sm:block shrink-0 w-28 h-20 rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-800">
                  {blog.coverImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={blog.coverImage}
                      alt={blog.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <BlogPlaceholder title={blog.title} index={i} />
                  )}
                </div>
              </MotionLink>
            ))}
          </motion.div>
        </AnimatePresence>

        {filtered.length === 0 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-zinc-400 dark:text-zinc-700 font-mono text-sm py-24"
          >
            No posts tagged with &ldquo;{active}&rdquo; yet.
          </motion.p>
        )}
      </div>
    </main>
  );
}
