"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import SocialIcon from "@/components/contact/SocialIcon";
import Frame from "@/components/reel/Frame";
import { CONTACT_PAGE, GRADES, SITE, SOCIALS } from "@/content/site";

type ContactPanelProps = {
  variant?: "page" | "section" | "reel";
};

const CHIP =
  "flex h-12 w-12 items-center justify-center border border-line text-body transition-colors duration-200 hover:border-paper hover:bg-paper hover:text-stage";

/**
 * The contact screen: the email address, socials and reasons to write, over
 * the signal frame. The same layout is used on the contact page, at the
 * foot of the about page and as the last chapter of the home reel.
 *
 * Args:
 *   variant: "page" fills the screen, "section" sits at the end of a page,
 *     and "reel" fits inside a home reel chapter and clears its chapter bar.
 *     Only "page" makes its title the page's main heading; the others sit
 *     under a page that already has one.
 */
export default function ContactPanel({ variant = "page" }: ContactPanelProps) {
  const [copied, setCopied] = useState(false);
  const [clock, setClock] = useState("");
  const reel = variant === "reel";
  const Heading = variant === "page" ? "h1" : "h2";

  useEffect(() => {
    const format = new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: CONTACT_PAGE.timeZone,
    });
    const tick = () => setClock(format.format(new Date()));
    tick();
    const timer = window.setInterval(tick, 30000);
    return () => window.clearInterval(timer);
  }, []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(SITE.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      window.location.href = `mailto:${SITE.email}`;
    }
  };

  const height = {
    page: "min-h-svh",
    section: "lg:min-h-[50rem]",
    reel: "h-full",
  }[variant];

  return (
    <section
      id={reel ? undefined : "contact"}
      className={`relative flex flex-col justify-end overflow-hidden ${height}`}
    >
      <Frame
        mode="signal"
        grade={GRADES.tungsten}
        label={CONTACT_PAGE.frameLabel}
        focusX={0.5}
        focusY={0.52}
        className={`lg:hidden ${reel ? "max-lg:h-[44svh]" : "max-lg:h-[54svh]"}`}
      />
      <Frame
        mode="signal"
        grade={GRADES.tungsten}
        label={CONTACT_PAGE.frameLabel}
        focusX={0.72}
        focusY={variant === "section" ? 0.24 : 0.34}
        className="hidden lg:block"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-40 bg-linear-to-b from-stage to-transparent"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 hidden h-1/2 bg-linear-to-t from-stage/90 from-15% to-transparent lg:block"
      />

      <div
        className={`wrap relative grid gap-x-6 gap-y-12 lg:grid-cols-12 lg:items-end ${
          reel
            ? "pr-16 pb-10 md:pr-[var(--gutter)] md:pb-32"
            : "pt-[48svh] pb-12 lg:pt-40"
        }`}
      >
        <div className="flex min-w-0 flex-col gap-5 lg:col-span-7">
          <p className="t-label text-quiet">{CONTACT_PAGE.kicker}</p>
          <Heading className="t-title">{CONTACT_PAGE.title}</Heading>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            <a
              href={`mailto:${SITE.email}`}
              className="t-heading border-b-2 border-paper pb-2 whitespace-nowrap hover:opacity-70 max-sm:text-[5.4vw]!"
            >
              {SITE.email}
            </a>
            <button
              type="button"
              onClick={copy}
              aria-live="polite"
              className="t-label min-h-11 cursor-pointer border border-paper px-4 hover:bg-paper hover:text-stage"
            >
              {copied ? CONTACT_PAGE.copied : CONTACT_PAGE.copy}
            </button>
          </div>
          <p className="t-lead max-w-[36rem] text-body">{CONTACT_PAGE.line}</p>
          <nav
            aria-label={CONTACT_PAGE.socialsLabel}
            className="flex gap-2 pt-1"
          >
            {SOCIALS.map((social) =>
              social.href.startsWith("/") ? (
                <Link
                  key={social.href}
                  href={social.href}
                  aria-label={social.label}
                  title={social.label}
                  className={CHIP}
                >
                  <SocialIcon name={social.icon} />
                </Link>
              ) : (
                <a
                  key={social.href}
                  href={social.href}
                  aria-label={social.label}
                  title={social.label}
                  className={CHIP}
                >
                  <SocialIcon name={social.icon} />
                </a>
              ),
            )}
          </nav>
        </div>

        <div
          className={`flex-col lg:col-span-4 lg:col-start-9 ${
            reel ? "hidden lg:flex" : "flex"
          }`}
        >
          <h2 className="t-label pb-4 text-quiet">
            {CONTACT_PAGE.topicsLabel}
          </h2>
          {CONTACT_PAGE.topics.map((topic) => (
            <a
              key={topic.label}
              href={`mailto:${SITE.email}?subject=${encodeURIComponent(topic.subject)}`}
              className="group grid grid-cols-[6rem_1fr_auto] items-baseline gap-x-4 border-t border-line py-4 transition-colors duration-200 hover:border-paper"
            >
              <span className="t-body font-semibold">{topic.label}</span>
              <span className="t-body text-body">{topic.line}</span>
              <span
                aria-hidden="true"
                className="t-body text-quiet transition-transform duration-300 ease-reel group-hover:translate-x-1 group-hover:text-paper"
              >
                &rarr;
              </span>
            </a>
          ))}
          <p className="t-small flex flex-wrap justify-between gap-x-6 gap-y-1 border-t border-line pt-4 text-quiet">
            <span>{CONTACT_PAGE.place}</span>
            {clock && (
              <span>
                {clock} {CONTACT_PAGE.localTime}
              </span>
            )}
          </p>
        </div>
      </div>
    </section>
  );
}
