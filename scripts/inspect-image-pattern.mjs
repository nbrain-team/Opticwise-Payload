import { readFileSync } from 'fs'
import pg from 'pg'

const env = readFileSync('.env', 'utf8').split('\n').reduce((acc, l) => {
  const m = l.match(/^([A-Z_]+)=(.*)$/)
  if (m) acc[m[1]] = m[2].replace(/^["']|["']$/g, '')
  return acc
}, {})
process.env.DATABASE_URI = process.env.DATABASE_URI || env.DATABASE_URI

const { Client } = pg
const c = new Client({ connectionString: process.env.DATABASE_URI, ssl: { rejectUnauthorized: false } })
await c.connect()

const r = await c.query(`SELECT id, slug, substring(html_content, 1, 1200) AS head FROM posts WHERE _status='published' ORDER BY published_at DESC LIMIT 3`)
for (const row of r.rows) {
  console.log(`\n=== ${row.slug} ===`)
  console.log(row.head)
}

console.log('\n=== meta_image_id counts ===')
const meta = await c.query(`SELECT COUNT(*) FILTER (WHERE meta_image_id IS NOT NULL) AS with_meta, COUNT(*) AS total FROM posts WHERE _status='published'`)
console.log(meta.rows[0])

await c.end()
