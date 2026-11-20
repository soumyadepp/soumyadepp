import type { Metadata } from "next";
import { SITE, SOCIALS } from "@/content/site";

type PageSeo = {
  title?: string;
  description: string;
  path: string;
  article?: { publishedTime: string; tags: string[] };
};

/**
 * Turns a site path into its full public address.
 *
 * Args:
 *   path: A path starting with a slash, such as /blogs.
 *
 * Returns:
 *   The absolute URL on the live site.
 */
export function absoluteUrl(path: string): string {
  return new URL(path, SITE.url).toString();
}

/**
 * Builds a page's metadata: its title and description, its canonical
 * address, and the matching link preview tags. A page's own openGraph
 * replaces the layout's and drops the image file beside the layout, so the
 * shared fields and the share image are repeated here.
 *
 * Args:
 *   page: The page's title (left out on the home page), description and
 *     path, plus the publish date and tags when it is an article.
 *
 * Returns:
 *   The metadata to export from the page.
 */
export function pageMetadata(page: PageSeo): Metadata {
  const title = page.title ? `${page.title} | ${SITE.fullName}` : SITE.title;
  const image = {
    url: SITE.shareImage.path,
    width: SITE.shareImage.width,
    height: SITE.shareImage.height,
    alt: SITE.shareImage.alt,
  };
  const shared = {
    siteName: SITE.fullName,
    title,
    description: page.description,
    url: page.path,
    locale: SITE.locale,
    images: [image],
  };
  return {
    ...(page.title ? { title: page.title } : {}),
    description: page.description,
    alternates: { canonical: page.path },
    openGraph: page.article
      ? {
          ...shared,
          type: "article",
          publishedTime: page.article.publishedTime,
          authors: [SITE.fullName],
          tags: page.article.tags,
        }
      : { ...shared, type: "website" },
    twitter: {
      card: "summary_large_image",
      title,
      description: page.description,
      images: [image],
    },
  };
}

/**
 * Lists the profiles on other sites that belong to the same person.
 *
 * Returns:
 *   The absolute links from the socials list, leaving out links back to
 *   this site.
 */
function profiles(): string[] {
  return SOCIALS.map((social) => social.href).filter((href) =>
    href.startsWith("http"),
  );
}

/**
 * Describes the site's owner to search engines.
 *
 * Returns:
 *   A schema.org Person, with an id other records can point to.
 */
export function personSchema() {
  return {
    "@type": "Person",
    "@id": absoluteUrl("/#person"),
    name: SITE.fullName,
    givenName: SITE.name,
    url: SITE.url,
    image: absoluteUrl(SITE.photo),
    jobTitle: SITE.role,
    description: SITE.description,
    email: `mailto:${SITE.email}`,
    address: { "@type": "PostalAddress", addressLocality: SITE.location },
    sameAs: profiles(),
  };
}

/**
 * Describes the site itself, published by its owner.
 *
 * Returns:
 *   A schema.org WebSite.
 */
export function websiteSchema() {
  return {
    "@type": "WebSite",
    "@id": absoluteUrl("/#website"),
    url: SITE.url,
    name: SITE.fullName,
    description: SITE.description,
    inLanguage: SITE.language,
    publisher: { "@id": absoluteUrl("/#person") },
  };
}

/**
 * Describes the about page as a profile of the site's owner.
 *
 * Args:
 *   description: The page's lead line.
 *
 * Returns:
 *   A schema.org ProfilePage whose subject is the Person.
 */
export function profilePageSchema(description: string) {
  return {
    "@type": "ProfilePage",
    url: absoluteUrl("/about"),
    name: `About | ${SITE.fullName}`,
    description,
    mainEntity: { "@id": absoluteUrl("/#person") },
  };
}

/**
 * Describes a blog post, so results can show its date and author.
 *
 * Args:
 *   post: The post's slug, title, excerpt, ISO date, tags and cover image.
 *
 * Returns:
 *   A schema.org BlogPosting.
 */
export function blogPostingSchema(post: {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  tags: string[];
  coverImage: string;
}) {
  const url = absoluteUrl(`/blogs/${post.slug}`);
  return {
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    url,
    mainEntityOfPage: url,
    ...(post.date ? { datePublished: post.date } : {}),
    ...(post.coverImage ? { image: absoluteUrl(post.coverImage) } : {}),
    keywords: post.tags.join(", "),
    inLanguage: SITE.language,
    author: { "@id": absoluteUrl("/#person") },
    publisher: { "@id": absoluteUrl("/#person") },
  };
}

/**
 * Describes a project as software its owner wrote.
 *
 * Args:
 *   project: The project's slug, name, summary, stack, year, links and
 *     the registry pages it is installed from, which become `sameAs`.
 *
 * Returns:
 *   A schema.org SoftwareSourceCode.
 */
export function projectSchema(project: {
  slug: string;
  name: string;
  summary: string;
  stack: string[];
  year: string;
  github?: string;
  live?: string;
  install?: { href: string }[];
}) {
  const elsewhere = [
    ...(project.live ? [project.live] : []),
    ...(project.install ?? []).map((item) => item.href),
  ];
  return {
    "@type": "SoftwareSourceCode",
    name: project.name,
    description: project.summary,
    url: absoluteUrl(`/projects/${project.slug}`),
    programmingLanguage: project.stack,
    dateCreated: project.year,
    ...(project.github ? { codeRepository: project.github } : {}),
    ...(elsewhere.length > 0 ? { sameAs: elsewhere } : {}),
    author: { "@id": absoluteUrl("/#person") },
  };
}

/**
 * Describes where a page sits in the site, for the trail in results.
 *
 * Args:
 *   trail: Each step's label and path, from the section down to the page.
 *
 * Returns:
 *   A schema.org BreadcrumbList that starts at the home page.
 */
export function breadcrumbSchema(trail: { label: string; path: string }[]) {
  const steps = [{ label: SITE.name, path: "/" }, ...trail];
  return {
    "@type": "BreadcrumbList",
    itemListElement: steps.map((step, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: step.label,
      item: absoluteUrl(step.path),
    })),
  };
}
