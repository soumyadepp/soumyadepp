import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import ContactPanel from "@/components/contact/ContactPanel";
import PageHero from "@/components/layout/PageHero";
import SubjectPhoto from "@/components/photo/SubjectPhoto";
import { ABOUT_PAGE, GRADES, SITE } from "@/content/site";
import { talks } from "@/data/talks";

export const metadata: Metadata = {
  title: `About | ${SITE.fullName}`,
  description: ABOUT_PAGE.lead,
};

export default function AboutPage() {
  const facts = [
    ...ABOUT_PAGE.facts,
    { figure: String(talks.length), ...ABOUT_PAGE.talksFact },
  ];

  return (
    <>
      <PageHero
        anchor="intro"
        kicker={ABOUT_PAGE.kicker}
        title={ABOUT_PAGE.title}
        mode="contours"
        grade={GRADES.tungsten}
        frameLabel={ABOUT_PAGE.frameLabel}
      />

      <section className="wrap grid gap-x-6 gap-y-10 pt-10 pb-24 lg:grid-cols-12 lg:items-start">
        <div className="relative aspect-[4/5] overflow-hidden bg-panel lg:sticky lg:top-8 lg:col-span-5">
          <SubjectPhoto
            sizes="(min-width: 1024px) 40vw, 100vw"
            fit="object-cover object-[38%_50%]"
            priority
          />
        </div>

        <div className="flex flex-col gap-20 lg:col-span-6 lg:col-start-7">
          <p className="t-heading font-normal text-body">{ABOUT_PAGE.lead}</p>

          <div className="flex flex-col gap-6">
            <h2 className="t-label text-quiet">{ABOUT_PAGE.storyLabel}</h2>
            {ABOUT_PAGE.paragraphs.map((paragraph) => (
              <p key={paragraph} className="t-lead max-w-[38rem] text-body">
                {paragraph}
              </p>
            ))}
          </div>

          <div>
            <h2 className="t-label pb-4 text-quiet">
              {ABOUT_PAGE.skillsLabel}
            </h2>
            <dl>
              {ABOUT_PAGE.skills.map((group) => (
                <div
                  key={group.label}
                  className="t-body grid gap-x-6 gap-y-1 border-t border-line py-4 last:border-b sm:grid-cols-[12rem_1fr]"
                >
                  <dt className="font-semibold">{group.label}</dt>
                  <dd className="text-body">{group.items.join(", ")}</dd>
                </div>
              ))}
            </dl>
          </div>

          <dl className="grid grid-cols-2 gap-x-6">
            {facts.map((fact) => (
              <div
                key={fact.line}
                className="flex flex-col gap-3 border-t border-paper py-6"
              >
                <dt className="flex flex-wrap items-baseline gap-x-2">
                  <span className="t-display">{fact.figure}</span>
                  {fact.unit && (
                    <span className="t-body text-quiet">{fact.unit}</span>
                  )}
                </dt>
                <dd className="t-body max-w-[16rem] text-body">{fact.line}</dd>
              </div>
            ))}
          </dl>

          <div className="flex flex-col gap-4">
            <h2 className="t-label text-quiet">{ABOUT_PAGE.stageLabel}</h2>
            <Link href="/talks" className="group grid grid-cols-3 gap-3">
              {talks.slice(0, 3).map((talk) => (
                <div
                  key={talk.id}
                  className="relative aspect-[4/5] overflow-hidden bg-panel"
                >
                  <Image
                    src={talk.featured}
                    alt={`${talk.title}, ${talk.event}`}
                    fill
                    sizes="(min-width: 1024px) 16vw, 33vw"
                    className="still object-cover transition-transform duration-700 ease-reel group-hover:scale-[1.04]"
                  />
                </div>
              ))}
            </Link>
          </div>

          <div className="flex flex-col gap-4">
            <h2 className="t-label text-quiet">{ABOUT_PAGE.outsideLabel}</h2>
            <p className="t-lead max-w-[38rem] text-body">
              {ABOUT_PAGE.outside}
            </p>
          </div>
        </div>
      </section>

      <ContactPanel variant="section" />
    </>
  );
}
