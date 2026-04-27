import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPageBySlug, getSiteSettings } from "@/lib/payload-helpers";
import { PageBlocksLive } from "@/components/PageBlocksLive";
import JsonLd from "@/components/JsonLd";
import {
  buildMetadata,
  breadcrumbSchema,
  organizationSchema,
  faqPageSchema,
} from "@/lib/seo";

// On-demand ISR (no generateStaticParams). The build does not prerender
// every page; pages render on first request, then get cached for the
// revalidate window. This avoids fanning 100+ parallel queries at Neon
// during build (which fails with "postgres message too large"), and
// still gives users fast cached HTML after the first hit.
export const revalidate = 300;
export const dynamicParams = true;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const slugStr = slug.join("/");
  const [page, settings] = await Promise.all([
    getPageBySlug(slugStr).catch(() => null),
    getSiteSettings().catch(() => null),
  ]);
  if (!page) return {};
  return buildMetadata({
    doc: page,
    settings,
    pathname: `/${slugStr}`,
    type: "website",
  });
}

function findFaqQuestions(
  layout: any[],
): Array<{ question: string; answer: string }> | null {
  if (!Array.isArray(layout)) return null;
  const all: Array<{ question: string; answer: string }> = [];
  for (const b of layout) {
    if (b?.blockType === "faq" && Array.isArray(b.questions)) {
      for (const q of b.questions) {
        if (q?.question && q?.answer) {
          all.push({ question: q.question, answer: q.answer });
        }
      }
    }
  }
  return all.length > 0 ? all : null;
}

export default async function PayloadPage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const slugStr = slug.join("/");
  const [page, settings] = await Promise.all([
    getPageBySlug(slugStr),
    getSiteSettings().catch(() => null),
  ]);
  if (!page) return notFound();

  const p = page as any;
  const layout: any[] = Array.isArray(p.layout) ? p.layout : [];

  const faqQuestions = findFaqQuestions(layout);
  const isAbout = slugStr === "about";

  if (layout.length === 0) {
    return (
      <>
        <JsonLd data={breadcrumbSchema(p.title, `/${slugStr}`)} />
        <section className="ow-section bg-white">
          <div className="ow-container max-w-3xl mx-auto text-center py-32">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-4">
              {p.title}
            </h1>
            <p className="text-gray-500">
              This page is being built in the CMS. Check back soon.
            </p>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <JsonLd data={breadcrumbSchema(p.title, `/${slugStr}`)} />
      {isAbout && <JsonLd data={organizationSchema(settings)} />}
      {faqQuestions && faqQuestions.length > 0 && (
        <JsonLd data={faqPageSchema(faqQuestions)} />
      )}
      <PageBlocksLive initialData={p} />
    </>
  );
}
