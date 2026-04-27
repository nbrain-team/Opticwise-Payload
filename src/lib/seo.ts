import type { Metadata } from "next";
import { getMediaUrl } from "./media-utils";

export function siteBaseUrl(): string {
  return (
    process.env.NEXT_PUBLIC_SERVER_URL ||
    "https://opticwise-payload.vercel.app"
  ).replace(/\/$/, "");
}

function pickImage(...candidates: any[]): string | null {
  for (const c of candidates) {
    if (!c) continue;
    if (typeof c === "string") return c;
    const url = getMediaUrl(c);
    if (url) return url;
  }
  return null;
}

interface BuildMetadataArgs {
  doc?: any;
  settings?: any;
  pathname: string; // e.g. "/", "/about", "/insights/some-slug"
  type?: "website" | "article";
  fallbackTitle?: string;
  fallbackDescription?: string;
}

export function buildMetadata({
  doc,
  settings,
  pathname,
  type = "website",
  fallbackTitle,
  fallbackDescription,
}: BuildMetadataArgs): Metadata {
  const base = siteBaseUrl();
  const url = `${base}${pathname.startsWith("/") ? pathname : `/${pathname}`}`;

  const docMeta = doc?.meta || {};
  const settingsAny = settings || {};

  const title =
    docMeta.title ||
    doc?.title ||
    fallbackTitle ||
    settingsAny.defaultMetaTitle ||
    "OpticWise — Owner-Controlled Data & Digital Infrastructure for CRE";

  const description =
    docMeta.description ||
    doc?.excerpt ||
    fallbackDescription ||
    settingsAny.defaultMetaDescription ||
    undefined;

  const ogImage = pickImage(
    docMeta.ogImage,
    doc?.featureImage,
    doc?.heroImage,
    settingsAny.defaultOgImage,
  );

  const images = ogImage ? [{ url: ogImage }] : undefined;

  const noIndex = Boolean(docMeta.noIndex);

  return {
    title,
    description,
    metadataBase: new URL(base),
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      type,
      url,
      siteName: "OpticWise",
      images,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ogImage ? [ogImage] : undefined,
    },
    robots: noIndex ? { index: false, follow: false } : undefined,
  };
}

export function organizationSchema(settings?: any) {
  const base = siteBaseUrl();
  const s: any = settings || {};
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "OpticWise",
    url: base,
    logo: `${base}/images/ow_logo.png`,
    description:
      s.organizationDescription ||
      "OpticWise is the data & digital infrastructure partner for commercial real estate. Founded in 2004.",
    foundingDate: String(s.organizationFoundingYear || 2004),
    sameAs: Array.isArray(s.organizationSameAs)
      ? s.organizationSameAs
          .map((x: any) => x?.url)
          .filter((u: any): u is string => !!u)
      : [],
    award: [
      "Digital Infrastructure Leadership in CRE Value Creation - The Silicon Review (2026)",
      "Building Intelligence Solutions Company of the Year - PropTech Outlook (2025)",
      "Best CRE Data & Digital Solution Provider - CIO Bulletin (2025)",
      "Best Wi-Fi Connectivity Solutions Specialist USA - Global 100 (2025, 2024)",
      "Top 10 Smart Building Solution Providers - PropTech Outlook (2024, 2023)",
      "PropTech Visionary of the Year USA - M&A Today (2024, 2023)",
      "Most Trusted Real Estate Technology Solutions - CIO Bulletin (2024)",
      "PropTech Visionary of the Year USA - Global 100 (2023, 2022)",
      "Best Commercial Real Estate Data Solutions Provider - Wealth & Finance (2024)",
      "Most Innovative PropTech Solutions Company - Corporate Vision (2023, 2022)",
    ],
  };
}

export function breadcrumbSchema(pageTitle: string, pathname: string) {
  const base = siteBaseUrl();
  const url = `${base}${pathname.startsWith("/") ? pathname : `/${pathname}`}`;
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: base,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: pageTitle,
        item: url,
      },
    ],
  };
}

export function articleSchema(post: any) {
  const base = siteBaseUrl();
  const image = pickImage(post?.meta?.ogImage, post?.featureImage);
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post?.title,
    description: post?.excerpt,
    image: image || undefined,
    datePublished: post?.publishedAt,
    dateModified: post?.updatedAt,
    author: Array.isArray(post?.authors)
      ? post.authors
          .map((a: any) =>
            a?.name ? { "@type": "Person", name: a.name } : null,
          )
          .filter(Boolean)
      : undefined,
    publisher: {
      "@type": "Organization",
      name: "OpticWise",
      logo: {
        "@type": "ImageObject",
        url: `${base}/images/ow_logo.png`,
      },
    },
  };
}

export function faqPageSchema(
  questions: Array<{ question: string; answer: string }>,
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: (questions || []).map((q) => ({
      "@type": "Question",
      name: q.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: q.answer,
      },
    })),
  };
}
