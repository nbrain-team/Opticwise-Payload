#!/usr/bin/env node
/**
 * build-html-mirror.mjs
 *
 * Crawl the live opticwise.com site (Next.js + Payload) and produce a 100% static
 * HTML mirror in /opticwise-html/.
 *
 * Strategy:
 *  1. Pull every URL from the live sitemap (https://www.opticwise.com/sitemap.xml).
 *  2. Add a few known extras that the sitemap omits (/insights landing, robots, etc).
 *  3. Fetch each HTML page, parse out every referenced asset (CSS, JS, images,
 *     fonts, favicons), and recursively download those assets.
 *     - For Next.js _next/image optimizer URLs, we resolve them down to the
 *       underlying source asset (e.g. /images/foo.png) since the optimizer
 *       isn't available in a static export.
 *     - CSS files are scanned for url(...) references so fonts and background
 *       images come along too.
 *  4. Rewrite every URL inside the HTML and CSS to a local, absolute-from-root
 *     path that works under any normal static server.
 *  5. Save pages as /<slug>/index.html so /about works without a .html suffix.
 *
 * Output layout:
 *   /opticwise-html/
 *     index.html
 *     about/index.html
 *     contact/index.html
 *     insights/index.html
 *     insights/<slug>/index.html
 *     _next/static/...
 *     api/media/file/...
 *     images/...
 *     ...
 */
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const SITE_ORIGIN = "https://www.opticwise.com";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.resolve(__dirname, "..", "..", "opticwise-html");

const CONCURRENCY = 6;

/** External hosts we still want to download (anything not listed stays remote). */
const DOWNLOAD_HOSTS = new Set([
  "www.opticwise.com",
  "opticwise.com",
]);

/** External hosts we deliberately leave as remote (CDNs, third-party widgets). */
const KEEP_REMOTE_HOSTS = new Set([
  "fonts.googleapis.com",
  "fonts.gstatic.com",
  "ownet.opticwise.com",
  "www.google-analytics.com",
  "www.googletagmanager.com",
  "googletagmanager.com",
]);

const log = (...a) => console.log("[mirror]", ...a);
const warn = (...a) => console.warn("[mirror][warn]", ...a);

/* ------------------------------------------------------ README content */

