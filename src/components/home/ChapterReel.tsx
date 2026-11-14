"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import ContactPanel from "@/components/contact/ContactPanel";
import HeroPhoto from "@/components/home/HeroPhoto";
import Frame from "@/components/reel/Frame";
import { CHAPTERS, HOME, type Chapter } from "@/content/site";

const WIDE = "(min-width: 768px)";
const WHEEL_LOCK = 900;
const WHEEL_THRESHOLD = 12;
const DRAG_THRESHOLD = 70;

function anchorOf(index: number): string {
  return CHAPTERS[index].name.toLowerCase();
}

function shots(chapter: Chapter, size: string) {
  return chapter.images?.slice(0, 2).map((image) => (
    <Link
      key={image.src}
      href={image.href}
      aria-label={image.alt}
      className="relative block aspect-[16/10] overflow-hidden border border-line bg-panel"
    >
      <Image
        src={image.src}
        alt=""
        fill
        sizes={size}
        className={`object-cover object-top ${image.still ? "still" : "tint"}`}
      />
    </Link>
  ));
}

/**
 * The home page: a reel of full-screen chapters.
 *
 * On a phone the chapters stack and each swipe up snaps to the next. On a
 * wide screen they sit side by side, and scrolling, the arrow keys or the
 * chapter bar move the reel horizontally.
 */
