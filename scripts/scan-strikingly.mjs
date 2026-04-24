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

// Count posts with strikingly references in body, AND total occurrences
const r = await c.query(`SELECT id, slug, html_content FROM posts WHERE _status='published'`)

let postsWithStrikingly = 0
let totalRefs = 0
const urls = new Set()
for (const row of r.rows) {
  const html = row.html_content || ''
  const matches = [...html.matchAll(/\/\/[^"' )]*strikinglycdn\.com\/[^"' )]+/gi)]
  if (matches.length > 0) {
    postsWithStrikingly++
    totalRefs += matches.length
    matches.forEach(m => urls.add(m[0]))
  }
}
console.log(`Posts with Strikingly URLs in html_content: ${postsWithStrikingly}/${r.rows.length}`)
console.log(`Total Strikingly URL occurrences: ${totalRefs}`)
console.log(`Unique Strikingly URLs: ${urls.size}`)
console.log(`\nFirst 10 unique URLs:`)
;[...urls].slice(0,10).forEach(u => console.log(' ', u))
await c.end()
