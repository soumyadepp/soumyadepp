"use client";

import { useEffect, useRef } from "react";
import SubjectPhoto from "@/components/photo/SubjectPhoto";
import Frame from "@/components/reel/Frame";
import { CHAPTERS } from "@/content/site";

/**
 * The intro frame: the desk photograph filling the screen, with light
 * orbiting the laptop behind the subject.
 *
 * The photograph keeps its own proportions and is shifted sideways on narrow
 * screens so the subject stays in view. With a mouse, a warm light follows
 * the pointer across the room behind the subject.
 */
export default function HeroPhoto() {
  const [intro] = CHAPTERS;
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const onPointer = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      const box = element.getBoundingClientRect();
      const x = ((event.clientX - box.left) / box.width) * 100;
      const y = ((event.clientY - box.top) / box.height) * 100;
      element.style.setProperty("--spot-x", `${x.toFixed(2)}%`);
      element.style.setProperty("--spot-y", `${y.toFixed(2)}%`);
      element.style.setProperty("--spot-on", "1");
    };
    const onLeave = () => element.style.setProperty("--spot-on", "0");
    window.addEventListener("pointermove", onPointer);
    document.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onPointer);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div
      ref={ref}
      className="fade absolute top-1/2 left-[min(0px,calc(50vw-0.4*max(100vw,177.78svh,71.2rem)))] aspect-video w-[max(100vw,177.78svh,71.2rem)] -translate-y-1/2"
    >
      <div className="drift absolute inset-0">
        <SubjectPhoto sizes="(min-width: 768px) 100vw, 180svh" priority>
          <div aria-hidden="true" className="spotlight absolute inset-0" />
          <Frame
            mode={intro.mode}
            grade={intro.grade}
            label={intro.frameLabel}
            focusX={0.652}
            focusY={0.735}
            overlay
          />
        </SubjectPhoto>
      </div>
    </div>
  );
}
