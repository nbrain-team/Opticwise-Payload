/**
 * Adds DB tables for the new `formEmbed` Payload block.
 *
 *   pages_blocks_form_embed       — live block instances on Pages
 *   _pages_v_blocks_form_embed    — versions/drafts variant
 *
 * Mirrors the column shape of every other simple block (e.g. pull_quote):
 * `_order`, `_path`, `_parent_id`, `id`, plus the block's own fields
 * (form_slug, eyebrow, heading, description, style, block_name).
 *
 * Idempotent: every CREATE / ALTER step uses an `IF NOT EXISTS` check.
 *
 * Required because `db.push` is silently skipped in production (Payload only
 * pushes schema in dev) — see the run-migrations.mjs preamble for full context.
 */

async function tableExists(client, table) {
  const r = await client.query(
    `SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name=$1`,
    [table],
  );
  return r.rowCount > 0;
}
async function colExists(client, table, col) {
  const r = await client.query(
    `SELECT 1 FROM information_schema.columns WHERE table_name=$1 AND column_name=$2`,
    [table, col],
  );
  return r.rowCount > 0;
}
async function constraintExists(client, name) {
  const r = await client.query(
    `SELECT 1 FROM information_schema.table_constraints WHERE constraint_name=$1`,
    [name],
  );
  return r.rowCount > 0;
}
async function indexExists(client, name) {
  const r = await client.query(`SELECT 1 FROM pg_indexes WHERE indexname=$1`, [
    name,
  ]);
  return r.rowCount > 0;
}

async function ensureColumn(client, log, table, col, ddlType) {
  if (!(await colExists(client, table, col))) {
    log(`  + ${table}.${col} (${ddlType})`);
    await client.query(`ALTER TABLE "${table}" ADD COLUMN "${col}" ${ddlType}`);
  } else {
    log(`  ✓ ${table}.${col} already exists`);
  }
}

async function ensureIndex(client, log, name, table, col) {
  if (!(await indexExists(client, name))) {
    log(`  + index ${name}`);
    await client.query(`CREATE INDEX "${name}" ON "${table}" ("${col}")`);
  } else {
    log(`  ✓ index ${name} already exists`);
  }
}

async function ensureFK(client, log, name, table, col, refTable, refCol) {
  if (!(await constraintExists(client, name))) {
    log(`  + FK ${name} → ${refTable}(${refCol})`);
    await client.query(
      `ALTER TABLE "${table}" ADD CONSTRAINT "${name}"
         FOREIGN KEY ("${col}") REFERENCES "${refTable}"("${refCol}")
         ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  } else {
    log(`  ✓ FK ${name} already exists`);
  }
}

async function buildLiveTable(client, log) {
  const t = "pages_blocks_form_embed";
  if (!(await tableExists(client, t))) {
    log(`+ creating table ${t}`);
    await client.query(`
      CREATE TABLE "${t}" (
        "_order"      integer        NOT NULL,
        "_parent_id"  integer        NOT NULL,
        "_path"       text           NOT NULL,
        "id"          varchar        PRIMARY KEY,
        "form_slug"   varchar        NOT NULL DEFAULT 'schedule-review',
        "eyebrow"     varchar,
        "heading"     varchar,
        "description" varchar,
        "style"       varchar        DEFAULT 'light',
        "block_name"  varchar
      )
    `);
  } else {
    log(`✓ table ${t} already exists`);
  }
  // Defensive column/index/FK ensures (in case the table exists from a partial run)
  await ensureColumn(client, log, t, "_order", "integer");
  await ensureColumn(client, log, t, "_parent_id", "integer");
  await ensureColumn(client, log, t, "_path", "text");
  await ensureColumn(client, log, t, "form_slug", "varchar");
  await ensureColumn(client, log, t, "eyebrow", "varchar");
  await ensureColumn(client, log, t, "heading", "varchar");
  await ensureColumn(client, log, t, "description", "varchar");
  await ensureColumn(client, log, t, "style", "varchar");
  await ensureColumn(client, log, t, "block_name", "varchar");
  await ensureIndex(client, log, `${t}_order_idx`, t, "_order");
  await ensureIndex(client, log, `${t}_parent_id_idx`, t, "_parent_id");
  await ensureIndex(client, log, `${t}_path_idx`, t, "_path");
  await ensureFK(
    client,
    log,
    `${t}_parent_id_fk`,
    t,
    "_parent_id",
    "pages",
    "id",
  );
}

async function buildVersionsTable(client, log) {
  const t = "_pages_v_blocks_form_embed";
  if (!(await tableExists(client, t))) {
    log(`+ creating table ${t}`);
    // Note: in version tables Payload uses `id integer` (auto) + a `_uuid varchar`
    // mirroring the live row's id. We follow the same convention.
    await client.query(`
      CREATE TABLE "${t}" (
        "_order"      integer        NOT NULL,
        "_parent_id"  integer        NOT NULL,
        "_path"       text           NOT NULL,
        "id"          serial         PRIMARY KEY,
        "form_slug"   varchar        NOT NULL DEFAULT 'schedule-review',
        "eyebrow"     varchar,
        "heading"     varchar,
        "description" varchar,
        "style"       varchar        DEFAULT 'light',
        "_uuid"       varchar,
        "block_name"  varchar
      )
    `);
  } else {
    log(`✓ table ${t} already exists`);
  }
  await ensureColumn(client, log, t, "_order", "integer");
  await ensureColumn(client, log, t, "_parent_id", "integer");
  await ensureColumn(client, log, t, "_path", "text");
  await ensureColumn(client, log, t, "form_slug", "varchar");
  await ensureColumn(client, log, t, "eyebrow", "varchar");
  await ensureColumn(client, log, t, "heading", "varchar");
  await ensureColumn(client, log, t, "description", "varchar");
  await ensureColumn(client, log, t, "style", "varchar");
  await ensureColumn(client, log, t, "_uuid", "varchar");
  await ensureColumn(client, log, t, "block_name", "varchar");
  await ensureIndex(client, log, `${t}_order_idx`, t, "_order");
  await ensureIndex(client, log, `${t}_parent_id_idx`, t, "_parent_id");
  await ensureIndex(client, log, `${t}_path_idx`, t, "_path");
  await ensureFK(
    client,
    log,
    `${t}_parent_id_fk`,
    t,
    "_parent_id",
    "_pages_v",
    "id",
  );
}

export async function up({ client, log }) {
  log("live table: pages_blocks_form_embed");
  await buildLiveTable(client, log);
  log("versions table: _pages_v_blocks_form_embed");
  await buildVersionsTable(client, log);
}
