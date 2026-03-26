export type Talk = {
  id: string;
  title: string;
  event: string;
  venue: string;
  topics: string[];
  description: string;
  images: string[];
  featured: string;
};

export const talks: Talk[] = [
  {
    id: "cspit-dsa",
    title: "Problem Solving, DSA & Interview Prep",
    event: "CSPIT CEP Talk",
    venue: "Charusat University, Anand",
    topics: ["DSA", "Problem Solving", "Interview Prep"],
    description:
      "Invited as a speaker to share my approach to problem solving, data structures, algorithms, and cracking technical interviews — helping students build a strong foundation for placements.",
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
    event: "CSPIT CEP Talk",
    venue: "Charusat University, Anand",
    topics: ["Competitive Programming", "Algorithms", "Contest Strategy"],
    description:
      "Invited to speak on competitive programming — covering contest strategy, efficient algorithm design, and how CP builds the muscle memory needed to tackle any engineering challenge.",
    images: [
      "/images/cspit_talk_2/cep_talk_1.jpeg",
      "/images/cspit_talk_2/cspit_talk_6.jpeg",
    ],
    featured: "/images/cspit_talk_2/cep_talk_1.jpeg",
  },
  {
    id: "ddu-cloud",
    title: "Cloud Basics, AWS & Chaos Engineering",
    event: "DDU Tech Talk",
    venue: "Dharmsinh Desai University, Nadiad",
    topics: ["AWS", "Cloud Computing", "Netflix", "Chaos Engineering"],
    description:
      "Invited back to my own college to talk about the fundamentals of cloud computing and AWS — and as a bonus, dived into how Netflix uses chaos engineering to build resilient, fault-tolerant systems at scale.",
    images: [
      "/images/ddu_talk_1/talk_image_1.jpeg",
      "/images/ddu_talk_1/talk_image_2.jpeg",
      "/images/ddu_talk_1/talk_image_3.jpeg",
    ],
    featured: "/images/ddu_talk_1/talk_image_1.jpeg",
  },
];
