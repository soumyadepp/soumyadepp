"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";
import { useTheme } from "next-themes";
import { MapPin, Award, BookOpen, BadgeCheck } from "lucide-react";
import {
  SiReact,
  SiNextdotjs,
  SiTypescript,
  SiRedux,
  SiFlutter,
  SiNodedotjs,
  SiPython,
  SiFirebase,
  SiGooglecloud,
  SiDocker,
  SiGit,
  SiSolidity,
  SiFigma,
  SiRust,
  SiMapbox,
  SiThreedotjs,
  SiLinear,
  SiNotion,
  SiFastapi,
  SiRubyonrails,
  SiJira,
  SiConfluence,
  SiBitbucket,
  SiTerraform,
} from "react-icons/si";
import type { IconType } from "react-icons";

type SkillMeta = { icon?: IconType; color: string; lightColor?: string };

const skillMeta: Record<string, SkillMeta> = {
  React: { icon: SiReact, color: "#61DAFB" },
  "Next.js": { icon: SiNextdotjs, color: "#ffffff", lightColor: "#000000" },
  TypeScript: { icon: SiTypescript, color: "#3178C6" },
  Redux: { icon: SiRedux, color: "#764ABC" },
  Flutter: { icon: SiFlutter, color: "#54C5F8" },
  "Node.js": { icon: SiNodedotjs, color: "#6DA55F" },
  FastAPI: { icon: SiFastapi, color: "#009688" },
  "Ruby on Rails": { icon: SiRubyonrails, color: "#CC0000" },
  Python: { icon: SiPython, color: "#3776AB" },
  Rust: { icon: SiRust, color: "#CE422B" },
  "REST APIs": { color: "#6EE7B7" },
  Firebase: { icon: SiFirebase, color: "#FFCA28" },
  "Google Cloud Run": { icon: SiGooglecloud, color: "#4285F4" },
  "Google App Engine": { icon: SiGooglecloud, color: "#4285F4" },
  "Cloud Firestore": { icon: SiFirebase, color: "#FFCA28" },
  "AWS Lambda": { color: "#FF9900" },
  "AWS EC2": { color: "#FF9900" },
  "AWS Cognito": { color: "#FF9900" },
  "AWS CloudFormation": { color: "#FF9900" },
  Docker: { icon: SiDocker, color: "#2496ED" },
  Git: { icon: SiGit, color: "#F05032" },
  Solidity: { icon: SiSolidity, color: "#818CF8" },
  "System Design": { color: "#A78BFA" },
  Mapbox: { icon: SiMapbox, color: "#1FBAD6" },
  "Three.js": { icon: SiThreedotjs, color: "#049EF4" },
  Tippecanoe: { color: "#34D399" },
  BigQuery: { icon: SiGooglecloud, color: "#4285F4" },
  TanStack: { color: "#EF4444" },
  Linear: { icon: SiLinear, color: "#5E6AD2" },
  Notion: { icon: SiNotion, color: "#ffffff", lightColor: "#000000" },
  Jira: { icon: SiJira, color: "#0052CC" },
  Confluence: { icon: SiConfluence, color: "#0052CC" },
  Bitbucket: { icon: SiBitbucket, color: "#0052CC" },
  Figma: { icon: SiFigma, color: "#F24E1E" },
  Terraform: { icon: SiTerraform, color: "#844FEC" },
};

type CategoryConfig = { accent: string; lightAccent: string };
const categoryConfig: Record<string, CategoryConfig> = {
  Frontend: { accent: "#38BDF8", lightAccent: "#0284C7" },
  Backend: { accent: "#34D399", lightAccent: "#059669" },
  "Cloud & Infra": { accent: "#818CF8", lightAccent: "#4F46E5" },
  "Tools & Others": { accent: "#FBBF24", lightAccent: "#B45309" },
};
import PageHeader from "@/components/layout/PageHeader";

const skillCategories = [
  {
    label: "Frontend",
    skills: [
      "React",
      "Next.js",
      "TypeScript",
      "Redux",
      "Flutter",
      "Three.js",
      "TanStack",
      "Mapbox",
    ],
  },
  {
    label: "Backend",
    skills: [
      "Node.js",
      "FastAPI",
      "Ruby on Rails",
      "Python",
      "Rust",
      "REST APIs",
      "Firebase",
    ],
  },
  {
    label: "Cloud & Infra",
    skills: [
      "Google Cloud Run",
      "Google App Engine",
      "Cloud Firestore",
      "AWS Lambda",
      "AWS EC2",
      "AWS Cognito",
      "AWS CloudFormation",
      "Docker",
      "Terraform",
      "BigQuery",
      "Tippecanoe",
    ],
  },
  {
    label: "Tools & Others",
    skills: [
      "Git",
      "Solidity",
      "System Design",
      "Linear",
      "Notion",
      "Figma",
      "Jira",
      "Confluence",
      "Bitbucket",
    ],
  },
];

