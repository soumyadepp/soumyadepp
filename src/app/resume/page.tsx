"use client";

import { Download, MapPin } from "lucide-react";

// ── Resume data ─────────────────────────────────────────────

const CONTACT = {
  name: "Soumyadeep Ghosh",
  title: "Software Engineer",
  location: "Ahmedabad, India",
  github: "github.com/soumyadepp",
  linkedin: "linkedin.com/in/soumyadeep-ghosh-90a1951b6",
};

const SUMMARY =
  "Software Engineer with 3+ years of experience building and shipping production-grade systems across AEC, mental health, logistics, and IoT domains. Proven ability to own features end-to-end, from architecture and implementation to deployment. Strong track record of delivering scalable, maintainable software in fast-paced environments.";

const EXPERIENCE = [
  {
    role: "Software Engineer II",
    company: "Infocusp Innovations",
    period: "Jul 2025 – Present",
    bullets: [
      "Architected and led full-stack development of an early-stage AEC SaaS product from ideation to production, owning the complete software development lifecycle.",
      "Established system design patterns and code review processes adopted across the engineering team.",
      "Collaborated cross-functionally with SMEs, PMs and Business stakeholders to translate AEC requirements into scalable, maintainable software systems.",
    ],
  },
  {
    role: "Software Engineer I",
    company: "Infocusp Innovations",
    period: "Jul 2023 – Jun 2025",
    bullets: [
      "Engineered RESTful backend services and full-stack features for a mental health and habit tracking application using TypeScript and Node.js.",
      "Owned features end-to-end — from technical design and implementation to automated testing and production deployment on Google Cloud.",
      "Developed IoT-adjacent systems for a smart bed manufacturing client, integrating with hardware data pipelines and delivering high-reliability production features.",
    ],
  },
  {
    role: "Software Engineer Intern",
    company: "Shipmnts",
    period: "Jun 2022 – Nov 2022",
    bullets: [
      "Built and shipped scalable features for a B2B logistics and shipment tracking platform, improving visibility across supply chain workflows.",
      "Implemented real-time data processing and tracking capabilities on the core platform, contributing to production features used by business clients.",
    ],
  },
];

const PROJECTS = [
  {
    name: "PopSub",
    tech: "Rust, WebSocket, Tokio, sled, JWT",
    url: "github.com/soumyadepp/popsub",
    bullets: [
      "Designed and built a lightweight WebSocket pub/sub broker with topic-based routing and message replay buffers.",
      "Implemented QoS=1 at-least-once delivery with client acknowledgements and JWT-based authentication.",
      "Added optional sled persistence for durable message storage without external dependencies.",
    ],
  },
  {
    name: "Northern Cleaning Crew",
    tech: "React, TypeScript, Tailwind CSS, Redux, React Hook Forms, Firebase",
    bullets: [
      "Designed and developed a full-stack client website for a cleaning business, enabling service management and customer quote requests.",
      "Implemented dynamic service listing with Redux state management and form-based quote submission using React Hook Forms.",
      "Integrated Firebase for backend data storage and real-time updates, deploying a production-ready solution for the client.",
    ],
  },
];

const SKILLS: Record<string, string[]> = {
  Languages: [
    "TypeScript",
    "JavaScript",
    "Go",
    "Rust",
    "Ruby",
    "Python",
    "Dart",
    "SQL",
  ],
  "Frontend & Mobile": [
    "React",
    "Next.js",
    "Redux",
    "Flutter",
    "D3",
    "ThreeJS",
    "Mapbox",
  ],
  "Backend & Infrastructure": [
    "FastAPI",
    "Ruby on Rails",
    "Node.js",
    "REST APIs",
    "Docker",
    "Kubernetes",
    "Tile Engine",
    "Google BigQuery",
    "Google Cloud Run",
    "Google App Engine",
    "AWS Lambda",
    "AWS EC2",
    "AWS Cognito",
  ],
  "Databases & Tools": [
    "PostgreSQL",
    "Firebase",
    "Cloud Firestore",
    "Supabase",
    "Git",
    "Linear",
    "Notion",
    "Confluence",
    "Jira",
    "Trello",
  ],
  Practices: [
    "System Design",
    "API Design",
    "End-to-end Feature Ownership",
    "Technical Leadership",
  ],
};

// ── Page ────────────────────────────────────────────────────