export default function ChapterReel() {
  const [active, setActive] = useState(0);
  const activeRef = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<(HTMLElement | null)[]>([]);

  const jump = useCallback((index: number, instant = false) => {
    const container = containerRef.current;
    if (!container) return;
    const target = Math.max(0, Math.min(CHAPTERS.length - 1, index));
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const behavior = calm || instant ? "auto" : "smooth";
    if (window.matchMedia(WIDE).matches) {
      container.scrollTo({ left: target * container.clientWidth, behavior });
    } else {
      container.scrollTo({ top: target * container.clientHeight, behavior });
    }
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const index = Number((entry.target as HTMLElement).dataset.index);
          activeRef.current = index;
          setActive(index);
          const hash = index === 0 ? "" : `#${anchorOf(index)}`;
          window.history.replaceState(
            null,
            "",
            `${window.location.pathname}${hash}`,
          );
        }
      },
      { root: container, threshold: 0.6 },
    );
    const start = CHAPTERS.findIndex(
      (_, index) => `#${anchorOf(index)}` === window.location.hash,
    );
    if (start > 0) jump(start, true);

    for (const slide of slideRefs.current) {
      if (slide) observer.observe(slide);
    }

    let locked = false;
    const onWheel = (event: WheelEvent) => {
      if (!window.matchMedia(WIDE).matches) return;
      if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;
      event.preventDefault();
      if (locked || Math.abs(event.deltaY) < WHEEL_THRESHOLD) return;
      locked = true;
      window.setTimeout(() => {
        locked = false;
      }, WHEEL_LOCK);
      jump(activeRef.current + (event.deltaY > 0 ? 1 : -1));
    };

    const onKey = (event: KeyboardEvent) => {
      const forward = event.key === "ArrowRight" || event.key === "ArrowDown";
      const back = event.key === "ArrowLeft" || event.key === "ArrowUp";
      if (!forward && !back) return;
      event.preventDefault();
      jump(activeRef.current + (forward ? 1 : -1));
    };

    let dragFrom: number | null = null;
    const onDown = (event: PointerEvent) => {
      if (event.pointerType !== "mouse" || event.button !== 0) return;
      dragFrom = event.clientX;
    };
    const onUp = (event: PointerEvent) => {
      if (dragFrom === null) return;
      const moved = event.clientX - dragFrom;
      dragFrom = null;
      if (Math.abs(moved) < DRAG_THRESHOLD) return;
      jump(activeRef.current + (moved < 0 ? 1 : -1));
    };

    const onHash = () => {
      const target = CHAPTERS.findIndex(
        (_, index) => `#${anchorOf(index)}` === window.location.hash,
      );
      jump(Math.max(target, 0));
    };

    window.addEventListener("hashchange", onHash);
    container.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    container.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKey);
    return () => {
      observer.disconnect();
      window.removeEventListener("hashchange", onHash);
      container.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      container.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKey);
    };
  }, [jump]);

  return (
    <div className="relative h-svh overflow-hidden bg-stage">
      <div
        ref={containerRef}
        className="grabbable flex h-full select-none snap-y snap-mandatory flex-col overflow-x-hidden overflow-y-auto overscroll-contain [scrollbar-width:none] md:snap-x md:flex-row md:overflow-x-auto md:overflow-y-hidden"
      >
        {CHAPTERS.map((chapter, index) => {
          const current = index === active;
          const last = index === CHAPTERS.length - 1;
          return (
            <section
              key={chapter.number}
              ref={(element) => {
                slideRefs.current[index] = element;
              }}
              data-index={index}
              className="relative flex h-svh w-full shrink-0 snap-start snap-always flex-col justify-end overflow-hidden md:w-screen"
            >
              {last ? (
                <ContactPanel variant="reel" />
              ) : (
                <>
                  {index === 0 ? (
                    <HeroPhoto />
                  ) : (
                    <Frame
                      mode={chapter.mode}
                      grade={chapter.grade}
                      label={chapter.frameLabel}
                      focusX={0.5}
                      focusY={0.34}
                      badges={chapter.badges}
                      className="md:hidden"
                    />
                  )}
                  {index !== 0 && (
                    <Frame
                      mode={chapter.mode}
                      grade={chapter.grade}
                      label={chapter.frameLabel}
                      focusX={0.7}
                      focusY={0.38}
                      badges={chapter.badges}
                      className="hidden md:block"
                    />
                  )}
                  {index === 0 && (
                    <div
                      aria-hidden="true"
                      className="absolute inset-y-0 left-0 hidden w-3/5 bg-linear-to-r from-stage/85 from-15% to-transparent md:block"
                    />
                  )}
                  <div
                    aria-hidden="true"
                    className="absolute inset-x-0 top-0 h-32 bg-linear-to-b from-stage/85 to-transparent md:h-40"
                  />
                  <div
                    aria-hidden="true"
                    className="absolute inset-x-0 bottom-0 h-[78%] bg-linear-to-t from-stage from-40% to-transparent md:h-1/2 md:from-stage/95 md:from-20%"
                  />

                  <div
                    className={`wrap relative flex flex-wrap items-end justify-between gap-x-10 gap-y-6 pr-16 pb-10 md:flex-nowrap md:pr-[var(--gutter)] md:pb-32 ${
                      current ? "cut" : "opacity-0"
                    }`}
                  >
                    <div className="flex max-w-[48rem] flex-col gap-4">
                      {chapter.images && (
                        <div className="grid grid-cols-2 gap-2 pr-6 pb-3 md:hidden">
                          {shots(chapter, "42vw")}
                        </div>
                      )}
                      {chapter.kicker && (
                        <p className="t-label text-quiet">{chapter.kicker}</p>
                      )}
                      <h2 className="t-title">{chapter.title}</h2>
                      <p className="t-lead break-words text-body">
                        {chapter.line}
                      </p>
                      <div className="mt-1 flex flex-wrap gap-3">
                        <Link
                          href={chapter.href}
                          className="t-body flex min-h-12 items-center border border-paper px-5 font-semibold transition-colors duration-200 hover:bg-paper hover:text-stage active:bg-paper active:text-stage"
                        >
                          {chapter.action}
                        </Link>
                        {chapter.secondary && (
                          <Link
                            href={chapter.secondary.href}
                            className="t-body flex min-h-12 items-center border border-rule px-5 font-semibold text-body transition-colors duration-200 hover:border-paper hover:text-paper"
                          >
                            {chapter.secondary.label}
                          </Link>
                        )}
                      </div>
                      {!last && (
                        <p
                          aria-hidden="true"
                          className="t-label pt-2 text-quiet md:hidden"
                        >
                          {HOME.swipe}
                        </p>
                      )}
                    </div>
                    <div className="hidden w-[42%] max-w-[40rem] shrink-0 flex-col items-end gap-8 md:flex">
                      {chapter.images && (
                        <div className="grid w-full grid-cols-2 gap-3">
                          {shots(chapter, "20vw")}
                        </div>
                      )}
                      {!last && (
                        <button
                          type="button"
                          aria-label={`${HOME.jump} ${CHAPTERS[index + 1].name}`}
                          onClick={() => jump(index + 1)}
                          className="cue flex min-h-12 cursor-pointer items-center gap-4 text-right"
                        >
                          <span className="flex flex-col items-end gap-1">
                            <span className="t-label text-quiet">
                              {HOME.next}
                            </span>
                            <span className="text-[17px] font-semibold tracking-[-0.02em] text-paper">
                              {CHAPTERS[index + 1].name}
                            </span>
                          </span>
                          <span aria-hidden="true" className="cue-track">
                            <span className="cue-glint" />
                          </span>
                          <svg
                            aria-hidden="true"
                            viewBox="0 0 12 20"
                            className="cue-arrow h-5 w-3 fill-none stroke-paper stroke-[1.5]"
                          >
                            <path d="M2 2l8 8-8 8" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>
                </>
              )}
            </section>
          );
        })}
      </div>

      <nav
        aria-label={HOME.chaptersLabel}
        className="absolute top-1/2 right-0 z-30 flex -translate-y-1/2 flex-col md:hidden"
      >
        {CHAPTERS.map((chapter, index) => {
          const current = index === active;
          return (
            <button
              key={chapter.number}
              type="button"
              aria-label={`${HOME.jump} ${chapter.name}`}
              aria-current={current ? "step" : undefined}
              onClick={() => jump(index)}
              className="flex h-11 w-12 items-center justify-end pr-[var(--gutter)]"
            >
              <span
                className={`block w-[3px] rounded-full transition-all duration-500 ease-reel ${
                  current ? "h-8 bg-paper" : "h-3 bg-rule"
                }`}
              />
            </button>
          );
        })}
      </nav>

      <nav
        aria-label={HOME.chaptersLabel}
        className="wrap absolute inset-x-0 bottom-0 z-30 hidden grid-cols-6 gap-x-2 pb-6 md:grid"
      >
        {CHAPTERS.map((chapter, index) => {
          const current = index === active;
          return (
            <button
              key={chapter.number}
              type="button"
              aria-current={current ? "step" : undefined}
              onClick={() => jump(index)}
              className={`flex min-h-16 cursor-pointer flex-col gap-1 border-t pt-3 text-left transition-colors duration-200 ${
                current
                  ? "border-t-[3px] border-paper text-paper"
                  : "border-rule text-quiet hover:text-paper"
              }`}
            >
              <span className="text-[13px] font-medium">{chapter.number}</span>
              <span className="text-[17px] font-semibold tracking-[-0.02em]">
                {chapter.name}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
