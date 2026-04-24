import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import { getPayload } from "payload";
import config from "@payload-config";

import { homePage } from "@/seed-data/v4/pages/home";
import { brainsPage } from "@/seed-data/v4/pages/brains";
import { howWeOperatePage } from "@/seed-data/v4/pages/howWeOperate";
import { advisoryPage } from "@/seed-data/v4/pages/advisory";
import { pppAuditPage } from "@/seed-data/v4/pages/pppAudit";
import { botPage } from "@/seed-data/v4/pages/bot";
import { fiveSPage } from "@/seed-data/v4/pages/fiveS";
import { faqPage } from "@/seed-data/v4/pages/faq";
import { noiStrategyPage } from "@/seed-data/v4/pages/noiStrategy";
import { noiPlaybookPage } from "@/seed-data/v4/pages/noiPlaybook";
import { aiReadyPage } from "@/seed-data/v4/pages/aiReady";
import { ownVsLeasePage } from "@/seed-data/v4/pages/ownVsLease";
import { digitalVisibilityPage } from "@/seed-data/v4/pages/digitalVisibility";
import { categoryHubPage } from "@/seed-data/v4/pages/categoryHub";
import { forLpsPage } from "@/seed-data/v4/pages/forLps";
import { forPmsPage } from "@/seed-data/v4/pages/forPms";
import { forTenantsPage } from "@/seed-data/v4/pages/forTenants";

import { categoriesSeed, authorsSeed } from "@/seed-data/v4/blog";

export const maxDuration = 300;
export const dynamic = "force-dynamic";

// ---------------------- LEXICAL HELPERS (from Bill's seed/index.ts) -------

function textToLexical(text: string): any {
  const paragraphs = text.split("\n\n").filter(Boolean);
  return {
    root: {
      type: "root",
      format: "",
      indent: 0,
      version: 1,
      direction: "ltr",
      children: paragraphs.map((p) => ({
        type: "paragraph",
        format: "",
        indent: 0,
        version: 1,
        direction: "ltr",
        children: [
          {
            type: "text",
            text: p,
            format: 0,
            detail: 0,
            mode: "normal",
            style: "",
            version: 1,
          },
        ],
      })),
    },
  };
}

function normalizeLexical(node: any): any {
  if (!node) return node;
  if (node.type === "text") {
    return {
      type: "text",
      text: node.text || "",
      format: node.format ?? 0,
      detail: node.detail ?? 0,
      mode: node.mode ?? "normal",
      style: node.style ?? "",
      version: 1,
    };
  }
  if (node.type === "root" || Array.isArray(node.children)) {
    return {
      ...node,
      format: node.format ?? "",
      indent: node.indent ?? 0,
      version: 1,
      direction: node.direction ?? "ltr",
      children: (node.children || []).map(normalizeLexical),
    };
  }
  if (node.root) {
    return { root: normalizeLexical(node.root) };
  }
  return node;
}

function moveAuthorityToBody(block: any) {
  const authority = block.authorityNote as string | undefined;
  if (!authority) return;
  if (authority.length < 160) return;
  block.body = textToLexical(authority);
  block.authorityNote = undefined;
}

function hydrateLayoutBodies(page: any) {
  const hydrated = JSON.parse(JSON.stringify(page));
  for (const block of hydrated.layout || []) {
    if (block.blockType === "twoColumn" && !block.body) {
      moveAuthorityToBody(block);
    }
    if (block.blockType === "richContent" && block.content) {
      block.content = normalizeLexical(block.content);
    }
  }
  return hydrated;
}

function hydrateHomepage(
  page: any,
  aspiriaId: any,
  industryId: any,
  amazeId: any,
  bookId: any,
) {
  const hydrated = hydrateLayoutBodies(page);
  for (const block of hydrated.layout || []) {
    if (block.blockType === "portfolioGrid") {
      if (aspiriaId && block.projects?.[0])
        block.projects[0].image = aspiriaId;
      if (industryId && block.projects?.[1])
        block.projects[1].image = industryId;
      if (amazeId && block.projects?.[2]) block.projects[2].image = amazeId;
    }
    if (block.blockType === "starterKit" && bookId) {
      block.bookImage = bookId;
    }
  }
  return hydrated;
}

// ---------------------- IMAGE HELPER ---------------------------------------

async function findOrUploadImage(
  payload: any,
  filename: string,
  alt: string,
): Promise<any> {
  const existing = await payload.find({
    collection: "media",
    where: { filename: { equals: filename } },
    limit: 1,
    depth: 0,
  });
  if (existing.docs?.[0]) return existing.docs[0];

  const imagePath = path.resolve(process.cwd(), "public/images", filename);
  if (!fs.existsSync(imagePath)) {
    return null;
  }
  return await payload.create({
    collection: "media",
    data: { alt },
    filePath: imagePath,
  });
}

// ---------------------- ROUTE -----------------------------------------------

