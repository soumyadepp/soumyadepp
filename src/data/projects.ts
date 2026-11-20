import type { ReelMode } from "@/components/reel/engine";
import { GRADES } from "@/content/site";

export type Screen = {
  src: string;
  alt: string;
  width: number;
  height: number;
  span?: "wide" | "narrow";
  paper?: boolean;
};

export type Install = {
  name: string;
  logo: string;
  registry: string;
  command: string;
  href: string;
  invert?: boolean;
  wide?: boolean;
};

export type Project = {
  slug: string;
  name: string;
  summary: string;
  why: string;
  features: { name: string; line: string }[];
  stack: string[];
  status: string;
  year: string;
  featured: boolean;
  mode: ReelMode;
  grade: string;
  frameLabel: string;
  cover?: string;
  screens?: Screen[];
  post?: string;
  github?: string;
  live?: string;
  install?: Install[];
};

export const projects: Project[] = [
  {
    slug: "popsub",
    name: "PopSub",
    cover: "/images/blog/building-popsub/cover.svg",
    summary:
      "A WebSocket publish/subscribe broker in Rust with topic logs, durable sessions and at-least-once delivery, and client libraries for Rust, TypeScript, Python and Go.",
    why: "Developers who need reliable message distribution often do not need the operations that come with a full message platform. PopSub is one binary and a data directory, with a JSON protocol any language can speak.",
    features: [
      {
        name: "Topic logs",
        line: "Every message gets a sequence number, so subscribers replay history and resume without gaps or repeats.",
      },
      {
        name: "At-least-once",
        line: "QoS 1 messages are acknowledged per subscriber and retried, then stalled or sent to a dead-letter topic.",
      },
      {
        name: "Durable sessions",
        line: "Subscriptions and positions survive disconnects, application restarts and server restarts.",
      },
      {
        name: "Wildcards and groups",
        line: "Subscribe to orders/#, or share a topic across a group of workers.",
      },
      {
        name: "Users and permissions",
        line: "Per-topic access, Argon2id passwords, JWTs and rate limits, managed on a running server.",
      },
      {
        name: "Four client libraries",
        line: "Rust, TypeScript, Python and Go, each held to one shared scenario suite.",
      },
    ],
    stack: ["Rust", "Tokio", "WebSocket", "TypeScript", "Python", "Go"],
    status: "Released, v0.1.0",
    year: "2026",
    featured: true,
    mode: "broker",
    grade: GRADES.sodium,
    frameLabel: "Trails converging on a broker and fanning out to subscribers",
    post: "building-popsub",
    github: "https://github.com/soumyadepp/popsub",
    install: [
      {
        name: "Rust",
        logo: "/images/logos/rust.svg",
        invert: true,
        registry: "crates.io",
        command: "cargo add popsub_sdk",
        href: "https://crates.io/crates/popsub_sdk",
      },
      {
        name: "TypeScript",
        logo: "/images/logos/typescript.svg",
        registry: "npm",
        command: "npm install popsub",
        href: "https://www.npmjs.com/package/popsub",
      },
      {
        name: "Python",
        logo: "/images/logos/python.svg",
        registry: "PyPI",
        command: "pip install popsub",
        href: "https://pypi.org/project/popsub/",
      },
      {
        name: "Go",
        logo: "/images/logos/go.svg",
        registry: "Go modules",
        command: "go get github.com/soumyadepp/popsub/clients/go",
        href: "https://pkg.go.dev/github.com/soumyadepp/popsub/clients/go",
      },
      {
        name: "Server",
        logo: "/images/logos/docker.svg",
        registry: "ghcr.io",
        command: "docker pull ghcr.io/soumyadepp/popsub:0.1",
        href: "https://github.com/soumyadepp/popsub/pkgs/container/popsub",
        wide: true,
      },
    ],
  },
  {
    slug: "neurosim",
    name: "neurosim",
    summary:
      "An interactive brain simulator showing how dementia spreads through a real map of the human brain.",
    why: "Disease progression is hard to picture from a paper. neurosim lets you watch a model of it move through the brain's own wiring, and checks that model against published patient data.",
    features: [
      {
        name: "A real connectome",
        line: "The simulation runs on a measured map of brain connections.",
      },
      {
        name: "Spread you can watch",
        line: "The model advances step by step across regions.",
      },
      {
        name: "Checked against evidence",
        line: "Results are compared with imaging from living patients.",
      },
      {
        name: "Works on a phone",
        line: "The story view is sized and tuned for small screens.",
      },
    ],
    stack: ["TypeScript", "Vite"],
    status: "Live",
    year: "2026",
    featured: true,
    mode: "spiral",
    grade: GRADES.daylight,
    frameLabel: "Trails spreading outward from a centre",
    screens: [
      {
        src: "/images/projects/neurosim/story.jpg",
        alt: "The simulator at age 77: a brain model above a chart of how treatment timing changes the outcome",
        width: 1512,
        height: 793,
        span: "wide",
      },
      {
        src: "/images/projects/neurosim/landing.jpg",
        alt: "The opening screen, with the headline that dementia begins years before anyone notices",
        width: 1512,
        height: 850,
        span: "wide",
      },
    ],
    github: "https://github.com/soumyadepp/neurosim",
    live: "https://soumyadepp.github.io/neurosim/",
  },
  {
    slug: "movewell",
    name: "MoveWell",
    summary:
      "Gentle, camera-guided exercise for older adults, in English and Hindi.",
    why: "Physiotherapy exercises are easy to do wrong at home. MoveWell watches through the camera and guides each movement, built first for older adults who may not be comfortable with apps.",
    features: [
      {
        name: "Camera guidance",
        line: "Pose tracking follows each movement as it happens.",
      },
      {
        name: "Hands-free sessions",
        line: "Spoken commands work even when they are misheard.",
      },
      {
        name: "A personal range",
        line: "Targets adjust to how far each person can move.",
      },
      { name: "Two languages", line: "English and Hindi throughout." },
    ],
    stack: ["Svelte", "MediaPipe", "TypeScript"],
    status: "Live",
    year: "2026",
    featured: true,
    mode: "contours",
    grade: GRADES.moss,
    frameLabel: "Contour lines slowly shifting like a map of terrain",
    screens: [
      {
        src: "/images/projects/movewell/today.jpg",
        alt: "The Today screen, greeting the user with the day's four-minute session",
        width: 1512,
        height: 793,
        span: "wide",
      },
      {
        src: "/images/projects/movewell/exercises.jpg",
        alt: "The six exercises in the plan, each with a photograph and its purpose",
        width: 1512,
        height: 793,
      },
      {
        src: "/images/projects/movewell/exercise.jpg",
        alt: "An exercise page with numbered steps, why it helps and a safety note",
        width: 1512,
        height: 793,
      },
      {
        src: "/images/projects/movewell/week.jpg",
        alt: "The weekly view with daily minutes and recent sessions",
        width: 1512,
        height: 793,
      },
      {
        src: "/images/projects/movewell/welcome.jpg",
        alt: "The welcome screen that sets the app up in three steps",
        width: 1512,
        height: 850,
      },
    ],
    github: "https://github.com/soumyadepp/movewell",
    live: "https://soumyadepp.github.io/movewell/",
  },
  {
    slug: "format-benchmark",
    name: "Format benchmark",
    cover: "/images/projects/format-benchmark/cover.svg",
    summary:
      "Measures how language models respond when given the same data in different formats.",
    why: "The format you hand a model changes what it costs and how well it answers. This toolkit measures that difference instead of guessing.",
    features: [
      {
        name: "Several formats",
        line: "The same data is sent as JSON, TOON and other encodings.",
      },
      {
        name: "Comparable results",
        line: "Responses are scored the same way for every format.",
      },
    ],
    stack: ["Python"],
    status: "Open source",
    year: "2026",
    featured: false,
    mode: "waves",
    grade: GRADES.paper,
    frameLabel: "Lines of light rising and falling like waves",
    github: "https://github.com/soumyadepp/benchmark-json-toon-vsc",
  },
  {
    slug: "photorecipe",
    name: "PhotoRecipe",
    summary:
      "Photograph your ingredients and get a complete, editable recipe in seconds.",
    why: "Deciding what to cook from what is already in the kitchen is a small daily problem. PhotoRecipe identifies the ingredients in a photo and writes a recipe around them.",
    features: [
      {
        name: "Ingredient recognition",
        line: "A vision model identifies what is in the photo.",
      },
      {
        name: "Recipe generation",
        line: "A name, ingredient list and steps, written on the spot.",
      },
      {
        name: "Editable and exportable",
        line: "Change anything, then save it as a PDF.",
      },
    ],
    stack: ["Next.js", "Gemini", "Genkit", "Firebase"],
    status: "Archived",
    year: "2025",
    featured: false,
    mode: "contours",
    grade: GRADES.sodium,
    frameLabel: "Contour lines slowly shifting like a map of terrain",
    screens: [
      {
        src: "/images/projects/photorecipe/home.jpg",
        alt: "The start screen: upload a photo or paste an image link to get a recipe",
        width: 1512,
        height: 850,
        span: "wide",
      },
    ],
    github: "https://github.com/soumyadepp/PhotoRecipe",
  },
  {
    slug: "northern-cleaning-crew",
    name: "Northern Cleaning Crew",
    summary:
      "A client website where a cleaning business shows its services and visitors request quotes.",
    why: "A small business needed to present its services, manage them without a developer, and take quote requests directly from the site.",
    features: [
      {
        name: "Service management",
        line: "The owner edits services from a dashboard.",
      },
      {
        name: "Quote requests",
        line: "Visitors price a job and ask for a quote in one flow.",
      },
      {
        name: "Works on any screen",
        line: "Laid out for phones first, then desktop.",
      },
    ],
    stack: ["React", "TypeScript", "Tailwind CSS", "Firebase"],
    status: "Completed",
    year: "2024",
    featured: false,
    mode: "orbits",
    grade: GRADES.daylight,
    frameLabel: "Points of light circling on tilted orbits",
    screens: [
      {
        src: "/images/ncc/desktop-image-1.png",
        alt: "The home page with a pricing calculator for cleaning services",
        width: 3454,
        height: 1994,
        span: "wide",
      },
      {
        src: "/images/ncc/desktop-image-2.png",
        alt: "A second desktop view of the site",
        width: 3454,
        height: 1994,
        span: "wide",
      },
      {
        src: "/images/ncc/mobile-image-1.png",
        alt: "The site on a phone",
        width: 784,
        height: 1686,
        span: "narrow",
      },
      {
        src: "/images/ncc/mobile-image-2.png",
        alt: "A second phone view",
        width: 784,
        height: 1686,
        span: "narrow",
      },
    ],
  },
];

/**
 * Finds a project by its URL slug.
 *
 * Args:
 *   slug: The slug from the route.
 *
 * Returns:
 *   The matching project, or undefined when there is none.
 */
export function getProject(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}
