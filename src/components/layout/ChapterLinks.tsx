import Link from "next/link";
import { CHAPTER_LINKS } from "@/content/site";

type ChapterLinksProps = {
  previous: { label: string; href: string };
  next?: { label: string; href: string };
};

/**
 * The previous and next chapter links that close each page.
 */
export default function ChapterLinks({ previous, next }: ChapterLinksProps) {
  return (
    <nav className="wrap flex flex-wrap items-center justify-between gap-6 py-14">
      <Link
        href={previous.href}
        className="t-body py-3 text-quiet hover:text-paper"
      >
        {CHAPTER_LINKS.previous}: {previous.label}
      </Link>
      {next && (
        <Link href={next.href} className="t-sub link-line">
          {CHAPTER_LINKS.next}: {next.label}
        </Link>
      )}
    </nav>
  );
}
