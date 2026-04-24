import { getAllPosts } from "@/lib/payload-helpers";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const SITE_URL =
  process.env.NEXT_PUBLIC_SERVER_URL?.replace(/\/$/, "") ||
  "https://opticwise-payload.vercel.app";
const FEED_TITLE = "OpticWise Insights";
const FEED_DESC =
  "Owner plays for CRE: how to reclaim control, reduce operational risk, and turn data & digital infrastructure into a compounding portfolio asset.";

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function toRfc822(d: string | Date | null | undefined): string {
  if (!d) return new Date().toUTCString();
  const date = typeof d === "string" ? new Date(d) : d;
  if (isNaN(date.getTime())) return new Date().toUTCString();
  return date.toUTCString();
}

export async function GET() {
  const posts = await getAllPosts();
  const lastBuild = posts[0]?.publishedAt
    ? toRfc822(posts[0].publishedAt as string)
    : new Date().toUTCString();

  const items = posts
    .map((p: any) => {
      const link = `${SITE_URL}/insights/${p.slug}`;
      const pub = toRfc822(p.publishedAt);
      const title = escapeXml(p.title || p.slug);
      const desc = escapeXml(p.excerpt || "");
      return `    <item>
      <title>${title}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <pubDate>${pub}</pubDate>
      <description>${desc}</description>
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(FEED_TITLE)}</title>
    <link>${SITE_URL}/insights</link>
    <atom:link href="${SITE_URL}/blog/feed.xml" rel="self" type="application/rss+xml" />
    <description>${escapeXml(FEED_DESC)}</description>
    <language>en-us</language>
    <lastBuildDate>${lastBuild}</lastBuildDate>
${items}
  </channel>
</rss>
`;

  return new Response(xml, {
    status: 200,
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=300, s-maxage=300",
    },
  });
}
