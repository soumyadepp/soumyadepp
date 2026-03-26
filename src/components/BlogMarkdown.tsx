"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import rehypeSlug from "rehype-slug";
import Image from "next/image";
import { useState } from "react";
import type { Components } from "react-markdown";

/* ── Custom heading with anchor link ─────────────────────── */
function Heading({
  level,
  id,
  children,
}: {
  level: 1 | 2 | 3 | 4 | 5 | 6;
  id?: string;
  children?: React.ReactNode;
}) {
  const Tag = `h${level}` as "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

  const sizeMap = {
    1: "text-3xl sm:text-4xl font-black mt-12 mb-6 tracking-tight",
    2: "text-2xl sm:text-3xl font-bold mt-10 mb-5 tracking-tight",
    3: "text-xl sm:text-2xl font-semibold mt-8 mb-4",
    4: "text-lg font-semibold mt-6 mb-3",
    5: "text-base font-semibold mt-4 mb-2",
    6: "text-sm font-semibold mt-4 mb-2 uppercase tracking-widest",
  } as const;

  const colorMap = {
    1: "text-zinc-900 dark:text-zinc-50",
    2: "text-zinc-800 dark:text-zinc-100",
    3: "text-zinc-800 dark:text-zinc-100",
    4: "text-zinc-700 dark:text-zinc-200",
    5: "text-zinc-700 dark:text-zinc-200",
    6: "text-sky-600 dark:text-sky-400",
  } as const;

  const borderMap = {
    1: "border-b border-zinc-200 dark:border-zinc-800 pb-3",
    2: "border-b border-zinc-100 dark:border-zinc-800/60 pb-2",
    3: "",
    4: "",
    5: "",
    6: "",
  } as const;

  return (
    <Tag
      id={id}
      className={`group relative ${sizeMap[level]} ${colorMap[level]} ${borderMap[level]}`}
    >
      {id && (
        <a
          href={`#${id}`}
          aria-label="Anchor link"
          className="absolute -left-5 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-sky-400 dark:text-sky-500 text-lg font-normal"
        >
          #
        </a>
      )}
      {children}
    </Tag>
  );
}

/* ── Smart image with Next.js optimization ────────────────── */
function BlogImage({ src, alt }: { src?: string; alt?: string }) {
  if (!src) return null;

  const isExternal = src.startsWith("http://") || src.startsWith("https://");

  return (
    <figure className="my-10 not-prose">
      <div
        className="relative w-full rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800"
      >
        {isExternal ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={src}
            alt={alt ?? ""}
            className="w-full h-auto rounded-xl"
          />
        ) : (
          <Image
            src={src}
            alt={alt ?? ""}
            width={1200}
            height={630}
            className="w-full h-auto rounded-xl"
          />
        )}
      </div>
      {alt && (
        <figcaption className="text-center text-xs text-zinc-400 dark:text-zinc-600 mt-3 font-mono">
          {alt}
        </figcaption>
      )}
    </figure>
  );
}

/* ── Code block with copy button ──────────────────────────── */
function CodeBlock({
  children,
  className,
  inline,
}: {
  children?: React.ReactNode;
  className?: string;
  inline?: boolean;
}) {
  const [copied, setCopied] = useState(false);

  if (inline) {
    return (
      <code className="font-mono text-[0.875em] bg-sky-500/10 dark:bg-sky-500/15 text-sky-700 dark:text-sky-300 border border-sky-500/20 dark:border-sky-500/15 px-1.5 py-0.5 rounded">
        {children}
      </code>
    );
  }

  const language = className?.replace("language-", "") ?? "";
  const codeText =
    typeof children === "string"
      ? children
      : Array.isArray(children)
      ? children.join("")
      : String(children ?? "");

  const handleCopy = () => {
    navigator.clipboard.writeText(codeText.trim()).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="relative group my-8 rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-700/60 bg-zinc-950">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-zinc-800 bg-zinc-900">
        <span className="font-mono text-[11px] text-zinc-500 uppercase tracking-widest">
          {language || "code"}
        </span>
        <button
          onClick={handleCopy}
          className="font-mono text-[11px] text-zinc-500 hover:text-zinc-200 transition-colors px-2 py-0.5 rounded border border-zinc-700 hover:border-zinc-500"
          aria-label="Copy code"
        >
          {copied ? "copied!" : "copy"}
        </button>
      </div>

      {/* Code */}
      <pre className="overflow-x-auto p-5 text-sm leading-relaxed">
        <code className={className}>{children}</code>
      </pre>
    </div>
  );
}

