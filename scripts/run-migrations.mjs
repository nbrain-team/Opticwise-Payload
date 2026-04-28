#!/usr/bin/env node
/**
 * Versioned schema migration runner.
 *
 * Why this exists
 * ---------------
 * Payload's `db.push: true` is silently SKIPPED when NODE_ENV === "production"
 * (see node_modules/@payloadcms/db-postgres/dist/connect.js). That means schema
 * changes shipped in code are never applied to the production Neon DB on a
 * Vercel deploy — until something queries a column that doesn't exist and the
 * site goes down (this is exactly what happened on 2026-04-28 with the
 * CardGrid `image_id` column).
 *
 * This runner is the production schema-sync mechanism. It is invoked by the
 * `vercel-build` npm script BEFORE `next build`, so the production database is
 * guaranteed to be in lockstep with the deployed code BEFORE any traffic hits
 * the new functions.
 *
 * How it works
 * ------------
 * 1. Connects to DATABASE_URI.
 * 2. Ensures a tracking table `_opticwise_migrations` exists.
 * 3. Reads every `.mjs` file in `scripts/migrations/` (sorted alphabetically).
 * 4. For each file NOT yet recorded as applied: imports it, calls its
 *    `export async function up({ client, log }) { ... }`, then records the
 *    filename on success.
 * 5. Already-applied migrations are skipped — safe to run on every deploy.
 *
 * Adding a new schema change
 * --------------------------
 * 1. Make the schema change in the Payload code (e.g. add a field to a block).
 * 2. Add a new file `scripts/migrations/NNN_short_description.mjs` whose `up`
 *    function applies the matching DDL (use `IF NOT EXISTS` patterns so the
 *    migration is itself idempotent).
 * 3. Commit. Vercel will run it on the next deploy automatically.
 *
 * Usage
 * -----
 *   npm run db:migrate            # run pending migrations against DATABASE_URI
 *   node scripts/run-migrations.mjs --dry-run    # just list pending, apply nothing
 */
import fs from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import pg from 'pg'

// --- env loading ---------------------------------------------------------
const envPath = path.resolve(process.cwd(), '.env')
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/)
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2]
  }
}

const DATABASE_URI = process.env.DATABASE_URI
if (!DATABASE_URI) {
  console.error('[migrate] FATAL: DATABASE_URI is not set')
  process.exit(1)
}

const dryRun = process.argv.includes('--dry-run')
const TRACK_TABLE = '_opticwise_migrations'
const MIGRATIONS_DIR = path.resolve(process.cwd(), 'scripts/migrations')

const target = DATABASE_URI.replace(/:[^@]+@/, ':***@')
console.log(`[migrate] Target: ${target}`)
console.log(`[migrate] Migrations dir: ${MIGRATIONS_DIR}`)
if (dryRun) console.log('[migrate] DRY RUN — no migrations will be applied')

const client = new pg.Client({
  connectionString: DATABASE_URI,
  ssl: { rejectUnauthorized: false },
})

const log = (...args) => console.log('   ', ...args)

async function ensureTrackTable() {
  await client.query(`
    CREATE TABLE IF NOT EXISTS "${TRACK_TABLE}" (
      "name" varchar PRIMARY KEY,
      "applied_at" timestamptz NOT NULL DEFAULT now()
    )
  `)
}

async function alreadyApplied() {
  const r = await client.query(`SELECT name FROM "${TRACK_TABLE}" ORDER BY name`)
  return new Set(r.rows.map((row) => row.name))
}

async function recordApplied(name) {
  await client.query(
    `INSERT INTO "${TRACK_TABLE}" (name) VALUES ($1) ON CONFLICT (name) DO NOTHING`,
    [name],
  )
}

function listMigrationFiles() {
  if (!fs.existsSync(MIGRATIONS_DIR)) return []
  return fs
    .readdirSync(MIGRATIONS_DIR)
    .filter((f) => f.endsWith('.mjs'))
    .sort()
}

async function main() {
  await client.connect()

  await ensureTrackTable()
  const applied = await alreadyApplied()
  const files = listMigrationFiles()

  if (files.length === 0) {
    console.log('[migrate] No migrations found.')
    return
  }

  console.log(`[migrate] Found ${files.length} migration(s); ${applied.size} already applied`)

  let ranCount = 0
  for (const file of files) {
    if (applied.has(file)) {
      console.log(`[migrate] ✓ skip   ${file}  (already applied)`)
      continue
    }

    if (dryRun) {
      console.log(`[migrate] [dry]   ${file}  (would apply)`)
      continue
    }

    console.log(`[migrate] → apply  ${file}`)
    const start = Date.now()
    const mod = await import(pathToFileURL(path.join(MIGRATIONS_DIR, file)).toString())
    if (typeof mod.up !== 'function') {
      throw new Error(`Migration ${file} does not export an async \`up({ client, log })\` function`)
    }
    try {
      await mod.up({ client, log })
      await recordApplied(file)
      console.log(`[migrate] ✓ done   ${file}  (${Date.now() - start}ms)`)
      ranCount++
    } catch (err) {
      console.error(`[migrate] ✗ FAILED ${file}:`, err)
      throw err
    }
  }

  if (ranCount === 0 && !dryRun) {
    console.log('[migrate] Nothing to do — schema is already in sync.')
  } else if (!dryRun) {
    console.log(`[migrate] Applied ${ranCount} migration(s).`)
  }
}

main()
  .then(async () => {
    await client.end()
    process.exit(0)
  })
  .catch(async (err) => {
    console.error('[migrate] FATAL:', err.message || err)
    try { await client.end() } catch {}
    process.exit(1)
  })
