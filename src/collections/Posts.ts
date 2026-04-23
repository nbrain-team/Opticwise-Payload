import type { CollectionConfig } from "payload";
import { revalidatePost, revalidatePostDelete } from "../hooks/revalidate";

const SERVER_URL =
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
      url: ({ data }) =>
        `${SERVER_URL}/insights/${(data?.slug as string) || ""}`,
      breakpoints: [
        { label: "Mobile", name: "mobile", width: 375, height: 667 },
        { label: "Tablet", name: "tablet", width: 768, height: 1024 },
        { label: "Desktop", name: "desktop", width: 1440, height: 900 },
      ],
    },
    preview: (doc) =>
      `${SERVER_URL}/insights/${(doc?.slug as string) || ""}`,
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
  ],
};
