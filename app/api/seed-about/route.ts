import { NextRequest, NextResponse } from "next/server";
import { getPayload } from "payload";
import config from "@payload-config";

import { aboutPage } from "@/seed-data/v4/pages/about";

export const maxDuration = 120;
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  // Same auth pattern as /api/v4-seed
  const expected = process.env.V4_SEED_TOKEN || process.env.PAYLOAD_SECRET;
  const provided = (req.headers.get("authorization") || "").replace(
    /^Bearer\s+/i,
    "",
  );
  if (!expected || provided !== expected) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const log: string[] = [];
  const t0 = Date.now();

  try {
    const payload = await getPayload({ config });
    log.push("Payload ready.");

    const existing = await payload.find({
      collection: "pages",
      where: { slug: { equals: "about" } },
      limit: 1,
      depth: 0,
    });

    let result: any;
    if (existing.docs[0]) {
      result = await payload.update({
        collection: "pages",
        id: existing.docs[0].id,
        data: { ...aboutPage, _status: "published" } as any,
      });
      log.push(`Updated existing /about page (id=${result.id}).`);
    } else {
      result = await payload.create({
        collection: "pages",
        data: { ...aboutPage, _status: "published" } as any,
      });
      log.push(`Created /about page (id=${result.id}).`);
    }

    return NextResponse.json({
      ok: true,
      ms: Date.now() - t0,
      log,
      page: { id: result.id, slug: result.slug, title: result.title },
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
