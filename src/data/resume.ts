export type ResumeRole = {
  title: string;
  company: string;
  location: string;
  period: string;
  bullets: string[];
};

export type ResumeProject = {
  name: string;
  stack: string;
  link: string;
  bullets: string[];
};

export const resume = {
  name: "Soumyadeep Ghosh",
  title: "Software Engineer",
  location: "Ahmedabad, India",
  email: "ghoshsoumyadeep330@gmail.com",
  links: [
    { label: "github.com/soumyadepp", href: "https://github.com/soumyadepp" },
    {
      label: "linkedin.com/in/soumyadeep-ghosh-90a1951b6",
      href: "https://www.linkedin.com/in/soumyadeep-ghosh-90a1951b6/",
    },
    { label: "soumyadepp.vercel.app", href: "https://soumyadepp.vercel.app" },
  ],
  summary:
    "Software engineer with 3+ years of full-time experience building and shipping production systems across building design (AEC), mental health, IoT and logistics. Currently leads full-stack development of an early-stage SaaS product, from architecture to deployment. Works across backend, frontend and cloud infrastructure.",
  roles: [
    {
      title: "Software Engineer 2",
      company: "Infocusp Innovations",
      location: "Ahmedabad, India",
      period: "Jul 2025 to Present",
      bullets: [
        "Lead full-stack development of an early-stage AEC SaaS product from ideation to production, covering backend architecture, data models and deployment.",
        "Designed backend services in Python and FastAPI on Google Cloud Run, with Cloud Firestore, PostgreSQL and BigQuery for application and geospatial data.",
        "Established system design patterns, code review and sprint planning practices adopted across the engineering team, and mentored engineers.",
        "Worked across backend, React and TypeScript frontend, Terraform infrastructure and AI features, with domain experts, product managers and design.",
      ],
    },
    {
      title: "Software Engineer 1",
      company: "Infocusp Innovations",
      location: "Ahmedabad, India",
      period: "Jul 2023 to Jun 2025",
      bullets: [
        "Built RESTful backend services and full-stack features for a mental health and habit tracking application using TypeScript and Node.js.",
        "Owned features end to end, from technical design and implementation to automated testing and production deployment on Google Cloud.",
        "Developed connected-device systems for a smart bed manufacturer, integrating with hardware data pipelines and delivering high-reliability features.",
      ],
    },
    {
      title: "Software Engineer",
      company: "Shipmnts",
      location: "Ahmedabad, India",
      period: "Jun 2022 to Nov 2022",
      bullets: [
        "Built and shipped features for a B2B logistics and shipment tracking platform, improving visibility across supply chain workflows.",
        "Implemented real-time data processing and tracking on the core platform, used in production by business clients.",
      ],
    },
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
