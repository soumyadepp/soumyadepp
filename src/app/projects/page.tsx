"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, ChevronLeft, ChevronRight, X } from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";
import FilterBar from "@/components/ui/FilterBar";
import { projects, type Project, type ProjectStatus } from "@/data/projects";

function Lightbox({
  images,
  startIndex,
  onClose,
}: {
  images: string[];
  startIndex: number;
  onClose: () => void;
}) {
  const [index, setIndex] = useState(startIndex);

  const prev = useCallback(
    () => setIndex((i) => (i - 1 + images.length) % images.length),
    [images.length],
  );
  const next = useCallback(
    () => setIndex((i) => (i + 1) % images.length),
    [images.length],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, prev, next]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
        onClick={onClose}
      >
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-4xl max-h-[80vh] mx-4 sm:mx-16"
          style={{ aspectRatio: "16/10" }}
          onClick={(e) => e.stopPropagation()}
        >
          <Image
            src={images[index]}
            alt="Project screenshot"
            fill
            className="object-contain"
            sizes="100vw"
          />
        </motion.div>

        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-white/50 hover:text-white transition-colors"
          aria-label="Close"
        >
          <X size={24} />
        </button>

        {images.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                prev();
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors bg-white/5 hover:bg-white/10 rounded-full p-2"
              aria-label="Previous"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                next();
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors bg-white/5 hover:bg-white/10 rounded-full p-2"
              aria-label="Next"
            >
              <ChevronRight size={24} />
            </button>
          </>
        )}

        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 font-mono text-xs text-white/40">
          {index + 1} / {images.length}
        </div>

        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-2 overflow-x-auto max-w-[90vw] px-2">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={(e) => {
                e.stopPropagation();
                setIndex(i);
              }}
              className={`relative shrink-0 w-12 h-8 rounded overflow-hidden border-2 transition-all ${
                i === index
                  ? "border-sky-400 opacity-100"
                  : "border-transparent opacity-40 hover:opacity-70"
              }`}
            >
              <Image
                src={img}
                alt=""
                fill
                className="object-cover"
                sizes="48px"
              />
            </button>
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

