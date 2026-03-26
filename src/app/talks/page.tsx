"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { MapPin, X, ChevronLeft, ChevronRight } from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";
import { talks } from "@/data/talks";
import { useState, useCallback, useEffect } from "react";

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
    [images.length]
  );
  const next = useCallback(
    () => setIndex((i) => (i + 1) % images.length),
    [images.length]
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
        {/* Image */}
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
            alt="Talk photo"
            fill
            className="object-contain"
            sizes="100vw"
          />
        </motion.div>

        {/* Controls */}
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
              onClick={(e) => { e.stopPropagation(); prev(); }}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors bg-white/5 hover:bg-white/10 rounded-full p-2"
              aria-label="Previous"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); next(); }}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors bg-white/5 hover:bg-white/10 rounded-full p-2"
              aria-label="Next"
            >
              <ChevronRight size={24} />
            </button>
          </>
        )}

        {/* Counter */}
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 font-mono text-xs text-white/40">
          {index + 1} / {images.length}
        </div>

        {/* Thumbnail strip */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-2 overflow-x-auto max-w-[90vw] px-2">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={(e) => { e.stopPropagation(); setIndex(i); }}
              className={`relative shrink-0 w-12 h-8 rounded overflow-hidden border-2 transition-all ${
                i === index ? "border-sky-400 opacity-100" : "border-transparent opacity-40 hover:opacity-70"
              }`}
            >
              <Image src={img} alt="" fill className="object-cover" sizes="48px" />
            </button>
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

export default function TalksPage() {
  const [lightbox, setLightbox] = useState<{ images: string[]; index: number } | null>(null);

  const totalPhotos = talks.reduce((acc, t) => acc + t.images.length, 0);
  const universities = new Set(talks.map((t) => t.venue)).size;

  return (
    <>
      <main className="min-h-screen bg-background">
        {/* ── Header ── */}
        <PageHeader maxWidth="max-w-5xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
            <p className="font-mono text-sky-500 dark:text-sky-400 text-sm mb-4 tracking-widest uppercase">
              speaker / educator
            </p>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-zinc-900 dark:text-zinc-100 mb-6 tracking-tight">
              Talks &amp; Sessions
            </h1>
            <p className="text-zinc-600 dark:text-zinc-400 max-w-lg leading-relaxed mb-10">
              I&apos;ve spoken at universities on topics I care about: problem
              solving, competitive programming, cloud computing, and engineering
              at scale.
            </p>

            {/* Stats */}
            <div className="flex flex-wrap gap-8">
              {[
                { value: talks.length, label: "talks" },
                { value: universities, label: "universities" },
                { value: totalPhotos, label: "photos" },
              ].map(({ value, label }) => (
                <div key={label}>
                  <p className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
                    {String(value).padStart(2, "0")}
                  </p>
                  <p className="font-mono text-xs text-zinc-500 mt-0.5">{label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </PageHeader>

        {/* Talk cards */}
        <div className="max-w-5xl mx-auto px-6 py-16">
          <p className="font-mono text-zinc-500 text-sm mb-12">
            {"// click any image to open the gallery"}
          </p>
          <div className="space-y-16 md:space-y-28">
            {talks.map((talk, i) => (
              <motion.article
                key={talk.id}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.55 }}
              >
                {/* Featured hero image */}
                <div
                  className="relative w-full rounded-2xl overflow-hidden cursor-pointer group mb-6"
                  style={{ aspectRatio: "16/7" }}
                  onClick={() => setLightbox({ images: talk.images, index: 0 })}
                >
                  <Image
                    src={talk.featured}
                    alt={talk.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                    sizes="(max-width: 768px) 100vw, 900px"
                    priority={i === 0}
                    loading={i === 0 ? "eager" : undefined}
                  />
                  {/* Gradient overlay */}
                  <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.35) 50%, transparent 100%)" }} />

                  {/* Overlaid text */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-8">
                    <span className="font-mono text-xs text-sky-400 tracking-widest uppercase mb-2 block">
                      {String(i + 1).padStart(2, "0")} &mdash; {talk.event}
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2 leading-tight">
                      {talk.title}
                    </h2>
                    <div className="flex items-center gap-1.5 text-white/60 text-sm">
                      <MapPin size={13} />
                      <span>{talk.venue}</span>
                    </div>
                  </div>

                  {/* Photo count badge */}
                  <div className="absolute top-5 right-5 bg-black/50 backdrop-blur-sm text-white/70 font-mono text-xs px-3 py-1.5 rounded-full border border-white/10">
                    {talk.images.length} photos
                  </div>
                </div>

                {/* Description + topics row */}
                <div className="flex flex-col sm:flex-row sm:items-start gap-6 mb-6 px-1">
                  <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-sm flex-1">
                    {talk.description}
                  </p>
                  <div className="flex flex-wrap gap-2 sm:justify-end sm:max-w-xs">
                    {talk.topics.map((topic) => (
                      <span
                        key={topic}
                        className="font-mono text-xs text-sky-600 dark:text-sky-400 bg-sky-500/10 border border-sky-500/20 px-3 py-1 rounded-full"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Thumbnail strip */}
                {talk.images.length > 1 && (
                  <div className="flex gap-3 overflow-x-auto pb-1 px-1">
                    {talk.images.map((img, j) => (
                      <button
                        key={j}
                        onClick={() => setLightbox({ images: talk.images, index: j })}
                        className="relative shrink-0 w-32 h-20 rounded-lg overflow-hidden group/thumb"
                      >
                        <Image
                          src={img}
                          alt="Talk photo"
                          fill
                          className="object-cover transition-transform duration-300 group-hover/thumb:scale-110"
                          sizes="128px"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover/thumb:bg-black/30 transition-colors duration-200 rounded-lg" />
                      </button>
                    ))}
                  </div>
                )}
              </motion.article>
            ))}
          </div>
        </div>
      </main>

      {/* Lightbox */}
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