function buildReadme({ pages, posts, assets }) {
  return `# opticwise-html — Static HTML Mirror of opticwise.com

This folder is a **100% static HTML mirror of the live opticwise.com site** as
of the most recent crawl. It was generated to evaluate moving off Payload CMS
to a plain HTML hosting model **without sacrificing visual fidelity, content,
SEO, or page coverage**.

> **Source of truth:** [\`https://www.opticwise.com\`](https://www.opticwise.com)
> **Crawler script:** [\`scripts/static-export/build-html-mirror.mjs\`](../scripts/static-export/build-html-mirror.mjs)

## What's inside

| Type | Count |
| --- | ---: |
| Top-level pages | ${pages} |
| Insights / blog posts | ${posts} |
| CSS / JS / image / font assets | ${assets} |

Every URL in the live \`sitemap.xml\` is captured here, plus the \`/insights\`
listing page, the RSS feed, sitemap, robots.txt, and all favicons.

### Folder layout

\`\`\`
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
\`\`\`

Every URL inside the mirror is rewritten to a **relative path** (e.g.
\`./about/index.html\` from the homepage, \`../about/index.html\` from any
top-level page, \`../../about/index.html\` from a blog post). Directory
links also have \`index.html\` appended so a \`file://\` URL can find the
file (browsers don't auto-resolve \`/foo/\` to \`/foo/index.html\` over
\`file://\` the way HTTP servers do).

## How to preview locally

You have two options:

### Option 1 — Just double-click \`index.html\` (no server needed)

Because every URL is relative, the site works directly from a \`file://\`
URL. Double-click \`opticwise-html/index.html\` in Finder and the homepage
opens in your default browser, fully styled and navigable. Click around
between pages and they all resolve.

> Note: a few interactive bits (the form embeds, search/filter on
> \`/insights\`) rely on JavaScript that talks to the live OpticWise CRM
> at \`ownet.opticwise.com\`. Those won't function from \`file://\` because
> of browser CORS restrictions — the static HTML still renders perfectly.

### Option 2 — Serve via local HTTP (recommended for full JS behavior)

From the **repo root** (one directory above this folder):

\`\`\`bash
npm run html:preview
# or directly:
python3 -m http.server 4321 --directory opticwise-html
\`\`\`

Then open <http://localhost:4321/>.

## How to regenerate from the live site

The crawler reads the current live sitemap, downloads every page + every
referenced asset (CSS, JS, images, fonts, RSC payloads), and rewrites
every URL to a local relative path:

\`\`\`bash
npm run html:build
# or directly:
node scripts/static-export/build-html-mirror.mjs
\`\`\`

This wipes \`opticwise-html/\` and rebuilds it from scratch in ~20 seconds.

## What works in the static export

- Full visual fidelity — fonts, colors, hero, navigation, footer, all
  responsive breakpoints
- All marketing pages and all insights / blog posts, with metadata
  (title, OG tags, JSON-LD)
- The \`/insights\` landing page — search, category filters, "Load more"
- Internal navigation between pages
- All static images (logos, hero photos, blog hero art, awards, book covers)
- Favicons, sitemap, robots
- Google Fonts (loaded from Google's CDN, same as the live site)

## Known limitations of a static export

These would need to be addressed before fully cutting over from Payload:

1. **Embedded forms (\`/contact\`, "Schedule Your Review", PPP starter kit)**
   are rendered by \`RemoteFormRenderer\`, which fetches the form schema
   from \`https://ownet.opticwise.com/api/public/forms/<slug>\`. That
   endpoint currently does not include a CORS allow-origin header for any
   host except production. From \`localhost:4321\` and any new domain, you
   will see the graceful fallback message *"We couldn't load this form
   right now."* When migrating, either:
   - add the new static-site origin to the CRM's CORS allowlist, or
   - replace \`RemoteFormRenderer\` with a plain HTML \`<form>\` POSTing
     directly to the CRM's form endpoint.

2. **Newsletter signup ("Get the PPP Starter Kit")** uses the same CRM
   endpoint and has the same CORS constraint.

3. **Live Preview / Payload admin** (\`/admin/...\`) is not included — the
   admin UI is the entire point of Payload and would not exist in a
   plain-HTML world. Editorial workflow becomes "edit HTML files and push
   git" or "regenerate from a new source".

4. **Dynamic routes** that rely on Payload at request time:
   - \`/sitemap.xml\` (currently auto-generated from the DB) is captured
     as a static snapshot; it will go stale unless regenerated.
   - \`/blog/feed.xml\` (RSS) — same caveat.
   - 404 page — Next.js renders a custom 404 from a Payload global; the
     static export only has the rendered HTML for known URLs and will
     return whatever the static server's default 404 is.

5. **Search engine canonicals** still point to
   \`https://www.opticwise.com\` (correct for SEO continuity). If the
   static site is hosted on a different domain, update canonicals before
   promoting it.

6. **Image optimization** — the live Next.js site uses \`_next/image\` to
   serve responsive JPEG/WebP/AVIF variants on demand. The static mirror
   resolves every image reference down to its underlying source file
   (typically a PNG or JPG from \`/images/\` or \`/api/media/file/\`).
   Pages look identical, but you lose automatic responsive image
   optimization; compensating with build-time srcset generation is
   straightforward.

## Generated by

\`scripts/static-export/build-html-mirror.mjs\` — a single-file Node crawler
with no external runtime dependencies (uses native \`fetch\` from Node 18+).
`;
}

/* ---------------------------------------------------------------- helpers */

