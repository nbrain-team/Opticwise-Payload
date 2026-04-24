/**
 * Renders Payload rich text or legacy Ghost/Strikingly HTML content.
 *
 * Legacy posts imported from the prior Strikingly install have a hero
 * block baked into the start of `htmlContent` (a div.s-blog-header
 * containing the cover image as background plus a duplicate of the
 * title/subtitle overlaid on top). We already render those exact
 * elements in our own page hero, so the embedded version is redundant
 * and looks awful (text overlapping image, unscoped legacy CSS).
 *
 * `stripLegacyBlogHeader` finds the start of the actual body content
 * (`div.s-blog-body`) and slices everything before it. Posts authored
 * fresh in Payload (or that don't carry the Strikingly wrapper) pass
 * through unchanged.
 */
function stripLegacyBlogHeader(html: string): string {
  if (!html.includes("s-blog-header")) return html;
  const bodyIdx = html.search(/<div[^>]*class="[^"]*s-blog-body[^"]*"/i);
  if (bodyIdx > 0) return html.slice(bodyIdx);
  return html;
}

export function RichContent({ html }: { html: string | null | undefined }) {
  if (!html) {
    return (
      <div className="text-center py-12 text-gray-400">
        <p>Content will appear here once it is added.</p>
      </div>
    );
  }

  const cleaned = stripLegacyBlogHeader(html);
  return <div className="ghost-content" dangerouslySetInnerHTML={{ __html: cleaned }} />;
}