export default function ResumePage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        .resume-paper { padding: 48px 52px; }
        .resume-exp-row {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
        }
        .resume-exp-period { white-space: nowrap; margin-left: 16px; }

        @media (max-width: 600px) {
          .resume-paper { padding: 28px 20px; }
          .resume-exp-row { flex-direction: column; gap: 2px; }
          .resume-exp-period { margin-left: 0; }
        }

        @media print {
          nav, footer, .no-print { display: none !important; }
          body { background: white !important; }
          .resume-screen-bg {
            background: white !important;
            padding: 0 !important;
            min-height: unset !important;
          }
          .resume-paper {
            box-shadow: none !important;
            max-width: 100% !important;
            width: 100% !important;
            min-height: unset !important;
            padding: 10mm 12mm !important;
            border-radius: 0 !important;
          }
          @page { margin: 0; size: A4 portrait; }
        }
      `}</style>

      <div className="resume-screen-bg min-h-screen bg-zinc-300 dark:bg-zinc-700 pt-24 pb-10 px-4 flex flex-col items-center">
        {/* Action bar */}
        <div className="no-print w-full max-w-198.5 flex items-center justify-between mb-5">
          <span className="font-mono text-xs text-zinc-500 tracking-widest uppercase">
            resume preview
          </span>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-md"
          >
            <Download size={14} />
            Download PDF
          </button>
        </div>

        {/* A4 Paper */}
        <div
          className="resume-paper bg-white text-zinc-900 w-full max-w-198.5 min-h-280.75 shadow-2xl rounded-sm"
          style={{ fontFamily: "'Inter', sans-serif", fontSize: "11.5px" }}
        >
          {/* ── Header ───────────────────────────────────── */}
          <header
            style={{
              borderBottom: "2px solid #000",
              paddingBottom: "10px",
              marginBottom: "14px",
            }}
          >
            <h1
              style={{
                fontSize: "28px",
                fontWeight: 800,
                color: "#000",
                textAlign: "center",
                margin: "0 0 2px",
                letterSpacing: "-0.3px",
              }}
            >
              {CONTACT.name}
            </h1>
            <p
              style={{
                fontWeight: 700,
                textAlign: "center",
                color: "#111",
                fontSize: "16px",
                margin: "4px 0 4px",
              }}
            >
              {CONTACT.title}
            </p>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexWrap: "wrap",
                gap: "6px",
                fontSize: "11.5px",
                color: "#444",
              }}
            >
              <span
                style={{ display: "flex", alignItems: "center", gap: "3px" }}
              >
                <MapPin size={11} />
                {CONTACT.location}
              </span>
              <span style={{ color: "#bbb" }}>·</span>
              <span
                style={{ display: "flex", alignItems: "center", gap: "3px" }}
              >
                <svg
                  width="11"
                  height="11"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
                </svg>
                {CONTACT.github}
              </span>
              <span style={{ color: "#bbb" }}>·</span>
              <span
                style={{ display: "flex", alignItems: "center", gap: "3px" }}
              >
                <svg
                  width="11"
                  height="11"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
                {CONTACT.linkedin}
              </span>
            </div>
          </header>

          {/* ── Summary ──────────────────────────────────── */}
          <section style={{ marginBottom: "12px" }}>
            <SectionHeading>Summary</SectionHeading>
            <p
              style={{
                lineHeight: "1.45",
                color: "#222",
                margin: 0,
              }}
            >
              {SUMMARY}
            </p>
          </section>

          {/* ── Experience ───────────────────────────────── */}
          <section style={{ marginBottom: "12px" }}>
            <SectionHeading>Experience</SectionHeading>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "10px" }}
            >
              {EXPERIENCE.map((exp) => (
                <div key={exp.role + exp.company}>
                  <div className="resume-exp-row">
                    <div>
                      <span
                        style={{
                          fontWeight: 700,
                          fontSize: "13.5px",
                          color: "#000",
                        }}
                      >
                        {exp.role}
                      </span>
                      <span style={{ color: "#333" }}> at {exp.company}</span>
                    </div>
                    <span
                      className="resume-exp-period"
                      style={{ color: "#555" }}
                    >
                      {exp.period}
                    </span>
                  </div>
                  <ul
                    style={{
                      margin: "2px 0 0",
                      paddingLeft: "14px",
                      display: "flex",
                      flexDirection: "column",
                      gap: "1px",
                    }}
                  >
                    {exp.bullets.map((b, i) => (
                      <li
                        key={i}
                        style={{
                          color: "#222",
                          lineHeight: "1.45",
                        }}
                      >
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* ── Projects ─────────────────────────────────── */}
          <section style={{ marginBottom: "12px" }}>
            <SectionHeading>Projects</SectionHeading>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "10px" }}
            >
              {PROJECTS.map((p) => (
                <div key={p.name}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "baseline",
                      gap: "8px",
                      flexWrap: "wrap",
                    }}
                  >
                    {p.url ? (
                      <a
                        href={`https://${p.url}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          fontWeight: 700,
                          fontSize: "13.5px",
                          color: "#000",
                          textDecoration: "underline",
                        }}
                      >
                        {p.name}
                      </a>
                    ) : (
                      <span
                        style={{
                          fontWeight: 700,
                          fontSize: "13.5px",
                          color: "#000",
                        }}
                      >
                        {p.name}
                      </span>
                    )}
                    <span style={{ fontSize: "11.5px", color: "#555" }}>
                      ({p.tech})
                    </span>
                  </div>
                  <ul
                    style={{
                      margin: "2px 0 0",
                      paddingLeft: "14px",
                      display: "flex",
                      flexDirection: "column",
                      gap: "1px",
                    }}
                  >
                    {p.bullets.map((b, i) => (
                      <li
                        key={i}
                        style={{
                          color: "#222",
                          lineHeight: "1.45",
                        }}
                      >
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* ── Skills ───────────────────────────────────── */}
          <section>
            <SectionHeading>Skills</SectionHeading>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "2px" }}
            >
              {Object.entries(SKILLS).map(([category, items]) => (
                <p
                  key={category}
                  style={{
                    color: "#222",
                    margin: 0,
                    lineHeight: "1.45",
                  }}
                >
                  <span style={{ fontWeight: 600, color: "#000" }}>
                    {category}:
                  </span>{" "}
                  {items.join(", ")}
                </p>
              ))}
            </div>
          </section>
        </div>
      </div>
    </>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2
      style={{
        fontSize: "13px",
        fontWeight: 700,
        letterSpacing: "0.06em",
        textTransform: "uppercase",
        color: "#000",
        margin: "0 0 10px",
        paddingBottom: "5px",
        borderBottom: "1.5px solid #000",
      }}
    >
      {children}
    </h2>
  );
}