function ProjectImageGallery({
  project,
  index,
  onOpen,
}: {
  project: Project;
  index: number;
  onOpen: (imageIndex: number) => void;
}) {
  const images = project.gallery ?? (project.image ? [project.image] : []);
  const [current, setCurrent] = useState(0);

  const prev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrent((c) => (c - 1 + images.length) % images.length);
  };
  const next = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrent((c) => (c + 1) % images.length);
  };

  return (
    <div
      className="relative w-full h-56 md:w-72 lg:w-80 md:h-auto md:shrink-0 bg-zinc-950 overflow-hidden border-b md:border-b-0 md:border-r border-zinc-200 dark:border-zinc-800 cursor-zoom-in"
      onClick={() => images.length > 0 && onOpen(current)}
    >
      {images.length > 0 && (
        <Image
          src={images[current]}
          alt={`${project.title} screenshot ${current + 1}`}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 288px, 320px"
          className="object-contain transition-all duration-500 ease-out group-hover:scale-[1.04]"
        />
      )}

      {/* Number badge */}
      <span className="absolute top-3 left-3 font-mono text-[10px] text-zinc-400/80 dark:text-zinc-600 bg-black/40 dark:bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded-full border border-zinc-700/40">
        {String(index + 1).padStart(2, "0")}
      </span>

      {/* Gallery controls */}
      {images.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center rounded-full bg-black/50 backdrop-blur-sm border border-white/10 text-white/80 hover:text-white hover:bg-black/70 transition-all duration-200 z-10"
          >
            <ChevronLeft size={14} />
          </button>
          <button
            onClick={next}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center rounded-full bg-black/50 backdrop-blur-sm border border-white/10 text-white/80 hover:text-white hover:bg-black/70 transition-all duration-200 z-10"
          >
            <ChevronRight size={14} />
          </button>

          {/* Dot indicators */}
          <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrent(i);
                }}
                className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${
                  i === current
                    ? "bg-white scale-125"
                    : "bg-white/40 hover:bg-white/70"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

const statusStyles: Record<ProjectStatus, string> = {
  "in development":
    "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  completed:
    "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  deprecated:
    "bg-zinc-500/10 text-zinc-500 dark:text-zinc-400 border-zinc-500/20",
  disabled:
    "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
};

const statusDot: Record<ProjectStatus, string> = {
  "in development": "bg-amber-400 animate-pulse",
  completed: "bg-emerald-400",
  deprecated: "bg-zinc-400",
  disabled: "bg-rose-400",
};

const allTags = [
  "All",
  ...Array.from(new Set(projects.flatMap((p) => p.tags))),
];

export default function ProjectsPage() {
  const [active, setActive] = useState("All");
  const [lightbox, setLightbox] = useState<{
    images: string[];
    index: number;
  } | null>(null);

  const filtered =
    active === "All"
      ? projects
      : projects.filter((p) => p.tags.includes(active));

  return (
    <>
      <main className="min-h-screen bg-background">
        {/* ── Header ── */}
        <PageHeader maxWidth="max-w-5xl">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="font-mono text-sky-500 dark:text-sky-400 text-sm tracking-widest uppercase mb-4"
          >
            Projects
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.07 }}
            className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 mb-6"
          >
            Things I&apos;ve built.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.14 }}
            className="text-zinc-600 dark:text-zinc-500 max-w-md leading-relaxed mb-10"
          >
            From side experiments to production systems. A running log of what
            I&apos;ve shipped.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.21 }}
            className="flex flex-wrap gap-10"
          >
            {[
              { value: projects.length, label: "projects built" },
              { value: allTags.length - 1, label: "technologies" },
            ].map(({ value, label }) => (
              <div key={label}>
                <p className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
                  {value}
                </p>
                <p className="font-mono text-xs text-zinc-500 mt-0.5">
                  {label}
                </p>
              </div>
            ))}
          </motion.div>
        </PageHeader>

        {/* ── Filter bar ── */}
        <FilterBar
          tags={allTags}
          active={active}
          onSelect={setActive}
          layoutId="projects-filter"
        />

        {/* ── Grid ── */}
        <div className="max-w-5xl mx-auto px-6 py-16">
          <motion.p layout className="font-mono text-xs text-zinc-500 mb-10">
            {"// "}
            {filtered.length} project{filtered.length !== 1 ? "s" : ""}
            {active !== "All"
              ? ` tagged "${active}"`
              : ", sorted by impact not date"}
          </motion.p>

          <motion.div layout className="flex flex-col gap-6">
            <AnimatePresence mode="popLayout">
              {filtered.map((project, i) => (
                <motion.article
                  key={project.title}
                  layout
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3, delay: i * 0.07 }}
                  className="group relative flex flex-col md:flex-row rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden transition-all duration-300 hover:border-sky-500/50 dark:hover:border-sky-500/40 hover:shadow-[0_8px_40px_-8px_rgba(14,165,233,0.18)] dark:hover:shadow-[0_8px_40px_-8px_rgba(14,165,233,0.14)]"
                >
                  {/* ── Image area ── */}
                  <ProjectImageGallery
                    project={project}
                    index={i}
                    onOpen={(imageIndex) => {
                      const images =
                        project.gallery ??
                        (project.image ? [project.image] : []);
                      setLightbox({ images, index: imageIndex });
                    }}
                  />

                  {/* ── Body ── */}
                  <div className="flex flex-col flex-1 px-6 py-6 gap-3 justify-center">
                    {/* Title + status */}
                    <div className="flex items-start justify-between gap-3">
                      <h2 className="text-zinc-900 dark:text-zinc-100 font-bold text-xl leading-tight tracking-tight group-hover:text-sky-600 dark:group-hover:text-sky-300 transition-colors duration-300">
                        {project.title}
                      </h2>
                      <span
                        className={`shrink-0 inline-flex items-center gap-1.5 font-mono text-[10px] px-2 py-0.5 rounded-full border mt-1 ${statusStyles[project.status]}`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${statusDot[project.status]}`}
                        />
                        {project.status}
                      </span>
                    </div>

                    {/* Description */}
                    <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed flex-1">
                      {project.description}
                    </p>

                    {/* Key Features (if available) */}
                    {project.keyFeatures && project.keyFeatures.length > 0 && (
                      <div className="mt-2 pt-2 border-t border-zinc-200 dark:border-zinc-800">
                        <p className="text-xs text-zinc-400 dark:text-zinc-500 font-medium mb-1.5">
                          Key features:
                        </p>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                          {project.keyFeatures.slice(0, 4).map((feature) => (
                            <li
                              key={feature}
                              className="text-xs text-zinc-600 dark:text-zinc-400 flex items-center gap-1.5"
                            >
                              <span className="w-1 h-1 rounded-full bg-sky-500/60" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Tech Stack */}
                    {project.techStack && project.techStack.length > 0 && (
                      <div className="mt-3 flex items-center gap-2 flex-wrap">
                        {project.techStack.map((tech) => (
                          <span
                            key={tech.name}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/60 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-sky-50 dark:hover:bg-sky-500/10 transition-colors"
                          >
                            {tech.name}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Tags */}
                    <ul className="flex flex-wrap gap-1.5 mt-1">
                      {project.tags.map((tag) => (
                        <li
                          key={tag}
                          className="font-mono text-[10px] text-sky-600 dark:text-sky-400/70 bg-sky-500/6 border border-sky-500/20 dark:border-sky-500/15 px-2.5 py-0.5 rounded-full"
                        >
                          {tag}
                        </li>
                      ))}
                    </ul>

                    {/* Divider */}
                    <div className="border-t border-zinc-100 dark:border-zinc-800 mt-1" />

                    {/* CTA row */}
                    <div className="flex items-center gap-4">
                      {project.github ? (
                        <a
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-500 dark:text-zinc-400 hover:text-sky-600 dark:hover:text-sky-300 transition-colors duration-200"
                        >
                          View source
                          <ArrowUpRight size={13} />
                        </a>
                      ) : (
                        <span className="font-mono text-[10px] text-zinc-400 dark:text-zinc-600 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 px-2.5 py-0.5 rounded-full">
                          private / confidential
                        </span>
                      )}
                      {project.live && (
                        <a
                          href={project.live}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-500 dark:text-zinc-400 hover:text-sky-600 dark:hover:text-sky-300 transition-colors duration-200"
                        >
                          Live demo
                          <ArrowUpRight size={13} />
                        </a>
                      )}
                    </div>
                  </div>
                </motion.article>
              ))}
            </AnimatePresence>
          </motion.div>

          {filtered.length === 0 && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-zinc-400 dark:text-zinc-700 font-mono text-sm py-24"
            >
              No projects tagged with &ldquo;{active}&rdquo; yet.
            </motion.p>
          )}
        </div>
      </main>

      {lightbox && (
        <Lightbox
          images={lightbox.images}
          startIndex={lightbox.index}
          onClose={() => setLightbox(null)}
        />
      )}
    </>
  );
}
