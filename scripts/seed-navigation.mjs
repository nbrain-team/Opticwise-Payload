// One-time idempotent seed: populates the Navigation global with the 7 nav items
// per Bill's Fix B (Round 2). Safe to re-run -- truncates and re-inserts so the
// admin always sees the canonical order. Schema-only changes (no rendering edits).
//
// Run: node --env-file=.env scripts/seed-navigation.mjs

import pg from "pg";

const NAV_ITEMS = [
  { label: "How It Works",   href: "/how-we-operate/",                style: "link"   },
  { label: "Pillars",        href: "/digital-infrastructure-noi-ai/", style: "link"   },
  { label: "Insights",       href: "/insights/",                       style: "link"   },
  { label: "FAQ",            href: "/faq/",                            style: "link"   },
  { label: "Advisory",       href: "/advisory-services/",              style: "link"   },
  { label: "Brains",         href: "/brains/",                         style: "link"   },
  { label: "Schedule Review", href: "/ppp-audit/",                     style: "button" },
];

const { Client } = pg;
const client = new Client({
  connectionString: process.env.DATABASE_URI,
  ssl: { rejectUnauthorized: false },
});

await client.connect();

try {
  await client.query("BEGIN");

  // Ensure the navigation global row exists (id=1).
  const navRow = await client.query("SELECT id FROM navigation LIMIT 1");
  let navId;
  if (navRow.rows.length === 0) {
    const inserted = await client.query(
      "INSERT INTO navigation (created_at, updated_at) VALUES (NOW(), NOW()) RETURNING id"
    );
    navId = inserted.rows[0].id;
    console.log(`created navigation row id=${navId}`);
  } else {
    navId = navRow.rows[0].id;
    console.log(`navigation row id=${navId}`);
  }

  // Idempotent: clear existing items + children, then re-insert canonical order.
  await client.query(
    "DELETE FROM navigation_items_children WHERE _parent_id IN (SELECT id FROM navigation_items WHERE _parent_id = $1)",
    [navId]
  );
  await client.query("DELETE FROM navigation_items WHERE _parent_id = $1", [navId]);

  for (let i = 0; i < NAV_ITEMS.length; i++) {
    const item = NAV_ITEMS[i];
    const itemId = `nav_${Date.now()}_${i}`;
    await client.query(
      `INSERT INTO navigation_items (id, _order, _parent_id, label, href, style)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [itemId, i + 1, navId, item.label, item.href, item.style]
    );
    console.log(`  + [${i + 1}] ${item.label} (${item.style}) -> ${item.href}`);
  }

  await client.query(
    "UPDATE navigation SET updated_at = NOW() WHERE id = $1",
    [navId]
  );

  await client.query("COMMIT");
  console.log(`\nseeded ${NAV_ITEMS.length} nav items into navigation global.`);
} catch (err) {
  await client.query("ROLLBACK");
  console.error("seed failed:", err);
  process.exitCode = 1;
} finally {
  await client.end();
}
