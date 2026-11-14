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
  screens?: Screen[];
  post?: string;
  github?: string;
  live?: string;
};

export const projects: Project[] = [
  {
    slug: "popsub",
    name: "PopSub",
    summary:
      "A real-time pub/sub server over WebSockets with topic routing and at-least-once delivery.",
    why: "Developers who need reliable message distribution often do not need the operations that come with a full message platform. PopSub is one self-contained process for edge deployments and local development.",
    features: [
      {
        name: "Topic routing",
        line: "Messages go only to the subscribers of their topic.",
      },
      {
        name: "At-least-once",
        line: "Delivery is acknowledged, and retried until it is.",
      },
      {
        name: "Replay buffer",
        line: "A late subscriber receives the most recent messages.",
      },
      {
        name: "Signed access",
        line: "Clients authenticate with JSON Web Tokens.",
      },
      {
        name: "Optional persistence",
        line: "Messages can be stored on disk with sled.",
      },
    ],
    stack: ["Rust", "Tokio", "WebSocket", "sled"],
    status: "In development",
    year: "2026",
    featured: true,
    mode: "broker",
    grade: GRADES.sodium,
    frameLabel: "Trails converging on a broker and fanning out to subscribers",
    post: "building-popsub",
    screens: [
      {
        src: "/images/blog/building-popsub/architecture.svg",
        alt: "Publishers send messages into the broker, which holds topics, clients, pending acknowledgements and a store, and fans messages out to subscribers",
        width: 1200,
        height: 560,
        span: "wide",
        paper: true,
      },
      {
        src: "/images/blog/building-popsub/retries.svg",
        alt: "An unacknowledged message is retried every five seconds and dropped after the fifth retry",
        width: 1200,
        height: 380,
        span: "wide",
        paper: true,
      },
    ],
    github: "https://github.com/soumyadepp/popsub",
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
