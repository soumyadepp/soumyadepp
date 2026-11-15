import type { Metadata } from "next";
import Image from "next/image";
import ChapterLinks from "@/components/layout/ChapterLinks";
import PageHero from "@/components/layout/PageHero";
import {
  CHAPTERS,
  COMPANY_ORBITS,
  EXPERIENCE_PAGE,
  GRADES,
} from "@/content/site";
import { earlierRoles, engagements } from "@/data/experience";

export const metadata: Metadata = {
  title: "Experience",
  description: EXPERIENCE_PAGE.title,
};

export default function ExperiencePage() {
  return (
    <>
      <PageHero
        anchor="experience"
        kicker={EXPERIENCE_PAGE.kicker}
        title={EXPERIENCE_PAGE.title}
        mode="orbits"
        grade={GRADES.tungsten}
        frameLabel={EXPERIENCE_PAGE.frameLabel}
        badges={COMPANY_ORBITS}
        focusX={0.64}
        focusY={0.54}
      />

      <div className="wrap pt-6">
        {engagements.map((engagement) => (
          <section
            key={engagement.company}
            className={`reveal grid gap-x-6 gap-y-8 border-t py-12 lg:grid-cols-12 ${
              engagement.current ? "border-paper" : "border-line"
            }`}
          >
            <header className="flex flex-col gap-2 lg:col-span-4">
              <p className="t-label text-quiet">{engagement.span}</p>
              <div className="flex items-center gap-4">
                <Image
                  src={engagement.logo}
                  alt=""
                  width={48}
                  height={48}
                  className={`size-12 shrink-0 grayscale ${
                    engagement.logoTone === "inverted"
                      ? "mix-blend-screen invert"
                      : ""
                  }`}
                />
                <h2 className="t-heading">{engagement.company}</h2>
              </div>
              <ol className="mt-6 flex flex-col">
                {engagement.positions.map((position, index) => (
                  <li
                    key={position.title}
                    className="flex flex-col gap-0.5 border-t border-line py-3 last:border-b"
                  >
                    <span
                      className={`t-body font-semibold ${index === 0 ? "text-paper" : "text-body"}`}
                    >
                      {position.title}
                    </span>
                    <span className="t-small text-quiet">
                      {position.period}
                    </span>
                  </li>
                ))}
              </ol>
            </header>

            <div className="flex flex-col gap-8 lg:col-span-7 lg:col-start-6">
              <p className="t-sub font-normal text-paper">
                {engagement.summary}
              </p>
              {engagement.focus && (
                <dl className="flex flex-col">
                  {engagement.focus.map((item) => (
                    <div
                      key={item.label}
                      className="grid gap-x-6 gap-y-2 border-t border-paper py-5 sm:grid-cols-[11rem_1fr]"
                    >
                      <dt className="t-body font-semibold">{item.label}</dt>
                      <dd className="t-body text-body">{item.line}</dd>
                    </div>
                  ))}
                </dl>
              )}
              {engagement.highlights.length > 0 && (
                <ul className="flex flex-col">
                  {engagement.highlights.map((highlight) => (
                    <li
                      key={highlight}
                      className="t-body border-t border-line py-3 text-body last:border-b"
                    >
                      {highlight}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>
        ))}

        <section className="border-t border-line py-12">
          <h2 className="t-label pb-6 text-quiet">{EXPERIENCE_PAGE.earlier}</h2>
          {earlierRoles.map((role) => (
            <div
              key={role.company}
              className="grid gap-x-6 gap-y-1 border-t border-line py-5 last:border-b md:grid-cols-[5rem_18rem_1fr] md:items-baseline lg:grid-cols-12"
            >
              <span className="t-body text-quiet lg:col-span-1">
                {role.year}
              </span>
              <div className="flex flex-col lg:col-span-4">
                <span className="t-body font-semibold">{role.company}</span>
                <span className="t-small text-quiet">{role.title}</span>
              </div>
              <p className="t-body text-body lg:col-span-7">{role.line}</p>
            </div>
          ))}
        </section>
      </div>

      <ChapterLinks
        previous={{ label: CHAPTERS[0].name, href: "/" }}
        next={{ label: CHAPTERS[2].name, href: CHAPTERS[2].href }}
      />
    </>
  );
}
