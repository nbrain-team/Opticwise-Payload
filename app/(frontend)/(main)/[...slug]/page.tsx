import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPageBySlug, getAllPages, getMediaUrl } from "@/lib/payload-helpers";
import { PageBlocksLive } from "@/components/PageBlocksLive";

// Static generation with ISR. With the data-layer change in
// src/lib/payload-helpers.ts (no more silent try/catch), a transient
// build-time DB error now throws and FAILS the deploy instead of
// silently baking a 404 into the static cache. dynamicParams=true
// means slugs added after deploy still render on first request.
export const revalidate = 300;
export const dynamicParams = true;

export async function generateStaticParams() {
  const pages = await getAllPages();
  return pages.map((p: any) => ({ slug: [p.slug] }));
}

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
