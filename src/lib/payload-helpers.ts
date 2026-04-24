import { getPayload } from "payload";
import config from "@payload-config";

let cachedPayload: Awaited<ReturnType<typeof getPayload>> | null = null;

export async function getPayloadClient() {
  if (cachedPayload) return cachedPayload;
  cachedPayload = await getPayload({ config });
  return cachedPayload;
}

// Semaphore limiting concurrent Payload reads. Vercel build prerenders
// 100+ pages in parallel; Neon's pooled connection limit was being
// exhausted, causing reads to throw mid-build. Throttling to 4
// concurrent queries keeps us well under the pool ceiling without a
// noticeable build-time cost (each query is fast, just don't fan all
// at once).
const MAX_CONCURRENT = 4;
let active = 0;
const waiting: Array<() => void> = [];
async function withLimit<T>(fn: () => Promise<T>): Promise<T> {
  if (active >= MAX_CONCURRENT) {
    await new Promise<void>((resolve) => waiting.push(resolve));
  }
  active++;
  try {
    return await fn();
  } finally {
    active--;
    const next = waiting.shift();
    if (next) next();
  }
}

// Errors are NOT silently swallowed. A baked notFound() is permanent;
// we'd rather a build/request fail loudly than serve a sticky 404 on a
// real page. Only "row exists / row absent" semantics drive null vs
// data — DB errors propagate.
//
// Retries on transient Postgres errors (connection drop, timeout) so a
// single Neon hiccup during build doesn't take down a full deploy.

const TRANSIENT_RE = /(ECONNRESET|ETIMEDOUT|terminat|timeout|server closed|Connection terminated|too many clients)/i;
async function withRetry<T>(label: string, fn: () => Promise<T>, attempts = 3): Promise<T> {
  let lastErr: any;
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn();
    } catch (err: any) {
      lastErr = err;
      if (!TRANSIENT_RE.test(err?.message || "")) break;
      const wait = 250 * Math.pow(2, i);
      console.warn(`[helpers] ${label} transient error (attempt ${i + 1}/${attempts}), retrying in ${wait}ms:`, err?.message);
      await new Promise((r) => setTimeout(r, wait));
    }
  }
  throw lastErr;
}

export async function getHomePage() {
  return withLimit(() => withRetry("getHomePage", async () => {
    const payload = await getPayloadClient();
    const result = await payload.find({
      collection: "pages",
      where: { isHomePage: { equals: true } },
      limit: 1,
      depth: 2,
    });
    return result.docs[0] || null;
  }));
}

export async function getPageBySlug(slug: string) {
  return withLimit(() => withRetry(`getPageBySlug(${slug})`, async () => {
    const payload = await getPayloadClient();
    const result = await payload.find({
      collection: "pages",
      where: { slug: { equals: slug } },
      limit: 1,
      depth: 2,
    });
    return result.docs[0] || null;
  }));
}

export async function getAllPages() {
  return withLimit(() => withRetry("getAllPages", async () => {
    const payload = await getPayloadClient();
    const result = await payload.find({
      collection: "pages",
      limit: 100,
      depth: 1,
      where: { _status: { equals: "published" } },
    });
    return result.docs;
  }));
}

export async function getAllPosts() {
  return withLimit(() => withRetry("getAllPosts", async () => {
    const payload = await getPayloadClient();
    // depth: 1 is enough for the listing card (title, slug, excerpt,
    // featureImage URL, category title). Going to depth: 2 across 100+
    // posts blows past Neon's serverless protocol message size limit
    // and crashes the build with "postgres message too large".
    const result = await payload.find({
      collection: "posts",
      limit: 200,
      depth: 1,
      sort: "-publishedAt",
      where: { _status: { equals: "published" } },
    });
    return result.docs;
  }));
}

export async function getPostBySlug(slug: string) {
  return withLimit(() => withRetry(`getPostBySlug(${slug})`, async () => {
    const payload = await getPayloadClient();
    const result = await payload.find({
      collection: "posts",
      where: { slug: { equals: slug } },
      limit: 1,
      depth: 2,
    });
    return result.docs[0] || null;
  }));
}

// Globals are non-critical chrome (headers, footers). If they error,
// we keep rendering the page with safe defaults rather than failing
// the whole request.
export async function getSiteSettings() {
  try {
    const payload = await getPayloadClient();
    return await payload.findGlobal({ slug: "site-settings", depth: 1 });
  } catch (e) {
    console.warn("[helpers] getSiteSettings failed, returning null:", (e as Error).message);
    return null;
  }
}

export async function getNavigation() {
  try {
    const payload = await getPayloadClient();
    return await payload.findGlobal({ slug: "navigation" });
  } catch (e) {
    console.warn("[helpers] getNavigation failed, returning null:", (e as Error).message);
    return null;
  }
}

export {
  getMediaUrl,
  getMediaAlt,
  extractFeatureImageFromHtml,
  getPostFeatureImageUrl,
} from "./media-utils";
