"use client";

import { motion } from "framer-motion";

interface FilterBarProps {
  tags: string[];
  active: string;
  onSelect: (tag: string) => void;
  layoutId?: string;
  maxWidth?: string;
}

export default function FilterBar({
  tags,
  active,
  onSelect,
  layoutId = "filter-pill",
  maxWidth = "max-w-5xl",
}: FilterBarProps) {
  return (
    <div className="sticky top-16 z-30 bg-white/90 dark:bg-zinc-950/90 backdrop-blur border-b border-zinc-200 dark:border-zinc-800">
      <div
        className={`${maxWidth} mx-auto px-6 py-3 flex gap-2 overflow-x-auto`}
        style={{ scrollbarWidth: "none" }}
      >
        {tags.map((tag) => (
          <button
            key={tag}
            onClick={() => onSelect(tag)}
            className={`relative shrink-0 font-mono text-xs px-3 py-1.5 rounded-full transition-colors duration-200 ${
              active === tag
                ? "text-zinc-950"
                : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-600"
            }`}
          >
            {active === tag && (
              <motion.span
                layoutId={layoutId}
                className="absolute inset-0 rounded-full bg-sky-400"
                transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
              />
            )}
            <span className="relative">{tag}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
