import type { Metadata } from "next";
import ChapterReel from "@/components/home/ChapterReel";
import JsonLd from "@/components/JsonLd";
import { SITE } from "@/content/site";
import { pageMetadata, personSchema, websiteSchema } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  description: SITE.description,
  path: "/",
});

export default function Home() {
  return (
    <>
      <JsonLd data={[personSchema(), websiteSchema()]} />
      <ChapterReel />
    </>
  );
}
