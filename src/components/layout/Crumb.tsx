import Link from "next/link";
import { CRUMB } from "@/content/site";

type CrumbProps = {
  anchor: string;
  label: string;
  parent?: { label: string; href: string };
};

/**
 * The line above a page title: a link back to the home overview, then where
 * the visitor is now.
 *
 * Args:
 *   anchor: The home section to return to, such as "experience".
 *   label: The name of the current page or section.
 *   parent: An optional page between the overview and this one.
 */
export default function Crumb({ anchor, label, parent }: CrumbProps) {
  return (
    <nav
      aria-label={CRUMB.label}
      className="t-label flex flex-wrap items-center gap-x-3 gap-y-1 text-quiet"
    >
      <Link
        href={`/#${anchor}`}
        className="-my-3 flex items-center gap-2 py-3 text-paper hover:opacity-70"
      >
        <span aria-hidden="true">←</span>
        {CRUMB.home}
      </Link>
      <span aria-hidden="true">/</span>
      {parent && (
        <>
          <Link
            href={parent.href}
            className="-my-3 py-3 text-paper hover:opacity-70"
          >
            {parent.label}
          </Link>
          <span aria-hidden="true">/</span>
        </>
      )}
      <span>{label}</span>
    </nav>
  );
}
