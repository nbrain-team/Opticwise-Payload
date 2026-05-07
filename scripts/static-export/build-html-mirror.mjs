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

/* ---------------------------------------------------------------- helpers */

async function fetchWithRetry(url, attempts = 4) {
  let lastErr;
  for (let i = 0; i < attempts; i++) {
    try {
      const res = await fetch(url, {
        headers: { "User-Agent": "OpticWise-Static-Mirror/1.0" },
        redirect: "follow",
      });
      // 4xx is "real" failure -- don't retry. 5xx and network issues retry with backoff.
      if (res.ok) return res;
      if (res.status >= 400 && res.status < 500) {
        throw new Error(`HTTP ${res.status} for ${url}`);
      }
      lastErr = new Error(`HTTP ${res.status} for ${url}`);
    } catch (err) {
      lastErr = err;
    }
    if (i < attempts - 1) {
      const wait = 500 * Math.pow(2, i) + Math.random() * 200;
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

function rewriteHtml(html, pageUrl) {
  // href="..." / src="..." / action="..." / data-src="..." / poster="..."
  const attrPattern =
    /\b(href|src|data-src|poster|action)\s*=\s*"([^"]+)"/gi;
  html = html.replace(attrPattern, (full, attr, raw) => {
    const abs = resolveUrl(raw, pageUrl);
    if (!abs) return full;
    const mapped = urlToLocal(abs);
    if (!mapped) return full;
    if (mapped.keepRemote) {
      return `${attr}="${mapped.publicUrl}"`;
    }
    return `${attr}="${mapped.publicUrl}"`;
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
      const pub = mapped.keepRemote ? mapped.publicUrl : mapped.publicUrl;
      return [pub, ...rest].join(" ");
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

function rewriteCss(css, cssUrl) {
  return css.replace(CSS_URL_PATTERN, (full, q, raw) => {
    const abs = resolveUrl(raw, cssUrl);
    if (!abs) return full;
    const mapped = urlToLocal(abs);
    if (!mapped) return full;
    const pub = mapped.keepRemote ? mapped.publicUrl : mapped.publicUrl;
    return `url(${q}${pub}${q})`;
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
      const rewritten = rewriteHtml(html, entry.absUrl);
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
          const rewritten = rewriteCss(text, entry.absUrl);
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
  const total = await drainQueue();
  log(`done. processed ${total} urls. errors: ${[...seen.values()].filter((e) => e.status === "error").length}`);

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