const certifications = [
  { title: "AlgoExpert Certification", issuer: "AlgoExpert" },
  { title: "Foundations of UX Design", issuer: "Google" },
];

const awards = [
  {
    title: "World Finalist – Marrs Spelling Bee",
    description:
      "Qualified and competed as a world finalist in the Marrs Spelling Bee 2012 held in Abu Dhabi, UAE.",
  },
];

const education = {
  degree: "B.Tech – Information Technology",
  institution: "Dharmsinh Desai University",
  period: "2019 – 2023",
};

function TiltImage() {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { stiffness: 150, damping: 20, mass: 0.5 };
  const rotateX = useSpring(
    useTransform(y, [-0.5, 0.5], [10, -10]),
    springConfig,
  );
  const rotateY = useSpring(
    useTransform(x, [-0.5, 0.5], [-10, 10]),
    springConfig,
  );
  const glareX = useTransform(x, [-0.5, 0.5], ["0%", "100%"]);
  const glareY = useTransform(y, [-0.5, 0.5], ["0%", "100%"]);

  function onMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  function onMouseLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
        perspective: 800,
      }}
      className="hidden md:block relative rounded-xl w-full max-w-sm lg:max-w-md aspect-3/4 overflow-hidden ring-1 ring-sky-500/25 cursor-pointer"
    >
      <Image
        src="/images/profile.png"
        alt="Soumyadeep Ghosh"
        fill
        className="object-cover object-top"
        sizes="(max-width: 1024px) 45vw, 420px"
        priority
      />
      {/* Base gradient overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(to top, rgba(0,0,0,0.35) 0%, transparent 50%)",
        }}
      />
      {/* Glare overlay */}
      <motion.div
        className="absolute inset-0 pointer-events-none rounded-xl"
        style={{
          background: useTransform(
            [glareX, glareY],
            ([gx, gy]) =>
              `radial-gradient(circle at ${gx} ${gy}, rgba(255,255,255,0.12) 0%, transparent 65%)`,
          ),
        }}
      />
    </motion.div>
  );
}

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 },
};

