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

const SERVER_URL =
  process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000";

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
      url: ({ data, collectionConfig }) => {
        if (collectionConfig?.slug === "posts") {
          return `${SERVER_URL}/insights/${(data?.slug as string) || ""}`;
        }
        if (data?.isHomePage) return SERVER_URL;
        return `${SERVER_URL}/${(data?.slug as string) || ""}`;
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
