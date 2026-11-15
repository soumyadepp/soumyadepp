import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import ChapterLinks from "@/components/layout/ChapterLinks";
import PageHero from "@/components/layout/PageHero";
import Frame from "@/components/reel/Frame";
import { CHAPTERS, GRADES, SITE, WORK_PAGE } from "@/content/site";
import { projects } from "@/data/projects";

export const metadata: Metadata = {
  title: `Work | ${SITE.fullName}`,
  description: WORK_PAGE.note,
};

export default function WorkPage() {
  const featured = projects.filter((project) => project.featured);
  const rest = projects.filter((project) => !project.featured);

  return (
    <>
      <PageHero
        anchor="work"
        kicker={WORK_PAGE.kicker}
        title={WORK_PAGE.title}
        mode="broker"
        grade={GRADES.sodium}
        frameLabel={WORK_PAGE.frameLabel}
      >
        <p className="t-lead max-w-[40rem] text-body">{WORK_PAGE.note}</p>
      </PageHero>

      <section className="wrap pt-6">
        {featured.map((project, position) => (
          <Link
            key={project.slug}
            href={`/projects/${project.slug}`}
            className={`reveal group grid gap-x-6 gap-y-5 border-t py-7 md:grid-cols-[minmax(0,26rem)_1fr] md:items-center lg:grid-cols-[minmax(0,28rem)_1fr_12rem] ${
              position === 0 ? "border-paper" : "border-line"
            }`}
          >
            <div
              className={`relative aspect-[16/9] overflow-hidden border border-line ${
                !project.cover && project.screens?.[0].paper
                  ? "bg-paper"
                  : "bg-stage"
              }`}
            >
              {project.cover ? (
                <Image
                  src={project.cover}
                  alt=""
                  fill
                  unoptimized
                  sizes="(min-width: 768px) 28rem, 100vw"
                  className="tint object-cover transition-transform duration-700 ease-reel group-hover:scale-[1.03]"
                />
              ) : project.screens ? (
                <Image
                  src={project.screens[0].src}
                  alt={project.screens[0].alt}
                  fill
                  unoptimized={project.screens[0].src.endsWith(".svg")}
                  sizes="(min-width: 768px) 28rem, 100vw"
                  className={`transition-transform duration-700 ease-reel group-hover:scale-[1.03] ${
                    project.screens[0].paper
                      ? "object-contain p-3"
                      : "tint object-cover object-top"
                  }`}
                />
              ) : (
                <Frame
                  mode={project.mode}
                  grade={project.grade}
                  label={project.frameLabel}
                  focusX={0.5}
                  focusY={0.5}
                />
              )}
            </div>
            <div className="flex flex-col gap-3">
              <h2 className="t-heading transition-opacity duration-200 group-hover:opacity-70">
                {project.name}
              </h2>
              <p className="t-body max-w-[28rem] text-body">
                {project.summary}
              </p>
            </div>
            <div className="t-small flex flex-col gap-1 text-quiet md:col-start-2 lg:col-start-3 lg:text-right">
              <span>{project.stack.slice(0, 2).join(", ")}</span>
              <span>{project.status}</span>
            </div>
          </Link>
        ))}
      </section>

      <section className="wrap pt-16">
        <h2 className="t-label pb-4 text-quiet">{WORK_PAGE.more}</h2>
        {rest.map((project) => (
          <Link
            key={project.slug}
            href={`/projects/${project.slug}`}
            className="reveal group grid gap-x-6 gap-y-3 border-t border-line py-6 md:grid-cols-[10rem_16rem_1fr_6rem] md:items-center"
          >
            <div className="relative aspect-[16/9] overflow-hidden border border-line bg-stage">
              {project.cover ? (
                <Image
                  src={project.cover}
                  alt=""
                  fill
                  unoptimized
                  sizes="(min-width: 768px) 10rem, 100vw"
                  className="tint object-cover"
                />
              ) : project.screens ? (
                <Image
                  src={project.screens[0].src}
                  alt={project.screens[0].alt}
                  fill
                  unoptimized={project.screens[0].src.endsWith(".svg")}
                  sizes="(min-width: 768px) 10rem, 100vw"
                  className="tint object-cover object-top"
                />
              ) : (
                <Frame
                  mode={project.mode}
                  grade={project.grade}
                  label={project.frameLabel}
                  focusX={0.5}
                  focusY={0.5}
                />
              )}
            </div>
            <h3 className="t-sub transition-opacity duration-200 group-hover:opacity-70">
              {project.name}
            </h3>
            <p className="t-body text-body">{project.summary}</p>
            <span className="t-small text-quiet md:text-right">
              {project.stack[0]}
            </span>
          </Link>
        ))}
        <div className="border-t border-rule" />
      </section>

      <ChapterLinks
        previous={{ label: CHAPTERS[1].name, href: CHAPTERS[1].href }}
        next={{ label: CHAPTERS[3].name, href: CHAPTERS[3].href }}
      />
    </>
  );
}
