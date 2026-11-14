import type { Metadata } from "next";
import ContactPanel from "@/components/contact/ContactPanel";
import { CONTACT_PAGE, SITE } from "@/content/site";

export const metadata: Metadata = {
  title: `Contact | ${SITE.fullName}`,
  description: CONTACT_PAGE.title,
};

export default function ContactPage() {
  return <ContactPanel />;
}
