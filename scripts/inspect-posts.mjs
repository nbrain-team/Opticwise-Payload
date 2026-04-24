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

console.log('--- posts table columns ---')
const cols = await c.query(`
  SELECT column_name, data_type FROM information_schema.columns
  WHERE table_name='posts' ORDER BY ordinal_position
`)
console.log(cols.rows.map(r => `  ${r.column_name} (${r.data_type})`).join('\n'))

console.log('\n--- sample of 5 posts: image-related fields ---')
const sample = await c.query(`SELECT id, title, slug, feature_image_id, hero_image_id FROM posts WHERE _status='published' ORDER BY published_at DESC LIMIT 5`).catch(async e => {
  // try without hero_image_id
  return c.query(`SELECT id, title, slug, feature_image_id FROM posts WHERE _status='published' ORDER BY published_at DESC LIMIT 5`)
})
console.log(JSON.stringify(sample.rows, null, 2))

console.log('\n--- counts: how many posts have feature_image_id set vs null ---')
const counts = await c.query(`
  SELECT
    COUNT(*) FILTER (WHERE feature_image_id IS NOT NULL) AS with_feat,
    COUNT(*) FILTER (WHERE feature_image_id IS NULL) AS without_feat,
    COUNT(*) AS total
  FROM posts WHERE _status='published'
`)
console.log(counts.rows[0])

console.log('\n--- one post with all its columns to see what data exists ---')
const one = await c.query(`SELECT * FROM posts WHERE _status='published' ORDER BY published_at DESC LIMIT 1`)
const post = one.rows[0]
const populated = Object.entries(post).filter(([k,v]) => v !== null && v !== '').map(([k,v]) => `  ${k}: ${typeof v === 'string' ? v.slice(0,80) : JSON.stringify(v).slice(0,80)}`)
console.log(populated.join('\n'))

await c.end()
