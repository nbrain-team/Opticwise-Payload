import type { GlobalConfig } from "payload";

export const SiteSettings: GlobalConfig = {
  slug: "site-settings",
  label: "Site Settings",
  admin: {
    description: "Global site configuration — branding, CTA defaults, footer text.",
  },
  fields: [
    {
      name: "siteName",
      type: "text",
      defaultValue: "OpticWise",
    },
    {
      name: "siteUrl",
      type: "text",
      defaultValue: "https://opticwise.com",
    },
    {
      name: "reframingLine",
      type: "text",
      defaultValue: "If you don't own your data & digital infrastructure, your vendors do.",
    },
    {
      name: "closingLine",
      type: "text",
      defaultValue: "Own your data & digital infrastructure. Operate with strategic foresight. Build for the long game.",
    },
    {
      name: "primaryCTA",
      type: "group",
      fields: [
        {
          name: "label",
          type: "text",
          defaultValue: "Complimentary CRE Data & Digital Review Session",
        },
        {
          name: "microcopy",
          type: "text",
          defaultValue: "One building. Map who owns what, where data lives, and where operational burden stacks up vs your KPIs.",
        },
        {
          name: "href",
          type: "text",
          defaultValue: "/ppp-audit/",
        },
      ],
    },
    {
      name: "logo",
      type: "upload",
      relationTo: "media",
    },
    {
      name: "footerDescription",
      type: "text",
      defaultValue: "Owner-controlled data & digital infrastructure for commercial real estate.",
    },
    {
      name: "insightsHeroEyebrow",
      type: "text",
      defaultValue: "The Owner's Library",
    },
    {
      name: "insightsHeroHeading",
      type: "text",
      defaultValue: "Insights",
    },
    {
      name: "insightsHeroLede",
      type: "textarea",
      defaultValue:
        "Owner plays on data & digital infrastructure, NOI drivers, vendor control, AI readiness, and the Peak Property Performance® operating system.",
    },
    {
      name: "insightsCtaHeading",
      type: "text",
      defaultValue: "Complimentary CRE Data & Digital Review Session",
    },
    {
      name: "insightsCtaSubheading",
      type: "textarea",
      defaultValue:
        "One building. Map who owns what, where data lives, and where operational burden stacks up vs your KPIs.",
    },
    {
      name: "defaultMetaTitle",
      type: "text",
      defaultValue:
        "OpticWise — Owner-Controlled Data & Digital Infrastructure for CRE",
      admin: {
        description: "Default meta title used when a page does not specify its own.",
      },
    },
    {
      name: "defaultMetaDescription",
      type: "textarea",
      defaultValue:
        "OpticWise helps CRE owners turn data & digital infrastructure into owner-controlled digital assets. Property Intelligence becomes Portfolio Intelligence. Founded 2004.",
      admin: { description: "Default meta description." },
    },
    {
      name: "defaultOgImage",
      type: "upload",
      relationTo: "media",
      admin: { description: "Default 1200×630 social share image." },
    },
    {
      name: "organizationDescription",
      type: "textarea",
      defaultValue:
        "OpticWise is the data & digital infrastructure partner for commercial real estate. Founded in 2004, OpticWise works with global owners operating commercial properties across the United States, delivering owner-controlled connectivity, governance, and intelligence under the Peak Property Performance® operating system.",
      admin: { description: "Used in JSON-LD Organization schema." },
    },
    {
      name: "organizationFoundingYear",
      type: "number",
      defaultValue: 2004,
    },
    {
      name: "organizationSameAs",
      type: "array",
      labels: { singular: "Profile URL", plural: "Profile URLs" },
      fields: [{ name: "url", type: "text", required: true }],
      admin: {
        description: "LinkedIn, X, etc. — used in Organization schema sameAs array.",
      },
    },
  ],
};
