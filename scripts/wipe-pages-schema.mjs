/**
 * One-time wipe of the old `pages` schema (tables + enums) so Payload can
 * push a clean schema for Bill's 15 v4 blocks without an interactive
 * Drizzle "rename or create?" prompt.
 *
 * - Drops every public table whose name matches /^_?pages(_|$)/
 * - Drops every public enum/type whose name starts with `enum_pages_`
 *   or `enum__pages_v_` (Payload prefixes versioned enums with __pages_v_).
 * - Leaves posts/categories/authors/users/media untouched.
 *
 * Run with the local .env loaded:
 *   node --env-file=.env scripts/wipe-pages-schema.mjs
 */
import pg from "pg";

const conn = process.env.DATABASE_URI;
if (!conn) {
  console.error("DATABASE_URI is not set in env.");
  process.exit(1);
}

const client = new pg.Client({ connectionString: conn });
await client.connect();
console.log("Connected to database.");

const tableRes = await client.query(
  `SELECT tablename FROM pg_tables
   WHERE schemaname='public'
     AND (tablename = 'pages'
          OR tablename LIKE 'pages\\_%' ESCAPE '\\'
          OR tablename LIKE '\\_pages\\_%' ESCAPE '\\'
          OR tablename = '_pages_v')
   ORDER BY tablename;`
);
const tables = tableRes.rows.map((r) => r.tablename);

const typeRes = await client.query(
  `SELECT t.typname FROM pg_type t
   JOIN pg_namespace n ON n.oid = t.typnamespace
   WHERE n.nspname='public'
     AND t.typtype='e'
     AND (t.typname LIKE 'enum\\_pages\\_%' ESCAPE '\\'
          OR t.typname LIKE 'enum\\_\\_pages\\_v\\_%' ESCAPE '\\')
   ORDER BY t.typname;`
);
const enums = typeRes.rows.map((r) => r.typname);

console.log(`Tables to drop (${tables.length}):`);
tables.forEach((t) => console.log("  -", t));
console.log(`Enums to drop (${enums.length}):`);
enums.forEach((e) => console.log("  -", e));

if (tables.length === 0 && enums.length === 0) {
  console.log("Nothing to drop. Exiting.");
  await client.end();
  process.exit(0);
}

await client.query("BEGIN");
try {
  for (const t of tables) {
    await client.query(`DROP TABLE IF EXISTS public."${t}" CASCADE;`);
  }
  for (const e of enums) {
    await client.query(`DROP TYPE IF EXISTS public."${e}" CASCADE;`);
  }
  await client.query("COMMIT");
  console.log("\nWiped successfully.");
} catch (err) {
  await client.query("ROLLBACK");
  console.error("Wipe failed:", err);
  process.exit(1);
}

await client.end();