export default function AboutPage() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <main className="min-h-screen bg-background">
      {/* ── Hero ── */}
      <PageHeader maxWidth="max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid md:grid-cols-2 gap-10 md:gap-16 items-center"
        >
          {/* Text — shown second on mobile via order, first on desktop */}
          <div className="order-2 md:order-1">
            <p className="font-mono text-sky-500 dark:text-sky-400 text-sm mb-4 tracking-widest uppercase">
              about me
            </p>
            <h1 className="text-4xl sm:text-5xl md:text-5xl lg:text-6xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight mb-5 leading-tight">
              The person
              <br />
              behind the code.
            </h1>
            <p className="text-zinc-600 dark:text-zinc-400 text-base sm:text-lg mb-5 leading-relaxed">
              Software engineer passionate about building products that solve
              real problems and making an impact through code.
            </p>
            <div className="flex items-center gap-2 text-zinc-500 text-sm mb-6">
              <MapPin size={14} />
              <span>Ahmedabad, Gujarat, India</span>
            </div>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4">
              Over the last ~3 years I&apos;ve shipped products across AEC,
              mental health, smart manufacturing, and logistics, owning the full
              journey from ideation to production. I believe in building systems
              that are elegant, reliable, and thoughtfully designed.
            </p>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed mb-8">
              Beyond code, I&apos;m endlessly curious. Chess since age 4 taught
              me patience and strategy. Music (guitar, keyboard), sports
              (basketball, cricket), and visual arts (sketching, painting,
              cooking) keep my creativity flowing. These diverse interests shape
              how I approach problems, bringing perspective beyond the screen.
            </p>

            {/* Stats */}
            <div className="flex gap-8 sm:gap-10 pt-8 border-t border-zinc-200 dark:border-zinc-800">
              {[
                { value: "3+", label: "years experience" },
                { value: "10+", label: "Projects" },
                { value: "3+", label: "Domains" },
              ].map(({ value, label }) => (
                <div key={label}>
                  <p className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-zinc-100">
                    {value}
                  </p>
                  <p className="font-mono text-xs text-zinc-500 mt-1">
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Photo — shown first on mobile */}
          <div className="order-1 md:order-2 flex justify-center md:justify-end">
            {/* Mobile: centered with decorative rings */}
            <div className="md:hidden relative flex items-center justify-center">
              <div className="absolute w-56 h-56 border border-dashed border-sky-500/30 animate-[spin_25s_linear_infinite]" />
              <div className="absolute w-56 h-56 border border-sky-500/15" />
              <div className="absolute w-56 h-56 bg-sky-600/10 blur-2xl" />
              <div className="relative w-48 h-48 ring-2 ring-sky-500 ring-offset-4 ring-offset-zinc-50 dark:ring-offset-zinc-950 overflow-hidden z-10">
                <Image
                  src="/images/profile.png"
                  alt="Soumyadeep Ghosh"
                  fill
                  className="object-cover"
                  sizes="192px"
                  priority
                />
              </div>
            </div>

            {/* Desktop: large portrait with tilt */}
            <TiltImage />
          </div>
        </motion.div>
      </PageHeader>

      {/* ── Content ── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        {/* Skills */}
        <motion.div {...fadeUp} className="mb-14 md:mb-24">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-2 flex items-center gap-4">
            Skills
            <span className="flex-1 h-px bg-zinc-200 dark:bg-zinc-800 ml-4" />
          </h2>
          <p className="font-mono text-zinc-500 text-sm mb-8 sm:mb-10">
            {"// technologies I work with, grouped by domain"}
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            {skillCategories.map((cat, i) => {
              const cfg = categoryConfig[cat.label] ?? {
                accent: "#38BDF8",
                glow: "rgba(56,189,248,0.08)",
              };
              return (
                <motion.div
                  key={cat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                  className="bg-white dark:bg-zinc-900/70 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 transition-all duration-300 hover:shadow-md hover:shadow-black/5 dark:hover:shadow-black/20"
                >
                  {/* Category label — darker in light mode, lighter in dark mode */}
                  <p
                    className="font-mono text-[11px] uppercase tracking-widest mb-4 font-semibold dark:hidden"
                    style={{ color: cfg.lightAccent }}
                  >
                    {cat.label}
                  </p>
                  <p
                    className="font-mono text-[11px] uppercase tracking-widest mb-4 font-semibold hidden dark:block"
                    style={{ color: cfg.accent }}
                  >
                    {cat.label}
                  </p>

                  {/* Skill chips */}
                  <div className="flex flex-wrap gap-2">
                    {cat.skills.map((skill) => {
                      const meta = skillMeta[skill] ?? { color: "#94A3B8" };
                      const Icon = meta.icon;
                      const iconColor = isDark
                        ? meta.color
                        : (meta.lightColor ?? meta.color);
                      return (
                        <span
                          key={skill}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-zinc-700 dark:text-zinc-200"
                          style={{
                            background: `${iconColor}18`,
                            border: `1px solid ${iconColor}50`,
                          }}
                        >
                          {Icon ? (
                            <Icon size={12} style={{ color: iconColor }} />
                          ) : (
                            <span
                              className="w-1.5 h-1.5 rounded-full shrink-0"
                              style={{ background: iconColor }}
                            />
                          )}
                          {skill}
                        </span>
                      );
                    })}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Education */}
        <motion.div {...fadeUp} className="mb-14 md:mb-24">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-10 flex items-center gap-4">
            Education
            <span className="flex-1 h-px bg-zinc-200 dark:bg-zinc-800 ml-4" />
          </h2>
          <div className="flex items-start gap-5 bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors">
            <div className="mt-1 p-2.5 bg-sky-500/10 rounded-lg border border-sky-500/20">
              <BookOpen size={20} className="text-sky-500 dark:text-sky-400" />
            </div>
            <div>
              <p className="font-mono text-xs text-sky-500 dark:text-sky-400 uppercase tracking-widest mb-1">
                {education.period}
              </p>
              <h3 className="text-zinc-900 dark:text-zinc-100 font-semibold text-lg">
                {education.degree}
              </h3>
              <p className="text-zinc-500 text-sm mt-0.5">
                {education.institution}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Certifications & Awards */}
        <motion.div {...fadeUp} className="mb-14 md:mb-24">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-10 flex items-center gap-4">
            Certifications &amp; Awards
            <span className="flex-1 h-px bg-zinc-200 dark:bg-zinc-800 ml-4" />
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {certifications.map((cert, i) => (
              <motion.div
                key={cert.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="flex items-start gap-4 bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors"
              >
                <div className="mt-0.5 p-2 bg-sky-500/10 rounded-lg border border-sky-500/20 shrink-0">
                  <BadgeCheck
                    size={16}
                    className="text-sky-500 dark:text-sky-400"
                  />
                </div>
                <div>
                  <p className="text-zinc-900 dark:text-zinc-100 font-medium text-sm">
                    {cert.title}
                  </p>
                  <p className="text-zinc-500 text-xs mt-0.5">{cert.issuer}</p>
                </div>
              </motion.div>
            ))}
            {awards.map((award, i) => (
              <motion.div
                key={award.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.4,
                  delay: (certifications.length + i) * 0.08,
                }}
                className="flex items-start gap-4 bg-white dark:bg-zinc-900/60 border border-amber-200 dark:border-amber-500/20 rounded-xl p-5 hover:border-amber-300 dark:hover:border-amber-500/40 transition-colors"
              >
                <div className="mt-0.5 p-2 bg-amber-500/10 rounded-lg border border-amber-500/20 shrink-0">
                  <Award
                    size={16}
                    className="text-amber-500 dark:text-amber-400"
                  />
                </div>
                <div>
                  <p className="text-zinc-900 dark:text-zinc-100 font-medium text-sm">
                    {award.title}
                  </p>
                  <p className="text-zinc-500 text-xs mt-0.5 leading-relaxed">
                    {award.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Interests */}
        <motion.div {...fadeUp} className="mb-14 md:mb-24">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-2 flex items-center gap-4">
            Interests & Passions
            <span className="flex-1 h-px bg-zinc-200 dark:bg-zinc-800 ml-4" />
          </h2>
          <p className="font-mono text-zinc-500 text-sm mb-8 sm:mb-10">
            {"// life beyond the code"}
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                title: "Chess",
                description:
                  "Playing since age 4. Strategy, patience, and long-term thinking.",
                color: "sky",
              },
              {
                title: "Music",
                description:
                  "Guitar and keyboard. A creative outlet that keeps me grounded.",
                color: "emerald",
              },
              {
                title: "Sports",
                description:
                  "Basketball and cricket. Team dynamics and competitive spirit.",
                color: "violet",
              },
              {
                title: "Visual Arts",
                description:
                  "Sketching and painting. Expressing ideas beyond words.",
                color: "amber",
              },
              {
                title: "Cooking",
                description:
                  "Experimenting with flavors and techniques. Precision meets creativity.",
                color: "rose",
              },
              {
                title: "Learning",
                description:
                  "Constantly exploring new ideas, technologies, and perspectives.",
                color: "cyan",
              },
            ].map((interest, i) => {
              const colorMap: Record<
                string,
                { bg: string; border: string; accent: string }
              > = {
                sky: {
                  bg: "bg-sky-50 dark:bg-sky-950/30",
                  border: "border-sky-200 dark:border-sky-900/50",
                  accent: "text-sky-600 dark:text-sky-400",
                },
                emerald: {
                  bg: "bg-emerald-50 dark:bg-emerald-950/30",
                  border: "border-emerald-200 dark:border-emerald-900/50",
                  accent: "text-emerald-600 dark:text-emerald-400",
                },
                violet: {
                  bg: "bg-violet-50 dark:bg-violet-950/30",
                  border: "border-violet-200 dark:border-violet-900/50",
                  accent: "text-violet-600 dark:text-violet-400",
                },
                amber: {
                  bg: "bg-amber-50 dark:bg-amber-950/30",
                  border: "border-amber-200 dark:border-amber-900/50",
                  accent: "text-amber-600 dark:text-amber-400",
                },
                rose: {
                  bg: "bg-rose-50 dark:bg-rose-950/30",
                  border: "border-rose-200 dark:border-rose-900/50",
                  accent: "text-rose-600 dark:text-rose-400",
                },
                cyan: {
                  bg: "bg-cyan-50 dark:bg-cyan-950/30",
                  border: "border-cyan-200 dark:border-cyan-900/50",
                  accent: "text-cyan-600 dark:text-cyan-400",
                },
              };
              const colors = colorMap[interest.color];
              return (
                <motion.div
                  key={interest.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                  className={`${colors.bg} border ${colors.border} rounded-xl p-5 hover:shadow-md hover:shadow-black/5 dark:hover:shadow-black/20 transition-all duration-300`}
                >
                  <h3
                    className={`font-semibold text-zinc-900 dark:text-zinc-100 mb-2 ${colors.accent}`}
                  >
                    {interest.title}
                  </h3>
                  <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">
                    {interest.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </main>
  );
}
