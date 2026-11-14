"use client";

import { RESUME_PAGE } from "@/content/site";

/**
 * Opens the browser's print dialog, where the resume can be saved as a PDF.
 */
export default function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="t-label min-h-11 cursor-pointer border border-stage px-4 text-stage hover:bg-stage hover:text-paper print:hidden"
    >
      {RESUME_PAGE.print}
    </button>
  );
}
