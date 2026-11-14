import { notFound } from "next/navigation";
import Frame from "@/components/reel/Frame";
import type { ReelMode } from "@/components/reel/engine";
import { GRADES } from "@/content/site";

const SAMPLES: { mode: ReelMode; label: string; grade: string }[] = [
  { mode: "orbits", label: "Orbits (Experience, new)", grade: GRADES.tungsten },
  { mode: "broker", label: "Broker (Projects, PopSub)", grade: GRADES.sodium },
  { mode: "spiral", label: "Spiral (Talks, current)", grade: GRADES.moss },
  { mode: "ripples", label: "Ripples (new, unused)", grade: GRADES.moss },
  { mode: "waves", label: "Waves (Writing, new)", grade: GRADES.paper },
  { mode: "contours", label: "Contours (About, new)", grade: GRADES.tungsten },
  { mode: "flow", label: "Flow (old About)", grade: GRADES.tungsten },
  { mode: "hole", label: "Black hole (Contact)", grade: GRADES.tungsten },
];

/**
 * A development-only page that shows every animation side by side.
 */
export default function LabPage() {
  if (process.env.NODE_ENV === "production") notFound();

  return (
    <div className="wrap grid gap-6 pt-28 pb-16 md:grid-cols-2">
      {SAMPLES.map((sample) => (
        <figure key={sample.mode} className="flex flex-col gap-3">
          <div className="relative h-[22rem] overflow-hidden border border-line">
            <Frame
              mode={sample.mode}
              grade={sample.grade}
              label={sample.label}
            />
          </div>
          <figcaption className="t-label text-quiet">{sample.label}</figcaption>
        </figure>
      ))}
    </div>
  );
}
