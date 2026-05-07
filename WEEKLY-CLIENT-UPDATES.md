# Weekly Client Updates

### 2026-05-07 — Static HTML mirror is now openable by double-click

- Made the static HTML version of opticwise.com fully openable by simply
  double-clicking `opticwise-html/index.html` in Finder — no local server
  needed. Every page link, image, and stylesheet now uses a relative
  path, and directory links automatically resolve to their `index.html`
  so `file://` browsing works exactly like a real website.
- Local HTTP preview (`npm run html:preview`) continues to work
  identically — the same export now serves correctly via both methods.
- Hardened the crawler so transient errors from the live site no longer
  leave the export with missing pages: it now retries with longer
  backoff and runs a second pass on any failures. Result: every page in
  the live sitemap (150 URLs across 24 marketing pages and 126 insights
  posts) makes it into the export on every build.
- The README inside `opticwise-html/` is now auto-generated as part of
  the build, so it always reflects the current export.

### 2026-05-07 — Static HTML mirror of opticwise.com (off-Payload evaluation)

- Generated a complete, fully-styled static HTML version of the entire
  opticwise.com site into a new `opticwise-html/` folder so the team can
  evaluate moving off the Payload CMS without losing any visual or
  content fidelity.
- The mirror covers everything the live site currently publishes:
  the homepage, all 24 marketing pages (About, Contact, FAQ, Glossary,
  every "For ..." audience page, every product page including
  Property Brain™, Portfolio Brain™, BoT®, 5S®, PPP Audit™, Advisory
  Services, etc.), the `/insights` blog landing page, and all 126
  insights / blog posts — pulled directly from the live sitemap so it
  matches production exactly.
- Visual fidelity is 1:1 with opticwise.com: same fonts (Inter +
  Playfair), same dark hero, same nav, same footer, same hero photos,
  same award badges, same book covers, same blog layouts. Side-by-side
  screenshots match the live site.
- Generation is reproducible — a single command (`npm run html:build`)
  re-crawls the live site and rebuilds the entire static mirror in
  about 20 seconds, so this stays in sync as content evolves.
- A `npm run html:preview` command spins up a local static server so any
  team member can browse the off-Payload version before any cutover
  decision.
- Documented the known constraints of going fully static (mainly: the
  form-embed widgets currently depend on the OpticWise CRM accepting
  cross-origin requests; this would need to be allowlisted on any new
  domain) so the decision can be made with eyes open.
