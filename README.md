# Soumyadeep's Dev Portfolio

A modern, interactive personal portfolio and resume website built with **Next.js 16**, **React 19**, and **Tailwind CSS**. Features a dark mode toggle, smooth animations, project showcases with image galleries, experience timeline, blog section with markdown support, and talks archive.

**Live Demo**: [soumyadeep.dev](https://soumyadeep.dev)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Scripts](#scripts)
- [Configuration](#configuration)
- [Key Components](#key-components)
- [Content Management](#content-management)
- [Deployment](#deployment)
- [Customization](#customization)
- [Contributing](#contributing)
- [License](#license)

---

## 🎯 Overview

This is a full-featured portfolio website designed to showcase software engineering work, experience, and technical insights. It serves as both a professional resume and a platform for sharing knowledge through blog posts and talk presentations.

**Key Highlights:**

- ✨ Smooth animations and interactive UI with Framer Motion
- 🌙 Dark/Light mode support with persistent theme storage
- 📱 Fully responsive design (mobile-first approach)
- 🔍 SEO-optimized with proper metadata
- 📝 Blog platform with markdown support and syntax highlighting
- 🎨 Modern, clean design with custom Tailwind configuration
- ⚡ Next.js App Router with server-side rendering capabilities
- 🎯 Project gallery with lightbox image viewer

---

## ✨ Features

### 1. **Home/Hero Section**

- Animated welcome banner
- Interactive gradient backgrounds
- Call-to-action buttons
- Quick navigation to key sections

### 2. **About Page**

- Personal bio and professional background
- Skills showcase with interactive cards
- Links to social profiles
- Professional image and branding

### 3. **Projects Showcase**

- Project cards with status indicators (in development, completed, deprecated, disabled)
- Interactive image galleries with lightbox viewer
- Tag-based filtering system
- GitHub and live demo links
- Project descriptions and tech stack information
- Keyboard navigation support in lightbox (arrow keys, ESC)

### 4. **Experience Timeline**

- Chronological career progression
- Role descriptions and achievements
- Company affiliations
- Date ranges and periods

### 5. **Blog Section**

- Markdown-based blog posts
- Syntax highlighting with Highlight.js
- Table of contents generation
- Responsive markdown rendering
- Blog post metadata (title, date, etc.)
- Tag-based post discovery

### 6. **Talks & Presentations**

- Archive of conference talks and presentations
- Event information and links
- Presentation materials access

### 7. **Theme Support**

- Dark and light mode toggle
- Persistent theme storage using `next-themes`
- Smooth transitions between themes
- System preference detection

### 8. **Responsive Navigation**

- Fixed header navbar with pill-shaped design
- Mobile hamburger menu with smooth animations
- Active route highlighting
- Theme toggle button

---

## 🛠️ Tech Stack

### Core Framework

- **Next.js** `16.2.1` - React metaframework with App Router
- **React** `19.2.4` - UI library
- **TypeScript** - Static type checking

### Styling & Design

- **Tailwind CSS** `4` - Utility-first CSS framework
- **PostCSS** `4` - CSS processor
- **Framer Motion** `12.38.0` - Animation library for React

### Content & Markdown

- **react-markdown** `10.1.0` - Markdown rendering
- **gray-matter** `4.0.3` - YAML front matter parsing
- **rehype-highlight** `7.0.2` - Syntax highlighting
- **rehype-slug** `6.0.0` - Auto-generate heading slugs
- **remark-gfm** `4.0.1` - GitHub Flavored Markdown support

### UI Components & Icons

- **Lucide React** `0.577.0` - Beautiful icon library
- **React Icons** `5.6.0` - Alternative icon library

### Theme Management

- **next-themes** `0.4.6` - Dark mode provider and utilities

### Development Tools

- **ESLint** `9` - Code linting
- **Node.js** `20+` - JavaScript runtime
- **pnpm** - Package manager (recommended)

---

## 📂 Project Structure

```
soumyadeep-portfolio/
├── public/                    # Static assets
│   └── images/               # Project and talk images
│       ├── ncc/              # Northern Cleaning Crew
│       ├── photorecipe/       # PhotoRecipe project
│       ├── popsub/           # PopSub project
│       ├── cspit_talk_1/      # Conference talk images
│       ├── cspit_talk_2/      # Conference talk images
│       ├── ddu_talk_1/        # Conference talk images
│       └── ...               # Other assets
│
├── src/
│   ├── app/                  # Next.js App Router
│   │   ├── globals.css       # Global styles and theme tokens
│   │   ├── layout.tsx        # Root layout component
│   │   ├── page.tsx          # Home page
│   │   ├── about/
│   │   │   └── page.tsx      # About page
│   │   ├── projects/
│   │   │   └── page.tsx      # Projects showcase
│   │   ├── experience/
│   │   │   └── page.tsx      # Experience timeline
│   │   ├── talks/
│   │   │   └── page.tsx      # Talks archive
│   │   ├── blogs/
│   │   │   ├── page.tsx      # Blog listing
│   │   │   ├── [slug]/
│   │   │   │   └── page.tsx  # Individual blog post
│   │   │   └── BlogsClient.tsx # Client-side blog logic
│   │   ├── contact/
│   │   │   └── page.tsx      # Contact page
│   │   └── resume/
│   │       └── page.tsx      # Resume download/display
│   │
│   ├── components/           # Reusable React components
│   │   ├── BlogMarkdown.tsx  # Markdown renderer for blogs
│   │   ├── layout/
│   │   │   ├── Navbar.tsx    # Navigation header
│   │   │   ├── Footer.tsx    # Footer component
│   │   │   └── PageHeader.tsx # Page title/header
│   │   ├── sections/
│   │   │   └── Hero.tsx      # Hero section with animations
│   │   ├── providers/
│   │   │   └── ThemeProvider.tsx # Theme context provider
│   │   └── ui/
│   │       └── FilterBar.tsx # Project filtering UI
│   │
│   ├── data/                 # Static data files
│   │   ├── projects.ts       # Projects, experience, skills
│   │   └── talks.ts          # Talks and presentations
│   │
│   └── lib/                  # Utility functions
│       ├── blogs.ts          # Blog loading and parsing
│       └── utils.ts          # General utilities
│
├── content/
│   └── blogs/                # Blog posts in Markdown
│       ├── python-slots-memory-optimization.md
│       ├── understanding-rust-ownership.md
│       └── why-your-code-doesnt-need-to-be-fast-yet.md
│
├── .next/                    # Next.js build output (ignored)
├── node_modules/             # Dependencies (ignored)
├── next.config.ts            # Next.js configuration
├── tsconfig.json             # TypeScript configuration
├── tailwind.config.ts        # Tailwind CSS configuration
├── postcss.config.mjs        # PostCSS configuration
├── eslint.config.mjs         # ESLint configuration
├── package.json              # Project metadata and scripts
├── pnpm-lock.yaml           # Dependency lock file
├── .gitignore               # Git ignore rules
└── README.md                # Project documentation
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ or **Bun** latest
- **pnpm** (recommended), **npm**, or **yarn**

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/soumyadepp/soumyadeep-portfolio.git
   cd soumyadeep-portfolio
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   # or
   npm install
   # or
   yarn install
   ```

3. **Start the development server**

   ```bash
   pnpm dev
   # or
   npm run dev
   ```

4. **Open in browser**
   - Navigate to [http://localhost:3000](http://localhost:3000)
   - The app will auto-refresh as you make changes

---

## 📜 Scripts

### Development

```bash
# Start development server with hot reload
pnpm dev
```

### Production Build

```bash
# Build for production
pnpm build

# Start production server
pnpm start
```

### Linting

```bash
# Run ESLint
pnpm lint
```

---

## ⚙️ Configuration

### Next.js Configuration (`next.config.ts`)

- Configured with TypeScript support
- Image optimization settings
- Build and runtime settings
- API routes configuration

### Tailwind CSS (`tailwind.config.ts`)

- Custom color palette
- Theme tokens for light and dark modes
- Typography settings
- Responsive breakpoints
- Animation configurations

### TypeScript (`tsconfig.json`)

- Strict mode enabled
- Path aliases configured (`@/*` for `src/*`)
- ES2020 target
- Module resolution set to `node`

### ESLint (`eslint.config.mjs`)

- Extends Next.js recommended rules
- TypeScript support
- React best practices
- Code quality checks

---

## 🧩 Key Components

### Navbar (`components/layout/Navbar.tsx`)

- Responsive pill-shaped navigation
- Fixed positioning with scroll effects
- Mobile menu with hamburger icon
- Theme toggle button
- Active route highlighting
- Smooth animations with Framer Motion

### Hero Section (`components/sections/Hero.tsx`)

- Animated gradient backgrounds
- Interactive mouse tracking effects
- Responsive typography
- Call-to-action buttons
- Dark mode optimized animations

### BlogMarkdown (`components/BlogMarkdown.tsx`)

- Renders markdown to JSX
- Syntax highlighting with Highlight.js
- GitHub Flavored Markdown support
- Auto-generated table of contents
- Responsive images and tables

### FilterBar (`components/ui/FilterBar.tsx`)

- Tag-based filtering
- Smooth transitions
- "All" category support
- Responsive design

### ThemeProvider (`components/providers/ThemeProvider.tsx`)

- `next-themes` integration
- Persistent theme storage
- System preference detection
- Hydration-safe theme toggle

---

## 📝 Content Management

### Blog Posts

Blog posts are stored as Markdown files in `content/blogs/` with YAML front matter:

```markdown
---
title: "Blog Post Title"
date: "2024-03-26"
description: "Brief description"
tags: ["tag1", "tag2"]
---

# Your content here
```

**Supported Markdown Features:**

- Headings (H1-H6)
- Lists (ordered and unordered)
- Code blocks with syntax highlighting
- Tables
- Blockquotes
- Links and images
- Emphasis (bold, italic)
- GitHub-flavored markdown

**Blog Loading:**

- Blogs are loaded from `content/blogs/` directory
- Parsed using `gray-matter` for front matter
- Sorted by date (newest first)
- Rendered with `react-markdown` and rehype plugins

### Projects Data (`src/data/projects.ts`)

```typescript
export type Project = {
  title: string;
  description: string;
  tags: string[];
  status: "in development" | "completed" | "deprecated" | "disabled";
  github?: string;
  live?: string;
  image?: string;
  gallery?: string[];
};
```

### Experience Data (`src/data/projects.ts`)

```typescript
export type Experience = {
  role: string;
  company: string;
  period: string;
  description: string;
};
```

---

## 🌍 Deployment

### Deploy to Vercel (Recommended)

1. **Push to GitHub**

   ```bash
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Select your GitHub repository
   - Vercel auto-detects Next.js settings

3. **Deploy**
   - Click "Deploy"
   - Vercel builds and deploys automatically
   - Get a live URL instantly

### Environment Variables

Create a `.env.local` file for local development:

```env
# Add any API keys or secrets needed
```

### Other Hosting Options

- **Netlify** - Supports Next.js with zero config
- **AWS Amplify** - Full AWS integration
- **Docker** - Containerize with Docker
- **Self-hosted** - Deploy to any VPS (DigitalOcean, Linode, etc.)

---

## 🎨 Customization

### Colors & Theming

Edit `src/app/globals.css` to customize colors:

```css
:root {
  --background: #f0f4fb;
  --foreground: #0f1929;
  --card: #ffffff;
  /* ... other tokens */
}

.dark {
  --background: #09090b;
  --foreground: #f4f4f5;
  /* ... dark mode colors */
}
```

### Fonts

Modify font configuration in `src/app/layout.tsx`:

- Currently uses Geist Sans and Geist Mono from Google Fonts
- Can be replaced with any Google Font or custom font

### Navigation Links

Update navigation links in `src/components/layout/Navbar.tsx`:

```typescript
const links = [
  { label: "About", href: "/about" },
  { label: "Projects", href: "/projects" },
  // Add more links
];
```

### Content Updates

- **Projects**: Edit `src/data/projects.ts`
- **Experience**: Edit experience array in `src/data/projects.ts`
- **Blog Posts**: Add `.md` files to `content/blogs/`
- **Images**: Add to `public/images/`

---

## 🐛 Troubleshooting

### Port Already in Use

```bash
# Kill the process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use a different port
pnpm dev -p 3001
```

### Build Issues

```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules
pnpm install

# Rebuild
pnpm build
```

### Theme Not Persisting

- Ensure `ThemeProvider` wraps your app in `layout.tsx`
- Clear browser cache and local storage
- Check browser's local storage support

### Images Not Loading

- Verify image paths in `public/images/`
- Check image dimensions and file sizes
- Ensure images are properly optimized

---

## 🔒 SEO & Performance

### SEO Optimization

- ✅ Metadata set in `src/app/layout.tsx`
- ✅ Open Graph tags for social sharing
- ✅ Twitter card tags
- ✅ Structured data ready (can add schema.org)
- ✅ Robots.txt configuration

### Performance Features

- ✅ Image optimization with Next.js Image component
- ✅ Code splitting and lazy loading
- ✅ CSS optimization with Tailwind
- ✅ Font optimization with Google Fonts
- ✅ Route prefetching

### Lighthouse Scores

- Aim for 90+ on all metrics
- Regularly monitor with PageSpeed Insights
- Use Chrome DevTools for profiling

---

## 📚 Learning Resources

### Next.js

- [Next.js Official Documentation](https://nextjs.org/docs)
- [Next.js App Router Guide](https://nextjs.org/docs/app)
- [Next.js Image Optimization](https://nextjs.org/docs/app/building-your-application/optimizing/images)

### React

- [React Official Docs](https://react.dev)
- [React Hooks Documentation](https://react.dev/reference/react)

### Tailwind CSS

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Tailwind CSS Color Palette](https://tailwindcss.com/docs/customizing-colors)

### TypeScript

- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app)

### Markdown

- [Markdown Guide](https://www.markdownguide.org)
- [GitHub Flavored Markdown](https://github.github.com/gfm/)

---

## 🤝 Contributing

Found a bug or want to suggest improvements? Feel free to open an issue or submit a pull request!

### Development Workflow

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Make your changes
3. Test locally: `pnpm dev`
4. Run linter: `pnpm lint`
5. Commit with clear messages: `git commit -m "Add feature X"`
6. Push: `git push origin feature/your-feature`
7. Open a Pull Request

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 👨‍💻 About the Developer

**Soumyadeep Ghosh** - Software Engineer at Infocusp Innovations

- 🔗 [GitHub](https://github.com/soumyadepp)
- 🐦 [Twitter/X](#)
- 💼 [LinkedIn](https://linkedin.com/in/soumyadeep-ghosh)
- 📧 Email: your-email@example.com

---

## 📞 Support & Feedback

Have questions or feedback? Feel free to reach out:

- Open an issue on GitHub
- Send an email
- Connect on LinkedIn

---

**Last Updated**: March 2026  
**Version**: 1.0.0

---

### Quick Start Recap

```bash
# Clone and install
git clone https://github.com/soumyadepp/soumyadeep-portfolio.git
cd soumyadeep-portfolio
pnpm install

# Start development
pnpm dev

# Open browser
# → http://localhost:3000
```

Enjoy your portfolio! 🚀
