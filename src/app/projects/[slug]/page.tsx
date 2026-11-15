import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageHero from "@/components/layout/PageHero";
import { WORK_PAGE } from "@/content/site";
import { getProject, projects } from "@/data/projects";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  return {
    title: project.name,
    description: project.summary,
  };
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-6 border-t border-line py-3 first:border-rule">
      <dt className="text-quiet">{label}</dt>
      <dd className="text-right">{value}</dd>
    </div>
  );
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const position = projects.indexOf(project);
  const next = projects[(position + 1) % projects.length];

  return (
    <>
      <PageHero
        anchor="work"
        parent={{ label: WORK_PAGE.kicker, href: "/projects" }}
        kicker={project.name}
        title={project.name}
        mode={project.mode}
        grade={project.grade}
        frameLabel={project.frameLabel}
        focusX={0.5}
        focusY={0.45}
        display
      >
        <p className="t-sub max-w-[46rem] font-normal text-body">
          {project.summary}
        </p>
      </PageHero>

      <div className="wrap flex flex-col gap-16 pt-10">
        {project.screens && (
          <section className="grid gap-x-6 gap-y-8 lg:grid-cols-12">
            <h2 className="t-label text-quiet lg:col-span-3">
              {project.screens.every((screen) => screen.paper)
                ? WORK_PAGE.diagrams
                : WORK_PAGE.screens}
            </h2>
            <div className="grid grid-cols-4 gap-4 lg:col-span-9">
              {project.screens.map((screen) => (
                <a
                  key={screen.src}
                  href={screen.src}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`${WORK_PAGE.enlarge}: ${screen.alt}`}
                  className={`group block overflow-hidden border border-line ${screen.paper ? "bg-paper p-4" : "bg-panel"} ${
                    screen.span === "narrow"
                      ? "col-span-2 sm:col-span-1"
                      : "col-span-4 sm:col-span-2"
                  }`}
                >
                  <Image
                    src={screen.src}
                    alt={screen.alt}
                    width={screen.width}
                    height={screen.height}
                    unoptimized={screen.src.endsWith(".svg")}
                    sizes="(min-width: 640px) 36vw, 100vw"
                    className="block h-auto w-full transition-transform duration-700 ease-reel group-hover:scale-[1.02]"
                  />
                </a>
              ))}
            </div>
          </section>
        )}

        <section className="grid gap-x-6 gap-y-8 lg:grid-cols-12">
          <h2 className="t-label text-quiet lg:col-span-3">{WORK_PAGE.why}</h2>
          <p className="t-lead text-body lg:col-span-5">{project.why}</p>
          <dl className="t-small lg:col-span-3 lg:col-start-10">
            <Fact
              label={WORK_PAGE.builtWith}
              value={project.stack.join(", ")}
            />
            <Fact label={WORK_PAGE.status} value={project.status} />
            <Fact label={WORK_PAGE.year} value={project.year} />
            {project.live && (
              <a
                href={project.live}
                className="flex justify-between border-t border-line py-4 font-semibold hover:opacity-70"
              >
                <span>{WORK_PAGE.live}</span>
                <span aria-hidden="true">↗</span>
              </a>
            )}
            {project.post && (
              <Link
                href={`/blogs/${project.post}`}
                className="flex justify-between border-t border-line py-4 font-semibold hover:opacity-70"
              >
                <span>{WORK_PAGE.post}</span>
                <span aria-hidden="true">→</span>
              </Link>
            )}
            {project.github && (
              <a
                href={project.github}
                className="flex justify-between border-y border-line py-4 font-semibold hover:opacity-70"
              >
                <span>{WORK_PAGE.source}</span>
                <span aria-hidden="true">↗</span>
              </a>
            )}
          </dl>
        </section>

        <section className="grid gap-x-6 gap-y-8 lg:grid-cols-12">
          <h2 className="t-label text-quiet lg:col-span-3">{WORK_PAGE.what}</h2>
          <ul className="grid gap-x-6 gap-y-8 sm:grid-cols-2 lg:col-span-9 xl:grid-cols-3">
            {project.features.map((feature) => (
              <li
                key={feature.name}
                className="flex flex-col gap-2 border-t border-paper pt-4"
              >
                <h3 className="t-sub">{feature.name}</h3>
                <p className="t-body text-body">{feature.line}</p>
              </li>
            ))}
          </ul>
        </section>

        <Link
          href={`/projects/${next.slug}`}
          className="group flex flex-wrap items-baseline justify-between gap-4 border-t border-paper py-8"
        >
          <span className="t-body text-quiet">{WORK_PAGE.next}</span>
          <span className="t-title transition-opacity duration-200 group-hover:opacity-70">
            {next.name}
          </span>
        </Link>
      </div>
    </>
  );
}
