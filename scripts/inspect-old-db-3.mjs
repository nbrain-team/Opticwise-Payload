import pg from "pg";

const OLD_DB = "postgresql://payload_user:jAlF9ffHSV7ovz2TgevzNUXiP5qvaITu@dpg-d7fbr0naqgkc739n5vug-a.oregon-postgres.render.com/payload_opticwise?sslmode=require";

const c = new pg.Client({ connectionString: OLD_DB });
await c.connect();

const total = await c.query("SELECT COUNT(*)::int n FROM posts");
const withCat = await c.query("SELECT COUNT(*)::int n FROM posts WHERE category_id IS NOT NULL");
const withFeat = await c.query("SELECT COUNT(*)::int n FROM posts WHERE feature_image_id IS NOT NULL");
const withRich = await c.query("SELECT COUNT(*)::int n FROM posts WHERE content IS NOT NULL AND content::text != 'null'");
const withHtml = await c.query("SELECT COUNT(*)::int n FROM posts WHERE html_content IS NOT NULL AND length(html_content) > 0");
console.log({total: total.rows[0].n, withCat: withCat.rows[0].n, withFeat: withFeat.rows[0].n, withRich: withRich.rows[0].n, withHtml: withHtml.rows[0].n});

const sample = await c.query("SELECT id, title, slug, content::text AS content_text, length(html_content) AS html_len FROM posts WHERE content IS NOT NULL LIMIT 1");
if (sample.rowCount) {
  const r = sample.rows[0];
  console.log("\n=== sample post with content ===");
  console.log({id: r.id, title: r.title, slug: r.slug, html_len: r.html_len});
  console.log("content (first 500 chars):", r.content_text?.slice(0, 500));
}

const samplePost = await c.query("SELECT id, title, slug, excerpt, published_at, html_content FROM posts ORDER BY published_at DESC LIMIT 1");
console.log("\n=== first post HTML preview ===");
console.log({title: samplePost.rows[0].title, slug: samplePost.rows[0].slug, excerpt: samplePost.rows[0].excerpt});
console.log("html (first 600):", samplePost.rows[0].html_content?.slice(0, 600));

await c.end();
