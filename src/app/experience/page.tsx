"use client";

import { motion } from "framer-motion";
import { Briefcase, Calendar, MapPin } from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";


const companies = [
  {
    name: "Infocusp Innovations",
    location: "Ahmedabad, Gujarat",
    totalDuration: "2 yrs 9 months",
    color: "sky",
    roles: [
      {
        title: "Software Engineer 2",
        period: "Jul 2025 – Present",
        duration: "9 months",
        current: true,
        description:
          "Building an early-stage AEC (Architecture, Engineering & Construction) product with an amazing team. Led the software development stream from ideation to production, wearing multiple hats across the stack: backend, frontend, DevOps, data engineering, and UI/UX, wherever the team needed it most.",
        highlights: [
          "Led end-to-end software development stream for an AEC product",
          "Drove architecture decisions from ideation to production",
          "Wore multiple hats across backend, frontend, DevOps, data engineering, and UI/UX design",
          "Acted as tech lead: drove sprints, reviewed PRs actively, and mentored teammates",
          "Collaborated with cross-functional teams across design and product",
        ],
      },
      {
        title: "Software Engineer 1",
        period: "Jan 2024 – Jun 2025",
        duration: "1 yr 6 months",
        current: false,
        description:
          "Built a robust system for a habit tracking and mental health awareness application, owning features end to end.",
        highlights: [
          "Owned full-stack feature development for a mental health platform",
          "Built scalable backend systems and responsive UIs",
          "Ensured reliability and performance across the application",
        ],
      },
      {
        title: "Associate Software Engineer",
        period: "Jul 2023 – Dec 2023",
        duration: "6 months",
        current: false,
        description:
          "Built and maintained the system for a leading smart bed manufacturing client, ensuring end-to-end feature delivery.",
        highlights: [
          "Delivered features for a smart bed manufacturing client",
          "Maintained system reliability and performance",
          "Contributed to end-to-end feature delivery pipeline",
        ],
      },
    ],
  },
  {
    name: "Shipmnts",
    location: "Ahmedabad, Gujarat",
    totalDuration: "6 months",
    color: "emerald",
    roles: [
      {
        title: "Software Engineer",
        period: "Jun 2022 – Nov 2022",
        duration: "6 months",
        current: false,
        description:
          "Designed and delivered features at scale to ease logistics and shipment tracking for businesses.",
        highlights: [
          "Built features for logistics and shipment tracking at scale",
          "Improved UX flows for business clients",
          "Contributed to a fast-paced product team",
        ],
      },
    ],
  },
  {
    name: "Vardaam Web Solutions",
    location: "Vadodara, Gujarat",
    totalDuration: "3 months",
    color: "violet",
    roles: [
      {
        title: "Software Engineer",
        period: "Oct 2021 – Dec 2021",
        duration: "3 months",
        current: false,
        description:
          "Worked on a monolithic application built on Flutter + Node. Improved Dashboard UX, boosting performance and user interaction by 50%. Also explored blockchain and smart contract implementation in Solidity.",
        highlights: [
          "Improved Dashboard UX, boosted performance and interaction by 50%",
          "Worked on Flutter + Node.js monolithic application",
          "Explored smart contract implementation in Solidity",
        ],
      },
    ],
  },
  {
    name: "Privilon Technologies",
    location: "Ahmedabad, Gujarat",
    totalDuration: "5 months",
    color: "rose",
    roles: [
      {
        title: "Lead Frontend Engineer",
        period: "Aug 2021 – Oct 2021",
        duration: "3 months",
        current: false,
        description:
          "Led a team of four to deliver a small-scale frontend project for a local business after being promoted from the intern role.",
        highlights: [
          "Led a 4-member frontend team",
          "Delivered project end-to-end for a local business client",
        ],
      },
      {
        title: "Frontend Engineer",
        period: "Jun 2021 – Aug 2021",
        duration: "3 months",
        current: false,
        description:
          "Worked with React, Redux, and Firebase. Built responsive and animated websites using CSS and JavaScript.",
        highlights: [
          "Built responsive and animated UIs with React + Redux",
          "Worked with Firebase for backend integration",
        ],
      },
    ],
  },
];

