export function getMediaUrl(media: any): string {
  if (!media) return "";
  if (typeof media === "string") return media;
  return media.url || "";
}

export function getMediaAlt(media: any): string {
  if (!media) return "";
  if (typeof media === "string") return "";
  return media.alt || "";
}

// Matches `background-image:url(...)` (handles single/double quotes and
// protocol-relative URLs). Used to recover the featured image from blog
// posts imported with their cover image baked into html_content.
const BG_IMAGE_RE = /background-image\s*:\s*url\(\s*["']?([^"')]+)["']?\s*\)/i;
const IMG_SRC_RE = /<img[^>]+src=["']([^"']+)["']/i;

export function extractFeatureImageFromHtml(html?: string | null): string {
  if (!html || typeof html !== "string") return "";
  const bgMatch = html.match(BG_IMAGE_RE);
  let url = bgMatch?.[1] || html.match(IMG_SRC_RE)?.[1] || "";
  if (!url) return "";
  url = url.trim();
  if (url.startsWith("//")) url = "https:" + url;
  return url;
}

// Resolve a blog post's cover image. Prefers the explicit `featureImage`
// upload (set in Payload admin); falls back to scraping the legacy
// htmlContent for posts imported from the prior install where the cover
// was embedded as a background-image instead of a Media record.
export function getPostFeatureImageUrl(post: any): string {
  const fromMedia = getMediaUrl(post?.featureImage);
  if (fromMedia) return fromMedia;
  return extractFeatureImageFromHtml(post?.htmlContent);
}
