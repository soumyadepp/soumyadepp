"use client";

import { motion } from "framer-motion";
import { MapPin, Mail, Copy, Check } from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";
import { useState } from "react";

const EMAIL = "ghoshsoumyadeep330@gmail.com";

const socials = [
  {
    name: "GitHub",
    handle: "@soumyadepp",
    description:
      "Check out my code, open-source contributions, and side projects.",
    href: "https://github.com/soumyadepp",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
      </svg>
    ),
    color: "zinc",
  },
  {
    name: "LinkedIn",
    handle: "Soumyadeep Ghosh",
    description:
      "Connect professionally. I'm always open to interesting conversations.",
    href: "https://www.linkedin.com/in/soumyadeep-ghosh-90a1951b6/",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
    color: "blue",
  },
  {
    name: "Instagram",
    handle: "@soumyadepp",
    description:
      "A peek into life outside the terminal: events, moments, and more.",
    href: "https://www.instagram.com/soumyadepp",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
      </svg>
    ),
    color: "pink",
  },
];

const socialColorMap: Record<
  string,
  { card: string; icon: string; arrow: string }
> = {
  zinc: {
    card: "hover:border-zinc-600",
    icon: "bg-zinc-800 text-zinc-300",
    arrow: "text-zinc-600 group-hover:text-zinc-400",
  },
  blue: {
    card: "hover:border-blue-500/40",
    icon: "bg-blue-500/10 text-blue-400",
    arrow: "text-zinc-600 group-hover:text-blue-400",
  },
  pink: {
    card: "hover:border-pink-500/40",
    icon: "bg-pink-500/10 text-pink-400",
    arrow: "text-zinc-600 group-hover:text-pink-400",
  },
};

export default function ContactPage() {
  const [copied, setCopied] = useState(false);

  function copyEmail() {
    navigator.clipboard.writeText(EMAIL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <main className="min-h-screen bg-background">
      {/* ── Header ── */}
      <PageHeader maxWidth="max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <p className="font-mono text-sky-500 dark:text-sky-400 text-sm mb-4 tracking-widest uppercase">
              get in touch
            </p>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight mb-6">
              Let&apos;s Connect.
            </h1>
            <p className="text-zinc-600 dark:text-zinc-400 max-w-lg leading-relaxed mb-6">
              Whether you have a project in mind, a role you think I&apos;d
              love, or just want to talk tech. My inbox is always open.
            </p>

            {/* Availability + location */}
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-sm px-4 py-2 rounded-full">
                <span className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse" />
                Open to opportunities
              </div>
              <div className="flex items-center gap-2 text-zinc-500 text-sm bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 px-4 py-2 rounded-full">
                <MapPin size={13} />
                Ahmedabad, India
              </div>
            </div>
          </motion.div>
      </PageHeader>

      <div className="max-w-4xl mx-auto px-6 py-16">
        {/* Email CTA */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-20"
        >
          <p className="text-zinc-500 text-sm font-mono mb-6">
            {"// fastest way to reach me"}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <a
              href={`mailto:${EMAIL}`}
              className="flex items-center gap-3 bg-sky-600 hover:bg-sky-500 dark:bg-sky-600 dark:hover:bg-sky-500 text-white px-8 py-4 rounded-xl font-medium transition-colors text-lg shadow-lg shadow-sky-500/25 hover:shadow-sky-500/40 hover:shadow-xl"
            >
              <Mail size={20} />
              Say Hello
            </a>

            <button
              onClick={copyEmail}
              className="flex items-center gap-2.5 bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-600 text-zinc-700 dark:text-zinc-300 px-6 py-4 rounded-xl transition-colors font-mono text-sm"
            >
              {copied ? (
                <>
                  <Check size={15} className="text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy size={15} />
                  {EMAIL}
                </>
              )}
            </button>
          </div>
        </motion.div>

        {/* Social cards */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-zinc-500 text-sm font-mono mb-6">
            {"// find me elsewhere"}
          </p>

          <div className="grid sm:grid-cols-3 gap-4">
            {socials.map((social, i) => {
              const c = socialColorMap[social.color];
              return (
                <motion.a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  className={`group relative bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 flex flex-col gap-4 transition-all duration-300 ${c.card} hover:-translate-y-1`}
                >
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center ${c.icon}`}
                  >
                    {social.icon}
                  </div>
                  <div>
                    <p className="text-zinc-900 dark:text-zinc-100 font-semibold mb-0.5">
                      {social.name}
                    </p>
                    <p className="font-mono text-xs text-zinc-500 mb-3">
                      {social.handle}
                    </p>
                    <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">
                      {social.description}
                    </p>
                  </div>
                  <div
                    className={`flex items-center gap-1 text-xs font-mono mt-auto transition-colors ${c.arrow}`}
                  >
                    <span>Visit</span>
                    <span className="group-hover:translate-x-1 transition-transform">
                      →
                    </span>
                  </div>
                </motion.a>
              );
            })}
          </div>
        </motion.div>
      </div>
    </main>
  );
}