const colorMap: Record<string, { border: string; badge: string; dot: string; icon: string; highlight: string }> = {
  sky: {
    border: "border-sky-500/30",
    badge: "bg-sky-500/10 text-sky-400 border-sky-500/20",
    dot: "bg-sky-500",
    icon: "bg-sky-500/10 border-sky-500/20 text-sky-400",
    highlight: "border-l-sky-500/50",
  },
  emerald: {
    border: "border-emerald-500/30",
    badge: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    dot: "bg-emerald-500",
    icon: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
    highlight: "border-l-emerald-500/50",
  },
  violet: {
    border: "border-violet-500/30",
    badge: "bg-violet-500/10 text-violet-400 border-violet-500/20",
    dot: "bg-violet-500",
    icon: "bg-violet-500/10 border-violet-500/20 text-violet-400",
    highlight: "border-l-violet-500/50",
  },
  rose: {
    border: "border-rose-500/30",
    badge: "bg-rose-500/10 text-rose-400 border-rose-500/20",
    dot: "bg-rose-500",
    icon: "bg-rose-500/10 border-rose-500/20 text-rose-400",
    highlight: "border-l-rose-500/50",
  },
};

export default function ExperiencePage() {
  const totalRoles = companies.reduce((acc, c) => acc + c.roles.length, 0);

  return (
    <main className="min-h-screen bg-background">
      {/* ── Header ── */}
      <PageHeader maxWidth="max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="grid lg:grid-cols-[1fr_380px] lg:gap-12 lg:items-center"
          >
          <div>
            <p className="font-mono text-sky-500 dark:text-sky-400 text-sm mb-4 tracking-widest uppercase">
              career
            </p>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight mb-6">
              Experience
            </h1>
            <p className="text-zinc-600 dark:text-zinc-400 max-w-lg leading-relaxed mb-10">
              A journey across startups and product companies. Building things that matter, leading teams, and shipping fast.
            </p>

            {/* Stats */}
            <div className="flex flex-wrap gap-10">
              {[
                { value: "3+", label: "years of experience" },
                { value: companies.length, label: "companies" },
                { value: totalRoles, label: "roles" },
              ].map(({ value, label }) => (
                <div key={label}>
                  <p className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">{value}</p>
                  <p className="font-mono text-xs text-zinc-500 mt-0.5">{label}</p>
                </div>
              ))}
            </div>
          </div>

        </motion.div>
      </PageHeader>

      {/* Companies */}
      <div className="max-w-4xl mx-auto px-6 py-16">
        <p className="font-mono text-zinc-500 text-sm mb-12">
          {"// full-time roles, sorted by recency"}
        </p>
        <div className="space-y-16">
          {companies.map((company) => {
            const c = colorMap[company.color];
            return (
              <motion.div
                key={company.name}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5 }}
              >
                {/* Company header */}
                <div className={`flex items-start gap-4 mb-8`}>
                  <div className={`mt-1 p-2.5 rounded-lg border ${c.icon}`}>
                    <Briefcase size={18} />
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-1">
                      <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">{company.name}</h2>
                      <span className={`font-mono text-xs px-2.5 py-0.5 rounded-full border ${c.badge}`}>
                        {company.totalDuration}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-zinc-500 text-sm">
                      <MapPin size={12} />
                      <span>{company.location}</span>
                    </div>
                  </div>
                </div>

                {/* Roles */}
                <div className={`ml-6 border-l-2 border-zinc-200 dark:border-zinc-800 pl-8 space-y-8`}>
                  {company.roles.map((role, ri) => (
                    <div key={ri} className="relative">
                      {/* Timeline dot */}
                      <span className={`absolute -left-[2.65rem] top-2 w-3 h-3 rounded-full border-2 border-zinc-50 dark:border-zinc-950 ${c.dot}`} />

                      <div className={`bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors`}>
                        <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="text-zinc-900 dark:text-zinc-100 font-semibold">{role.title}</h3>
                              {role.current && (
                                <span className="flex items-center gap-1.5 text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                  current
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5 text-zinc-500 text-xs font-mono">
                            <Calendar size={11} />
                            <span>{role.period}</span>
                          </div>
                        </div>

                        <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed mb-4">
                          {role.description}
                        </p>

                        <ul className={`space-y-1.5 border-l-2 pl-4 ${c.highlight}`}>
                          {role.highlights.map((h, hi) => (
                            <li key={hi} className="text-zinc-500 text-xs leading-relaxed">
                              {h}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
