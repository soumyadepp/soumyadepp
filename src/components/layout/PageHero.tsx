import Crumb from "@/components/layout/Crumb";
import Frame from "@/components/reel/Frame";
import type { ReelMode } from "@/components/reel/engine";

type PageHeroProps = {
  anchor: string;
  parent?: { label: string; href: string };
  kicker: string;
  title: string;
  mode: ReelMode;
  grade: string;
  frameLabel: string;
  display?: boolean;
  focusX?: number;
  focusY?: number;
  badges?: string[];
  children?: React.ReactNode;
};

/**
 * The opening of a chapter page: a live frame with the title set over it.
 */
export default function PageHero({
  anchor,
  parent,
  kicker,
  title,
  mode,
  grade,
  frameLabel,
  display = false,
  focusX,
  focusY,
  badges,
  children,
}: PageHeroProps) {
  return (
    <section className="relative flex min-h-[24rem] flex-col justify-end overflow-hidden md:min-h-[27rem]">
      <Frame
        mode={mode}
        grade={grade}
        label={frameLabel}
        focusX={focusX}
        focusY={focusY}
        badges={badges}
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-36 bg-linear-to-b from-stage/85 to-transparent"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-3/5 bg-linear-to-t from-stage from-10% to-transparent"
      />
      <div className="wrap relative flex flex-col gap-4 pb-10">
        <Crumb anchor={anchor} label={kicker} parent={parent} />
        <h1 className={`max-w-[56rem] ${display ? "t-display" : "t-title"}`}>
          {title}
        </h1>
        {children}
      </div>
    </section>
  );
}
