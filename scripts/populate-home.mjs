/**
 * Populate / update the Home page with the full block-based layout
 * (hero, problem, outcomes, two-layer model, lead magnet, projects, CTA).
 *
 * Usage:
 *   PAYLOAD_URL=https://opticwise-payload.vercel.app \
 *   PAYLOAD_EMAIL=danny@nbrain.ai \
 *   PAYLOAD_PASSWORD='Tm0bile#88' \
 *   node scripts/populate-home.mjs
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
    throw new Error(`${method} ${ep} → ${res.status}: ${JSON.stringify(json).slice(0, 400)}`);
  }
  return json;
}

console.log("=== Populate Home page (CMS blocks) ===\n");

const auth = await api("POST", "/api/users/login", { email: EMAIL, password: PASSWORD });
TOKEN = auth.token;
console.log("Logged in as", auth.user?.email, "\n");

// Lookup media ids by filename
async function findMediaId(filename) {
  const r = await api(
    "GET",
    `/api/media?where[filename][equals]=${encodeURIComponent(filename)}&limit=1&depth=0`
  );
  return r.docs?.[0]?.id || null;
}

const heroBg = await findMediaId("hero-industry.jpg");
const problemImg = await findMediaId("solution-industry.jpg");
const ctaBg = await findMediaId("testimonial-bg.jpg");
const projCatalyst = await findMediaId("project-catalyst.jpg");
const projIndustry = await findMediaId("project-industry.jpg");
const projTradecraft = await findMediaId("project-tradecraft.jpg");
const pppBook = await findMediaId("ppp-book-cover.png");

console.log("Media IDs:", { heroBg, problemImg, ctaBg, projCatalyst, projIndustry, projTradecraft, pppBook });

// helper to build a Lexical paragraph
function p(text) {
  return {
    type: "paragraph",
    version: 1,
    children: [{ type: "text", version: 1, text }],
  };
}
function richText(...paragraphs) {
  return {
    root: {
      type: "root",
      version: 1,
      children: paragraphs,
      direction: "ltr",
      format: "",
      indent: 0,
    },
  };
}

const layout = [
  // ============== HERO ==============
  {
    blockType: "hero",
    heading: "Own Your Data & Digital Infrastructure.",
    headingHighlight: "Build for the Long Game.",
    description:
      "Data & digital infrastructure are no longer background utilities. They determine who controls NOI, who owns operational and tenant data, and who shapes the future intelligence of commercial real estate assets.",
    secondaryText: "For years, these decisions were delegated to vendors. That era is ending.",
    calloutText: "If you don't own your data & digital infrastructure, your vendors do.",
    backgroundImage: heroBg || undefined,
    buttons: [
      { label: "Schedule Your Review", href: "#", style: "primary", isScheduleReview: true },
      { label: "Explore the Pillars", href: "/digital-infrastructure-noi-ai", style: "outline-light", isScheduleReview: false },
    ],
  },

  // ============== PROBLEM (two-column content) ==============
  {
    blockType: "content",
    layout: "two-column",
    imagePosition: "left",
    backgroundColor: "white",
    eyebrow: "The Problem",
    heading: "The Owner Problem: Silent Loss of Control",
    image: problemImg || undefined,
    richText: richText(
      p("Most owners did not give up control intentionally. It happened quietly:"),
      p("Networks installed under vendor contracts. Wireless systems designed around revenue share. Data locked inside dashboards. Visibility defined by third-party platforms."),
      p("Each decision felt tactical. Together, they shifted control away from the asset.")
    ),
  },

  // ============== WHAT OWNERSHIP UNLOCKS (card grid) ==============
  {
    blockType: "cardGrid",
    style: "light",
    columns: "3",
    eyebrow: "The Solution",
    heading: "What Ownership Unlocks",
    subheading: "When you reclaim control of data & digital infrastructure, outcomes change.",
    cards: [
      { icon: "chart-up", iconColor: "blue", title: "NOI Improves", description: "Through owner-controlled connectivity and operational efficiency" },
      { icon: "users", iconColor: "blue", title: "Tenant Experience Improves", description: "Through consistent, measurable performance" },
      { icon: "shield", iconColor: "blue", title: "Operations Stabilize", description: "Through coordination and reduced vendor friction" },
      { icon: "brain", iconColor: "green", title: "AI Readiness Becomes Real", description: "Not theoretical — grounded in governance" },
      { icon: "flask", iconColor: "blue", title: "Assets Future-Proof", description: "As vendors and technologies change" },
    ],
    footnote: "This is not about more technology. It is about who controls the economics.",
  },

  // ============== TWO-LAYER MODEL ==============
  {
    blockType: "twoLayerModel",
    eyebrow: "The OpticWise Model",
    heading: "How OpticWise Helps You Win the Long Game",
    description: richText(
      p("OpticWise is not a bolt-on vendor. We partner with you to design, implement, and operate managed data & digital infrastructure services—and provide the owner-controlled intelligence layer that turns Property Intelligence → Portfolio Intelligence.")
    ),
    layer1: {
      tag: "Layer 1",
      title: "Managed Data & Digital Infrastructure",
      subtitle: "The foundation you own",
      items: [
        { bold: "Design:", text: "repeatable standards across properties" },
        { bold: "Implementation:", text: "governance baked in (segmentation, access rules, documentation)" },
        { bold: "Operations:", text: "ongoing digital management to keep performance high and operational risk low" },
      ],
    },
    layer2: {
      tag: "Layer 2",
      title: "Owner-Controlled Intelligence Layer",
      subtitle: "OpticWise Brain",
      description: richText(
        p("A vendor- and LLM-agnostic Property Intelligence Layer: a governed data plane + trust plane enabling autonomous activities and intelligence.")
      ),
      formula: [
        { step: "One standard intelligence substrate" },
        { step: "Many decision engines" },
        { step: "Scaled across buildings" },
      ],
    },
  },

  // ============== LEAD MAGNET ==============
  {
    blockType: "leadMagnet",
    badge: "Free Download — PPP Starter Kit",
    heading: "The Hidden Data Inside Your Buildings",
    description:
      "Why most CRE owners don't control their most valuable asset—and the framework that changes everything.",
    bookImage: pppBook || undefined,
    bulletPoints: [
      { text: "Chapter 1 from Peak Property Performance (Fast Company Press)" },
      { text: "1-page PPP 5C™ Framework diagram" },
      { text: "The five questions every owner should ask about building data" },
      { text: "PPP Review teaser worksheet" },
    ],
  },

  // ============== PROJECTS (card grid, dark) ==============
  {
    blockType: "cardGrid",
    style: "dark",
    columns: "3",
    eyebrow: "Portfolio",
    heading: "Infrastructure We've Built",
    cards: [
      { image: projCatalyst || undefined, title: "ASPIRIA", description: "Salt Lake City, UT · Overland Park, KS" },
      { image: projIndustry || undefined, title: "Industry", description: "Denver, CO" },
      { image: projTradecraft || undefined, title: "AMAZE @ NODA APARTMENTS", description: "Charlotte, NC" },
    ],
  },

  // ============== CTA ==============
  {
    blockType: "cta",
    style: "primary",
    eyebrow: "Your Next Step",
    heading: "Ready to Own Your Data & Digital Infrastructure?",
    description: "Map who owns what, where data lives, and where operational burden stacks up vs your KPIs — for one building.",
    backgroundImage: ctaBg || undefined,
    isScheduleReview: true,
    buttonLabel: "Schedule Your Review",
  },

  // ============== INFINITE GAME (CTA dark) ==============
  {
    blockType: "cta",
    style: "dark",
    heading: "The Infinite Game",
    description: "Don't play for next quarter—build for the next decade. Own your data & digital infrastructure. Operate with strategic foresight. Build for the long game.",
  },
];

// Find existing Home page record
const homeLookup = await api(
  "GET",
  "/api/pages?where[isHomePage][equals]=true&limit=1&depth=0"
);
const existing = homeLookup.docs?.[0];

const body = {
  title: "Home",
  slug: "home",
  isHomePage: true,
  layout,
  _status: "published",
};

if (existing) {
  console.log(`Updating existing Home page (id=${existing.id})...`);
  await api("PATCH", `/api/pages/${existing.id}`, body);
  console.log("Home page updated.");
} else {
  console.log("Creating new Home page...");
  const created = await api("POST", "/api/pages", body);
  console.log(`Home page created (id=${created.doc?.id || created.id}).`);
}

console.log("\nVisit https://opticwise-payload.vercel.app/admin/collections/pages to edit each block.");
