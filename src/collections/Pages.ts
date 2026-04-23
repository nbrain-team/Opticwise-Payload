import type { CollectionConfig } from "payload";
import { HeroBlock } from "../blocks/Hero";
import { ContentBlock } from "../blocks/Content";
import { CardGridBlock } from "../blocks/CardGrid";
import { CTABlock } from "../blocks/CTA";
import { TwoLayerModelBlock } from "../blocks/TwoLayerModel";
import { LeadMagnetBlock } from "../blocks/LeadMagnet";
import { FAQBlock } from "../blocks/FAQ";
import { TimelineBlock } from "../blocks/Timeline";
import { DeliverablesBlock } from "../blocks/Deliverables";
import { revalidatePage, revalidatePageDelete } from "../hooks/revalidate";

const SERVER_URL =
  process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000";

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
      url: ({ data }) => {
        const slug = (data?.slug as string) || "";
        if (data?.isHomePage) return SERVER_URL;
        return `${SERVER_URL}/${slug}`;
      },
      breakpoints: [
        { label: "Mobile", name: "mobile", width: 375, height: 667 },
        { label: "Tablet", name: "tablet", width: 768, height: 1024 },
        { label: "Desktop", name: "desktop", width: 1440, height: 900 },
      ],
    },
    preview: (doc) => {
      const slug = (doc?.slug as string) || "";
      if (doc?.isHomePage) return SERVER_URL;
      return `${SERVER_URL}/${slug}`;
    },
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
      name: "layout",
      type: "blocks",
      blocks: [
        HeroBlock,
        ContentBlock,
        CardGridBlock,
        CTABlock,
        TwoLayerModelBlock,
        LeadMagnetBlock,
        FAQBlock,
        TimelineBlock,
        DeliverablesBlock,
      ],
    },
  ],
};
