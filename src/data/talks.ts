export type Talk = {
  id: string;
  title: string;
  event: string;
  venue: string;
  date: string;
  topics: string[];
  description: string;
  longDescription?: string;
  keyTakeaways?: string[];
  audience?: string;
  duration?: string;
  images: string[];
  featured: string;
  slidesDeck?: string;
  videoLink?: string;
};

export const talks: Talk[] = [
  {
    id: "charusat-stl",
    title: "Introduction to STL",
    event: "Charusat Session",
    venue: "Charusat University, Anand",
    date: "2026",
    audience: "Engineering students learning C++ and data structures",
    duration: "120 minutes",
    topics: ["C++", "STL", "Data Structures", "Algorithms"],
    description:
      "A session on the C++ Standard Template Library that went past using vector, map and set, into how they work and why each operation costs what it does.",
    longDescription:
      "We started with the containers, iterators and algorithms students already use, then opened them up: what sits underneath each one, why certain operations have the complexity they do, and how knowing that changes the code you write. A library is much more interesting once you stop treating it as a black box.",
    keyTakeaways: [
      "Vectors, maps, sets, stacks and queues, and when to reach for each",
      "How iterators and algorithms fit together",
      "What each container is built on",
      "Why operations have the complexity they do",
      "Using that knowledge to write better code",
    ],
    images: [
      "/images/charusat_stl/stl_talk_2.jpeg",
      "/images/charusat_stl/stl_talk_3.jpeg",
      "/images/charusat_stl/stl_talk_1.jpeg",
    ],
    featured: "/images/charusat_stl/stl_talk_2.jpeg",
  },
  {
    id: "ddu-cloud",
    title: "Cloud Basics, AWS & Chaos Engineering",
    event: "DDU Tech Talk",
    venue: "Dharmsinh Desai University, Nadiad",
    date: "2026",
    audience: "Computer science students and tech enthusiasts",
    duration: "90 minutes",
    topics: ["AWS", "Cloud Computing", "Netflix", "Chaos Engineering"],
    description:
      "My own college invited me back to talk about cloud computing. I covered the basics of the cloud and AWS, then how Netflix uses chaos engineering to keep its systems running when parts of them fail.",
    longDescription:
      "We started with what the cloud is and why teams move to it, then walked through the main AWS services and how they fit together. The last part was about chaos engineering: Netflix breaks parts of its own production systems on purpose, so it finds the weak spots before an outage does.",
    keyTakeaways: [
      "What the cloud offers over running your own servers",
      "The core AWS services and common ways to combine them",
      "Designing systems that scale and stay up",
      "What chaos engineering is and why Netflix uses it",
    ],
    images: [
      "/images/ddu_talk_1/talk_image_1.jpeg",
      "/images/ddu_talk_1/talk_image_2.jpeg",
      "/images/ddu_talk_1/talk_image_3.jpeg",
    ],
    featured: "/images/ddu_talk_1/talk_image_1.jpeg",
  },
  {
    id: "cspit-dsa",
    title: "Problem Solving, DSA & Interview Prep",
    event: "CSPIT CP Talk",
    venue: "Charusat University, Anand",
    date: "2025",
    audience: "Engineering students and placement aspirants",
    duration: "60 minutes",
    topics: ["DSA", "Problem Solving", "Interview Prep"],
    description:
      "A talk for students preparing for placements, on how I approach problem solving, data structures and algorithms, and how to prepare for technical interviews.",
    longDescription:
      "I shared how I learned data structures and algorithms, the problem-solving patterns that helped me in my own interviews, and how I would prepare for one again.",
    keyTakeaways: [
      "The core data structures and where they show up in real code",
      "Patterns for breaking down an unfamiliar problem",
      "How to prepare for a technical interview",
      "Common interview mistakes and how to avoid them",
      "How to tell which algorithm a problem needs",
    ],
    images: [
      "/images/cspit_talk_1/cep_talk_2.jpeg",
      "/images/cspit_talk_1/cep_talk_4.jpeg",
      "/images/cspit_talk_1/cep_talk_5.jpeg",
      "/images/cspit_talk_1/first_talk_3.jpeg",
    ],
    featured: "/images/cspit_talk_1/cep_talk_5.jpeg",
  },
  {
    id: "cspit-cp",
    title: "Competitive Programming",
    event: "CSPIT CP Talk",
    venue: "Charusat University, Anand",
    date: "2025",
    audience: "Competitive programming enthusiasts and students",
    duration: "75 minutes",
    topics: ["Competitive Programming", "Algorithms", "Contest Strategy"],
    description:
      "A talk on competitive programming: how to approach a contest, how to design efficient algorithms, and why the practice carries over to everyday engineering.",
    longDescription:
      "We talked about what contests train: reading a problem under time pressure, choosing an approach, and speeding up a solution that works but is too slow. I also covered where that habit pays off in production engineering.",
    keyTakeaways: [
      "Contest strategy and managing your time",
      "Designing and implementing efficient algorithms",
      "Patterns and techniques that come up often in contests",
      "Where competitive programming helps in day-to-day engineering",
      "Where to practice and what to read next",
    ],
    images: [
      "/images/cspit_talk_2/cep_talk_1.jpeg",
      "/images/cspit_talk_2/cspit_talk_6.jpeg",
    ],
    featured: "/images/cspit_talk_2/cep_talk_1.jpeg",
  },
];
