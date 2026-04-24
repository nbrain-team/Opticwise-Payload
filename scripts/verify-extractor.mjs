import { readFileSync } from 'fs'
import pg from 'pg'

const env = readFileSync('.env', 'utf8').split('\n').reduce((acc, l) => {
  const m = l.match(/^([A-Z_]+)=(.*)$/)
  if (m) acc[m[1]] = m[2].replace(/^["']|["']$/g, '')
  return acc
}, {})

const BG_IMAGE_RE = /background-image\s*:\s*url\(\s*["']?([^"')]+)["']?\s*\)/i
const IMG_SRC_RE = /<img[^>]+src=["']([^"']+)["']/i
function extract(html) {
  if (!html) return ''
  let url = html.match(BG_IMAGE_RE)?.[1] || html.match(IMG_SRC_RE)?.[1] || ''
  if (!url) return ''
  url = url.trim()
  if (url.startsWith('//')) url = 'https:' + url
  return url
}

const { Client } = pg
const c = new Client({ connectionString: env.DATABASE_URI, ssl: { rejectUnauthorized: false } })
await c.connect()
const r = await c.query(`SELECT id, slug, html_content FROM posts WHERE _status='published' ORDER BY published_at DESC`)

let withImg = 0, without = 0
for (const row of r.rows) {
  const url = extract(row.html_content)
  if (url) withImg++
  else { without++; if (without <= 3) console.log('NO IMG:', row.slug) }
}
console.log(`\nResult: ${withImg}/${r.rows.length} posts have an extractable cover image. ${without} without.`)

// sample first 5
console.log('\n--- First 5 extractions ---')
for (const row of r.rows.slice(0, 5)) {
  console.log(`${row.slug.slice(0,50).padEnd(52)} -> ${extract(row.html_content).slice(0,100)}`)
}
await c.end()
