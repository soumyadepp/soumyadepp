import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Nav from "@/components/layout/Nav";
import { SITE } from "@/content/site";

const host = localFont({
  variable: "--font-host",
  src: [
    {
      path: "./fonts/host-grotesk-latin-400.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/host-grotesk-latin-500.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "./fonts/host-grotesk-latin-600.woff2",
      weight: "600",
      style: "normal",
    },
  ],
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
