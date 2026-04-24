import fs from 'node:fs'
const env = fs.readFileSync('.env', 'utf8')
for (const line of env.split('\n')) {
  const m = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/)
  if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '')
}
const { Client } = await import('pg')
const c = new Client({ connectionString: process.env.DATABASE_URI })
await c.connect()
const r = await c.query(`SELECT slug, html_content FROM posts WHERE slug = 'ai-isn-t-the-future-it-s-today-why-your-digital-infrastructure-must' LIMIT 1`)
const html = r.rows[0].html_content
console.log('total length:', html.length)
console.log('s-blog-header count:', (html.match(/s-blog-header/g) || []).length)
console.log('s-blog-body count:', (html.match(/s-blog-body/g) || []).length)
const idx = html.search(/<div[^>]*class="[^"]*s-blog-body[^"]*"/i)
console.log('first s-blog-body div index:', idx)
console.log('would strip', idx, 'chars from front')
console.log('--- what comes AFTER strip (first 400) ---')
console.log(html.slice(idx, idx + 400))
console.log('--- what was BEFORE strip (last 200) ---')
console.log(html.slice(Math.max(0, idx - 200), idx))
await c.end()
