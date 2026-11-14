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
  title: SITE.title,
  description: SITE.description,
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
