import { readFileSync } from 'fs'
import pg from 'pg'

const env = readFileSync('.env', 'utf8').split('\n').reduce((acc, l) => {
  const m = l.match(/^([A-Z_]+)=(.*)$/)
  if (m) acc[m[1]] = m[2].replace(/^["']|["']$/g, '')
  return acc
}, {})

const { Client } = pg
const c = new Client({ connectionString: env.DATABASE_URI, ssl: { rejectUnauthorized: false } })
await c.connect()

const r = await c.query(`SELECT id, title, slug, is_home_page, _status, updated_at FROM pages ORDER BY id LIMIT 20`)
console.log('All pages:')
for (const p of r.rows) console.log(`  id=${p.id}  slug="${p.slug}"  isHome=${p.is_home_page}  status=${p._status}`)

await c.end()
