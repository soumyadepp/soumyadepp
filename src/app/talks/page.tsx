import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import ChapterLinks from "@/components/layout/ChapterLinks";
import PageHero from "@/components/layout/PageHero";
import { CHAPTERS, GRADES, SITE, TALKS_PAGE } from "@/content/site";
import { talks } from "@/data/talks";

export const metadata: Metadata = {
  title: `Talks | ${SITE.fullName}`,
  description: TALKS_PAGE.title,
};

export default function TalksPage() {
  return (
    <>
      <PageHero
        anchor="talks"
        kicker={TALKS_PAGE.kicker}
        title={TALKS_PAGE.title}
        mode="spiral"
        grade={GRADES.moss}
        frameLabel={TALKS_PAGE.frameLabel}
      />

      <section className="wrap pt-6">
        {talks.map((talk, position) => (
          <Link
            key={talk.id}
            href={`/talks/${talk.id}`}
            className={`reveal group grid gap-x-6 gap-y-6 border-t py-8 md:grid-cols-12 md:items-center ${
              position === 0 ? "border-paper" : "border-line"
            }`}
          >
            <div className="relative aspect-[16/9] overflow-hidden bg-panel md:col-span-5">
              <Image
                src={talk.featured}
                alt={`${talk.title}, ${talk.event}`}
                fill
                sizes="(min-width: 768px) 40vw, 100vw"
                className="still object-cover transition-transform duration-700 ease-reel group-hover:scale-[1.03]"
              />
            </div>
            <div className="flex flex-col gap-4 md:col-span-6 md:col-start-7">
              <p className="t-small text-quiet">
                {[talk.date, talk.duration, talk.venue]
                  .filter(Boolean)
                  .join(" · ")}
              </p>
              <h2 className="t-heading transition-opacity duration-200 group-hover:opacity-70">
                {talk.title}
              </h2>
              <p className="t-body text-body">{talk.description}</p>
            </div>
          </Link>
        ))}
        <div className="border-t border-rule" />
      </section>

      <ChapterLinks
        previous={{ label: CHAPTERS[2].name, href: CHAPTERS[2].href }}
        next={{ label: CHAPTERS[4].name, href: CHAPTERS[4].href }}
      />
    </>
  );
}
