import type { Metadata } from "next";
import ContactPanel from "@/components/contact/ContactPanel";
import { CONTACT_PAGE } from "@/content/site";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Contact",
  description: CONTACT_PAGE.title,
  path: "/contact",
});

export default function ContactPage() {
  return <ContactPanel />;
}
