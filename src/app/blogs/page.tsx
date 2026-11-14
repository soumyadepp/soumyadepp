import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import ChapterLinks from "@/components/layout/ChapterLinks";
import PageHero from "@/components/layout/PageHero";
import { CHAPTERS, GRADES, SITE, WRITING_PAGE } from "@/content/site";
import { formatMonth, getAllBlogs } from "@/lib/blogs";

export const metadata: Metadata = {
  title: `Writing | ${SITE.fullName}`,
  description: WRITING_PAGE.title,
};

export default function WritingPage() {
  const posts = getAllBlogs();

  return (
    <>
      <PageHero
        anchor="writing"
        kicker={WRITING_PAGE.kicker}
        title={WRITING_PAGE.title}
        mode="waves"
        grade={GRADES.paper}
        frameLabel={WRITING_PAGE.frameLabel}
      />

      <section className="wrap pt-6">
        {posts.length === 0 && (
          <p className="t-body border-t border-line py-6 text-quiet">
            {WRITING_PAGE.empty}
          </p>
        )}
        {posts.map((post, position) => (
          <Link
            key={post.slug}
            href={`/blogs/${post.slug}`}
            className={`reveal group grid gap-x-6 gap-y-2 border-t py-6 md:grid-cols-[11rem_9rem_1fr_14rem_5rem] md:items-center ${
              position === 0 ? "border-paper" : "border-line"
            }`}
          >
            <div className="relative hidden aspect-[16/10] overflow-hidden border border-line bg-panel md:block">
              {post.coverImage && (
                <Image
                  src={post.coverImage}
                  alt=""
                  fill
                  unoptimized
                  sizes="11rem"
                  className="tint object-cover"
                />
              )}
            </div>
            <span className="t-body text-body">{formatMonth(post.date)}</span>
            <h2 className="t-sub max-w-[44rem] transition-opacity duration-200 group-hover:opacity-70">
              {post.title}
            </h2>
            <span className="t-small text-quiet">
              {post.tags.slice(0, 2).join(", ")}
            </span>
            <span className="t-small text-quiet md:text-right">
              {post.readTime} {WRITING_PAGE.minutes}
            </span>
          </Link>
        ))}
        <div className="border-t border-rule" />
      </section>

      <ChapterLinks
        previous={{ label: CHAPTERS[3].name, href: CHAPTERS[3].href }}
        next={{ label: CHAPTERS[5].name, href: CHAPTERS[5].href }}
      />
    </>
  );
}
