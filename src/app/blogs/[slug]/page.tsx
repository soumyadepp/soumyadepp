import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import BlogMarkdown from "@/components/BlogMarkdown";
import Crumb from "@/components/layout/Crumb";
import { SITE, WRITING_PAGE } from "@/content/site";
import { formatDay, getAllBlogs, getBlogBySlug } from "@/lib/blogs";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getAllBlogs().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogBySlug(slug);
  if (!post) return {};
  return {
    title: `${post.title} | ${SITE.fullName}`,
    description: post.excerpt,
  };
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = getBlogBySlug(slug);
  if (!post) notFound();

  return (
    <>
      <header className="wrap grid gap-x-6 gap-y-10 pt-28 pb-14 md:pt-40 lg:grid-cols-12 lg:items-end">
        <div className="flex flex-col gap-5 lg:col-span-7">
          <Crumb
            anchor="writing"
            parent={{ label: WRITING_PAGE.kicker, href: "/blogs" }}
            label={formatDay(post.date)}
          />
          <h1 className="t-title max-w-[60rem]">{post.title}</h1>
          <p className="t-sub max-w-[46rem] font-normal text-body">
            {post.excerpt}
          </p>
        </div>
        {post.coverImage && (
          <div className="w-full max-w-[34rem] lg:col-span-4 lg:col-start-9 lg:justify-self-end">
            <Image
              src={post.coverImage}
              alt=""
              width={0}
              height={0}
              unoptimized
              priority
              sizes="(min-width: 1024px) 30vw, 100vw"
              className="block h-auto max-h-[26rem] w-full border border-line bg-panel object-contain"
            />
          </div>
        )}
      </header>

      <div className="on-paper bg-paper text-stage">
        <div className="wrap grid gap-x-6 gap-y-10 pt-16 pb-24 lg:grid-cols-12">
          <aside className="t-small flex flex-col gap-6 lg:sticky lg:top-8 lg:col-span-3 lg:self-start">
            <div className="flex flex-col gap-1">
              <span className="text-ink-soft">{WRITING_PAGE.published}</span>
              <span className="font-semibold">{formatDay(post.date)}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-ink-soft">{WRITING_PAGE.readingTime}</span>
              <span className="font-semibold">
                {post.readTime} {WRITING_PAGE.minutesLong}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-ink-soft">{WRITING_PAGE.topics}</span>
              <span className="font-semibold">{post.tags.join(", ")}</span>
            </div>
            <Link
              href="/blogs"
              className="self-start border-b-2 border-stage py-3 font-semibold hover:opacity-70"
            >
              {WRITING_PAGE.back}
            </Link>
          </aside>

          <article className="prose-paper min-w-0 lg:col-span-8 lg:col-start-5">
            <BlogMarkdown content={post.content} />
          </article>
        </div>
      </div>
    </>
  );
}
