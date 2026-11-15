"use client";

import { useEffect, useRef } from "react";
import { Reel, type ReelMode } from "./engine";

type FrameProps = {
  mode: ReelMode;
  grade: string;
  label: string;
  focusX?: number;
  focusY?: number;
  badges?: string[];
  overlay?: boolean;
  className?: string;
};

/**
 * A live frame: a canvas that renders the system a page describes.
 *
 * It fills its parent, pauses while off screen, and shows a finished still
 * for visitors who prefer reduced motion.
 */
export default function Frame({
  mode,
  grade,
  label,
  focusX,
  focusY,
  badges,
  overlay = false,
  className = "",
}: FrameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reelRef = useRef<Reel | null>(null);
  const calmRef = useRef(false);
  const badgeList = badges?.join(",");
  const initial = useRef({ mode, grade, focusX, focusY, badges: badgeList });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const reel = new Reel(canvas, initial.current);
    reelRef.current = reel;
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    calmRef.current = calm;

    const resize = new ResizeObserver(() => {
      reel.resize();
      if (calm) reel.still();
    });
    resize.observe(canvas);

    let visible = false;
    const visibility = new IntersectionObserver((entries) => {
      visible = entries[entries.length - 1].isIntersecting;
      if (calm) return;
      if (visible) reel.start();
      else reel.stop();
    });
    visibility.observe(canvas);

    if (calm) reel.still();

    const onPointer = (event: PointerEvent) => {
      if (event.pointerType !== "mouse" || !visible) return;
      const box = canvas.getBoundingClientRect();
      const x = event.clientX - box.left;
      const y = event.clientY - box.top;
      const inside = x >= 0 && y >= 0 && x <= box.width && y <= box.height;
      reel.setPointer(inside ? { x, y } : null);
    };
    const onLeave = () => reel.setPointer(null);
    if (!calm) {
      window.addEventListener("pointermove", onPointer);
      document.addEventListener("pointerleave", onLeave);
    }

    return () => {
      window.removeEventListener("pointermove", onPointer);
      document.removeEventListener("pointerleave", onLeave);
      resize.disconnect();
      visibility.disconnect();
      reel.stop();
      reelRef.current = null;
    };
  }, []);

  useEffect(() => {
    const reel = reelRef.current;
    if (!reel) return;
    reel.update({ mode, grade, focusX, focusY, badges: badgeList });
    if (calmRef.current) reel.still();
  }, [mode, grade, focusX, focusY, badgeList]);

  return (
    <canvas
      ref={canvasRef}
      role="img"
      aria-label={label}
      className={`absolute inset-0 block h-full w-full ${overlay ? "mix-blend-screen" : ""} ${className}`}
    />
  );
}
