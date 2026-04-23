import pg from "pg";

const OLD_DB = "postgresql://payload_user:jAlF9ffHSV7ovz2TgevzNUXiP5qvaITu@dpg-d7fbr0naqgkc739n5vug-a.oregon-postgres.render.com/payload_opticwise?sslmode=require";

const c = new pg.Client({ connectionString: OLD_DB });
await c.connect();

console.log("=== media sample ===");
const media = await c.query("SELECT id, filename, url, mime_type, alt FROM media ORDER BY id");
for (const m of media.rows) console.log(`  ${m.id} | ${m.filename} | ${m.mime_type} | url=${m.url?.slice(0, 80)}`);

console.log("\n=== posts sample (first 5) ===");
const posts = await c.query("SELECT id, slug, title, _status, published_at, feature_image_id, category_id, length(html_content) as html_len FROM posts ORDER BY published_at DESC NULLS LAST LIMIT 5");
for (const p of posts.rows) console.log(`  ${p.id} | ${p.slug} | ${p._status} | feat=${p.feature_image_id} | cat=${p.category_id} | html=${p.html_len}`);

console.log("\n=== categories ===");
const cats = await c.query("SELECT id, title, slug FROM categories ORDER BY id");
for (const cat of cats.rows) console.log(`  ${cat.id} | ${cat.slug} | ${cat.title}`);

console.log("\n=== posts_rels columns ===");
const relCols = await c.query("SELECT column_name FROM information_schema.columns WHERE table_name='posts_rels' ORDER BY ordinal_position");
for (const r of relCols.rows) console.log(`  ${r.column_name}`);

console.log("\n=== posts_rels sample ===");
const rels = await c.query("SELECT * FROM posts_rels LIMIT 5");
console.log(JSON.stringify(rels.rows, null, 2));

console.log(`\n=== posts status counts ===`);
const statusCounts = await c.query("SELECT _status, COUNT(*) FROM posts GROUP BY _status");
for (const s of statusCounts.rows) console.log(`  ${s._status}: ${s.count}`);

await c.end();
