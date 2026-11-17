"use client";

import { useEffect, useRef } from "react";
import { Reel, type ReelMode } from "./engine";

type FrameProps = {
  mode: ReelMode;
  grade: string;
  label: string;
  focusX?: number;
  focusY?: number;
  wideFocusX?: number;
  wideFocusY?: number;
  badges?: string[];
  overlay?: boolean;
  className?: string;
};

const WIDE_SCREEN = "(min-width: 768px)";
const NEARBY = "100%";
const IDLE_LIMIT_MS = 300;

/**
 * Runs a task when the browser is next idle, so it stays out of the work
 * the page does while it loads.
 *
 * Args:
 *   task: The work to run.
 *
 * Returns:
 *   A function that cancels the task if it hasn't run yet.
 */
function whenIdle(task: () => void): () => void {
  if (typeof window.requestIdleCallback === "function") {
    const id = window.requestIdleCallback(task, { timeout: IDLE_LIMIT_MS });
    return () => window.cancelIdleCallback(id);
  }
  const id = window.setTimeout(task, 1);
  return () => window.clearTimeout(id);
}

/**
 * A live frame: a canvas that renders the system a page describes.
 *
 * It fills its parent and shows a finished still for visitors who prefer
 * reduced motion. Its drawing engine is only built once the canvas is
 * within a screen of the viewport, and then during idle time, so frames
 * further down a page cost nothing while it loads. It animates only while
 * on screen.
 *
 * Args:
 *   mode: Which system to draw.
 *   grade: The light's colour, as an "r,g,b" string.
 *   label: What the frame shows, for screen readers.
 *   focusX: Where the system is centred across the frame, from 0 to 1.
 *   focusY: Where it is centred down the frame, from 0 to 1.
 *   wideFocusX: The centre across the frame on wide screens, when it differs.
 *   wideFocusY: The centre down the frame on wide screens, when it differs.
 *   badges: Images that orbit in the frame, as "source@weight" entries.
 *   overlay: Whether the frame blends over what is behind it.
 *   className: Extra classes for the canvas.
 */
export default function Frame({
  mode,
  grade,
  label,
  focusX,
  focusY,
  wideFocusX,
  wideFocusY,
  badges,
  overlay = false,
  className = "",
}: FrameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reelRef = useRef<Reel | null>(null);
  const calmRef = useRef(false);
  const badgeList = badges?.join(",");
  const settings = { mode, grade, focusX, focusY, wideFocusX, wideFocusY };
  const latest = useRef({ ...settings, badges: badgeList });

  useEffect(() => {
    latest.current = {
      mode,
      grade,
      focusX,
      focusY,
      wideFocusX,
      wideFocusY,
      badges: badgeList,
    };
  }, [mode, grade, focusX, focusY, wideFocusX, wideFocusY, badgeList]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    calmRef.current = calm;
    const wide = window.matchMedia(WIDE_SCREEN);

    const options = () => {
      const now = latest.current;
      return {
        mode: now.mode,
        grade: now.grade,
        focusX: wide.matches ? (now.wideFocusX ?? now.focusX) : now.focusX,
        focusY: wide.matches ? (now.wideFocusY ?? now.focusY) : now.focusY,
        badges: now.badges,
      };
    };

    let reel: Reel | null = null;
    let visible = false;
    let cancelBuild: (() => void) | null = null;

    const build = () => {
      cancelBuild = null;
      if (reel) return;
      reel = new Reel(canvas, options());
      reelRef.current = reel;
      if (calm) reel.still();
      else if (visible) reel.start();
    };

    const resize = new ResizeObserver(() => {
      if (!reel) return;
      reel.resize();
      if (calm) reel.still();
    });
    resize.observe(canvas);

    const nearby = new IntersectionObserver(
      (entries) => {
        if (!entries[entries.length - 1].isIntersecting) return;
        nearby.disconnect();
        if (!reel && !cancelBuild) cancelBuild = whenIdle(build);
      },
      { rootMargin: NEARBY },
    );
    nearby.observe(canvas);

    const visibility = new IntersectionObserver((entries) => {
      visible = entries[entries.length - 1].isIntersecting;
      if (!reel || calm) return;
      if (visible) reel.start();
      else reel.stop();
    });
    visibility.observe(canvas);

    const onWidth = () => {
      if (!reel) return;
      reel.update(options());
      if (calm) reel.still();
    };
    wide.addEventListener("change", onWidth);

    const onPointer = (event: PointerEvent) => {
      if (event.pointerType !== "mouse" || !visible || !reel) return;
      const box = canvas.getBoundingClientRect();
      const x = event.clientX - box.left;
      const y = event.clientY - box.top;
      const inside = x >= 0 && y >= 0 && x <= box.width && y <= box.height;
      reel.setPointer(inside ? { x, y } : null);
    };
    const onLeave = () => reel?.setPointer(null);
    if (!calm) {
      window.addEventListener("pointermove", onPointer);
      document.addEventListener("pointerleave", onLeave);
    }

    return () => {
      cancelBuild?.();
      wide.removeEventListener("change", onWidth);
      window.removeEventListener("pointermove", onPointer);
      document.removeEventListener("pointerleave", onLeave);
      resize.disconnect();
      nearby.disconnect();
      visibility.disconnect();
      reel?.stop();
      reelRef.current = null;
    };
  }, []);

  useEffect(() => {
    const reel = reelRef.current;
    if (!reel) return;
    const wide = window.matchMedia(WIDE_SCREEN).matches;
    reel.update({
      mode,
      grade,
      focusX: wide ? (wideFocusX ?? focusX) : focusX,
      focusY: wide ? (wideFocusY ?? focusY) : focusY,
      badges: badgeList,
    });
    if (calmRef.current) reel.still();
  }, [mode, grade, focusX, focusY, wideFocusX, wideFocusY, badgeList]);

  return (
    <canvas
      ref={canvasRef}
      role="img"
      aria-label={label}
      className={`absolute inset-0 block h-full w-full ${overlay ? "mix-blend-screen" : ""} ${className}`}
    />
  );
}
