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

const counts = await c.query(`
  SELECT
    COUNT(*) FILTER (WHERE feature_image_id IS NOT NULL) AS with_feat,
    COUNT(*) FILTER (WHERE feature_image_id IS NULL) AS without_feat,
    COUNT(*) AS total
  FROM posts WHERE _status='published'
`)
console.log('Posts feature_image coverage:', counts.rows[0])

const sample = await c.query(`
  SELECT p.id, p.slug, p.feature_image_id, m.url, m.filename, m.mime_type
  FROM posts p
  JOIN media m ON m.id = p.feature_image_id
  WHERE p._status='published'
  ORDER BY p.published_at DESC
  LIMIT 5
`)
console.log('\nFirst 5 posts (now linked to Vercel Blob):')
for (const r of sample.rows) {
  console.log(`  ${r.slug.slice(0,50).padEnd(52)} -> ${r.url}`)
}

const blobCount = await c.query(`SELECT COUNT(*) FROM media WHERE url LIKE 'https://%blob.vercel-storage.com/%' OR url LIKE 'https://%.public.blob.vercel-storage.com/%'`)
console.log('\nMedia rows pointing at Vercel Blob:', blobCount.rows[0].count)

await c.end()
