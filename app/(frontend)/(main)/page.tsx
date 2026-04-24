import { notFound } from "next/navigation";
import { getHomePage } from "@/lib/payload-helpers";
import { PageBlocksLive } from "@/components/PageBlocksLive";

export const revalidate = 300;

export default async function HomePage() {
  const homePage = await getHomePage();
  const layout = (homePage as any)?.layout;
  if (!homePage || !Array.isArray(layout) || layout.length === 0) {
    return notFound();
  }
  return <PageBlocksLive initialData={homePage} />;
}
