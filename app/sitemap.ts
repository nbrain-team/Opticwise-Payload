import { getPayload } from "payload";
import config from "@payload-config";

export const dynamic = "force-dynamic";
export const revalidate = 3600;

export default async function sitemap() {
  const baseUrl = (
    process.env.NEXT_PUBLIC_SERVER_URL || "https://opticwise.com"
  ).replace(/\/$/, "");

  let pages: any[] = [];
  let posts: any[] = [];
  try {
    const payload = await getPayload({ config });
    const pagesResult = await payload.find({
      collection: "pages",
      limit: 200,
      depth: 0,
    });
    const postsResult = await payload.find({
      collection: "posts",
      limit: 500,
      depth: 0,
    });
    pages = pagesResult.docs;
    posts = postsResult.docs;
  } catch {
    // empty sitemap on build failure
  }

  const pageUrls = pages
    .filter((p: any) => !p.meta?.noIndex)
    .map((p: any) => ({
      url: p.isHomePage ? baseUrl : `${baseUrl}/${p.slug}`,
      lastModified: p.updatedAt,
      changeFrequency: "weekly" as const,
      priority: p.isHomePage ? 1.0 : 0.8,
    }));

  const postUrls = posts
    .filter((p: any) => !p.meta?.noIndex)
    .map((p: any) => ({
      url: `${baseUrl}/insights/${p.slug}`,
      lastModified: p.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));

  return [...pageUrls, ...postUrls];
}
