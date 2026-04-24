/**
 * Create / refresh an alternate Home page (slug: "home-v4") that mirrors
 * the OW_v4_Homepage_Mockup.html design. This is a non-home preview page
 * so the original / Home record stays intact and can be compared
 * side-by-side at /home-v4.
 *
 * Usage:
 *   PAYLOAD_URL=https://opticwise-payload.vercel.app \
 *   PAYLOAD_EMAIL=danny@nbrain.ai \
 *   PAYLOAD_PASSWORD='Tm0bile#88' \
 *   node scripts/populate-home-v4.mjs
 */

const BASE = process.env.PAYLOAD_URL || "https://opticwise-payload.vercel.app";
const EMAIL = process.env.PAYLOAD_EMAIL;
const PASSWORD = process.env.PAYLOAD_PASSWORD;

if (!EMAIL || !PASSWORD) {
  console.error("Set PAYLOAD_EMAIL and PAYLOAD_PASSWORD env vars");
  process.exit(1);
}

let TOKEN = "";

async function api(method, ep, body) {
  const opts = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(TOKEN ? { Authorization: `JWT ${TOKEN}` } : {}),
    },
  };
  if (body) opts.body = JSON.stringify(body);
  const res = await fetch(`${BASE}${ep}`, opts);
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(
      `${method} ${ep} → ${res.status}: ${JSON.stringify(json).slice(0, 600)}`
    );
  }
  return json;
}

console.log("=== Populate Home v4 page (CMS blocks) ===\n");

const auth = await api("POST", "/api/users/login", {
  email: EMAIL,
  password: PASSWORD,
});
TOKEN = auth.token;
console.log("Logged in as", auth.user?.email, "\n");

async function findMediaId(filename) {
  const r = await api(
    "GET",
    `/api/media?where[filename][equals]=${encodeURIComponent(
      filename
    )}&limit=1&depth=0`
  );
  return r.docs?.[0]?.id || null;
}

const heroBg = await findMediaId("hero-industry.jpg");
const projCatalyst = await findMediaId("project-catalyst.jpg");
const projIndustry = await findMediaId("project-industry.jpg");
const projTradecraft = await findMediaId("project-tradecraft.jpg");
const pppBook = await findMediaId("ppp-book-cover.png");

console.log("Media IDs resolved:", {
  heroBg,
  projCatalyst,
  projIndustry,
  projTradecraft,
  pppBook,
});

// ---------- Lexical helpers ----------
function p(text, format = "") {
  return {
    type: "paragraph",
    version: 1,
    format,
    children: [{ type: "text", version: 1, text, format: 0 }],
  };
}
function pBold(boldText, rest = "") {
  return {
    type: "paragraph",
    version: 1,
    children: [
      { type: "text", version: 1, text: boldText, format: 1 },
      ...(rest ? [{ type: "text", version: 1, text: rest, format: 0 }] : []),
    ],
  };
}
function ul(items) {
  return {
    type: "list",
    version: 1,
    listType: "bullet",
    tag: "ul",
    start: 1,
    children: items.map((t, i) => ({
      type: "listitem",
      version: 1,
      value: i + 1,
      children: [{ type: "text", version: 1, text: t, format: 0 }],
    })),
  };
}
function richText(...nodes) {
  return {
    root: {
      type: "root",
      version: 1,
      children: nodes,
      direction: "ltr",
      format: "",
      indent: 0,
    },
  };
}

