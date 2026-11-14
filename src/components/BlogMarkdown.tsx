import Image from "next/image";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";

/**
 * Renders a post's markdown. Styling comes from the prose-paper class on
 * the surrounding article.
 */
export default function BlogMarkdown({ content }: { content: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeSlug, rehypeHighlight]}
      components={{
        img: ({ src, alt }) =>
          typeof src === "string" ? (
            <Image
              src={src}
              alt={alt ?? ""}
              width={1200}
              height={675}
              unoptimized
              sizes="(min-width: 1024px) 680px, 100vw"
            />
          ) : null,
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
