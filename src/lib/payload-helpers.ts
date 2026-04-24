import { getPayload } from "payload";
import config from "@payload-config";

let cachedPayload: Awaited<ReturnType<typeof getPayload>> | null = null;

export async function getPayloadClient() {
  if (cachedPayload) return cachedPayload;
  cachedPayload = await getPayload({ config });
  return cachedPayload;
}

// IMPORTANT: these helpers intentionally do NOT swallow errors.
//
// Earlier revisions wrapped each call in try/catch and returned null on
// failure. That hid Postgres connection / timeout failures: at Vercel
// build time a transient DB hiccup made every page render notFound(),
// which Next.js then baked into the static cache as a permanent 404
// (ISR revalidation cannot recover from a baked notFound). The result
// was random, sticky 404s on real, published pages.
//
// Now: missing data returns `null` (legitimate "no such doc"), but a
// real DB error throws and the build/request fails loudly. That makes
// build problems visible AND keeps "doc exists / doc absent" semantics
// distinct, so notFound() is only ever called for genuinely missing docs.

export async function getHomePage() {
  const payload = await getPayloadClient();
  const result = await payload.find({
    collection: "pages",
    where: { isHomePage: { equals: true } },
    limit: 1,
    depth: 2,
  });
  return result.docs[0] || null;
}

export async function getPageBySlug(slug: string) {
  const payload = await getPayloadClient();
  const result = await payload.find({
    collection: "pages",
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 2,
  });
  return result.docs[0] || null;
}

export async function getAllPages() {
  const payload = await getPayloadClient();
  const result = await payload.find({
    collection: "pages",
    limit: 100,
    depth: 1,
    where: { _status: { equals: "published" } },
  });
  return result.docs;
}

export async function getAllPosts() {
  const payload = await getPayloadClient();
  const result = await payload.find({
    collection: "posts",
    limit: 200,
    depth: 2,
    sort: "-publishedAt",
    where: { _status: { equals: "published" } },
  });
  return result.docs;
}

export async function getPostBySlug(slug: string) {
  const payload = await getPayloadClient();
  const result = await payload.find({
    collection: "posts",
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 2,
  });
  return result.docs[0] || null;
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
