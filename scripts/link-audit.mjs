// Crawl the production site and report broken internal links.
// Strategy:
//   1. Seed with the homepage + every page slug we know exists.
//   2. Fetch each seed page, extract every <a href> that's same-origin
//      (relative or absolute to opticwise-payload.vercel.app).
//   3. Build a deduped set of URLs to verify.
//   4. HEAD-check each URL in parallel batches; record status.
//   5. Re-fetch each broken URL with GET to confirm (some servers 405 HEAD).
//   6. For each broken URL, report the source page(s) that linked to it.

const ORIGIN = 'https://opticwise-payload.vercel.app'

const SEED_PATHS = [
  '/',
  '/how-we-operate',
  '/brains',
  '/advisory-services',
  '/ppp-audit',
  '/bot-building-of-things',
  '/5s-user-experience-standard',
  '/faq',
  '/digital-infrastructure-noi-strategy',
  '/digital-infrastructure-noi-playbook',
  '/ai-ready-commercial-real-estate',
  '/own-vs-lease-cre-building-data',
  '/control-cre-digital-visibility',
  '/digital-infrastructure-noi-ai',
  '/for-lps-and-financiers',
  '/for-property-managers-and-engineers',
  '/for-tenants',
  '/insights',
  // Sample of blog posts
  '/insights/ai-isn-t-the-future-it-s-today-why-your-digital-infrastructure-must',
  '/insights/part-5-cre-s-digital-divide-why-infrastructure-ownership-determines-ai',
  '/insights/transitioning-to-digital-first-commercial-real-estate-portfolio-owners',
]

function normalizeUrl(href, fromUrl) {
  if (!href) return null
  if (href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('javascript:')) return null
  if (href.startsWith('#')) return null
  try {
    const u = new URL(href, fromUrl)
    if (u.origin !== ORIGIN) return null
    // Strip hash + trailing slash for dedupe (treat /foo and /foo/ as same)
    u.hash = ''
    u.search = ''
    let p = u.pathname.replace(/\/+$/, '') || '/'
    return ORIGIN + p
  } catch {
    return null
  }
}

async function fetchHtml(url) {
  const res = await fetch(url, {
    redirect: 'follow',
    headers: { 'User-Agent': 'OpticWiseLinkAudit/1.0' },
  })
  const text = await res.text()
  return { status: res.status, finalUrl: res.url, html: text }
}

async function check(url) {
  // Try GET with body discarded (HEAD is unreliable for Next.js routes).
  try {
    const res = await fetch(url, {
      method: 'GET',
      redirect: 'follow',
      headers: { 'User-Agent': 'OpticWiseLinkAudit/1.0' },
    })
    // Drain body
    await res.text()
    return { status: res.status, finalUrl: res.url }
  } catch (e) {
    return { status: 0, error: e.message }
  }
}

const HREF_RE = /<a[^>]*\shref=["']([^"']+)["']/gi

async function main() {
  console.log(`Crawling ${SEED_PATHS.length} seed pages on ${ORIGIN}...`)
  const linkSources = new Map() // url -> Set of source pages
  const seedFailures = []

  for (const path of SEED_PATHS) {
    const url = ORIGIN + path
    const r = await fetchHtml(url)
    if (r.status !== 200) {
      seedFailures.push({ url, status: r.status })
      continue
    }
    const found = new Set()
    let m
    while ((m = HREF_RE.exec(r.html))) {
      const norm = normalizeUrl(m[1], url)
      if (norm) found.add(norm)
    }
    for (const link of found) {
      if (!linkSources.has(link)) linkSources.set(link, new Set())
      linkSources.get(link).add(path)
    }
  }

  console.log(`\nFound ${linkSources.size} unique internal links.\n`)
  console.log(`Verifying each link...\n`)

  const results = []
  const links = [...linkSources.keys()].sort()
  const BATCH = 8
  for (let i = 0; i < links.length; i += BATCH) {
    const batch = links.slice(i, i + BATCH)
    const checked = await Promise.all(batch.map(async (link) => ({
      link,
      ...(await check(link)),
    })))
    results.push(...checked)
    process.stdout.write(`  ${Math.min(i + BATCH, links.length)}/${links.length}\r`)
  }
  console.log('\n')

  const broken = results.filter(r => r.status === 0 || r.status >= 400)
  const ok = results.filter(r => r.status >= 200 && r.status < 400)

  console.log(`Result: ${ok.length} OK, ${broken.length} broken.\n`)
  if (seedFailures.length) {
    console.log('Seed page failures:')
    for (const f of seedFailures) console.log(`  ${f.status}  ${f.url}`)
    console.log('')
  }

  if (broken.length === 0) {
    console.log('  No broken internal links detected.')
  } else {
    console.log('Broken links (URL  ->  status  [linked from these pages]):\n')
    for (const b of broken) {
      const srcs = [...linkSources.get(b.link)].sort()
      console.log(`  [${b.status || 'ERR'}]  ${b.link}`)
      console.log(`         from: ${srcs.join(', ')}`)
      if (b.error) console.log(`         error: ${b.error}`)
    }
  }

  // Also show OK links so we can see the full inventory
  console.log(`\n--- Working internal links (${ok.length}) ---`)
  for (const o of ok) console.log(`  [${o.status}]  ${o.link.replace(ORIGIN, '')}`)
}

main().catch(e => { console.error(e); process.exit(1) })
