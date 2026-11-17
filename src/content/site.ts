import type { ReelMode } from "@/components/reel/engine";

export const GRADES = {
  daylight: "207,227,255",
  tungsten: "255,184,107",
  sodium: "255,122,47",
  moss: "183,211,107",
  paper: "238,240,242",
} as const;

const FIRST_YEAR = 2023;

export const YEARS = new Date().getFullYear() - FIRST_YEAR;

export const SITE = {
  name: "Soumyadeep",
  fullName: "Soumyadeep Ghosh",
  role: "Software Engineer",
  url: "https://www.soumyadepp.com",
  location: "Ahmedabad, India",
  language: "en",
  locale: "en_US",
  shareImage: {
    path: "/opengraph-image.png",
    width: 1200,
    height: 630,
    alt: "Soumyadeep Ghosh. Software engineer. Builder. Team lead.",
  },
  title: "Soumyadeep Ghosh | Software Engineer",
  description:
    "Soumyadeep Ghosh is a software engineer working across backend, frontend and cloud. Founding engineer on a building design product, and now its engineering lead.",
  email: "ghoshsoumyadeep330@gmail.com",
  photo: "/images/hero-desk.jpg",
  photoSubject: "/images/hero-desk-subject.png",
  photoAlt: "Soumyadeep working at his desk in warm evening light",
} as const;

