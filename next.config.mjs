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
      {
        source: "/brains",
        destination: "/property-brain",
        permanent: true,
      },
      {
        source: "/brains/",
        destination: "/property-brain",
        permanent: true,
      },
    ];
  },
};

export default withPayload(nextConfig);
