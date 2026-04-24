import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPageBySlug, getMediaUrl } from "@/lib/payload-helpers";
import { PageBlocksLive } from "@/components/PageBlocksLive";

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
  const page = await getPageBySlug(slug.join("/"));
  if (!page) return {};

  const p = page as any;
  return {
    title: p.meta?.title || p.title,
    description: p.meta?.description || p.excerpt || undefined,
    openGraph: p.meta?.image
      ? { images: [{ url: getMediaUrl(p.meta.image) }] }
      : p.heroImage
        ? { images: [{ url: getMediaUrl(p.heroImage) }] }
        : undefined,
  };
}

export default async function PayloadPage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const page = await getPageBySlug(slug.join("/"));
  if (!page) return notFound();

  const p = page as any;
  const layout: any[] = Array.isArray(p.layout) ? p.layout : [];

  if (layout.length === 0) {
    return (
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
    );
  }

  return <PageBlocksLive initialData={p} />;
}
