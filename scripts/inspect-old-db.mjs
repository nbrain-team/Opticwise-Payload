import pg from "pg";

const OLD_DB = "postgresql://payload_user:jAlF9ffHSV7ovz2TgevzNUXiP5qvaITu@dpg-d7fbr0naqgkc739n5vug-a.oregon-postgres.render.com/payload_opticwise?sslmode=require";

const client = new pg.Client({ connectionString: OLD_DB });
await client.connect();

const tables = await client.query(`
  SELECT table_name FROM information_schema.tables
  WHERE table_schema = 'public' ORDER BY table_name
`);
console.log("=== TABLES ===");
for (const t of tables.rows) console.log("  " + t.table_name);

const interesting = ["posts", "categories", "media", "users", "pages"];
for (const t of interesting) {
  const cols = await client.query(`
    SELECT column_name, data_type
    FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = $1
    ORDER BY ordinal_position
  `, [t]);
  if (!cols.rowCount) {
    console.log(`\n--- ${t}: not found`);
    continue;
  }
  console.log(`\n--- ${t} columns ---`);
  for (const c of cols.rows) console.log(`  ${c.column_name}: ${c.data_type}`);
  const count = await client.query(`SELECT COUNT(*)::int AS n FROM "${t}"`);
  console.log(`  count: ${count.rows[0].n}`);
}

await client.end();
