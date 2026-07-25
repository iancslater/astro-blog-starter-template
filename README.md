# Negative Utopia

A dystopian art and writing project built around an archive of downloadable propaganda posters, stickers, and related editorial work.

**Live site:** [astro-blog-starter-template.zptqqjpz4n.workers.dev](https://astro-blog-starter-template.zptqqjpz4n.workers.dev/)

The site is built with Astro and deployed as a Cloudflare Worker. Content lives in the repository as Markdown or MDX and is organized through Astro content collections.

## What is here

- A **Propaganda Archive** for posters and stickers, including metadata, tags, preview images, and downloadable source files
- A **blog collection** for longer-form writing in Markdown or MDX
- Static, accessible Astro pages with shared site navigation and metadata
- RSS and sitemap generation
- A production-path Playwright smoke test that exercises the built Cloudflare Worker rather than only the Astro development server

## Technology

- [Astro](https://astro.build/)
- [MDX](https://mdxjs.com/)
- [Cloudflare Workers](https://developers.cloudflare.com/workers/)
- [Playwright](https://playwright.dev/)
- TypeScript

Node.js **22.12 or newer** is required.

## Content model

Content collections are defined in `src/content.config.ts`.

### Propaganda

Files live in:

```text
src/content/propaganda/
```

Supported frontmatter:

```yaml
title: Example poster
type: poster # poster or sticker
downloadFile: /downloads/example-poster.pdf
printSize: 11 × 17 inches
orientation: portrait # portrait or landscape
year: "2026"
tags:
  - surveillance
  - resistance
previewImage: /images/example-poster.png
```

Required fields are `title`, `type`, and `downloadFile`. The remaining fields are optional.

### Blog

Files live in:

```text
src/content/blog/
```

Supported frontmatter:

```yaml
title: Example post
description: A short summary of the post.
pubDate: 2026-07-25
updatedDate: 2026-07-26
heroImage: /images/example-post.jpg
```

Blog entries can use either `.md` or `.mdx`.

## Local development

Install dependencies:

```bash
npm ci
```

Start the Astro development server:

```bash
npm run dev
```

The site will be available at `http://localhost:4321` unless Astro selects another open port.

## Commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Astro development server |
| `npm run build` | Create the production build in `dist/` |
| `npm run preview` | Build and serve the generated Worker locally with Wrangler |
| `npm run test:worker` | Build the site and run the Playwright smoke test against the generated Worker |
| `npm run check` | Build, run TypeScript checking, and perform a Wrangler deployment dry run |
| `npm run cf-typegen` | Generate Cloudflare binding types |
| `npm run deploy` | Deploy the current build through Wrangler |

## Project structure

```text
public/                    Static images, downloads, fonts, and other public assets
src/components/            Shared Astro components
src/content/blog/          Markdown and MDX blog entries
src/content/propaganda/    Propaganda archive entries
src/layouts/               Shared page layouts
src/pages/                 File-based routes, RSS, and sitemap endpoints
src/styles/                Global styles
tests/worker-smoke/        Built-Worker Playwright coverage
astro.config.mjs           Astro, MDX, sitemap, Cloudflare, and session configuration
playwright.worker.config.ts
wrangler.json              Cloudflare Worker configuration
```

## Deployment notes

The project deploys to Cloudflare Workers through `wrangler.json`.

The Cloudflare Worker currently retains the historical name `astro-blog-starter-template`. That identifier is intentionally separate from the GitHub repository and project name so renaming the repository does not create a second Worker or disrupt the existing deployment.

Two adapter settings are important to the current production shape:

- Prerendering uses Astro's Node environment because the Workerd prerender path in the current Astro 7 / Cloudflare adapter combination previously serialized Astro page bodies as `[object Object]`.
- The site uses Astro's null session driver because it does not use sessions; this prevents the adapter from provisioning an unnecessary `SESSION` KV namespace.

Do not remove either setting without validating a clean production build, the built Worker, and the deployed preview.

## Verification

Before deploying changes, run:

```bash
npm ci
npm run build
npm run test:worker
npm run check
```

The Worker smoke test verifies that the homepage contains meaningful visible content and rejects malformed output such as `[object Object]` or `[object Promise]`.

## Credits

The project began from the Astro blog starter and retains design lineage from [Bear Blog](https://github.com/HermanMartinus/bearblog/). It has since been adapted into the Negative Utopia site and propaganda archive.