async function fetchWithRetry(url, attempts = 6) {
  let lastErr;
  for (let i = 0; i < attempts; i++) {
    try {
      const res = await fetch(url, {
        headers: { "User-Agent": "OpticWise-Static-Mirror/1.0" },
        redirect: "follow",
      });
      // 4xx is "real" failure -- don't retry. 5xx and network issues retry
      // with exponential backoff. The live opticwise.com Vercel deployment
      // intermittently returns 500s for individual pages (cold-start/Neon
      // pool churn), so the retry curve needs to cover several seconds.
      if (res.ok) return res;
      if (res.status >= 400 && res.status < 500) {
        throw new Error(`HTTP ${res.status} for ${url}`);
      }
      lastErr = new Error(`HTTP ${res.status} for ${url}`);
    } catch (err) {
      lastErr = err;
    }
    if (i < attempts - 1) {
      const wait = 800 * Math.pow(2, i) + Math.random() * 400;
      await new Promise((r) => setTimeout(r, wait));
    }
  }
  throw lastErr;
}

async function fetchText(url) {
  const res = await fetchWithRetry(url);
  return await res.text();
}

async function fetchBuffer(url) {
  const res = await fetchWithRetry(url);
  const ab = await res.arrayBuffer();
  return Buffer.from(ab);
}

async function ensureDir(filePath) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
}

async function writeFile(localPath, contents) {
  await ensureDir(localPath);
  await fs.writeFile(localPath, contents);
}

function decodeEntities(s) {
  return String(s)
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

/**
 * Resolve a possibly relative URL against the page URL it appeared in.
 * Returns a fully qualified URL string, or null if it shouldn't be touched
 * (mailto:, tel:, javascript:, data:, anchors, etc).
 */
function resolveUrl(raw, baseUrl) {
  if (!raw) return null;
  const decoded = decodeEntities(raw).trim();
  if (!decoded) return null;
  if (decoded.startsWith("#")) return null;
  if (/^(mailto:|tel:|javascript:|data:|blob:)/i.test(decoded)) return null;
  try {
    return new URL(decoded, baseUrl).toString();
  } catch {
    return null;
  }
}

/**
 * Convert a fully qualified URL to the local path (relative to OUT_DIR) where
 * we'll save it, AND the public URL we should rewrite the reference to.
 *
 * Returns: { localPath, publicUrl, kind } | null  (null = skip)
 */
function urlToLocal(absUrl) {
  let u;
  try {
    u = new URL(absUrl);
  } catch {
    return null;
  }

  // Resolve Next.js image optimizer down to the underlying source.
  if (u.pathname === "/_next/image" && u.searchParams.has("url")) {
    const inner = u.searchParams.get("url");
    const innerAbs = inner.startsWith("http")
      ? inner
      : new URL(inner, SITE_ORIGIN).toString();
    return urlToLocal(innerAbs);
  }

  // Strip cache-busting query params for Next.js static chunks; everything
  // else gets the query string folded into the file name so we don't collide.
  const isInternalNext = u.pathname.startsWith("/_next/");
  let pathname = u.pathname;
  let suffix = "";
  if (!isInternalNext && u.search) {
    suffix =
      "_" +
      u.search
        .replace(/^\?/, "")
        .replace(/[^a-zA-Z0-9_.-]/g, "_")
        .slice(0, 60);
  }

  // Decide if this host should be downloaded at all.
  if (
    !DOWNLOAD_HOSTS.has(u.hostname) &&
    !KEEP_REMOTE_HOSTS.has(u.hostname) &&
    u.hostname !== ""
  ) {
    // Unknown external host -- be conservative and leave it remote.
    return { keepRemote: true, publicUrl: u.toString() };
  }

  if (KEEP_REMOTE_HOSTS.has(u.hostname)) {
    return { keepRemote: true, publicUrl: u.toString() };
  }

  // The `pathname` returned from the URL constructor preserves percent-encoded
  // characters (e.g. `%5Bslug%5D`). When a static HTTP server (Python's
  // http.server, nginx, Vercel, etc.) handles a request, it URL-decodes the
  // path BEFORE looking up the file on disk. So we must store files using the
  // decoded form, while keeping the public URL ref in its original encoded
  // form so the request matches the file on disk after decoding.
  const decode = (s) => {
    try {
      return decodeURIComponent(s);
    } catch {
      return s;
    }
  };

  // Pages: no extension -> save as <path>/index.html
  const hasExt = /\.[a-zA-Z0-9]{1,8}$/.test(pathname);
  if (!hasExt) {
    if (pathname === "/" || pathname === "") {
      return {
        localPath: path.join(OUT_DIR, "index.html"),
        publicUrl: "/",
        kind: "page",
      };
    }
    const trimmedEncoded = pathname.replace(/^\/+/, "").replace(/\/+$/, "");
    const trimmedDecoded = decode(trimmedEncoded);
    return {
      localPath: path.join(OUT_DIR, trimmedDecoded, "index.html"),
      publicUrl: "/" + trimmedEncoded + "/",
      kind: "page",
    };
  }

  // Asset with extension.
  const cleanPath = pathname.replace(/^\/+/, "");
  const baseName = cleanPath.replace(/\.([a-zA-Z0-9]+)$/, "");
  const ext = (cleanPath.match(/\.([a-zA-Z0-9]+)$/) || [, ""])[1];
  const finalRelEncoded = suffix ? `${baseName}${suffix}.${ext}` : cleanPath;
  const finalRelDecoded = decode(finalRelEncoded);
  return {
    localPath: path.join(OUT_DIR, finalRelDecoded),
    publicUrl: "/" + finalRelEncoded,
    kind: "asset",
  };
}

/* ----------------------------------------------------------- url discovery */

const HTML_URL_PATTERNS = [
  // href / src / data-src / poster
  /\b(?:href|src|data-src|poster|action)\s*=\s*"([^"]+)"/gi,
  /\b(?:href|src|data-src|poster|action)\s*=\s*'([^']+)'/gi,
  // imageSrcSet / srcSet / srcset
  /\b(?:imageSrcSet|srcSet|srcset)\s*=\s*"([^"]+)"/gi,
  /\b(?:imageSrcSet|srcSet|srcset)\s*=\s*'([^']+)'/gi,
  // Next.js inline JSON sometimes embeds `"src":"/..."` — pick those up too.
  /"src"\s*:\s*"(\/[^"]+\.(?:png|jpe?g|webp|gif|svg|avif|ico|woff2?|ttf|otf))"/gi,
  /"url"\s*:\s*"(\/[^"]+\.(?:png|jpe?g|webp|gif|svg|avif|ico|woff2?|ttf|otf))"/gi,
];

