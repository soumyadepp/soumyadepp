# Developing the portfolio

The site behind [soumyadepp.com](https://soumyadepp.com). Next.js 16 (App Router), React 19, Tailwind CSS 4 and TypeScript, deployed on Vercel from `main`.

## Run it

```bash
pnpm install
pnpm dev      # http://localhost:3000
pnpm build    # production build, also type checks
pnpm lint
```

## Where things live

| Path | What it holds |
|---|---|
| `src/content/site.ts` | All page copy, navigation, socials and chapter settings |
| `src/data/` | Experience, projects, talks and the resume |
| `content/blogs/*.md` | Blog posts, with frontmatter for title, date, tags, excerpt, cover and read time |
| `src/components/reel/` | The canvas animations behind each section (`engine.ts`) and the React wrapper (`Frame.tsx`) |
| `src/lib/ambient.ts` | The optional ambient score and click sounds, built with the Web Audio API |
| `public/images/` | Photos, logos, project screenshots and blog figures |
| `.github/profile/` | The banner on the GitHub profile README |

## Search and link previews

- `src/lib/seo.ts` builds each page's metadata (`pageMetadata`: title, description, canonical address, link preview tags and the share image) and its structured data (`personSchema`, `websiteSchema`, `profilePageSchema`, `blogPostingSchema`, `projectSchema`, `breadcrumbSchema`). `src/components/JsonLd.tsx` writes the structured data into the page.
- Every page exports `pageMetadata({ title, description, path })`. A new page needs it too, or it has no canonical address and no share image.
- Each page has exactly one `<h1>`. Headings written with `#` in a blog post are rendered as `<h2>`, since the post's title is the `<h1>`.
- `src/app/sitemap.ts` and `src/app/robots.ts` serve `/sitemap.xml` and `/robots.txt`. New projects, talks and posts appear in the sitemap on their own.
- To verify the site in Google Search Console, set `GOOGLE_SITE_VERIFICATION` to the code Google gives you in the Vercel project's environment variables and redeploy. Pages are built ahead of time, so it has to be set at build time.
- Check structured data with Google's Rich Results Test after a deploy.

## Adding content

- **A blog post:** add a Markdown file to `content/blogs/`. The file name becomes the URL.
- **A project:** add an entry to `src/data/projects.ts` and its screenshots under `public/images/projects/<slug>/`.
- **A talk:** add an entry to `src/data/talks.ts` and its photos under `public/images/<talk>/`.

## Conventions

- Copy lives in `src/content/site.ts`, never inline in components.
- Comments are docstrings only.
- `/lab` shows every animation side by side in development and returns 404 in production.
