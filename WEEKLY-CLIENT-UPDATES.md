# Weekly Client Updates

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
