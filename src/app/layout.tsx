import type { Metadata } from "next";
import { Host_Grotesk } from "next/font/google";
import "./globals.css";
import Nav from "@/components/layout/Nav";
import { SITE } from "@/content/site";

const host = Host_Grotesk({
  variable: "--font-host",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: SITE.title, template: `%s | ${SITE.fullName}` },
  description: SITE.description,
  openGraph: {
    type: "website",
    siteName: SITE.fullName,
    title: SITE.title,
    description: SITE.description,
    locale: SITE.locale,
  },
  twitter: { card: "summary_large_image" },
  authors: [{ name: SITE.fullName, url: SITE.url }],
  creator: SITE.fullName,
  robots: {
    index: true,
    follow: true,
    googleBot: { "max-image-preview": "large", "max-snippet": -1 },
  },
  verification: { google: process.env.GOOGLE_SITE_VERIFICATION },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={host.variable}>
      <body className="min-h-screen">
        <Nav />
        <main>{children}</main>
      </body>
    </html>
  );
}
