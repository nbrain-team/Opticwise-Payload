import type { CollectionConfig } from "payload";
import { revalidatePost, revalidatePostDelete } from "../hooks/revalidate";

const FALLBACK_SERVER_URL =
  process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000";

export const Posts: CollectionConfig = {
  slug: "posts",
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "category", "_status", "publishedAt"],
    description: "Blog / Insights articles.",
    livePreview: {
      url: ({ data }: any) =>
        `/insights/${(data?.slug as string) || ""}`,
      breakpoints: [
        { label: "Mobile", name: "mobile", width: 375, height: 667 },
        { label: "Tablet", name: "tablet", width: 768, height: 1024 },
        { label: "Desktop", name: "desktop", width: 1440, height: 900 },
      ],
    },
    preview: (doc) =>
      `${FALLBACK_SERVER_URL}/insights/${(doc?.slug as string) || ""}`,
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
    afterChange: [revalidatePost],
    afterDelete: [revalidatePostDelete],
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
      },
    },
    {
      name: "excerpt",
      type: "textarea",
      admin: {
        description: "Short summary for cards and meta descriptions.",
      },
    },
    {
      name: "featureImage",
      type: "upload",
      relationTo: "media",
      admin: {
        position: "sidebar",
      },
    },
    {
      name: "category",
      type: "relationship",
      relationTo: "categories",
      hasMany: false,
      admin: {
        position: "sidebar",
      },
    },
    {
      name: "tags",
      type: "relationship",
      relationTo: "categories",
      hasMany: true,
      admin: {
        position: "sidebar",
        description: "Additional category tags for filtering.",
      },
    },
    {
      name: "content",
      type: "richText",
    },
    {
      name: "htmlContent",
      type: "textarea",
      admin: {
        description: "Legacy HTML content imported from Ghost. Used as fallback when rich text is empty.",
      },
    },
    {
      name: "publishedAt",
      type: "date",
      admin: {
        position: "sidebar",
        date: {
          pickerAppearance: "dayAndTime",
        },
      },
    },
    {
      name: "readingTime",
      type: "number",
      admin: {
        position: "sidebar",
        description: "Estimated reading time in minutes.",
      },
    },
    {
      name: "meta",
      type: "group",
      label: "SEO",
      admin: { position: "sidebar" },
      fields: [
        {
          name: "title",
          type: "text",
          admin: { description: "Meta title (50–60 chars). Falls back to post title if empty." },
        },
        {
          name: "description",
          type: "textarea",
          admin: { description: "Meta description (150–160 chars). Falls back to excerpt if empty." },
        },
        {
          name: "ogImage",
          type: "upload",
          relationTo: "media",
          admin: { description: "Social share image (1200×630). Falls back to feature image, then default OG image." },
        },
        {
          name: "noIndex",
          type: "checkbox",
          admin: { description: "Hide this post from search engines." },
        },
      ],
    },
  ],
};
