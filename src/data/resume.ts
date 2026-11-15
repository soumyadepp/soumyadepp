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
    period: `${start}${PERIOD_JOIN}${end === "now" ? "Present" : end}`,
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
const COUNTRY = "India";
const PROFILES = SOCIALS.filter(
  (social) => social.icon === "github" || social.icon === "linkedin",
);

export const resume = {
  name: SITE.fullName,
  title: SITE.role,
  location: SITE.location,
  email: SITE.email,
  links: [...PROFILES.map((social) => linkTo(social.href)), linkTo(SITE.url)],
  summary:
    "Software engineer with 3+ years of full-time experience building and shipping production systems across building design (AEC), mental health, IoT and logistics. Currently leads full-stack development of an early-stage SaaS product, from architecture to deployment. Works across backend, frontend and cloud infrastructure.",
  roles: [
    roleFrom({
      company: "Infocusp Innovations",
      positions: ["Software Engineer 2"],
      bullets: [
        "Lead full-stack development of an early-stage AEC SaaS product from ideation to production, covering backend architecture, data models and deployment.",
        "Designed backend services in Python and FastAPI on Google Cloud Run, with Cloud Firestore, PostgreSQL and BigQuery for application and geospatial data.",
        "Established system design patterns, code review and sprint planning practices adopted across the engineering team, and mentored engineers.",
        "Worked across backend, React and TypeScript frontend, Terraform infrastructure and AI features, with domain experts, product managers and design.",
      ],
    }),
    roleFrom({
      company: "Infocusp Innovations",
      positions: ["Associate Software Engineer", "Software Engineer 1"],
      bullets: [
        "Built RESTful backend services and full-stack features for a mental health and habit tracking application using TypeScript and Node.js.",
        "Owned features end to end, from technical design and implementation to automated testing and production deployment on Google Cloud.",
        "Developed connected-device systems for a smart bed manufacturer, integrating with hardware data pipelines and delivering high-reliability features.",
      ],
    }),
    roleFrom({
      company: "Shipmnts",
      positions: ["Software Engineer"],
      bullets: [
        "Built and shipped features for a B2B logistics and shipment tracking platform, improving visibility across supply chain workflows.",
        "Implemented real-time data processing and tracking on the core platform, used in production by business clients.",
      ],
    }),
  ] satisfies ResumeRole[],
  projects: [
    {
      name: "PopSub",
      stack: "Rust, Tokio, WebSocket, sled, JWT",
      link: "github.com/soumyadepp/popsub",
      bullets: [
        "Built a WebSocket pub/sub broker with topic-based routing, a replay buffer and optional sled persistence.",
        "Implemented at-least-once delivery (QoS 1) with acknowledgements, timed retries and JWT authentication.",
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
    period: "2019 to 2023",
  },
  certifications: "AlgoExpert Certification; Foundations of UX Design (Google)",
} as const;
