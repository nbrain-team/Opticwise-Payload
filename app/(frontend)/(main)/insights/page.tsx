import type { Metadata } from "next";
import { getAllPosts, getSiteSettings } from "@/lib/payload-helpers";
import { SubpageHero } from "@/components/SubpageHero";
import { CTASection } from "@/components/CTASection";
import { SITE } from "@/lib/site";
import { InsightsGrid } from "@/components/InsightsGrid";
import { getPostFeatureImageUrl } from "@/lib/payload-helpers";
import JsonLd from "@/components/JsonLd";
import { buildMetadata, breadcrumbSchema } from "@/lib/seo";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings().catch(() => null);
  const s = (settings as any) || {};
  const heroHeading: string =
    s.insightsHeroHeading || "Insights for Owners Who Want Control";
  const heroLede: string =
    s.insightsHeroLede ||
    "Owner plays on data & digital infrastructure, NOI drivers, vendor control, AI readiness, and the Peak Property Performance® operating system.";
  return buildMetadata({
    settings,
    pathname: "/insights",
    type: "website",
    fallbackTitle: heroHeading,
    fallbackDescription: heroLede,
  });
}

export default async function InsightsPage() {
  const [posts, settings] = await Promise.all([getAllPosts(), getSiteSettings()]);
  const s = (settings as any) || {};

  const heroEyebrow: string = s.insightsHeroEyebrow || "Resources";
  const heroHeading: string = s.insightsHeroHeading || "Insights for Owners Who Want Control";
  const heroLede: string =
    s.insightsHeroLede ||
    "This is where we publish the owner plays: how to reclaim control, reduce operational risk, and turn data & digital infrastructure into a compounding portfolio asset.";

  const ctaHeading: string = s.insightsCtaHeading || "Complimentary CRE Data & Digital Review Session";
  const ctaSubheading: string =
    s.insightsCtaSubheading ||
    "One building. Map who owns what, where data lives, and where operational burden stacks up vs your KPIs.";

  const postCards = posts.map((p: any) => ({
    id: p.id,
    title: p.title,
    slug: p.slug,
    excerpt: p.excerpt,
    featureImageUrl: getPostFeatureImageUrl(p),
    categoryName: typeof p.category === "object" ? p.category?.title : null,
    publishedAt: p.publishedAt,
    readingTime: p.readingTime,
    tags: (p.tags || []).map((t: any) => (typeof t === "object" ? t.title : t)).filter(Boolean),
  }));

  const allTags = Array.from(
    new Set(postCards.flatMap((p: any) => p.tags || []))
  ).sort() as string[];

  return (
    <>
      <JsonLd data={breadcrumbSchema(heroHeading, "/insights")} />
      <SubpageHero title={heroHeading} lead={heroLede} badge={heroEyebrow} />

      <InsightsGrid posts={postCards} tags={allTags} />

      <CTASection heading={ctaHeading} subheading={ctaSubheading} />

      <section className="bg-ow-navy py-14">
        <div className="ow-container text-center">
          <p className="text-sm text-white/70 font-medium">{SITE.closingLine}</p>
        </div>
      </section>
    </>
  );
}
