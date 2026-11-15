import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageHero from "@/components/layout/PageHero";
import { GRADES, TALKS_PAGE } from "@/content/site";
import { talks } from "@/data/talks";

type Props = {
  params: Promise<{ id: string }>;
};

export function generateStaticParams() {
  return talks.map((talk) => ({ id: talk.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const talk = talks.find((item) => item.id === id);
  if (!talk) return {};
  return {
    title: talk.title,
    description: talk.description,
  };
}

export default async function TalkPage({ params }: Props) {
  const { id } = await params;
  const talk = talks.find((item) => item.id === id);
  if (!talk) notFound();

  return (
    <>
      <PageHero
        anchor="talks"
        parent={{ label: TALKS_PAGE.kicker, href: "/talks" }}
        kicker={[talk.event, talk.date, talk.duration]
          .filter(Boolean)
          .join(" · ")}
        title={talk.title}
        mode="spiral"
        grade={GRADES.moss}
        frameLabel={TALKS_PAGE.frameLabel}
      >
        <p className="t-lead text-body">{talk.venue}</p>
      </PageHero>

      <div className="wrap flex flex-col gap-16 pt-10">
        <section className="grid gap-x-6 gap-y-6 lg:grid-cols-12">
          <h2 className="t-label text-quiet lg:col-span-3">
            {TALKS_PAGE.about}
          </h2>
          <div className="flex flex-col gap-5 lg:col-span-6">
            <p className="t-lead text-body">
              {talk.longDescription ?? talk.description}
            </p>
            {talk.audience && (
              <p className="t-body text-quiet">
                {TALKS_PAGE.audience}: {talk.audience}
              </p>
            )}
          </div>
        </section>

        {talk.keyTakeaways && (
          <section className="grid gap-x-6 gap-y-6 lg:grid-cols-12">
            <h2 className="t-label text-quiet lg:col-span-3">
              {TALKS_PAGE.takeaways}
            </h2>
            <ol className="lg:col-span-9">
              {talk.keyTakeaways.map((item, position) => (
                <li
                  key={item}
                  className="grid grid-cols-[3rem_1fr] gap-x-6 border-t border-line py-4 first:border-paper"
                >
                  <span className="t-body text-quiet">
                    {String(position + 1).padStart(2, "0")}
                  </span>
                  <span className="t-sub font-medium">{item}</span>
                </li>
              ))}
            </ol>
          </section>
        )}

        <section className="grid gap-x-6 gap-y-6 lg:grid-cols-12">
          <h2 className="t-label text-quiet lg:col-span-3">
            {TALKS_PAGE.stills}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:col-span-9">
            {talk.images.map((image, position) => (
              <div
                key={image}
                className="relative aspect-[3/2] overflow-hidden bg-panel"
              >
                <Image
                  src={image}
                  alt={`${talk.title}, photograph ${position + 1}`}
                  fill
                  sizes="(min-width: 1024px) 36vw, (min-width: 640px) 50vw, 100vw"
                  className="still object-cover"
                />
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="wrap py-14">
        <Link href="/talks" className="t-body py-3 text-quiet hover:text-paper">
          {TALKS_PAGE.back}
        </Link>
      </div>
    </>
  );
}
