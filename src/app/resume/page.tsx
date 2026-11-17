import type { Metadata } from "next";
import Link from "next/link";
import PrintButton from "@/components/resume/PrintButton";
import { CRUMB, RESUME_PAGE } from "@/content/site";
import { resume } from "@/data/resume";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Resume",
  description: resume.summary,
  path: "/resume",
});

function Heading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mt-3 border-b border-black pb-0.5 text-[11pt] font-bold tracking-wide uppercase">
      {children}
    </h2>
  );
}

export default function ResumePage() {
  return (
    <div className="min-h-screen bg-paper py-8 text-black print:bg-white print:py-0">
      <div className="mx-auto flex max-w-[210mm] items-center justify-between px-6 pb-4 print:hidden">
        <Link
          href="/"
          className="t-label flex items-center gap-2 py-3 hover:opacity-70"
        >
          <span aria-hidden="true">←</span>
          {CRUMB.home}
        </Link>
        <PrintButton />
      </div>

      <article className="resume mx-auto max-w-[210mm] bg-white px-[14mm] py-[12mm] print:max-w-none print:p-0">
        <header className="text-center">
          <h1 className="text-[20pt] leading-tight font-bold">{resume.name}</h1>
          <p className="text-[11pt]">{resume.title}</p>
          <p>
            {resume.location} |{" "}
            <a href={`mailto:${resume.email}`}>{resume.email}</a>
          </p>
          <p>
            {resume.links.map((link, position) => (
              <span key={link.href} className="whitespace-nowrap">
                {position > 0 && " | "}
                <a href={link.href}>{link.label}</a>
              </span>
            ))}
          </p>
        </header>

        <section>
          <Heading>{RESUME_PAGE.summaryLabel}</Heading>
          <p className="mt-1">{resume.summary}</p>
        </section>

        <section>
          <Heading>{RESUME_PAGE.experienceLabel}</Heading>
          {resume.roles.map((role) => (
            <div key={`${role.company}-${role.title}`} className="mt-1.5">
              <div className="flex justify-between gap-4">
                <h3 className="font-bold">
                  {role.title}, {role.company}, {role.location}
                </h3>
                <span className="shrink-0">{role.period}</span>
              </div>
              <ul className="list-disc pl-[5mm]">
                {role.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            </div>
          ))}
        </section>

        <section>
          <Heading>{RESUME_PAGE.projectsLabel}</Heading>
          {resume.projects.map((project) => (
            <div key={project.name} className="mt-1.5">
              <div className="flex justify-between gap-4">
                <h3>
                  <span className="font-bold">{project.name}</span> (
                  {project.stack})
                </h3>
                <span className="shrink-0">{project.link}</span>
              </div>
              <ul className="list-disc pl-[5mm]">
                {project.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            </div>
          ))}
        </section>

        <section>
          <Heading>{RESUME_PAGE.skillsLabel}</Heading>
          <ul className="mt-1">
            {resume.skills.map((group) => (
              <li key={group.label}>
                <span className="font-bold">{group.label}:</span> {group.items}
              </li>
            ))}
          </ul>
        </section>

        <section>
          <Heading>{RESUME_PAGE.educationLabel}</Heading>
          <div className="mt-1 flex justify-between gap-4">
            <p>
              <span className="font-bold">{resume.education.degree}</span>,{" "}
              {resume.education.institution}
            </p>
            <span className="shrink-0">{resume.education.period}</span>
          </div>
          <p>
            <span className="font-bold">
              {RESUME_PAGE.certificationsLabel}:
            </span>{" "}
            {resume.certifications}
          </p>
        </section>
      </article>
    </div>
  );
}
