import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPageBySlug, getMediaUrl } from "@/lib/payload-helpers";
import { PageBlocksLive } from "@/components/PageBlocksLive";

// Render at request time. Previously this used generateStaticParams +
// revalidate, which baked 404s into the static cache for any page where
// getPageBySlug returned null during the Vercel build (transient DB error,
// connection pool exhaustion, etc). A baked notFound() does not recover
// via ISR revalidation, producing intermittent 404s for users. Going
// fully dynamic eliminates the entire class of build-baked 404 bugs and
// lets the Live Preview iframe always see a fresh server render.
export const dynamic = "force-dynamic";
export const revalidate = 0;

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
