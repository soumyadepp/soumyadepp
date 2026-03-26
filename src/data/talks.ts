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
    id: "ddu-cloud",
    title: "Cloud Basics, AWS & Chaos Engineering",
    event: "DDU Tech Talk",
    venue: "Dharmsinh Desai University, Nadiad",
    date: "2026",
    audience: "Computer science students and tech enthusiasts",
    duration: "90 minutes",
    topics: ["AWS", "Cloud Computing", "Netflix", "Chaos Engineering"],
    description:
      "Invited back to my own college to talk about the fundamentals of cloud computing and AWS, and as a bonus, dived into how Netflix uses chaos engineering to build resilient, fault-tolerant systems at scale.",
    longDescription:
      "A comprehensive exploration of cloud computing fundamentals, AWS services, and advanced resilience patterns. We covered the basics of cloud architecture, discussed key AWS services, and explored how modern companies like Netflix engineer reliability through controlled chaos testing.",
    keyTakeaways: [
      "Cloud computing fundamentals and benefits",
      "AWS core services and architecture patterns",
      "Building scalable and reliable systems",
      "Introduction to chaos engineering",
      "Resilience and fault tolerance at scale",
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
      "Invited as a speaker to share my approach to problem solving, data structures, algorithms, and cracking technical interviews, helping students build a strong foundation for placements.",
    longDescription:
      "This talk covers a comprehensive approach to mastering data structures and algorithms, with a focus on practical problem-solving strategies used in technical interviews. I shared insights from my journey as an engineer and practical patterns that helped me and many others crack interviews at top tech companies.",
    keyTakeaways: [
      "Core DSA concepts and their real-world applications",
      "Problem-solving patterns and mental models",
      "Interview preparation strategies and best practices",
      "Common pitfalls and how to avoid them",
      "Building intuition for algorithm selection",
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
      "Invited to speak on competitive programming, covering contest strategy, efficient algorithm design, and how CP builds the muscle memory needed to tackle any engineering challenge.",
    longDescription:
      "This session dived into the world of competitive programming, exploring how competing in contests sharpens your problem-solving skills. We discussed strategies for approaching problems under time pressure, optimizing solutions, and building the algorithmic intuition that translates directly to production engineering work.",
    keyTakeaways: [
      "Developing contest strategy and time management",
      "Efficient algorithm design and implementation",
      "Common CP patterns and techniques",
      "How CP translates to real-world engineering",
      "Resources for continuous learning and practice",
    ],
    images: [
      "/images/cspit_talk_2/cep_talk_1.jpeg",
      "/images/cspit_talk_2/cspit_talk_6.jpeg",
    ],
    featured: "/images/cspit_talk_2/cep_talk_1.jpeg",
  },
];