export async function POST(req: NextRequest) {
  // Simple shared-secret guard (set V4_SEED_TOKEN in env, pass as Bearer).
  const expected = process.env.V4_SEED_TOKEN || process.env.PAYLOAD_SECRET;
  const provided = (req.headers.get("authorization") || "").replace(
    /^Bearer\s+/i,
    "",
  );
  if (!expected || provided !== expected) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const url = new URL(req.url);
  const dryRun = url.searchParams.get("dryRun") === "1";
  const wipePages = url.searchParams.get("wipePages") !== "0";

  const log: string[] = [];
  const t0 = Date.now();

  try {
    const payload = await getPayload({ config });
    log.push("Payload ready.");

    // 1. Optionally wipe existing pages so we have a clean slate
    if (wipePages && !dryRun) {
      const existing = await payload.find({
        collection: "pages",
        limit: 500,
        depth: 0,
      });
      for (const doc of existing.docs) {
        await payload.delete({ collection: "pages", id: doc.id });
      }
      log.push(`Wiped ${existing.totalDocs} existing pages.`);
    }

    // 2. Resolve / upload Bill's 4 hero images
    const aspiria = await findOrUploadImage(
      payload,
      "aspiria.jpg",
      "ASPIRIA campus aerial view, Overland Park, KS",
    );
    const industry = await findOrUploadImage(
      payload,
      "industry.jpg",
      "Industry Denver — renovated warehouse with yellow support columns",
    );
    const amaze = await findOrUploadImage(
      payload,
      "amaze-noda.jpg",
      "AMAZE @ NODA Apartments, Charlotte NC",
    );
    const book = await findOrUploadImage(
      payload,
      "ppp-book.png",
      "Peak Property Performance — Bill Douglas, Drew Hall, Ryan R. Goble (Fast Company Press)",
    );
    log.push(
      `Images: aspiria=${!!aspiria} industry=${!!industry} amaze=${!!amaze} book=${!!book}`,
    );

    // 3. Categories — upsert by slug
    const categoryMap: Record<string, any> = {};
    for (const cat of categoriesSeed) {
      const existing = await payload.find({
        collection: "categories",
        where: { slug: { equals: cat.slug } },
        limit: 1,
        depth: 0,
      });
      if (existing.docs[0]) {
        categoryMap[cat.slug] = existing.docs[0];
      } else if (!dryRun) {
        // Bill's category objects don't include `color` (our existing field has a default), so create works.
        categoryMap[cat.slug] = await payload.create({
          collection: "categories",
          data: cat as any,
        });
      }
    }
    log.push(`Categories upserted: ${Object.keys(categoryMap).length}`);

    // 4. Authors — upsert by name
    const authorMap: Record<string, any> = {};
    for (const author of authorsSeed) {
      const existing = await payload.find({
        collection: "authors",
        where: { name: { equals: author.name } },
        limit: 1,
        depth: 0,
      });
      if (existing.docs[0]) {
        authorMap[author.name] = existing.docs[0];
      } else if (!dryRun) {
        authorMap[author.name] = await payload.create({
          collection: "authors",
          data: author as any,
        });
      }
    }
    log.push(`Authors upserted: ${Object.keys(authorMap).length}`);

    // 5. Pages
    const allPages = [
      hydrateHomepage(
        homePage,
        aspiria?.id,
        industry?.id,
        amaze?.id,
        book?.id,
      ),
      hydrateLayoutBodies(brainsPage),
      hydrateLayoutBodies(howWeOperatePage),
      hydrateLayoutBodies(advisoryPage),
      hydrateLayoutBodies(pppAuditPage),
      hydrateLayoutBodies(botPage),
      hydrateLayoutBodies(fiveSPage),
      hydrateLayoutBodies(faqPage),
      hydrateLayoutBodies(noiStrategyPage),
      hydrateLayoutBodies(noiPlaybookPage),
      hydrateLayoutBodies(aiReadyPage),
      hydrateLayoutBodies(ownVsLeasePage),
      hydrateLayoutBodies(digitalVisibilityPage),
      hydrateLayoutBodies(categoryHubPage),
      hydrateLayoutBodies(forLpsPage),
      hydrateLayoutBodies(forPmsPage),
      hydrateLayoutBodies(forTenantsPage),
    ];

    const created: { slug: string; id: any }[] = [];
    for (const page of allPages) {
      if (dryRun) {
        created.push({ slug: page.slug, id: "dry-run" });
        continue;
      }
      const doc = await payload.create({
        collection: "pages",
        data: { ...page, _status: "published" } as any,
      });
      created.push({ slug: page.slug, id: doc.id });
    }
    log.push(`Pages created: ${created.length}`);

    return NextResponse.json({
      ok: true,
      ms: Date.now() - t0,
      dryRun,
      log,
      pages: created,
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        ok: false,
        ms: Date.now() - t0,
        log,
        error: String(err?.message || err),
        stack: err?.stack,
      },
      { status: 500 },
    );
  }
}
