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

## Adding content

- **A blog post:** add a Markdown file to `content/blogs/`. The file name becomes the URL.
- **A project:** add an entry to `src/data/projects.ts` and its screenshots under `public/images/projects/<slug>/`.
- **A talk:** add an entry to `src/data/talks.ts` and its photos under `public/images/<talk>/`.

## Conventions

- Copy lives in `src/content/site.ts`, never inline in components.
- Comments are docstrings only.
- `/lab` shows every animation side by side in development and returns 404 in production.
