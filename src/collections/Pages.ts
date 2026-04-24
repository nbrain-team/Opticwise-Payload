import type { CollectionConfig } from "payload";
import { Hero } from "../blocks/v4/Hero";
import { TwoColumn } from "../blocks/v4/TwoColumn";
import { ProblemBlock } from "../blocks/v4/ProblemBlock";
import { PullQuote } from "../blocks/v4/PullQuote";
import { BotCallout } from "../blocks/v4/BotCallout";
import { BrainBlock } from "../blocks/v4/BrainBlock";
import { FivePlan } from "../blocks/v4/FivePlan";
import { FiveStandard } from "../blocks/v4/FiveStandard";
import { CardGrid } from "../blocks/v4/CardGrid";
import { AvoidFailure } from "../blocks/v4/AvoidFailure";
import { StarterKit } from "../blocks/v4/StarterKit";
import { PortfolioGrid } from "../blocks/v4/PortfolioGrid";
import { CallToAction } from "../blocks/v4/CallToAction";
import { RichContent } from "../blocks/v4/RichContent";
import { FAQ } from "../blocks/v4/FAQ";
import { revalidatePage, revalidatePageDelete } from "../hooks/revalidate";

const FALLBACK_SERVER_URL =
  process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000";

/**
 * "Open in new tab" preview links need an absolute URL because the
 * destination is a separate browser navigation, not an embedded iframe.
 * Live preview URLs, in contrast, can be relative — Payload resolves
 * them against `window.location.origin` so the iframe always shares the
 * admin's origin (avoids alias vs. per-deployment Vercel URL drift).
 */
function pagePath(slug: string, isHomePage?: boolean): string {
  if (isHomePage) return "/";
  return `/${slug}`;
}

export const Pages: CollectionConfig = {
  slug: "pages",
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "slug", "_status", "updatedAt"],
    description: "Website pages with block-based layout builder.",
    livePreview: {
      url: ({ data }: any) =>
        pagePath((data?.slug as string) || "", Boolean(data?.isHomePage)),
      breakpoints: [
        { label: "Mobile", name: "mobile", width: 375, height: 667 },
        { label: "Tablet", name: "tablet", width: 768, height: 1024 },
        { label: "Desktop", name: "desktop", width: 1440, height: 900 },
      ],
    },
    preview: (doc) =>
      `${FALLBACK_SERVER_URL}${pagePath(
        (doc?.slug as string) || "",
        Boolean(doc?.isHomePage),
      )}`,
  },
  versions: {
    drafts: {
      autosave: { interval: 750 },
      schedulePublish: true,
    },
    maxPerDoc: 50,
  },
  lockDocuments: {
    duration: 600,
  },
  hooks: {
    afterChange: [revalidatePage],
    afterDelete: [revalidatePageDelete],
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
    },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      admin: {
        position: "sidebar",
        description: "URL path for this page (e.g. 'ppp-audit')",
      },
    },
    {
      name: "excerpt",
      type: "textarea",
      admin: {
        description: "Short description shown in hero sections and meta tags.",
      },
    },
    {
      name: "heroImage",
      type: "upload",
      relationTo: "media",
      admin: {
        position: "sidebar",
        description: "Background image for the page hero.",
      },
    },
    {
      name: "heroBadge",
      type: "text",
      admin: {
        position: "sidebar",
        description: "Optional badge shown above the hero title.",
      },
    },
    {
      name: "isHomePage",
      type: "checkbox",
      defaultValue: false,
      admin: {
        position: "sidebar",
        description: "Mark this as the home page (only one should be checked).",
      },
    },
    {
      name: "audience",
      type: "select",
      defaultValue: "primary",
      admin: {
        position: "sidebar",
        description:
          "Who this page is primarily addressing. Used for filtering / future audience targeting.",
      },
      options: [
        { label: "Primary (general CRE owners)", value: "primary" },
        { label: "LPs & Financiers", value: "lps" },
        { label: "Property Managers", value: "pms" },
        { label: "Tenants", value: "tenants" },
      ],
    },
    {
      name: "layout",
      type: "blocks",
      blocks: [
        Hero,
        TwoColumn,
        ProblemBlock,
        PullQuote,
        BotCallout,
        BrainBlock,
        FivePlan,
        FiveStandard,
        CardGrid,
        AvoidFailure,
        StarterKit,
        PortfolioGrid,
        CallToAction,
        RichContent,
        FAQ,
      ],
    },
  ],
};