function extractUrlsFromHtml(html) {
  const out = new Set();
  for (const pat of HTML_URL_PATTERNS) {
    pat.lastIndex = 0;
    let m;
    while ((m = pat.exec(html)) !== null) {
      const value = m[1];
      // srcset can contain "url 1x, url 2x" pairs.
      if (/\s\d+(\.\d+)?[wx]/i.test(value)) {
        for (const part of value.split(",")) {
          const u = part.trim().split(/\s+/)[0];
          if (u) out.add(u);
        }
      } else {
        out.add(value);
      }
    }
  }
  return [...out];
}

const CSS_URL_PATTERN = /url\(\s*(['"]?)([^'")]+)\1\s*\)/gi;
const CSS_IMPORT_PATTERN = /@import\s+(?:url\()?\s*(['"])([^'"]+)\1/gi;

function extractUrlsFromCss(css) {
  const out = new Set();
  CSS_URL_PATTERN.lastIndex = 0;
  let m;
  while ((m = CSS_URL_PATTERN.exec(css)) !== null) {
    const v = m[2].trim();
    if (v && !v.startsWith("data:")) out.add(v);
  }
  CSS_IMPORT_PATTERN.lastIndex = 0;
  while ((m = CSS_IMPORT_PATTERN.exec(css)) !== null) {
    const v = m[2].trim();
    if (v && !v.startsWith("data:")) out.add(v);
  }
  return [...out];
}

/* --------------------------------------------------------- url rewriting */

/**
 * Convert an absolute-from-OUT_DIR public URL (e.g. "/about/" or
 * "/_next/static/css/foo.css") into a relative path that works when the
 * file at `fromLocalPath` is opened directly in a browser via the
 * `file://` protocol — meaning:
 *
 *   1. No leading `/` (which would resolve to the filesystem root under
 *      file:// and break every reference). Each path is prefixed with
 *      enough `../` segments to climb back to OUT_DIR.
 *   2. Directory-style links (no extension, ending in `/`) are extended
 *      with `index.html` because `file://` does not auto-serve index
 *      files when a request lands on a directory.
 *
 * The output also remains 100% compatible with normal HTTP serving.
 */
function relativize(absPublicUrl, fromLocalPath) {
  if (!absPublicUrl || typeof absPublicUrl !== "string") return absPublicUrl;
  if (absPublicUrl.startsWith("#")) return absPublicUrl;
  if (/^(https?:|mailto:|tel:|javascript:|data:|blob:)/i.test(absPublicUrl)) {
    return absPublicUrl;
  }
  if (!absPublicUrl.startsWith("/")) return absPublicUrl;

  const fromDir = path.dirname(fromLocalPath);
  const relDir = path.relative(OUT_DIR, fromDir);
  const depth = relDir === "" ? 0 : relDir.split(path.sep).length;
  const prefix = depth === 0 ? "./" : "../".repeat(depth);

  // Split off any query/fragment so we don't accidentally treat `?` or `#`
  // as part of the path when deciding whether to append `index.html`.
  const hashIdx = absPublicUrl.indexOf("#");
  const hash = hashIdx === -1 ? "" : absPublicUrl.slice(hashIdx);
  const noHash = hashIdx === -1 ? absPublicUrl : absPublicUrl.slice(0, hashIdx);
  const qIdx = noHash.indexOf("?");
  const query = qIdx === -1 ? "" : noHash.slice(qIdx);
  const pathOnly = qIdx === -1 ? noHash : noHash.slice(0, qIdx);

  let stripped = pathOnly.replace(/^\/+/, "");
  if (stripped === "" || stripped.endsWith("/")) {
    stripped += "index.html";
  }

  return prefix + stripped + query + hash;
}

function rewriteHtml(html, pageUrl, localPath) {
  const rel = (pub) => relativize(pub, localPath);

  // href="..." / src="..." / action="..." / data-src="..." / poster="..."
  const attrPattern =
    /\b(href|src|data-src|poster|action)\s*=\s*"([^"]+)"/gi;
  html = html.replace(attrPattern, (full, attr, raw) => {
    const abs = resolveUrl(raw, pageUrl);
    if (!abs) return full;
    const mapped = urlToLocal(abs);
    if (!mapped) return full;
    return `${attr}="${rel(mapped.publicUrl)}"`;
  });

  // imageSrcSet / srcSet / srcset
  const srcsetPattern =
    /\b(imageSrcSet|srcSet|srcset)\s*=\s*"([^"]+)"/gi;
  html = html.replace(srcsetPattern, (full, attr, raw) => {
    const decoded = decodeEntities(raw);
    const parts = decoded.split(",").map((p) => p.trim()).filter(Boolean);
    const rebuilt = parts.map((part) => {
      const [u, ...rest] = part.split(/\s+/);
      const abs = resolveUrl(u, pageUrl);
      if (!abs) return part;
      const mapped = urlToLocal(abs);
      if (!mapped) return part;
      return [rel(mapped.publicUrl), ...rest].join(" ");
    });
    return `${attr}="${rebuilt.join(", ")}"`;
  });

  // Final pass: strip Vercel deployment-id query strings from any remaining
  // _next URL embedded inside RSC payload script tags (e.g. inside escaped
  // JS strings like \"/_next/static/...?dpl=...\" or webpack chunk refs
  // like \"static/chunks/...?dpl=...\"). These don't affect functionality
  // on a static server (which ignores the query) but they trigger noisy
  // "preloaded but not used" console warnings because the React runtime
  // sees them as distinct from the rewritten <link> URL.
  html = html.replace(
    /((?:\/_next\/static\/|static\/chunks\/|static\/css\/)[^?"'\\\s,]+)\?dpl=[A-Za-z0-9_-]+/g,
    "$1",
  );

  // Also rewrite `/_next/image?url=ENC&...` references that survived inside
  // RSC JS payload strings (escaped quotes prevented the attribute regex
  // above from catching them). Map them down to the underlying source path.
  html = html.replace(
    /\/_next\/image\?url=([^&"\\\s]+)(?:&(?:amp;)?[^"\\\s]+)?/g,
    (full, encUrl) => {
      try {
        const decoded = decodeURIComponent(encUrl);
        return decoded.startsWith("/") ? decoded : "/" + decoded;
      } catch {
        return full;
      }
    },
  );

  return html;
}

function rewriteCss(css, cssUrl, localPath) {
  return css.replace(CSS_URL_PATTERN, (full, q, raw) => {
    const abs = resolveUrl(raw, cssUrl);
    if (!abs) return full;
    const mapped = urlToLocal(abs);
    if (!mapped) return full;
    return `url(${q}${relativize(mapped.publicUrl, localPath)}${q})`;
  });
}

/* ------------------------------------------------------ sitemap & queue */

async function loadSitemapUrls() {
  const xml = await fetchText(`${SITE_ORIGIN}/sitemap.xml`);
  const out = [];
  const re = /<loc>([^<]+)<\/loc>/g;
  let m;
  while ((m = re.exec(xml)) !== null) {
    const u = m[1].trim();
    if (!u.includes("/insights/null")) out.push(u);
  }
  return out;
}

const queue = [];
const seen = new Map(); // absUrl -> { localPath, publicUrl, kind, status }

function enqueue(absUrl, kind) {
  if (!absUrl) return null;
  if (seen.has(absUrl)) return seen.get(absUrl);
  const mapped = urlToLocal(absUrl);
  if (!mapped) return null;
  if (mapped.keepRemote) return mapped; // no enqueue, just remember
  const entry = { ...mapped, absUrl, kind: kind || mapped.kind, status: "pending" };
  seen.set(absUrl, entry);
  queue.push(entry);
  return entry;
}

async function processEntry(entry) {
  try {
    if (entry.kind === "page") {
      const html = await fetchText(entry.absUrl);
      const refs = extractUrlsFromHtml(html);
      for (const ref of refs) {
        const abs = resolveUrl(ref, entry.absUrl);
        if (!abs) continue;
        enqueue(abs);
      }
      const rewritten = rewriteHtml(html, entry.absUrl, entry.localPath);
      await writeFile(entry.localPath, rewritten);
      entry.status = "ok";
    } else {
      // asset
      const ext = path.extname(entry.localPath).toLowerCase();
      const isText = ext === ".css" || ext === ".js" || ext === ".json" || ext === ".xml" || ext === ".svg" || ext === ".txt";
      if (isText) {
        const text = await fetchText(entry.absUrl);
        if (ext === ".css") {
          const refs = extractUrlsFromCss(text);
          for (const ref of refs) {
            const abs = resolveUrl(ref, entry.absUrl);
            if (!abs) continue;
            enqueue(abs);
          }
          const rewritten = rewriteCss(text, entry.absUrl, entry.localPath);
          await writeFile(entry.localPath, rewritten);
        } else {
          await writeFile(entry.localPath, text);
        }
      } else {
        const buf = await fetchBuffer(entry.absUrl);
        await writeFile(entry.localPath, buf);
      }
      entry.status = "ok";
    }
  } catch (err) {
    entry.status = "error";
    entry.error = err.message;
    warn(entry.absUrl, "->", err.message);
  }
}

async function drainQueue() {
  let inFlight = 0;
  let processed = 0;
  return new Promise((resolve) => {
    const tick = () => {
      while (inFlight < CONCURRENCY && queue.length > 0) {
        const entry = queue.shift();
        inFlight++;
        processEntry(entry)
          .catch((e) => warn("processEntry crash:", e.message))
          .finally(() => {
            inFlight--;
            processed++;
            if (processed % 25 === 0) {
              log(`processed ${processed}, queue ${queue.length}, inflight ${inFlight}`);
            }
            tick();
          });
      }
      if (inFlight === 0 && queue.length === 0) resolve(processed);
    };
    tick();
  });
}

/* ----------------------------------------------------------------- main */

async function main() {
  log("output dir:", OUT_DIR);
  await fs.rm(OUT_DIR, { recursive: true, force: true });
  await fs.mkdir(OUT_DIR, { recursive: true });

  log("fetching sitemap...");
  const sitemapUrls = await loadSitemapUrls();
  log(`sitemap urls: ${sitemapUrls.length}`);

  // Add the canonical homepage explicitly + a few extras the sitemap may miss.
  const seedUrls = new Set([
    `${SITE_ORIGIN}/`,
    `${SITE_ORIGIN}/insights`,
    `${SITE_ORIGIN}/blog/feed.xml`,
    `${SITE_ORIGIN}/sitemap.xml`,
    `${SITE_ORIGIN}/robots.txt`,
    `${SITE_ORIGIN}/favicon.ico`,
    `${SITE_ORIGIN}/favicon.png`,
    `${SITE_ORIGIN}/icon.png`,
    `${SITE_ORIGIN}/apple-touch-icon.png`,
  ]);

  for (const u of sitemapUrls) {
    // Normalize bare domain to "/" so it doesn't get saved as ./index.html twice.
    let abs = u;
    if (abs === SITE_ORIGIN) abs = `${SITE_ORIGIN}/`;
    seedUrls.add(abs);
  }

  for (const u of seedUrls) enqueue(u, u.match(/\.[a-zA-Z0-9]{1,8}$/) ? "asset" : "page");

  log(`seeded ${queue.length} urls`);
  let total = await drainQueue();
  log(`first pass done. processed ${total} urls. errors: ${[...seen.values()].filter((e) => e.status === "error").length}`);

  // The live opticwise.com Vercel deployment intermittently 500s on cold
  // requests (Neon connection pool churn). Re-enqueue any *page* failures
  // that look transient (5xx / network errors) and try them again with a
  // fresh retry budget. 4xx are real "this URL doesn't exist" results and
  // are skipped — those broken links exist on the live site too.
  const pageFailures = [...seen.values()].filter(
    (e) => e.status === "error" && e.kind === "page",
  );
  const transientFailures = pageFailures.filter(
    (e) => !e.error || !/HTTP 4\d\d/.test(e.error),
  );
  if (transientFailures.length > 0) {
    log(
      `re-trying ${transientFailures.length} transient page failure(s) after a 5s pause...`,
    );
    await new Promise((r) => setTimeout(r, 5000));
    for (const entry of transientFailures) {
      entry.status = "pending";
      entry.error = null;
      queue.push(entry);
    }
    total += await drainQueue();
    log(
      `final errors: ${[...seen.values()].filter((e) => e.status === "error").length}`,
    );
  }

  // Write a manifest to aid debugging.
  const manifest = [...seen.values()].map((e) => ({
    url: e.absUrl,
    local: path.relative(OUT_DIR, e.localPath || ""),
    kind: e.kind,
    status: e.status,
    error: e.error || null,
  }));
  await writeFile(
    path.join(OUT_DIR, "_mirror-manifest.json"),
    JSON.stringify(manifest, null, 2),
  );

  // Always (re)emit the README so re-running the build doesn't leave the
  // mirror folder undocumented.
  const pageEntries = [...seen.values()].filter(
    (e) => e.kind === "page" && e.status === "ok",
  );
  const stats = {
    pages: pageEntries.filter(
      (e) => !e.absUrl.includes("/insights/") || e.absUrl.endsWith("/insights"),
    ).length,
    posts: pageEntries.filter(
      (e) => /\/insights\/[^/]+/.test(new URL(e.absUrl).pathname),
    ).length,
    assets: [...seen.values()].filter(
      (e) => e.kind === "asset" && e.status === "ok",
    ).length,
  };
  await writeFile(path.join(OUT_DIR, "README.md"), buildReadme(stats));

  const errors = manifest.filter((m) => m.status === "error");
  if (errors.length) {
    warn(`${errors.length} fetch errors. First few:`);
    errors.slice(0, 10).forEach((e) => warn("  ", e.url, "->", e.error));
  }
  log("manifest written to _mirror-manifest.json");
}

main().catch((e) => {
  console.error("[mirror] fatal:", e);
  process.exit(1);
});
