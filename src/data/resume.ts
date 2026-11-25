import { SITE, SOCIALS } from "@/content/site";
import { engagements } from "@/data/experience";

export type ResumeRole = {
  title: string;
  company: string;
  location: string;
  period: string;
  bullets: string[];
};

type RoleSource = {
  company: string;
  positions: string[];
  bullets: string[];
};

export type ResumeProject = {
  name: string;
  stack: string;
  link: string;
  bullets: string[];
};

/**
 * Builds a resume role from the experience data, so titles, places and
 * dates are written once.
 *
 * Args:
 *   source: The company, the position titles the role covers and the
 *     resume bullets for it.
 *
 * Returns:
 *   The role, titled after its latest position and dated from the first
 *   position's start to the latest position's end.
 *
 * Raises:
 *   Error: When the company or a position is missing from the experience
 *     data.
 */
function roleFrom(source: RoleSource): ResumeRole {
  const engagement = engagements.find(
    (item) => item.company === source.company,
  );
  if (!engagement) throw new Error(`Unknown company: ${source.company}`);
  const covered = engagement.positions.filter((position) =>
    source.positions.includes(position.title),
  );
  if (covered.length !== source.positions.length) {
    throw new Error(`Unknown position at ${source.company}`);
  }
  const latest = covered[0];
  const first = covered[covered.length - 1];
  const [start] = first.period.split(PERIOD_JOIN);
  const [, end] = latest.period.split(PERIOD_JOIN);
  return {
    title: latest.title,
    company: engagement.company,
    location: `${engagement.location}, ${COUNTRY}`,
    period: `${start}${RANGE_JOIN}${end === "now" ? "Present" : end}`,
    bullets: source.bullets,
  };
}

function linkTo(href: string): { label: string; href: string } {
  return {
    label: href.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, ""),
    href,
  };
}

const PERIOD_JOIN = " to ";
const RANGE_JOIN = " - ";
const COUNTRY = "India";
const PROFILES = SOCIALS.filter(
  (social) => social.icon === "github" || social.icon === "linkedin",
);

export const resume = {
  name: SITE.fullName,
  title: "Full-Stack Software Engineer",
  location: SITE.location,
  email: SITE.email,
  links: [...PROFILES.map((social) => linkTo(social.href)), linkTo(SITE.url)],
  summary:
    "Full-stack software engineer. Founding engineer on an early-stage building design (AEC) SaaS product, taken from ideation to production, and now lead its team of 10. Own the backend architecture and data model, and work across the frontend, cloud infrastructure and AI features. Earlier built production software for mental health, IoT and logistics.",
  roles: [
    roleFrom({
      company: "Infocusp Innovations",
      positions: [
        "Software Engineer 2",
        "Software Engineer 1",
        "Associate Software Engineer",
      ],
      bullets: [
        "Founding engineer on an AEC SaaS product for site selection and site plan design, from ideation to production. Promoted twice since joining.",
        "Own the backend architecture and data model: Python and FastAPI services on Google Cloud Run, with Cloud Firestore, PostgreSQL and BigQuery for application and geospatial data.",
        "Modeled zoning, parcel and map data, site plan compliance and development financials with domain experts and product. The product now covers 8 cities in the US and New Zealand and 2,000+ zoning and overlay districts.",
        "Cut a map API response from 2.17 MB to 0.3 KB gzipped and its first BigQuery query from 65 s to 1.5 s, and removed a 106 s data preload from every server's startup.",
        "Fixed a browser out-of-memory crash: the map repainted 361 times every 3 s with no one touching it and the heap grew to 3 GB. It now sits idle and stays near 300 MB.",
        "Lead a team of 10, set its system design, code review and sprint practices, and have mentored 5 teammates.",
      ],
    }),
    roleFrom({
      company: "Shipmnts",
      positions: ["Software Engineer"],
      bullets: [
        "Built and shipped features for a B2B logistics and shipment tracking platform.",
        "Implemented real-time data processing and tracking on the core platform, used in production by business clients.",
      ],
    }),
  ] satisfies ResumeRole[],
  projects: [
    {
      name: "PopSub",
      stack: "Rust, Tokio, WebSocket, TypeScript, Python, Go",
      link: "github.com/soumyadepp/popsub",
      bullets: [
        "Built and released a WebSocket pub/sub broker with sequenced topic logs, durable sessions, wildcard and shared subscriptions, and at-least-once delivery with dead-lettering.",
        "Shipped client libraries for Rust, TypeScript, Python and Go on crates.io, npm and PyPI, all held to one shared scenario suite, with a tag-driven release pipeline.",
      ],
    },
    {
      name: "neurosim",
      stack: "TypeScript, Vite, WebGL",
      link: "soumyadepp.github.io/neurosim",
      bullets: [
        "Built an interactive brain simulator that models how dementia spreads across a measured map of brain connections, checked against published patient imaging.",
      ],
    },
    {
      name: "MoveWell",
      stack: "Svelte, TypeScript, MediaPipe",
      link: "soumyadepp.github.io/movewell",
      bullets: [
        "Built a camera-guided exercise app for older adults with pose tracking, voice commands and English and Hindi support.",
      ],
    },
  ] satisfies ResumeProject[],
  skills: [
    {
      label: "Languages",
      items: "Python, TypeScript, JavaScript, Rust, Ruby, Dart, SQL",
    },
    {
      label: "Backend",
      items:
        "FastAPI, Node.js, Ruby on Rails, REST APIs, PostgreSQL, Cloud Firestore, Firebase",
    },
    {
      label: "Frontend",
      items: "React, Next.js, Redux, Svelte, Flutter, Mapbox, Three.js",
    },
    {
      label: "Cloud and DevOps",
      items:
        "Google Cloud Run, BigQuery, App Engine, AWS Lambda, AWS EC2, Docker, Kubernetes, Terraform, CI/CD",
    },
    {
      label: "Practices",
      items:
        "System Design, API Design, Technical Leadership, Code Review, End-to-End Testing",
    },
  ],
  education: {
    degree: "B.Tech in Information Technology",
    institution: "Dharmsinh Desai University, Nadiad",
    grade: "CPI: 9.2/10",
    period: "2019 - 2023",
  },
  certifications: "AlgoExpert Certification; Foundations of UX Design (Google)",
} as const;
