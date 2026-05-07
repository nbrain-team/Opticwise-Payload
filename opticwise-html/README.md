# opticwise-html — Static HTML Mirror of opticwise.com

This folder is a **100% static HTML mirror of the live opticwise.com site** as
of the most recent crawl. It was generated to evaluate moving off Payload CMS
to a plain HTML hosting model **without sacrificing visual fidelity, content,
SEO, or page coverage**.

> **Source of truth:** [`https://www.opticwise.com`](https://www.opticwise.com)
> **Crawler script:** [`scripts/static-export/build-html-mirror.mjs`](../scripts/static-export/build-html-mirror.mjs)

## What's inside

| Type | Count |
| --- | ---: |
| Top-level pages | 25 |
| Insights / blog posts | 126 |
| CSS / JS / image / font assets | 159 |
| Total size on disk | ~89 MB |

Every URL in the live `sitemap.xml` (150 entries) is captured here, plus the
`/insights` listing page, the RSS feed, sitemap, robots.txt, and all
favicons.

### Folder layout

```
opticwise-html/
├── index.html                     ← homepage (was /)
├── about/index.html               ← /about
├── contact/index.html             ← /contact
├── faq/index.html, glossary/...   ← every other top-level page
├── insights/
│   ├── index.html                 ← /insights (blog landing page)
│   └── <slug>/index.html          ← every blog post
├── _next/static/                  ← Next.js CSS + JS bundles
├── api/media/file/                ← Payload-served media (images, PDFs)
├── images/                        ← static logo / brand assets
├── favicon.ico, favicon.png, ...
├── sitemap.xml, robots.txt
└── _mirror-manifest.json          ← debug log of every URL captured
```

Each page is saved as `<route>/index.html` so a normal static server (Nginx,
Vercel, Netlify, S3+CloudFront, GitHub Pages, etc.) will serve `/about` as
`about/index.html` automatically — exactly how the live site behaves today.

## How to preview locally

From the **repo root** (one directory above this folder):

```bash
npm run html:preview
# or directly:
python3 -m http.server 4321 --directory opticwise-html
```

Then open <http://localhost:4321/>.

## How to regenerate from the live site

The crawler reads the current live sitemap, downloads every page + every
referenced asset (CSS, JS, images, fonts, RSC payloads), and rewrites every
URL to a local path:

```bash
npm run html:build
# or directly:
node scripts/static-export/build-html-mirror.mjs
```

This wipes `opticwise-html/` and rebuilds it from scratch in ~20 seconds.

## What works in the static export

- Full visual fidelity — fonts, colors, hero, navigation, footer, all
  responsive breakpoints
- All 25 marketing pages and all 126 insights / blog posts, with metadata
  (title, OG tags, JSON-LD)
- The `/insights` landing page — search, category filters, "Load more"
- Internal navigation between pages
- All static images (logos, hero photos, blog hero art, awards, book covers)
- Favicons, sitemap, robots
- Google Fonts (loaded from Google's CDN, same as the live site)

## Known limitations of a static export

These would need to be addressed before fully cutting over from Payload:

1. **Embedded forms (`/contact`, "Schedule Your Review", PPP starter kit)**
   are rendered by `RemoteFormRenderer`, which fetches the form schema from
   `https://ownet.opticwise.com/api/public/forms/<slug>`. That endpoint
   currently does not include a CORS allow-origin header for any host
   except production. From `localhost:4321` and any new domain, you will
   see the graceful fallback message *"We couldn't load this form right
   now."* When migrating, either:
   - add the new static-site origin to the CRM's CORS allowlist, or
   - replace `RemoteFormRenderer` with a plain HTML `<form>` POSTing
     directly to the CRM's form endpoint.

2. **Newsletter signup (`Get the PPP Starter Kit`)** uses the same CRM
   endpoint and has the same CORS constraint as above.

3. **Live Preview / Payload admin** (`/admin/...`) is not included — the
   admin UI is the entire point of Payload and would not exist in a
   plain-HTML world. Editorial workflow becomes "edit HTML files and push
   git" or "regenerate from a new source".

4. **Dynamic routes** that rely on Payload at request time:
   - `/sitemap.xml` (currently auto-generated from the DB) is captured as
     a static snapshot; it will go stale unless regenerated.
   - `/blog/feed.xml` (RSS) — same caveat.
   - 404 page — Next.js renders a custom 404 from a Payload global; the
     static export only has the rendered HTML for known URLs and will
     return whatever the static server's default 404 is.

5. **Search engine canonicals** still point to `https://www.opticwise.com`
   (correct for SEO continuity). If the static site is hosted on a
   different domain, update canonicals before promoting it.

6. **Image optimization** — the live Next.js site uses `_next/image` to
   serve responsive JPEG/WebP/AVIF variants on demand. The static mirror
   resolves every image reference down to its underlying source file
   (typically a PNG or JPG from `/images/` or `/api/media/file/`). Pages
   look identical, but you lose automatic responsive image optimization;
   compensating with build-time srcset generation is straightforward.

## Generated by

`scripts/static-export/build-html-mirror.mjs` — a single-file Node crawler
with no external runtime dependencies (uses native `fetch` from Node 18+).
