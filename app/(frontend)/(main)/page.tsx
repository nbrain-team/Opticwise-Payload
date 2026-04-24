import { notFound } from "next/navigation";
import { getHomePage } from "@/lib/payload-helpers";
import { PageBlocksLive } from "@/components/PageBlocksLive";

// Render at request time, never statically cache. This route previously
// baked an unrecoverable 404 into the production build because a transient
// DB issue at build time made getHomePage() return null and `notFound()`
// got cached. Forcing dynamic also lets the Payload Live Preview iframe
// receive a fresh server render on every load.
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function HomePage() {
  const homePage = await getHomePage();
  const layout = (homePage as any)?.layout;
  if (!homePage) {
    console.error("[home] getHomePage() returned null — no page with isHomePage:true and _status:published was found.");
    return notFound();
  }
  if (!Array.isArray(layout) || layout.length === 0) {
    console.error(`[home] home page (id=${(homePage as any).id}) has no layout blocks.`);
    return notFound();
  }
  return <PageBlocksLive initialData={homePage} />;
}