// ---------- Layout ----------
const layout = [
  // 1. HERO
  {
    blockType: "hero",
    heading: "Own Your Data & Digital Infrastructure.",
    headingHighlight: "Build for the Long Game.",
    description:
      "Data & digital infrastructure are no longer background utilities. They determine who controls NOI, who owns operational and tenant data, and who shapes the future intelligence of commercial real estate assets.",
    calloutText:
      "If you don't own your data & digital infrastructure, your vendors do.",
    secondaryText:
      "For CRE owners, operators, and asset managers who want predictable NOI, resilient operations, satisfied tenants, and portfolios that get smarter over time.",
    backgroundImage: heroBg || undefined,
    buttons: [
      {
        label: "Schedule Your Review",
        href: "#cta",
        style: "primary",
        isScheduleReview: true,
      },
      {
        label: "Explore the Pillars",
        href: "#pillars",
        style: "outline-light",
        isScheduleReview: false,
      },
    ],
  },

  // 2. INTERNAL PROBLEM — Running the Business with Blurry Vision
  {
    blockType: "content",
    layout: "default",
    backgroundColor: "gray",
    eyebrow: "The Internal Problem",
    heading: "Running the Business with Blurry Vision",
    richText: richText(
      p("Most owners aren't flying blind — they're flying blurry."),
      p(
        "You know value is being left on the table. You just can't see where, how much, or why."
      ),
      p(
        'Every new "solution" adds cost, complexity, and another layer between you and your own building. That\'s not a tooling problem. That\'s a control problem.'
      )
    ),
  },

  // 3. OWNER PROBLEM — The Silent Loss of Control
  {
    blockType: "content",
    layout: "default",
    backgroundColor: "dark",
    eyebrow: "The Owner Problem",
    heading: "The Silent Loss of Control",
    richText: richText(
      p(
        "Most owners did not give up control intentionally. It happened quietly — one tactical decision at a time."
      ),
      pBold("Networks — ", "Installed under vendor contracts."),
      pBold("Wireless — ", "Designed around revenue share."),
      pBold("Data — ", "Locked inside vendor dashboards."),
      pBold("Visibility — ", "Defined by third-party platforms."),
      p(
        "Each decision felt tactical. Together, they shifted control away from the asset."
      )
    ),
  },

  // 4. SKYBOX QUOTE
  {
    blockType: "cta",
    style: "dark",
    eyebrow: "The Skybox Principle",
    heading:
      '"Don\'t manage a 50-asset portfolio from the field. Build the owner-controlled intelligence layer so you can operate from the skybox — seeing causes, not just results."',
    isScheduleReview: false,
  },

  // 5. OW MODEL — How OpticWise Helps You Win the Long Game
  {
    blockType: "content",
    layout: "default",
    backgroundColor: "dark",
    eyebrow: "The OpticWise Model",
    heading: "How OpticWise Helps You Win the Long Game",
    richText: richText(
      p(
        "OpticWise is not a bolt-on vendor. We partner with you to design, implement, and operate managed data & digital infrastructure — and deliver the owner-controlled intelligence layer that turns Property Intelligence into Portfolio Intelligence."
      ),
      p(
        "The PPP 5C™ plan, the Two-Layer Model, and Property Brain™ are codified in Peak Property Performance® (Fast Company Press) and grounded in field-tested practice across commercial real estate portfolios — not slideware."
      )
    ),
  },

  // 6a. BoT CALLOUT (Layer 1) — header content
  {
    blockType: "content",
    layout: "default",
    backgroundColor: "dark",
    eyebrow: "Layer 1 — The Foundation You Own",
    heading: "Managed Data & Digital Infrastructure",
    richText: richText(
      p(
        "Delivered through BoT® (Building of Things®) — OpticWise's owner-controlled approach to data & digital infrastructure. BoT® consolidates and governs building connectivity so every device and system runs on a single, secure, segmented foundation."
      ),
      p("Different skill set. Different lane. Same owner standard.")
    ),
  },

  // 6b. BoT pillars — 3 cards
  {
    blockType: "cardGrid",
    style: "dark",
    columns: "3",
    cards: [
      {
        title: "Design",
        description: "Repeatable standards across every property.",
      },
      {
        title: "Implementation",
        description:
          "Governance baked in — segmentation, access rules, documentation.",
      },
      {
        title: "Operations",
        description:
          "Ongoing digital management that keeps performance high and operational risk low — without taxing on-site engineers or property managers.",
      },
    ],
  },

  // 7. 5S STANDARD — timeline (5 numbered standards)
  {
    blockType: "timeline",
    backgroundColor: "white",
    eyebrow: "The User Experience Standard",
    heading: "5S® — Non-Negotiable",
    subheading:
      "Every building OpticWise touches is measured against five standards. No exceptions.",
    steps: [
      {
        number: "01",
        title: "Seamless Mobility",
        description:
          "One network identity, consistent across every property.",
      },
      {
        number: "02",
        title: "Security",
        description: "Segmented, governed, auditable.",
      },
      {
        number: "03",
        title: "Stability",
        description:
          "Resilient by design — outages get isolated, not inherited.",
      },
      {
        number: "04",
        title: "Speed",
        description:
          "Performance that matches tenant expectations today and tomorrow.",
      },
      {
        number: "05",
        title: "Service",
        description: "Human operations — not ticket roulette.",
      },
    ],
  },

  // 8. BRAIN BLOCK (Layer 2)
  {
    blockType: "content",
    layout: "default",
    backgroundColor: "dark",
    eyebrow: "Layer 2 — Owner-Controlled Intelligence",
    heading: "Property Brain™ → Portfolio Brain™",
    richText: richText(
      p("Vendor- and LLM-agnostic. Owner-controlled by design."),
      p(
        "Property Brain™ is a governed data plane + trust plane that makes each building capable of autonomous activities and intelligence."
      ),
      p(
        "Standardize it once, and Property Brain™ becomes Portfolio Brain™ — so intelligence compounds across buildings instead of restarting at every address."
      ),
      p(
        "One standard intelligence substrate → Many decision engines → Scaled across your portfolio."
      )
    ),
  },

  // 9. 5C PLAN — timeline with 5 steps
  {
    blockType: "timeline",
    backgroundColor: "gray",
    eyebrow: "The Plan",
    heading: "Peak Property Performance® — The 5C™ Plan",
    subheading:
      "One repeatable plan that turns fragmented, vendor-controlled building tech into an owner standard that scales.",
    steps: [
      {
        number: "01",
        title: "Clarify",
        badge: "PPP Audit™",
        description:
          "Define success metrics, map ownership, identify leakage, document what's trustworthy and portable.",
      },
      {
        number: "02",
        title: "Connect",
        badge: "Managed Infrastructure",
        description:
          "Establish secure, owner-controlled connectivity that repeats property-to-property.",
      },
      {
        number: "03",
        title: "Collect",
        badge: "Managed Infrastructure",
        description:
          "Capture and normalize high-fidelity usable data into a consistent reusable model.",
      },
      {
        number: "04",
        title: "Coordinate",
        badge: "Property Brain™ + Portfolio Brain™",
        description:
          "Govern identity, access, privacy, lineage, retention, and rules of use.",
      },
      {
        number: "05",
        title: "Control",
        badge: "Property Brain™ + Portfolio Brain™",
        description:
          "Enable any decision engine or LLM to act under owner permissions.",
      },
    ],
  },

  // 10. OPERATOR VOICE QUOTE (light)
  {
    blockType: "cta",
    style: "simple",
    eyebrow: "Operator Voice",
    heading:
      '"If you only look at NOI, you\'re looking at the result — not the cause."',
    description: "OpticWise Quote Bank",
    isScheduleReview: false,
  },

  // 11. OWNERSHIP UNLOCKS — 8 cards
  {
    blockType: "cardGrid",
    style: "white",
    columns: "4",
    eyebrow: "What Changes",
    heading: "What Ownership Unlocks",
    subheading: "When you own the foundation, the asset itself changes.",
    cards: [
      {
        title: "Portable Intelligence Assets",
        description:
          "Properties stop being one-offs. Data moves with the owner, not the vendor.",
      },
      {
        title: "Vendor Portability",
        description:
          "Swap vendors without losing history, intelligence, or operational continuity.",
      },
      {
        title: "Platform Portability",
        description: "Swap decision engines without rewiring buildings.",
      },
      {
        title: "NOI That Grows",
        description:
          "Owner-controlled connectivity, fewer leaks, and revenue you couldn't see before.",
      },
      {
        title: "Lower Risk",
        description:
          "Privacy, security, compliance, auditability — owned, not rented.",
      },
      {
        title: "Tenant Experience That Holds Up",
        description:
          "Consistent, measurable, 5S®-grade — property to property.",
      },
      {
        title: "AI Readiness That's Real",
        description: "Grounded in governance, not theoretical.",
      },
      {
        title: "Compounding Portfolio Performance",
        description:
          "Built on client-owned data & digital infrastructure. Not rented software.",
      },
    ],
    footnote:
      "We don't just optimize a building. We change what the asset is — then scale that advantage portfolio-wide.",
  },

  // 12. AVOID FAILURE — Without Owner-Controlled Data
  {
    blockType: "content",
    layout: "default",
    backgroundColor: "dark",
    eyebrow: "The Cost of Inaction",
    heading: "Without Owner-Controlled Data & Digital Infrastructure",
    richText: richText(
      p("Delay doesn't buy you optionality. It locks it up."),
      ul([
        "Every new tool becomes another silo.",
        "Data stays inconsistent, operationally ambiguous, and trapped inside dashboards.",
        "AI becomes automation without governance — speed without trust.",
        "Each property needs custom integration — slow, expensive, brittle.",
        'The portfolio becomes a patchwork of "smart buildings" that can\'t compound value.',
        "You end up with lock-in and dashboards — but no durable capability.",
      ]),
      p('"Governance debt comes due with interest."')
    ),
  },

  // 13. STARTER KIT — lead magnet
  {
    blockType: "leadMagnet",
    badge: "Free Download",
    heading: "The Hidden Data Inside Your Buildings",
    description:
      "Why most CRE owners don't control their most valuable asset — and the framework that changes everything.",
    bookImage: pppBook || undefined,
    bulletPoints: [
      {
        text: "Chapter 1 from Peak Property Performance® (Fast Company Press)",
      },
      { text: "1-page PPP 5C™ Framework diagram" },
      { text: "The five questions every owner should ask about building data" },
      { text: "PPP Review teaser worksheet" },
    ],
  },

  // 14. PORTFOLIO — 3 case-study cards
  {
    blockType: "cardGrid",
    style: "dark",
    columns: "3",
    eyebrow: "Portfolio",
    heading: "Infrastructure We've Built",
    cards: [
      {
        image: projCatalyst || undefined,
        title: "ASPIRIA",
        description:
          "Overland Park, KS — Common pattern: owner-controlled connectivity and data & digital infrastructure repeated across a large mixed-use campus under one standard.",
      },
      {
        image: projIndustry || undefined,
        title: "Industry",
        description:
          "Denver, CO — Common pattern: owner-standard data & digital infrastructure replacing fragmented vendor installs — one backplane, vendors plug in under rules.",
      },
      {
        image: projTradecraft || undefined,
        title: "AMAZE @ NODA Apartments",
        description:
          "Charlotte, NC — Common pattern: governed connectivity and ongoing operations without taxing on-site engineers or property managers.",
      },
    ],
  },

  // 15. FINAL CTA
  {
    blockType: "cta",
    style: "primary",
    eyebrow: "Your Next Step",
    heading: "Complimentary CRE Data & Digital Review",
    description:
      "One building. 45 minutes. No software pitch. No rip-and-replace. We'll cover what you actually own (and what your vendors do), where your data lives and how portable it is, where operational burden stacks up against your KPIs, and the top 3 monthly plays you'd actually use — not another dashboard.",
    buttonLabel: "Schedule Your Review",
    isScheduleReview: true,
  },
];

// Find existing home-v4 page (slug = "home-v4")
const lookup = await api(
  "GET",
  `/api/pages?where[slug][equals]=home-v4&limit=1&depth=0`
);
const existing = lookup.docs?.[0];

const body = {
  title: "Home v4 (Mockup)",
  slug: "home-v4",
  isHomePage: false,
  excerpt:
    "Alternate v4 homepage — mirrors OW_v4_Homepage_Mockup.html. Live at /home-v4 for side-by-side comparison.",
  layout,
  _status: "published",
};

if (existing) {
  console.log(`Updating existing home-v4 page (id=${existing.id})...`);
  await api("PATCH", `/api/pages/${existing.id}`, body);
  console.log("home-v4 page updated.");
} else {
  console.log("Creating new home-v4 page...");
  const created = await api("POST", "/api/pages", body);
  console.log(
    `home-v4 page created (id=${created.doc?.id || created.id}).`
  );
}

console.log(
  "\nFront-end:  https://opticwise-payload.vercel.app/home-v4\nAdmin edit: https://opticwise-payload.vercel.app/admin/collections/pages"
);
