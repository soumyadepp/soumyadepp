"use client";

import { useEffect, useSyncExternalStore } from "react";
import { SOUND } from "@/content/site";
import {
  restoreSound,
  setSound,
  setVolume,
  soundOn,
  soundVolume,
  subscribeSound,
} from "@/lib/ambient";

const BARS = ["0ms", "-420ms", "-180ms", "-640ms"];
const LEVELS = [1, 2, 3, 4, 5];

/**
 * Turns the ambient score on and off. Every toggle on the page shares one
 * state, and the choice is remembered for the next visit.
 *
 * Args:
 *   compact: Show only the icon and leave out the volume control, for the
 *     narrow phone header where the device's own buttons set the volume.
 */
type SoundToggleProps = {
  compact?: boolean;
};

export default function SoundToggle({ compact = false }: SoundToggleProps) {
  const on = useSyncExternalStore(subscribeSound, soundOn, () => false);
  const volume = useSyncExternalStore(subscribeSound, soundVolume, () => 0.6);

  useEffect(() => {
    restoreSound();
  }, []);

  return (
    <span className="flex items-center gap-3">
      <button
        type="button"
        onClick={() => setSound(!on)}
        aria-pressed={on}
        aria-label={on ? SOUND.turnOff : SOUND.turnOn}
        title={on ? SOUND.turnOff : SOUND.turnOn}
        className="flex min-h-11 cursor-pointer items-center gap-2.5 text-[15px] font-medium tracking-[-0.01em] transition-opacity duration-200 hover:opacity-70"
      >
        <span aria-hidden="true" className="flex h-3.5 items-end gap-[3px]">
          {BARS.map((delay) => (
            <span
              key={delay}
              style={{ animationDelay: delay }}
              className={`block w-[2px] rounded-full bg-paper ${
                on ? "sound-bar h-3.5" : "h-[3px]"
              }`}
            />
          ))}
        </span>
        {!compact && <span>{SOUND.label}</span>}
      </button>
      {on && !compact && (
        <span
          role="group"
          aria-label={SOUND.volume}
          className="fade flex items-center"
        >
          {LEVELS.map((level) => {
            const current = Math.round(volume * LEVELS.length);
            return (
              <button
                key={level}
                type="button"
                onClick={() => setVolume(level / LEVELS.length)}
                aria-label={`${SOUND.volume} ${level} / ${LEVELS.length}`}
                aria-pressed={current === level}
                className="group flex h-11 w-3 cursor-pointer items-center justify-center"
              >
                <span
                  style={{ height: `${4 + level * 3}px` }}
                  className={`block w-[2px] self-center rounded-full transition-colors duration-200 ${
                    current >= level
                      ? "bg-paper"
                      : "bg-rule/50 group-hover:bg-quiet"
                  }`}
                />
              </button>
            );
          })}
        </span>
      )}
    </span>
  );
}
