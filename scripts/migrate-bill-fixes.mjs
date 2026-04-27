import fs from 'node:fs';
import path from 'node:path';
import pg from 'pg';

const envPath = path.resolve(process.cwd(), '.env');
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
  }
}

const url = process.env.DATABASE_URI;
if (!url) {
  console.error('DATABASE_URI missing');
  process.exit(1);
}

const client = new pg.Client({ connectionString: url, ssl: { rejectUnauthorized: false } });
await client.connect();

async function colExists(table, col) {
  const r = await client.query(
    `SELECT 1 FROM information_schema.columns WHERE table_name=$1 AND column_name=$2`,
    [table, col],
  );
  return r.rowCount > 0;
}
async function tableExists(name) {
  const r = await client.query(
    `SELECT 1 FROM information_schema.tables WHERE table_name=$1`,
    [name],
  );
  return r.rowCount > 0;
}
async function add(table, col, ddl) {
  if (await colExists(table, col)) {
    console.log(`  - ${table}.${col} already present, skipping`);
    return;
  }
  console.log(`  + ${table}.${col} ${ddl}`);
  await client.query(`ALTER TABLE ${table} ADD COLUMN ${col} ${ddl}`);
}

console.log('=== Posts.meta group ===');
await add('posts', 'meta_title', 'varchar');
await add('posts', 'meta_description', 'varchar');
await add('posts', 'meta_og_image_id', 'integer REFERENCES media(id) ON DELETE SET NULL');
await add('posts', 'meta_no_index', 'boolean DEFAULT false');

console.log('=== Pages.meta group ===');
await add('pages', 'meta_title', 'varchar');
await add('pages', 'meta_description', 'varchar');
await add('pages', 'meta_og_image_id', 'integer REFERENCES media(id) ON DELETE SET NULL');
await add('pages', 'meta_no_index', 'boolean DEFAULT false');

console.log('=== _pages_v.meta group (drafts) ===');
if (await tableExists('_pages_v')) {
  await add('_pages_v', 'version_meta_title', 'varchar');
  await add('_pages_v', 'version_meta_description', 'varchar');
  await add('_pages_v', 'version_meta_og_image_id', 'integer REFERENCES media(id) ON DELETE SET NULL');
  await add('_pages_v', 'version_meta_no_index', 'boolean DEFAULT false');
}

console.log('=== _posts_v.meta group (drafts) ===');
if (await tableExists('_posts_v')) {
  await add('_posts_v', 'version_meta_title', 'varchar');
  await add('_posts_v', 'version_meta_description', 'varchar');
  await add('_posts_v', 'version_meta_og_image_id', 'integer REFERENCES media(id) ON DELETE SET NULL');
  await add('_posts_v', 'version_meta_no_index', 'boolean DEFAULT false');
}

console.log('=== Site Settings new fields ===');
await add('site_settings', 'insights_hero_eyebrow', 'varchar');
await add('site_settings', 'insights_hero_heading', 'varchar');
await add('site_settings', 'insights_hero_lede', 'varchar');
await add('site_settings', 'insights_cta_heading', 'varchar');
await add('site_settings', 'insights_cta_subheading', 'varchar');
await add('site_settings', 'default_meta_title', 'varchar');
await add('site_settings', 'default_meta_description', 'varchar');
await add('site_settings', 'default_og_image_id', 'integer REFERENCES media(id) ON DELETE SET NULL');
await add('site_settings', 'organization_description', 'varchar');
await add('site_settings', 'organization_founding_year', 'numeric');

console.log('=== site_settings_organization_same_as (array) ===');
if (!(await tableExists('site_settings_organization_same_as'))) {
  await client.query(`
    CREATE TABLE site_settings_organization_same_as (
      _order integer NOT NULL,
      _parent_id integer NOT NULL REFERENCES site_settings(id) ON DELETE CASCADE,
      id varchar NOT NULL,
      url varchar,
      PRIMARY KEY (_parent_id, id)
    )
  `);
  console.log('  + created');
} else {
  console.log('  - already exists, skipping');
}

console.log('=== Navigation: items + items_children ===');
if (!(await tableExists('navigation_items'))) {
  await client.query(`
    CREATE TABLE navigation_items (
      _order integer NOT NULL,
      _parent_id integer NOT NULL REFERENCES navigation(id) ON DELETE CASCADE,
      id varchar NOT NULL,
      label varchar,
      href varchar,
      style varchar DEFAULT 'link',
      PRIMARY KEY (_parent_id, id)
    )
  `);
  console.log('  + navigation_items created');
} else {
  console.log('  - navigation_items exists, skipping');
}
if (!(await tableExists('navigation_items_children'))) {
  await client.query(`
    CREATE TABLE navigation_items_children (
      _order integer NOT NULL,
      _parent_id varchar NOT NULL,
      id varchar NOT NULL,
      label varchar,
      href varchar,
      PRIMARY KEY (_parent_id, id)
    )
  `);
  console.log('  + navigation_items_children created');
} else {
  console.log('  - navigation_items_children exists, skipping');
}

console.log('=== Footer global tables ===');
if (!(await tableExists('footer'))) {
  await client.query(`
    CREATE TABLE footer (
      id serial PRIMARY KEY,
      updated_at timestamp(3) with time zone NOT NULL DEFAULT now(),
      created_at timestamp(3) with time zone NOT NULL DEFAULT now()
    )
  `);
  console.log('  + footer created');
} else {
  console.log('  - footer exists, skipping');
}
if (!(await tableExists('footer_columns'))) {
  await client.query(`
    CREATE TABLE footer_columns (
      _order integer NOT NULL,
      _parent_id integer NOT NULL REFERENCES footer(id) ON DELETE CASCADE,
      id varchar NOT NULL,
      heading varchar,
      PRIMARY KEY (_parent_id, id)
    )
  `);
  console.log('  + footer_columns created');
} else {
  console.log('  - footer_columns exists, skipping');
}
if (!(await tableExists('footer_columns_links'))) {
  await client.query(`
    CREATE TABLE footer_columns_links (
      _order integer NOT NULL,
      _parent_id varchar NOT NULL,
      id varchar NOT NULL,
      label varchar,
      href varchar,
      PRIMARY KEY (_parent_id, id)
    )
  `);
  console.log('  + footer_columns_links created');
} else {
  console.log('  - footer_columns_links exists, skipping');
}

console.log('Done.');
await client.end();
