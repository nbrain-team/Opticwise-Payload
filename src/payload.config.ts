import path from "path";
import { fileURLToPath } from "url";

import { buildConfig } from "payload";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { vercelBlobStorage } from "@payloadcms/storage-vercel-blob";
import sharp from "sharp";

import { Pages } from "./collections/Pages";
import { Posts } from "./collections/Posts";
import { Media } from "./collections/Media";
import { Categories } from "./collections/Categories";
import { Authors } from "./collections/Authors";
import { Users } from "./collections/Users";
import { SiteSettings } from "./globals/SiteSettings";
import { Navigation } from "./globals/Navigation";
import { Footer } from "./globals/Footer";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

const serverURL =
  process.env.NEXT_PUBLIC_SERVER_URL?.replace(/\/$/, "") ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "") ||
  "http://localhost:3000";

const vercelOrigin = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "";

/** Extra admin origins allowed for JWT cookie extraction (comma-separated full origins, no trailing slashes). */
const csrfExtra = (process.env.PAYLOAD_CSRF_ORIGINS ?? "")
  .split(",")
  .map((o) => o.trim().replace(/\/$/, ""))
  .filter(Boolean);

const csrfAllowed = [
  ...new Set([serverURL, vercelOrigin, ...csrfExtra].filter(Boolean)),
];

/**
 * Live-preview URLs are returned as RELATIVE paths.
 * Payload's `formatAbsoluteURL` resolves them against
 * `window.location.origin` on the client, which guarantees
 * the iframe always loads from the same origin as the admin
 * panel. This sidesteps NEXT_PUBLIC_SERVER_URL drift between
 * the production alias and per-deployment Vercel URLs, and
 * keeps the postMessage origin check passing.
 */

export default buildConfig({
  serverURL,
  csrf: csrfAllowed,
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
          return `/insights/${String(data?.slug || "")}`;
        }
        if (data?.isHomePage) return "/";
        return `/${String(data?.slug || "")}`;
      },
      collections: ["pages", "posts"],
      breakpoints: [
        { label: "Mobile", name: "mobile", width: 375, height: 667 },
        { label: "Tablet", name: "tablet", width: 768, height: 1024 },
        { label: "Desktop", name: "desktop", width: 1440, height: 900 },
      ],
    },
  },
  collections: [Pages, Posts, Media, Categories, Authors, Users],
  globals: [SiteSettings, Navigation, Footer],
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
    vercelBlobStorage({
      enabled: !!process.env.BLOB_READ_WRITE_TOKEN,
      collections: {
        media: true,
      },
      token: process.env.BLOB_READ_WRITE_TOKEN || "",
    }),
  ],
});
