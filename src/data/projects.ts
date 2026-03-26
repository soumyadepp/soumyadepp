export type ProjectStatus =
  | "in development"
  | "completed"
  | "deprecated"
  | "disabled";

export type Project = {
  title: string;
  description: string;
  tags: string[];
  status: ProjectStatus;
  github?: string;
  live?: string;
  image?: string;
  gallery?: string[];
};

export const projects: Project[] = [
  {
    title: "PopSub",
    description:
      "A lightweight WebSocket pub/sub broker written in Rust. Supports topic-based routing, replay buffers for recent messages, QoS=1 at-least-once delivery with acknowledgements, JWT-based auth, and optional sled persistence — designed to be simple to run locally and straightforward to extend.",
    tags: ["Rust", "WebSocket", "Pub/Sub", "JWT", "Tokio", "sled"],
    status: "in development",
    github: "https://github.com/soumyadepp/popsub",
    image: "/images/popsub/popsub.svg",
  },
  {
    title: "Northern Cleaning Crew",
    description:
      "Designed and developed a client website for a cleaning business where they can showcase and manage their services, and visitors can request quotes directly through the site.",
    tags: [
      "React",
      "TypeScript",
      "Tailwind CSS",
      "Redux",
      "React Hook Forms",
      "Firebase",
    ],
    status: "completed",
    gallery: [
      "/images/ncc/desktop-image-1.png",
      "/images/ncc/desktop-image-2.png",
      "/images/ncc/mobile-image-1.png",
      "/images/ncc/mobile-image-2.png",
    ],
  },
  {
    title: "PhotoRecipe",
    description:
      "Snap a photo of your ingredients and get a complete recipe in seconds. AI identifies what you have, suggests missing items, then generates a recipe with a name, ingredient list, and step-by-step instructions — all editable and exportable as a PDF.",
    tags: [
      "Next.js",
      "Genkit",
      "Gemini",
      "ShadCN UI",
      "Tailwind CSS",
      "Firebase",
    ],
    status: "disabled",
    github: "https://github.com/soumyadepp/PhotoRecipe",
    image: "/images/photorecipe/photorecipe.svg",
  },
];

export type Experience = {
  role: string;
  company: string;
  period: string;
  description: string;
};

export const experiences: Experience[] = [
  {
    role: "Software Engineer II",
    company: "Infocusp Innovations",
    period: "Jul 2025 – Present",
    description:
      "Led software development for an early-stage AEC product, dxriving it from ideation through production. Defined system architecture and engineering standards across the full product lifecycle.",
  },
  {
    role: "Software Engineer I",
    company: "Infocusp Innovations",
    period: "Jan 2024 – Jun 2025",
    description:
      "Built and maintained backend systems for a habit tracking and mental health awareness application. Owned features end-to-end, from technical design and implementation to testing and production rollout.",
  },
  {
    role: "Associate Software Engineer",
    company: "Infocusp Innovations",
    period: "Jul 2023 – Dec 2023",
    description:
      "Built and maintained IoT-adjacent systems for a leading smart bed manufacturing client, delivering features end-to-end with close attention to stability and hardware pipeline integration.",
  },
  {
    role: "Software Engineer Intern",
    company: "Shipmnts",
    period: "Jun 2022 – Nov 2022",
    description:
      "Designed and shipped features at scale to streamline logistics and shipment tracking for business clients. Contributed to core platform functionality handling real-time data across supply chain workflows.",
  },
];

export const skills = [
  "TypeScript",
  "React",
  "Next.js",
  "Node.js",
  "FastAPI",
  "Ruby on Rails",
  "Flutter",
  "Python",
  "Firebase",
  "Cloud Firestore",
  "Google Cloud Run",
  "Google App Engine",
  "Docker",
  "Redux",
  "Git",
];
