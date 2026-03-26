"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import {
  MapPin,
  Calendar,
  Users,
  Clock,
  X,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
} from "lucide-react";
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
          className="relative w-full max-w-5xl max-h-[85vh] mx-4 sm:mx-16"
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
      </motion.div>
    </AnimatePresence>
  );
}

export default function TalkPage() {
  const params = useParams();
  const router = useRouter();
  const talkId = params.id as string;
  const talk = talks.find((t) => t.id === talkId);
  const [lightbox, setLightbox] = useState<{
    images: string[];
    index: number;
  } | null>(null);

  if (!talk) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <p className="text-zinc-400 mb-4">Talk not found</p>
          <button
            onClick={() => router.back()}
            className="text-sky-500 hover:text-sky-400 transition-colors flex items-center gap-2 mx-auto"
          >
            <ArrowLeft size={16} /> Go back
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen bg-background"
    >
      {/* Header */}
      <div className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
          >
            <ArrowLeft size={18} />
            <span className="text-sm font-medium">Back to talks</span>
          </button>
          <span className="font-mono text-xs text-zinc-400 dark:text-zinc-600">
            {talkId}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-6 py-16">
        {/* Title Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="mb-12"
        >
          <h1 className="text-4xl sm:text-5xl font-bold text-zinc-900 dark:text-zinc-100 mb-6 leading-tight">
            {talk.title}
          </h1>

          {/* Meta Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="flex items-start gap-3">
              <MapPin size={18} className="text-sky-500 mt-1 shrink-0" />
              <div className="min-w-0">
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-0.5">
                  Venue
                </p>
                <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate">
                  {talk.venue}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Calendar size={18} className="text-sky-500 mt-1 shrink-0" />
              <div>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-0.5">
                  Year
                </p>
                <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                  {talk.date}
                </p>
              </div>
            </div>

            {talk.duration && (
              <div className="flex items-start gap-3">
                <Clock size={18} className="text-sky-500 mt-1 shrink-0" />
                <div>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-0.5">
                    Duration
                  </p>
                  <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                    {talk.duration}
                  </p>
                </div>
              </div>
            )}

            {talk.audience && (
              <div className="flex items-start gap-3">
                <Users size={18} className="text-sky-500 mt-1 shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-0.5">
                    Audience
                  </p>
                  <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate">
                    {talk.audience}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Event Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-sky-50 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-900/50">
            <span className="w-2 h-2 rounded-full bg-sky-500" />
            <span className="text-sm font-medium text-sky-700 dark:text-sky-300">
              {talk.event}
            </span>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="lg:col-span-2"
          >
            {/* Featured Image */}
            <div className="rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 mb-8 cursor-pointer hover:border-sky-500/50 dark:hover:border-sky-500/30 transition-colors">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="relative w-full aspect-video bg-zinc-900"
                onClick={() => setLightbox({ images: talk.images, index: 0 })}
              >
                <Image
                  src={talk.featured}
                  alt={talk.title}
                  fill
                  className="object-cover"
                />
              </motion.div>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">
                Overview
              </h2>
              <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed mb-4">
                {talk.description}
              </p>
              {talk.longDescription && (
                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  {talk.longDescription}
                </p>
              )}
            </div>

            {/* Topics */}
            <div className="mb-8">
              <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-4">
                Topics Covered
              </h3>
              <div className="flex flex-wrap gap-2">
                {talk.topics.map((topic) => (
                  <span
                    key={topic}
                    className="px-3 py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-sm font-medium text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </div>

            {/* Key Takeaways */}
            {talk.keyTakeaways && talk.keyTakeaways.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-4">
                  Key Takeaways
                </h3>
                <ul className="space-y-2">
                  {talk.keyTakeaways.map((takeaway, idx) => (
                    <motion.li
                      key={idx}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + idx * 0.05 }}
                      className="flex items-start gap-3 text-zinc-700 dark:text-zinc-300"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-sky-500 mt-2 shrink-0" />
                      {takeaway}
                    </motion.li>
                  ))}
                </ul>
              </div>
            )}
          </motion.div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="lg:col-span-1"
          >
            {/* Gallery Preview */}
            {talk.images.length > 0 && (
              <div className="bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl p-6 border border-zinc-200 dark:border-zinc-800 mb-6">
                <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 mb-4">
                  Photo Gallery
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {talk.images.map((image, idx) => (
                    <motion.button
                      key={idx}
                      whileHover={{ scale: 1.05 }}
                      onClick={() =>
                        setLightbox({ images: talk.images, index: idx })
                      }
                      className="relative aspect-square rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-700 hover:border-sky-500/50 transition-colors group"
                    >
                      <Image
                        src={image}
                        alt={`Gallery ${idx + 1}`}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </motion.button>
                  ))}
                </div>
                <button
                  onClick={() => setLightbox({ images: talk.images, index: 0 })}
                  className="w-full mt-4 px-4 py-2 rounded-lg bg-sky-50 dark:bg-sky-950/30 text-sky-700 dark:text-sky-300 hover:bg-sky-100 dark:hover:bg-sky-950/50 font-medium text-sm transition-colors border border-sky-200 dark:border-sky-900/50"
                >
                  View all {talk.images.length} photos
                </button>
              </div>
            )}

            {/* Quick Links */}
            <div className="bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl p-6 border border-zinc-200 dark:border-zinc-800">
              <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 mb-4">
                Details
              </h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-zinc-500 dark:text-zinc-400 mb-1">Event</p>
                  <p className="font-medium text-zinc-900 dark:text-zinc-100">
                    {talk.event}
                  </p>
                </div>
                <div>
                  <p className="text-zinc-500 dark:text-zinc-400 mb-1">Venue</p>
                  <p className="font-medium text-zinc-900 dark:text-zinc-100">
                    {talk.venue}
                  </p>
                </div>
                {talk.date && (
                  <div>
                    <p className="text-zinc-500 dark:text-zinc-400 mb-1">
                      Year
                    </p>
                    <p className="font-medium text-zinc-900 dark:text-zinc-100">
                      {talk.date}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Lightbox */}
      {lightbox && (
        <Lightbox
          images={lightbox.images}
          startIndex={lightbox.index}
          onClose={() => setLightbox(null)}
        />
      )}
    </motion.main>
  );
}
