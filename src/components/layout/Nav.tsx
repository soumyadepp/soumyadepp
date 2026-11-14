"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Frame from "@/components/reel/Frame";
import {
  CHAPTERS,
  GRADES,
  HOME_ANCHORS,
  MENU,
  NAV,
  SITE,
  type Chapter,
} from "@/content/site";

const REST: Pick<Chapter, "mode" | "grade"> = {
  mode: "contours",
  grade: GRADES.tungsten,
};

function chapterFor(href: string): Chapter | undefined {
  return CHAPTERS.find(
    (chapter) => chapter.href === href && chapter.mode !== "pull",
  );
}

/**
 * The site navigation, laid over the top of every page.
 *
 * On a phone it opens as a full-screen menu whose background plays the
 * animation of whichever section is being touched. It is hidden on the
 * printable resume.
 */
export default function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [preview, setPreview] = useState<Chapter | undefined>(undefined);
  const printing = pathname === "/resume";
  const section = HOME_ANCHORS.find((item) => pathname.startsWith(item.path));
  const home = section ? `/#${section.anchor}` : "/";
  const sections = NAV.filter((item) => item.href !== "/resume");
  const current = sections.find((item) => pathname.startsWith(item.href));
  const scene = preview ?? (current && chapterFor(current.href)) ?? REST;

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  if (printing) return null;

  const close = () => {
    setOpen(false);
    setPreview(undefined);
  };

  return (
    <>
      <header className="wrap absolute inset-x-0 top-0 z-40 text-paper">
        <div className="flex items-center justify-between py-3">
          <Link
            href={home}
            className="py-3 text-lg font-semibold tracking-[-0.02em]"
          >
            {SITE.name}
          </Link>

          <nav className="hidden gap-8 text-[15px] font-medium tracking-[-0.01em] md:flex">
            {NAV.map((item) => {
              const active = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`border-b-2 py-3 transition-opacity duration-200 hover:opacity-70 ${
                    active ? "border-paper" : "border-transparent"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <button
            type="button"
            className="flex min-h-11 items-center gap-3 text-[15px] font-medium md:hidden"
            aria-expanded={open}
            aria-controls="site-menu"
            onClick={() => setOpen(true)}
          >
            <span aria-hidden="true" className="flex flex-col gap-1.5">
              <span className="block h-0.5 w-6 bg-paper" />
              <span className="block h-0.5 w-4 self-end bg-paper" />
            </span>
            {MENU.open}
          </button>
        </div>
      </header>

      {open && (
        <div
          id="site-menu"
          role="dialog"
          aria-modal="true"
          aria-label={MENU.open}
          className="fade fixed inset-0 z-50 flex flex-col overflow-hidden bg-stage text-paper md:hidden"
        >
          <div className="absolute inset-0 opacity-70">
            <Frame
              mode={scene.mode}
              grade={scene.grade}
              label={MENU.backdrop}
              focusX={0.62}
              focusY={0.3}
            />
          </div>
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-linear-to-t from-stage from-10% via-stage/70 to-stage/20"
          />

          <div className="wrap relative flex items-center justify-between py-3">
            <Link
              href={home}
              className="py-3 text-lg font-semibold tracking-[-0.02em]"
              onClick={close}
            >
              {SITE.name}
            </Link>
            <button
              type="button"
              className="flex min-h-11 items-center gap-3 text-[15px] font-medium"
              onClick={close}
            >
              <span aria-hidden="true" className="relative block size-5">
                <span className="absolute top-1/2 left-0 block h-0.5 w-5 rotate-45 bg-paper" />
                <span className="absolute top-1/2 left-0 block h-0.5 w-5 -rotate-45 bg-paper" />
              </span>
              {MENU.close}
            </button>
          </div>

          <nav className="wrap relative flex flex-1 flex-col justify-end pb-6">
            {sections.map((item, index) => {
              const active = item === current;
              const chapter = chapterFor(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  onClick={close}
                  onPointerEnter={() => setPreview(chapter)}
                  onFocus={() => setPreview(chapter)}
                  style={{ animationDelay: `${index * 60}ms` }}
                  className={`cut grid grid-cols-[2.75rem_1fr] items-baseline border-t py-3 ${
                    active ? "border-paper" : "border-line"
                  }`}
                >
                  <span className="t-small text-quiet">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span
                    className={`text-[clamp(2.25rem,11.5vw,3.5rem)] leading-[1.05] font-semibold tracking-[-0.04em] ${
                      active ? "text-paper" : "text-body"
                    }`}
                  >
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </nav>

          <div className="wrap relative flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-t border-rule py-5">
            <a href={`mailto:${SITE.email}`} className="t-small py-2 text-body">
              {SITE.email}
            </a>
            <Link
              href="/resume"
              className="t-label border border-paper px-4 py-3"
              onClick={close}
            >
              {MENU.resume}
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
