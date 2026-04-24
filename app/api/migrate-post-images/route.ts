import { NextRequest, NextResponse } from "next/server";
import { getPayload } from "payload";
import config from "@payload-config";
import { extractFeatureImageFromHtml } from "@/lib/media-utils";

export const maxDuration = 300;
export const dynamic = "force-dynamic";

const MIME_BY_EXT: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  gif: "image/gif",
  webp: "image/webp",
  svg: "image/svg+xml",
  avif: "image/avif",
};

function deriveFile(url: string, slug: string): { name: string; mimetype: string } {
  let pathname = url;
  try {
    pathname = new URL(url).pathname;
  } catch {
    // leave as-is
  }
  const base = pathname.split("/").pop() || "";
  const ext = (base.includes(".") ? base.split(".").pop() : "") || "jpg";
  const safeExt = ext.toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 5) || "jpg";
  const safeSlug = slug.toLowerCase().replace(/[^a-z0-9-]+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "").slice(0, 80);
  return {
    name: `${safeSlug}-cover.${safeExt}`,
    mimetype: MIME_BY_EXT[safeExt] || "image/jpeg",
  };
}

async function fetchImage(url: string): Promise<{ buffer: Buffer; contentType: string | null }> {
  const res = await fetch(url, {
    redirect: "follow",
    headers: {
      // Some CDNs reject empty UAs.
      "User-Agent": "Mozilla/5.0 (compatible; OpticWisePayloadBot/1.0)",
      Accept: "image/*,*/*;q=0.8",
    },
  });
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} fetching ${url}`);
  }
  const arrayBuf = await res.arrayBuffer();
  return {
    buffer: Buffer.from(arrayBuf),
    contentType: res.headers.get("content-type"),
  };
}

export async function POST(req: NextRequest) {
  const expected = process.env.V4_SEED_TOKEN || process.env.PAYLOAD_SECRET;
  const provided = (req.headers.get("authorization") || "").replace(/^Bearer\s+/i, "");
  if (!expected || provided !== expected) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(req.url);
  const dryRun = url.searchParams.get("dryRun") === "1";
  const limitParam = parseInt(url.searchParams.get("limit") || "200", 10);
  const onlySlug = url.searchParams.get("slug") || null;

  const payload = await getPayload({ config });
  const log: string[] = [];
  const t0 = Date.now();

  // Pull every post that does NOT already have a featureImage. The shape on
  // a freshly-fetched doc is { featureImage: null | id | object } depending
  // on depth — query at depth 0 so we can rely on a primitive comparison.
  const where: any = onlySlug
    ? { slug: { equals: onlySlug } }
    : { featureImage: { exists: false } };

  const result = await payload.find({
    collection: "posts",
    where,
    limit: limitParam,
    depth: 0,
    pagination: false,
  });

  log.push(`Found ${result.docs.length} candidate post(s).`);

  const summary = {
    skippedHasFeature: 0,
    skippedNoUrl: 0,
    migrated: 0,
    failed: 0,
  };
  const failures: Array<{ slug: string; error: string }> = [];
  const migrated: Array<{ slug: string; mediaId: number | string; sourceUrl: string }> = [];

  for (const post of result.docs as any[]) {
    if (post.featureImage && !onlySlug) {
      summary.skippedHasFeature++;
      continue;
    }

    const sourceUrl = extractFeatureImageFromHtml(post.htmlContent);
    if (!sourceUrl) {
      summary.skippedNoUrl++;
      log.push(`[skip] ${post.slug}: no extractable image URL`);
      continue;
    }

    if (dryRun) {
      log.push(`[dry] ${post.slug} -> ${sourceUrl}`);
      summary.migrated++;
      continue;
    }

    try {
      const { buffer, contentType } = await fetchImage(sourceUrl);
      const { name, mimetype } = deriveFile(sourceUrl, post.slug);
      const finalMime = contentType?.startsWith("image/") ? contentType.split(";")[0] : mimetype;

      const media = (await payload.create({
        collection: "media",
        data: {
          alt: post.title?.slice(0, 200) || post.slug,
        } as any,
        file: {
          data: buffer,
          mimetype: finalMime,
          name,
          size: buffer.length,
        } as any,
      })) as any;

      await payload.update({
        collection: "posts",
        id: post.id,
        data: { featureImage: media.id } as any,
        // Don't trigger the full revalidation hook for every single post —
        // we'll do one bulk revalidation at the end.
        context: { skipRevalidate: true } as any,
      });

      summary.migrated++;
      migrated.push({ slug: post.slug, mediaId: media.id, sourceUrl });
      if (summary.migrated % 10 === 0) {
        log.push(`...${summary.migrated} migrated so far`);
      }
    } catch (e: any) {
      summary.failed++;
      const msg = e?.message || String(e);
      failures.push({ slug: post.slug, error: msg });
      log.push(`[fail] ${post.slug}: ${msg}`);
    }
  }

  log.push(`Done in ${Date.now() - t0}ms.`);

  return NextResponse.json({
    ok: true,
    dryRun,
    summary,
    migrated,
    failures,
    log,
  });
}
