import path from "path";
import { fileURLToPath } from "url";
import { buildConfig } from "payload";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { seoPlugin } from "@payloadcms/plugin-seo";
import { vercelBlobStorage } from "@payloadcms/storage-vercel-blob";
import sharp from "sharp";

import { Pages } from "./collections/Pages";
import { Posts } from "./collections/Posts";
import { Media } from "./collections/Media";
import { Categories } from "./collections/Categories";
import { Users } from "./collections/Users";
import { SiteSettings } from "./globals/SiteSettings";
import { Navigation } from "./globals/Navigation";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

const FALLBACK_SERVER_URL =
  process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000";

/**
 * Build the live-preview URL on the same origin as the admin request,
 * so the iframe and the parent admin window share an origin and the
 * useLivePreview postMessage origin check passes. Falls back to
 * NEXT_PUBLIC_SERVER_URL when no request is available (preview links
 * generated outside an HTTP context).
 */
function buildPreviewBase(req: any): string {
  const host =
    req?.host ||
    req?.headers?.get?.("host") ||
    req?.headers?.host ||
    null;
  if (host) {
    const protocol =
      req?.protocol?.replace(/:$/, "") ||
      (host.includes("localhost") || host.startsWith("127.")
        ? "http"
        : "https");
    return `${protocol}://${host}`;
  }
  return FALLBACK_SERVER_URL;
}

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      titleSuffix: " — OpticWise Studio",
      description:
        "OpticWise Content Studio — Pages, Posts, and the OpticWise Brain.",
    },
    components: {
      graphics: {
        Logo: "/admin/Logo#Logo",
        Icon: "/admin/Icon#Icon",
      },
      beforeDashboard: ["/admin/BeforeDashboard#BeforeDashboard"],
    },
    livePreview: {
      url: ({ data, collectionConfig, req }: any) => {
        const base = buildPreviewBase(req);
        if (collectionConfig?.slug === "posts") {
          return `${base}/insights/${(data?.slug as string) || ""}`;
        }
        if (data?.isHomePage) return base;
        return `${base}/${(data?.slug as string) || ""}`;
      },
      collections: ["pages", "posts"],
      breakpoints: [
        { label: "Mobile", name: "mobile", width: 375, height: 667 },
        { label: "Tablet", name: "tablet", width: 768, height: 1024 },
        { label: "Desktop", name: "desktop", width: 1440, height: 900 },
      ],
    },
  },
  collections: [Pages, Posts, Media, Categories, Users],
  globals: [SiteSettings, Navigation],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || "CHANGE-ME-PLEASE",
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || "",
    },
    push: true,
  }),
  sharp,
  plugins: [
    seoPlugin({
      collections: ["pages", "posts"],
      uploadsCollection: "media",
      generateTitle: ({ doc }: any) => `${doc?.title || "OpticWise"} | OpticWise`,
      generateDescription: ({ doc }: any) => doc?.excerpt || "",
    }),
    vercelBlobStorage({
      enabled: !!process.env.BLOB_READ_WRITE_TOKEN,
      collections: {
        media: true,
      },
      token: process.env.BLOB_READ_WRITE_TOKEN || "",
    }),
  ],
});
