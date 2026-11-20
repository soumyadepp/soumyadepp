"use client";

import { useEffect, useRef, useState } from "react";
import { WORK_PAGE } from "@/content/site";

/**
 * How long the button says it copied before reading "Copy" again, in
 * milliseconds.
 */
const COPIED_FOR_MS = 1500;

/**
 * The copy icon: two overlapping sheets.
 *
 * Returns:
 *   An inline SVG drawn in the current text colour.
 */
function CopyIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="size-4"
    >
      <rect x="9" y="9" width="11" height="11" rx="2" />
      <path d="M5 15V6a2 2 0 0 1 2-2h8" />
    </svg>
  );
}

/**
 * The check mark shown for a moment after a copy.
 *
 * Returns:
 *   An inline SVG drawn in the current text colour.
 */
function CheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="size-4"
    >
      <path d="M5 12.5l4.5 4.5L19 7.5" />
    </svg>
  );
}

/**
 * A shell command in a terminal-style strip with an icon button that
 * copies it.
 *
 * The `$` prompt is shown but can't be selected, and a click on the command
 * selects all of it, so it can also be copied by hand without the prompt.
 * A command wider than the strip scrolls sideways, and its right edge fades
 * out so it reads as cut off rather than finished.
 *
 * Args:
 *   command: The command to show and copy.
 */
type CopyCommandProps = {
  command: string;
};

export default function CopyCommand({ command }: CopyCommandProps) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  /**
   * Writes the command to the clipboard and shows "Copied" for a moment.
   * When the clipboard isn't available (an insecure page, or permission
   * refused) the label stays as it was and the command can still be
   * selected by hand.
   */
  async function copy() {
    try {
      await navigator.clipboard.writeText(command);
    } catch {
      return;
    }
    setCopied(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), COPIED_FOR_MS);
  }

  return (
    <div className="flex items-stretch border border-line bg-stage">
      <code className="t-small min-w-0 flex-1 overflow-x-auto whitespace-nowrap px-3 py-2 font-mono text-body [mask-image:linear-gradient(to_right,black_calc(100%-1.5rem),transparent)]">
        <span aria-hidden="true" className="mr-2 select-none text-quiet">
          {WORK_PAGE.prompt}
        </span>
        <span className="select-all">{command}</span>
      </code>
      <button
        type="button"
        onClick={copy}
        aria-label={`${WORK_PAGE.copy}: ${command}`}
        title={copied ? WORK_PAGE.copied : WORK_PAGE.copy}
        className={`flex shrink-0 cursor-pointer items-center border-l border-line px-3 transition-colors duration-200 hover:text-paper ${copied ? "text-paper" : "text-quiet"}`}
      >
        {copied ? <CheckIcon /> : <CopyIcon />}
        <span aria-live="polite" className="sr-only">
          {copied ? WORK_PAGE.copied : ""}
        </span>
      </button>
    </div>
  );
}