export const NAV = [
  { label: "Experience", href: "/experience" },
  { label: "Work", href: "/projects" },
  { label: "Talks", href: "/talks" },
  { label: "Writing", href: "/blogs" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Resume", href: "/resume" },
] as const;

export const HOME_HEADER: string[] = ["/resume"];

export const HOME_ANCHORS = [
  { path: "/experience", anchor: "experience" },
  { path: "/projects", anchor: "work" },
  { path: "/talks", anchor: "talks" },
  { path: "/blogs", anchor: "writing" },
  { path: "/about", anchor: "intro" },
  { path: "/contact", anchor: "contact" },
] as const;

export const SOCIALS = [
  { label: "GitHub", icon: "github", href: "https://github.com/soumyadepp" },
  {
    label: "LinkedIn",
    icon: "linkedin",
    href: "https://www.linkedin.com/in/soumyadeep-ghosh-90a1951b6/",
  },
  {
    label: "Instagram",
    icon: "instagram",
    href: "https://www.instagram.com/soumyadepp",
  },
  { label: "Resume", icon: "resume", href: "/resume" },
] as const;

export const COMPANY_ORBITS = [
  { src: "/images/infocusp_logo.jpeg", months: 40 },
  { src: "/images/shipmnts_logo.jpeg", months: 6 },
  { src: "/images/vardaam_logo.jpeg", months: 3 },
  { src: "/images/privilon_logo.jpeg", months: 5 },
].map((company) => `${company.src}@${company.months}`);

const ORBIT_LABEL =
  "The logos of Infocusp, Shipmnts, Vardaam and Privilon circling on tilted orbits";

export type Chapter = {
  number: string;
  name: string;
  href: string;
  kicker: string;
  title: string;
  line: string;
  action: string;
  secondary?: { label: string; href: string };
  images?: { src: string; alt: string; href: string; still?: boolean }[];
  badges?: string[];
  mode: ReelMode;
  grade: string;
  frameLabel: string;
};

export const CHAPTERS: Chapter[] = [
  {
    number: "00",
    name: "Intro",
    href: "/about",
    kicker: "",
    title: "Software engineer. Builder. Team lead.",
    line: "I'm Soumyadeep. I ship on Fridays and still sleep well.",
    action: "About me",
    secondary: { label: "Resume", href: "/resume" },
    mode: "pull",
    grade: "255,198,140",
    frameLabel: "Light orbiting the laptop and falling slowly into it",
  },
  {
    number: "01",
    name: "Experience",
    href: "/experience",
    kicker: "Experience",
    title: "Where I've worked.",
    line: "Cargo that moves, beds that rest, minds that heal, buildings that stand. I've written software for all four.",
    action: "See my experience",
    badges: COMPANY_ORBITS,
    mode: "orbits",
    grade: GRADES.tungsten,
    frameLabel: ORBIT_LABEL,
  },
  {
    number: "02",
    name: "Work",
    href: "/projects",
    kicker: "Work",
    title: "Projects I built from the first commit.",
    line: "A message broker in Rust, a brain simulator, an exercise guide for older adults, and more.",
    action: "See the projects",
    images: [
      {
        src: "/images/projects/neurosim/story.jpg",
        href: "/projects/neurosim",
        alt: "neurosim: a brain model above a chart of how treatment timing changes the outcome",
      },
      {
        src: "/images/projects/movewell/today.jpg",
        href: "/projects/movewell",
        alt: "MoveWell: the Today screen with the day's exercise session",
      },
    ],
    mode: "broker",
    grade: GRADES.sodium,
    frameLabel: "Trails converging on one point and fanning out into lanes",
  },
  {
    number: "03",
    name: "Talks",
    href: "/talks",
    kicker: "Talks",
    title: "I share what I learn.",
    line: "I go back to universities to teach what I wish someone had shown me: C++, cloud, problem solving and competitive programming.",
    action: "See the talks",
    images: [
      {
        src: "/images/charusat_stl/stl_talk_2.jpeg",
        href: "/talks/charusat-stl",
        alt: "Soumyadeep presenting to a full lecture hall, with a slide on stacks and queues behind him",
        still: true,
      },
      {
        src: "/images/ddu_talk_1/talk_image_1.jpeg",
        href: "/talks/ddu-cloud",
        alt: "Soumyadeep speaking at a lectern in front of a projected slide",
        still: true,
      },
    ],
    mode: "spiral",
    grade: GRADES.moss,
    frameLabel: "Trails spiralling outward from a centre",
  },
  {
    number: "04",
    name: "Writing",
    href: "/blogs",
    kicker: "Writing",
    title: "I write about what I build and learn.",
    line: "Rust, Python, message brokers, and what I learned building each.",
    action: "Read the blog",
    mode: "waves",
    grade: GRADES.paper,
    frameLabel: "Lines of light rising and falling like waves",
  },
  {
    number: "05",
    name: "Contact",
    href: "/contact",
    kicker: "Contact",
    title: "Let's talk.",
    line: SITE.email,
    action: "Contact me",
    mode: "signal",
    grade: GRADES.tungsten,
    frameLabel: "Two points of light trading signals across the dark",
  },
];

export const CRUMB = {
  label: "Breadcrumb",
  home: "Overview",
} as const;

export const HOME = {
  chaptersLabel: "Chapters",
  swipe: "Swipe up",
  next: "Scroll or drag",
  jump: "Go to",
  soundHint: "It's better with sound. Top right.",
  soundThought: "This little maneuver's gonna cost us 51 years.",
  thoughts: [
    "Coffee first, then the bug.",
    "Why was it working yesterday?",
    "That meeting could have been a message.",
    "What was I doing again?",
    "Was that ping for me?",
    "Okay, but why does it work now?",
    "I'll write it down later. I won't.",
    "Just one more fix, then dinner.",
    "Who wrote this? Oh. Me.",
    "Should have said no to that meeting.",
    "Is it Friday yet?",
    "I need to drink some water.",
  ],
} as const;

export const EXPERIENCE_PAGE = {
  kicker: "Experience",
  title: "Where I've worked.",
  frameLabel: ORBIT_LABEL,
  earlier: "Earlier",
} as const;

export const WORK_PAGE = {
  kicker: "Work",
  section: "Project",
  title: "Projects",
  frameLabel: "Trails converging on one point and fanning out into lanes",
  note: "Things I built outside my day job, from the first commit to a working product.",
  more: "More projects",
  caseStudy: "View project",
  why: "The problem",
  what: "What it does",
  screens: "Screenshots",
  diagrams: "How it works",
  enlarge: "Open full size",
  builtWith: "Built with",
  status: "Status",
  year: "Year",
  source: "Source on GitHub",
  post: "Read how it works",
  live: "Open the live demo",
  next: "Next project",
  of: "of",
  back: "All work",
} as const;

export const TALKS_PAGE = {
  kicker: "Talks",
  title: "Talks for university students.",
  frameLabel: "Trails spiralling outward from a centre",
  columns: { year: "Year", talk: "Talk", where: "Where", length: "Length" },
  open: "View talk",
  back: "All talks",
  about: "About the talk",
  takeaways: "Key takeaways",
  audience: "Audience",
  stills: "Photos",
} as const;

export const WRITING_PAGE = {
  kicker: "Writing",
  title: "Notes on building software that holds up.",
  frameLabel: "Lines of light rising and falling like waves",
  minutes: "min",
  published: "Published",
  readingTime: "Reading time",
  minutesLong: "minutes",
  topics: "Topics",
  back: "All posts",
  empty: "No posts yet.",
} as const;

export const ABOUT_PAGE = {
  kicker: "About",
  title: "A bit about me.",
  frameLabel: "Contour lines slowly shifting like a map of terrain",
  lead: "I'm Soumyadeep. I turn 'it works on my machine' into 'it works'.",
  facts: [
    {
      figure: String(YEARS),
      unit: "years",
      line: "Of building software for a living.",
    },
    {
      figure: "700+",
      unit: "problems",
      line: "Solved on LeetCode, mostly for fun.",
    },
    {
      figure: "2012",
      unit: "",
      line: "World finalist, Marrs Spelling Bee, Abu Dhabi.",
    },
  ],
  talksFact: {
    unit: "talks",
    line: "Given at universities, including my own.",
  },
  stageLabel: "On stage",
  storyLabel: "Background",
  paragraphs: [
    "I wrote my first production code in 2021, building React screens for a local startup while I was still at university. A few months in, I was leading a team of four.",
    "Since then I have worked on logistics software, smart beds, a mental health app and, most recently, a product that helps people design buildings. Along the way I drifted from the frontend to the backend. These days most of my time goes into how data is shaped and how systems are run.",
    "I studied Information Technology at Dharmsinh Desai University and finished in the top 1% of my class. I go back to colleges when they invite me, to teach C++, cloud, problem solving and competitive programming.",
  ],
  outsideLabel: "Outside work",
  outside:
    "I hosted TEDxPrahladnagar, which is where I learned to hold a room. I also play guitar and keyboard, basketball and cricket, sketch a little, and cook things I have never cooked before.",
  skillsLabel: "Skills",
  skills: [
    {
      label: "Backend",
      items: [
        "Python",
        "FastAPI",
        "Rust",
        "Node.js",
        "Ruby on Rails",
        "REST APIs",
      ],
    },
    {
      label: "Frontend",
      items: ["TypeScript", "React", "Next.js", "Redux", "Flutter"],
    },
    {
      label: "Cloud and infrastructure",
      items: [
        "Google Cloud Run",
        "Cloud Firestore",
        "BigQuery",
        "AWS Lambda",
        "AWS EC2",
        "Docker",
        "Terraform",
      ],
    },
  ],
  educationLabel: "Education",
  education: {
    degree: "B.Tech, Information Technology",
    institution: "Dharmsinh Desai University",
    period: "2019 to 2023",
  },
  certificationsLabel: "Certifications",
  certifications: [
    { title: "AlgoExpert Certification", issuer: "AlgoExpert" },
    { title: "Foundations of UX Design", issuer: "Google" },
  ],
} as const;

export const NOT_FOUND = {
  kicker: "404",
  title: "This page fell into a black hole.",
  line: "It may have moved, or it never existed. Either way, it is not coming back.",
  home: "Back to the overview",
  work: "See the work",
  frameLabel: "A black hole with a disk of warm light around it",
} as const;

export const CONTACT_PAGE = {
  kicker: "Contact",
  title: "Let's talk.",
  line: "Email is the fastest way to reach me. I read every message.",
  socialsLabel: "Elsewhere",
  topicsLabel: "Good reasons to write",
  topics: [
    {
      label: "Work",
      line: "A role or a project you think I would fit.",
      subject: "Work",
    },
    {
      label: "Talks",
      line: "A session for your college, meetup or team.",
      subject: "A talk",
    },
    {
      label: "Projects",
      line: "A question or an idea about something I built.",
      subject: "About your project",
    },
  ],
  place: SITE.location,
  timeZone: "Asia/Kolkata",
  localTime: "local time",
  copy: "Copy email",
  copied: "Copied",
  frameLabel: "Two points of light trading signals across the dark",
} as const;

export const RESUME_PAGE = {
  print: "Print or save as PDF",
  summaryLabel: "Summary",
  experienceLabel: "Experience",
  projectsLabel: "Projects",
  skillsLabel: "Skills",
  educationLabel: "Education",
  certificationsLabel: "Certifications",
} as const;

export const CHAPTER_LINKS = {
  previous: "Previous",
  next: "Next",
} as const;

export const SOUND = {
  label: "Sound",
  turnOn: "Turn on ambient sound",
  turnOff: "Turn off ambient sound",
  volume: "Volume",
} as const;

export const MENU = {
  open: "Menu",
  close: "Close",
  resume: "Resume",
  backdrop: "The animation for the section being touched",
} as const;
