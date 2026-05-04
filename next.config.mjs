import { withPayload } from "@payloadcms/next/withPayload";

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.ghost.io" },
      { protocol: "https", hostname: "**.onrender.com" },
    ],
  },
  async redirects() {
    return [
      // /brains -> /property-brain (slug rename for SEO clarity).
      // Two entries to catch both with and without trailing slash;
      // existing inbound links (PPP book, partner sites, 25+ blog
      // posts) use both forms.
      //
      // Using statusCode: 301 (not `permanent: true`) because Next.js
      // maps `permanent: true` to 308. Bill's spec asked specifically
      // for 301 Moved Permanently, which is the status search engines
      // and legacy crawlers most consistently honor for indexed URLs.
      {
        source: "/brains",
        destination: "/property-brain",
        statusCode: 301,
      },
      {
        source: "/brains/",
        destination: "/property-brain",
        statusCode: 301,
      },
    ];
  },
};

export default withPayload(nextConfig);
