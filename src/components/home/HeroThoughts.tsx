"use client";

import { useEffect, useState } from "react";
import { PHOTO_FRAME } from "@/components/home/HeroPhoto";
import { HOME } from "@/content/site";
import { onSoundStart } from "@/lib/ambient";

const START_DELAY = 1800;
const CLOUD =
  "M129.3,15.0 A33.9,33.9 0 0 1 192.3,22.6 A25.3,25.3 0 0 1 236.0,44.7 A14.3,14.3 0 0 1 242.9,68.5 A20.5,20.5 0 0 1 216.1,92.8 A29.2,29.2 0 0 1 161.0,107.2 A34.7,34.7 0 0 1 102.0,107.6 A35.3,35.3 0 0 1 43.7,92.7 A20.5,20.5 0 0 1 16.9,68.0 A16.3,16.3 0 0 1 28.0,41.0 A20.7,20.7 0 0 1 63.8,23.7 A33.8,33.8 0 0 1 129.3,15.0 Z";

/**
 * A thought cloud above the subject's head in the intro photograph, cycling
 * through short jokes. Shown on wide screens only, and held on the first
 * thought when the visitor prefers reduced motion. Switching sound on
 * interrupts the cycle with a line about time.
 */
export default function HeroThoughts() {
  const [index, setIndex] = useState(0);
  const [started, setStarted] = useState(false);
  const [moving, setMoving] = useState(true);
  const [cue, setCue] = useState(0);
  const [cued, setCued] = useState(false);

  useEffect(() => {
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timer = window.setTimeout(() => {
      setMoving(!calm);
      setStarted(true);
    }, START_DELAY);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(
    () =>
      onSoundStart(() => {
        setStarted(true);
        setCued(true);
        setCue((current) => current + 1);
      }),
    [],
  );

  const next = () =>
    setIndex((current) => (current + 1) % HOME.thoughts.length);

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none hidden lg:block ${PHOTO_FRAME}`}
    >
      {started && (
        <div className="thought-float absolute bottom-[79%] left-[41%]">
          <div
            key={cued ? `cue-${cue}` : index}
            onAnimationEnd={(event) => {
              if (event.target !== event.currentTarget) return;
              if (cued) setCued(false);
              else if (moving) next();
            }}
            className={`relative ${cued ? "thought thought-long" : moving ? "thought" : ""}`}
          >
            <span className="absolute -bottom-5 left-[14%] h-4 w-5 rounded-[50%] bg-paper" />
            <span className="absolute -bottom-10 left-[6%] h-2.5 w-3 rounded-[50%] bg-paper" />
            <svg
              viewBox="0 0 260 124"
              className="block h-[7.75rem] w-[16.25rem] overflow-visible drop-shadow-[0_14px_30px_rgb(0_0_0/0.5)]"
            >
              <path d={CLOUD} className="fill-paper" />
            </svg>
            <p className="absolute inset-0 flex items-center justify-center px-12 text-center text-[16px] leading-snug font-semibold tracking-[-0.01em] text-balance text-stage">
              {cued ? HOME.soundThought : HOME.thoughts[index]}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
