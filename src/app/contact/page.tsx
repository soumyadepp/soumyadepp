import type { Metadata } from "next";
import ContactPanel from "@/components/contact/ContactPanel";
import { CONTACT_PAGE } from "@/content/site";

export const metadata: Metadata = {
  title: "Contact",
  description: CONTACT_PAGE.title,
};

export default function ContactPage() {
  return <ContactPanel />;
}
