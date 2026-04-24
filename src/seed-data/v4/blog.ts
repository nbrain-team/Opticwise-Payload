export const categoriesSeed = [
  { title: 'The 5C™ Plan', slug: '5c-plan', description: 'Posts covering Clarify, Connect, Collect, Coordinate, Control.' },
  { title: 'NOI & Revenue', slug: 'noi-revenue', description: 'Hidden NOI drivers, revenue from connectivity, CapEx planning.' },
  { title: 'Vendor Control & Governance', slug: 'vendor-control', description: 'Vendor sprawl, redundant networks, governance debt.' },
  { title: 'AI & Data Readiness', slug: 'ai-readiness', description: 'Pre-AI posture, ethical AI, the GenAI divide in CRE.' },
  { title: 'Tenant Experience', slug: 'tenant-experience', description: '5S® UX, tenant satisfaction, smart buildings done right.' },
  { title: 'Case Studies & Proof', slug: 'case-studies', description: 'Approved patterns and client outcomes.' },
]

export const authorsSeed = [
  { name: 'Bill Douglas', title: 'Co-Author, Peak Property Performance®', bio: 'Founder, OpticWise.' },
  { name: 'Drew Hall', title: 'Co-Author, Peak Property Performance®', bio: 'Co-author of Peak Property Performance® (Fast Company Press).' },
  { name: 'Ryan R. Goble', title: 'Contributor, Peak Property Performance®', bio: 'Contributor to Peak Property Performance®.' },
  { name: 'OpticWise', title: 'OpticWise Editorial', bio: 'OpticWise editorial team.' },
]

// Three starter posts so the Insights feed isn't empty on first deploy.
// Danny: the full 90+ post migration is in /docs/MIGRATION.md.
export const startingPostsSeed = [
  {
    title: 'Clarify — The First Step to Peak Property Performance',
    slug: 'clarify-the-first-step-to-peak-property-performance',
    featured: true,
    publishedAt: new Date('2026-01-15').toISOString(),
    excerpt: "The starting point of the PPP 5C™ plan — and why every engagement begins here.",
    categorySlug: '5c-plan',
    contentBlocks: [
      {
        blockType: 'richContent',
        content: {
          root: {
            type: 'root',
            children: [
              { type: 'paragraph', children: [{ type: 'text', text: "Most CRE owners skip the Clarify step. They jump to tools, dashboards, or a new vendor. Every time they do, they rebuild on the same fragmented foundation." }] },
              { type: 'heading', tag: 'h2', children: [{ type: 'text', text: "What Clarify Actually Is" }] },
              { type: 'paragraph', children: [{ type: 'text', text: "Clarify is a structured working session where we map: who owns what, where data lives, where operational burden stacks up against your KPIs, and what is trustworthy versus assumed." }] },
              { type: 'paragraph', children: [{ type: 'text', text: "It produces three deliverables: a Property Data Map, a Control Gap Analysis, and a Prioritized Roadmap." }] },
              { type: 'heading', tag: 'h2', children: [{ type: 'text', text: "Why Owners Skip It" }] },
              { type: 'paragraph', children: [{ type: 'text', text: "Because it doesn't feel like action. But clarify before act is the difference between compounding intelligence and compounding vendor dependency." }] },
              { type: 'paragraph', children: [{ type: 'text', text: "Start with Clarify. Scale with control." }] },
            ],
          },
        },
        style: 'light',
      },
    ],
  },
  {
    title: "Own Your Building's Digital Infrastructure — Or Be Owned By It",
    slug: 'own-your-buildings-digital-infrastructure-or-be-owned-by-it',
    featured: true,
    publishedAt: new Date('2026-02-02').toISOString(),
    excerpt: 'The philosophical problem most CRE owners have not yet named.',
    categorySlug: 'vendor-control',
    contentBlocks: [
      {
        blockType: 'richContent',
        content: {
          root: {
            type: 'root',
            children: [
              { type: 'paragraph', children: [{ type: 'text', text: "If you don't own your data & digital infrastructure, your vendors do." }] },
              { type: 'paragraph', children: [{ type: 'text', text: "That's not a slogan. It's a diagnosis. And it compounds." }] },
              { type: 'heading', tag: 'h2', children: [{ type: 'text', text: "How Ownership Slips Away" }] },
              { type: 'paragraph', children: [{ type: 'text', text: "One decision at a time. The wireless vendor installs on their hardware. The access control vendor brings their own network. The HVAC integrator holds the admin credentials. By the time you inherit the portfolio, what you own is a collection of vendor contracts wearing a trench coat." }] },
              { type: 'heading', tag: 'h2', children: [{ type: 'text', text: "What Ownership Actually Requires" }] },
              { type: 'paragraph', children: [{ type: 'text', text: "Governance plus operating model. Not a purchase." }] },
            ],
          },
        },
        style: 'light',
      },
    ],
  },
  {
    title: 'Why Redundant Networks Are Silent Killers',
    slug: 'why-redundant-networks-are-silent-killers',
    featured: true,
    publishedAt: new Date('2026-02-18').toISOString(),
    excerpt: 'Duplicate and rogue networks cost twice in CapEx and OpEx — and take down the building when they fail.',
    categorySlug: 'vendor-control',
    contentBlocks: [
      {
        blockType: 'richContent',
        content: {
          root: {
            type: 'root',
            children: [
              { type: 'paragraph', children: [{ type: 'text', text: "Most CRE buildings have more networks than the owner knows about." }] },
              { type: 'paragraph', children: [{ type: 'text', text: "Each vendor brought their own. The building pays twice — in CapEx to install, in OpEx to maintain, and in emergency remediation when duplicate IP ranges eventually collide." }] },
              { type: 'heading', tag: 'h2', children: [{ type: 'text', text: "The Rogue Network Time Bomb" }] },
              { type: 'paragraph', children: [{ type: 'text', text: "The failure mode is predictable: years of quiet running, then a single event exposes years of layered vendor shortcuts. Downtime. Emergency work orders. A post-mortem that reveals admin credentials nobody held." }] },
              { type: 'paragraph', children: [{ type: 'text', text: "Governance debt comes due with interest." }] },
            ],
          },
        },
        style: 'light',
      },
    ],
  },
]