/* ── Main component ───────────────────────────────────────── */
const components: Components = {
  h1: ({ id, children }) => <Heading level={1} id={id}>{children}</Heading>,
  h2: ({ id, children }) => <Heading level={2} id={id}>{children}</Heading>,
  h3: ({ id, children }) => <Heading level={3} id={id}>{children}</Heading>,
  h4: ({ id, children }) => <Heading level={4} id={id}>{children}</Heading>,
  h5: ({ id, children }) => <Heading level={5} id={id}>{children}</Heading>,
  h6: ({ id, children }) => <Heading level={6} id={id}>{children}</Heading>,

  img: ({ src, alt }) => <BlogImage src={typeof src === "string" ? src : undefined} alt={alt} />,

  code: ({ children, className, ...props }) => {
    const isInline = !className && typeof children === "string" && !children.includes("\n");
    return (
      <CodeBlock className={className} inline={isInline} {...props}>
        {children}
      </CodeBlock>
    );
  },

  pre: ({ children }) => <>{children}</>,

  p: ({ children, node }) => {
    const firstChild = node?.children?.[0] as { type?: string; tagName?: string } | undefined;
    if (
      node?.children?.length === 1 &&
      firstChild?.type === "element" &&
      firstChild?.tagName === "img"
    ) {
      return <>{children}</>;
    }
    return (
      <p className="text-zinc-700 dark:text-zinc-300 leading-[1.85] text-base mb-5">{children}</p>
    );
  },

  a: ({ href, children }) => (
    <a
      href={href}
      target={href?.startsWith("http") ? "_blank" : undefined}
      rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
      className="text-sky-600 dark:text-sky-400 underline underline-offset-3 decoration-sky-500/40 hover:decoration-sky-500 transition-colors"
    >
      {children}
    </a>
  ),

  blockquote: ({ children }) => (
    <blockquote className="my-6 pl-5 border-l-4 border-sky-500/50 dark:border-sky-400/40 bg-sky-500/5 dark:bg-sky-500/5 py-3 pr-4 rounded-r-lg">
      <div className="text-zinc-600 dark:text-zinc-400 italic text-[0.95rem] leading-relaxed [&>p]:mb-0">
        {children}
      </div>
    </blockquote>
  ),

  ul: ({ children }) => (
    <ul className="my-5 ml-5 space-y-2 list-none">{children}</ul>
  ),

  ol: ({ children }) => (
    <ol className="my-5 ml-5 space-y-2 list-decimal [&>li]:pl-1">{children}</ol>
  ),

  li: ({ children }) => (
    <li className="text-zinc-700 dark:text-zinc-300 leading-relaxed flex gap-2.5 before:content-['—'] before:text-sky-400 before:shrink-0 before:mt-0.5">
      <span>{children}</span>
    </li>
  ),

  table: ({ children }) => (
    <div className="my-8 overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-700/60">
      <table className="w-full text-sm border-collapse">{children}</table>
    </div>
  ),

  thead: ({ children }) => (
    <thead className="bg-zinc-100 dark:bg-zinc-800/60">{children}</thead>
  ),

  tbody: ({ children }) => (
    <tbody className="divide-y divide-zinc-200 dark:divide-zinc-700/60">{children}</tbody>
  ),

  tr: ({ children }) => <tr className="hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors">{children}</tr>,

  th: ({ children }) => (
    <th className="px-4 py-3 text-left font-mono text-xs uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
      {children}
    </th>
  ),

  td: ({ children }) => (
    <td className="px-4 py-3 text-zinc-700 dark:text-zinc-300">{children}</td>
  ),

  hr: () => (
    <hr className="my-12 border-none h-px bg-zinc-200 dark:bg-zinc-800" />
  ),

  strong: ({ children }) => (
    <strong className="font-semibold text-zinc-900 dark:text-zinc-100">{children}</strong>
  ),

  em: ({ children }) => (
    <em className="italic text-zinc-600 dark:text-zinc-400">{children}</em>
  ),
};

export default function BlogMarkdown({ content }: { content: string }) {
  return (
    <article className="max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSlug, rehypeHighlight]}
        components={components}
      >
        {content}
      </ReactMarkdown>
    </article>
  );
}
