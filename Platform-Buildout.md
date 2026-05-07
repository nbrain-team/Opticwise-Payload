# Platform Buildout — Opticwise Payload

Living documentation for the Opticwise web platform. Update this file whenever
new architectural decisions, service endpoints, or operational details are
discovered.

## Repository overview

- **Stack:** Next.js 15 App Router + Payload CMS 3 + Tailwind CSS
- **Database:** Postgres (Neon) — connection string in `.env` as `DATABASE_URI`
- **Object storage:** Vercel Blob (token in `.env` as `BLOB_READ_WRITE_TOKEN`)
- **Hosting:** Vercel (production at <https://opticwise.com> →
  <https://www.opticwise.com>)
- **CRM / forms backend:** `https://ownet.opticwise.com` (separate service,
  exposes `GET /api/public/forms/<slug>` and
  `POST /api/public/forms/<slug>/submit`)

## Key directories

```
app/
  (frontend)/            ← public marketing site
    (main)/
      page.tsx           ← homepage
      [...slug]/         ← dynamic CMS pages
      insights/          ← /insights landing + /insights/[slug] posts
  (payload)/admin/       ← Payload admin UI
  api/                   ← Payload API routes
  blog/feed.xml          ← RSS feed
  sitemap.ts             ← dynamic sitemap

src/
  collections/           ← Pages, Posts, Media, Categories, Authors, Users
  globals/               ← SiteSettings, Navigation, Footer
  blocks/                ← page builder blocks (FormEmbed, FivePlan, etc.)
  components/            ← React components used by the frontend
  payload.config.ts      ← root Payload config

scripts/
  static-export/         ← static HTML mirror generator (see below)
  migrations/            ← Payload DB migrations
  seed*.mjs              ← content seeding
```

## Static HTML mirror (`opticwise-html/`)

A complete, self-contained static export of the live site lives in
`opticwise-html/`. It is **generated**, not hand-edited.

- **Generator:** `scripts/static-export/build-html-mirror.mjs`
- **Build:** `npm run html:build`
- **Preview:** `npm run html:preview` (serves on <http://localhost:4321>)
- **Coverage:** all 150 sitemap URLs (25 pages + 126 insights posts) plus
  RSS, sitemap, robots, favicons, and every referenced asset.
- **Purpose:** lets the team evaluate moving off Payload to plain HTML
  hosting without losing visual fidelity, content, or SEO. See
  [`opticwise-html/README.md`](./opticwise-html/README.md) for limitations
  (mainly: form embeds rely on CRM CORS, and Payload admin doesn't exist
  in a static world).

## Content model (Payload collections)

| Collection | Slug | Purpose |
| --- | --- | --- |
| `pages` | `pages` | Marketing pages (`isHomePage` flag picks the home page) |
| `posts` | `posts` | Insights / blog posts; rendered at `/insights/<slug>` |
| `media` | `media` | Images, PDFs, attachments — served via `/api/media/file/...` |
| `categories` | `categories` | Post categories used by `/insights` filters |
| `authors` | `authors` | Post authors |
| `users` | `users` | Admin users |

Globals: `SiteSettings`, `Navigation`, `Footer`.

## Live preview

Payload's Live Preview is configured in `src/payload.config.ts`:

- Posts → `/insights/<slug>`
- Pages → `/<slug>` (or `/` if `isHomePage: true`)
- Live preview URLs are returned as RELATIVE paths so the iframe always
  loads from the same origin as the admin panel (avoids
  `NEXT_PUBLIC_SERVER_URL` drift between production and per-deploy
  Vercel URLs).

## Deployment notes

- `npm run vercel-build` runs DB migrations, then `next build`.
- DB migrations live in `scripts/migrations/` and are run by
  `scripts/run-migrations.mjs`.
- `dynamic = "force-dynamic"` on the homepage prevents Vercel from baking
  a stale 404 into the production build when the DB is briefly
  unreachable at build time.

## External integrations

- **OpticWise CRM (`ownet.opticwise.com`)** — owns all form schemas and
  submissions. The frontend `RemoteFormRenderer` fetches the form schema
  client-side and posts submissions back. CORS is currently restricted
  to production domains only.
- **Vercel Blob** — stores all uploaded media; serves through Payload's
  `/api/media/file/<filename>` proxy.
- **Google Fonts** — Inter + Playfair Display, loaded from
  `fonts.googleapis.com`.
