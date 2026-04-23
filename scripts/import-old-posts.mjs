/**
 * One-shot import: pull all 93 posts from the old Render Payload DB
 * and POST them into the new Vercel Payload via REST API.
 *
 * Usage:
 *   PAYLOAD_URL=https://opticwise-payload.vercel.app \
 *   PAYLOAD_EMAIL=danny@nbrain.ai \
 *   PAYLOAD_PASSWORD='Tm0bile#88' \
 *   node scripts/import-old-posts.mjs
 */
import pg from "pg";

const OLD_DB =
  process.env.OLD_DB_URI ||
  "postgresql://payload_user:jAlF9ffHSV7ovz2TgevzNUXiP5qvaITu@dpg-d7fbr0naqgkc739n5vug-a.oregon-postgres.render.com/payload_opticwise?sslmode=require";

const BASE = process.env.PAYLOAD_URL || "https://opticwise-payload.vercel.app";
const EMAIL = process.env.PAYLOAD_EMAIL;
const PASSWORD = process.env.PAYLOAD_PASSWORD;

if (!EMAIL || !PASSWORD) {
  console.error("Set PAYLOAD_EMAIL and PAYLOAD_PASSWORD env vars");
  process.exit(1);
}

let TOKEN = "";

async function api(method, ep, body) {
  const opts = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(TOKEN ? { Authorization: `JWT ${TOKEN}` } : {}),
    },
  };
  if (body) opts.body = JSON.stringify(body);
  const res = await fetch(`${BASE}${ep}`, opts);
  const json = await res.json().catch(() => ({}));
  if (!res.ok && res.status !== 400) {
    throw new Error(`${method} ${ep} → ${res.status}: ${JSON.stringify(json).slice(0, 250)}`);
  }
  return { status: res.status, data: json };
}

async function login() {
  const { data } = await api("POST", "/api/users/login", { email: EMAIL, password: PASSWORD });
  TOKEN = data.token;
  console.log("Logged in as", data.user?.email);
}

async function existsBySlug(slug) {
  const { data } = await api(
    "GET",
    `/api/posts?where[slug][equals]=${encodeURIComponent(slug)}&limit=1&depth=0`
  );
  return data.docs && data.docs.length > 0;
}

function estimateReadingTime(html) {
  if (!html) return 1;
  const text = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  const words = text.split(" ").filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}

console.log("=== Import old Payload posts → new Payload ===\n");
console.log("Source:", OLD_DB.split("@")[1]);
console.log("Target:", BASE, "\n");

await login();

const old = new pg.Client({ connectionString: OLD_DB });
await old.connect();

const { rows: oldPosts } = await old.query(`
  SELECT id, title, slug, excerpt, html_content, published_at,
         meta_title, meta_description, _status
  FROM posts
  ORDER BY published_at DESC NULLS LAST, id DESC
`);
console.log(`Pulled ${oldPosts.length} posts from old DB.\n`);

let created = 0,
  skipped = 0,
  failed = 0;

for (const p of oldPosts) {
  if (!p.slug || !p.title) {
    console.log(`  SKIP   id=${p.id} (missing title or slug)`);
    skipped++;
    continue;
  }
  if (await existsBySlug(p.slug)) {
    console.log(`  SKIP   ${p.slug} (already exists)`);
    skipped++;
    continue;
  }
  try {
    const body = {
      title: p.title,
      slug: p.slug,
      excerpt: p.excerpt || undefined,
      htmlContent: p.html_content || undefined,
      publishedAt: p.published_at?.toISOString?.() || p.published_at || undefined,
      readingTime: estimateReadingTime(p.html_content),
      _status: p._status === "draft" ? "draft" : "published",
      ...(p.meta_title || p.meta_description
        ? {
            meta: {
              title: p.meta_title || undefined,
              description: p.meta_description || undefined,
            },
          }
        : {}),
    };
    await api("POST", "/api/posts", body);
    console.log(`  OK     ${p.slug}`);
    created++;
  } catch (e) {
    console.log(`  ERR    ${p.slug}: ${e.message}`);
    failed++;
  }
}

await old.end();

console.log("\n========================================");
console.log(`Posts imported: ${created}`);
console.log(`Skipped:        ${skipped}`);
console.log(`Failed:         ${failed}`);
console.log("========================================");
