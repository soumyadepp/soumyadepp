import type { Metadata } from "next";
import Link from "next/link";
import Frame from "@/components/reel/Frame";
import { GRADES, NOT_FOUND } from "@/content/site";

export const metadata: Metadata = {
  title: NOT_FOUND.kicker,
};

/**
 * The page shown for any address that does not exist, set over the black
 * hole frame.
 */
export default function NotFound() {
  return (
    <section className="relative flex min-h-svh flex-col justify-end overflow-hidden">
      <Frame
        mode="hole"
        grade={GRADES.tungsten}
        label={NOT_FOUND.frameLabel}
        focusX={0.5}
        focusY={0.36}
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-40 bg-linear-to-b from-stage to-transparent"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-stage from-20% to-transparent"
      />
      <div className="wrap relative flex flex-col gap-5 pb-14 md:pb-20">
        <p className="t-label text-quiet">{NOT_FOUND.kicker}</p>
        <h1 className="t-title max-w-[48rem]">{NOT_FOUND.title}</h1>
        <p className="t-lead max-w-[36rem] text-body">{NOT_FOUND.line}</p>
        <div className="mt-1 flex flex-wrap gap-3">
          <Link
            href="/"
            className="t-body flex min-h-12 items-center border border-paper px-5 font-semibold transition-colors duration-200 hover:bg-paper hover:text-stage"
          >
            {NOT_FOUND.home}
          </Link>
          <Link
            href="/projects"
            className="t-body flex min-h-12 items-center border border-rule px-5 font-semibold text-body transition-colors duration-200 hover:border-paper hover:text-paper"
          >
            {NOT_FOUND.work}
          </Link>
        </div>
      </div>
    </section>
  );
}
