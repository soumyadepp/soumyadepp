export type Position = {
  title: string;
  period: string;
};

export type Focus = {
  label: string;
  line: string;
};

export type Engagement = {
  company: string;
  logo: string;
  logoTone: "plain" | "inverted";
  location: string;
  span: string;
  current: boolean;
  positions: Position[];
  summary: string;
  focus?: Focus[];
  highlights: string[];
};

export type EarlierRole = {
  year: string;
  company: string;
  title: string;
  line: string;
};

export const engagements: Engagement[] = [
  {
    company: "Infocusp Innovations",
    logo: "/images/infocusp_logo.jpeg",
    logoTone: "plain",
    location: "Ahmedabad",
    span: "2023 to now",
    current: true,
    positions: [
      { title: "Software Engineer 2", period: "Jul 2025 to now" },
      { title: "Software Engineer 1", period: "Jan 2024 to Jun 2025" },
      { title: "Associate Software Engineer", period: "Jul 2023 to Dec 2023" },
    ],
    summary:
      "I joined this building design product as one of its first engineers, before its first release. It helps builders and architects choose sites and design compliant site plans. I helped take it to production, and I now lead the engineers who build it.",
    focus: [
      {
        label: "Technical leadership",
        line: "I am responsible for the backend architecture and the data model. I help set the engineering standards, lead code review and sprint planning, and mentor engineers on the team.",
      },
      {
        label: "Across workstreams",
        line: "I work across backend, frontend, cloud infrastructure and the AI features, and move to whichever one a release is waiting on. I decide scope together with product and design.",
      },
      {
        label: "In the domain",
        line: "I learned zoning rules, parcel and map data, site plan compliance and development financials well enough to model them in code.",
      },
    ],
    highlights: [],
  },
  {
    company: "Shipmnts",
    logo: "/images/shipmnts_logo.jpeg",
    logoTone: "inverted",
    location: "Ahmedabad",
    span: "2022",
    current: false,
    positions: [{ title: "Software Engineer", period: "Jun 2022 to Nov 2022" }],
    summary:
      "Shipmnts runs a logistics platform that handles live supply chain data. I built features that let businesses track their shipments on it.",
    highlights: [
      "Shipped features that simplified logistics workflows for business clients",
      "Reworked flows around the problems users reported",
    ],
  },
];

export const earlierRoles: EarlierRole[] = [
  {
    year: "2021",
    company: "Vardaam Web Solutions",
    title: "Software Engineer",
    line: "Web and blockchain applications with Flutter, Node.js and Solidity.",
  },
  {
    year: "2021",
    company: "Privilon Technologies",
    title: "Lead Frontend Engineer",
    line: "Joined as an intern. Three months later I was leading a team of four on a React and Firebase product for a local business.",
  },
];
