import type { Block } from "payload";

/**
 * FormEmbed block.
 *
 * Drops a form into any page, schema-driven from the OpticWise CRM
 * (ownet.opticwise.com). Editors only need to set the `formSlug`; everything
 * else (fields, validation, success message, honeypot) is owned by the CRM
 * and rendered live by `RemoteFormRenderer` on the frontend.
 *
 * Submissions land in the CRM at:
 *   POST /api/public/forms/<formSlug>/submit
 */
export const FormEmbed: Block = {
  slug: "formEmbed",
  labels: {
    singular: "Form Embed",
    plural: "Form Embeds",
  },
  fields: [
    {
      name: "formSlug",
      type: "text",
      required: true,
      defaultValue: "schedule-review",
      admin: {
        description:
          'Slug of the form on ownet.opticwise.com (e.g. "schedule-review"). The form fields and submit handling are owned by the CRM — this block just renders whatever the CRM serves.',
      },
    },
    {
      name: "eyebrow",
      type: "text",
      admin: {
        description: "Optional small label above the heading.",
      },
    },
    {
      name: "heading",
      type: "text",
      admin: {
        description:
          "Optional heading shown above the form. Leave blank to render the form alone.",
      },
    },
    {
      name: "description",
      type: "textarea",
      admin: {
        description: "Optional intro copy shown beneath the heading.",
      },
    },
    {
      name: "style",
      type: "select",
      defaultValue: "light",
      options: [
        { label: "Light (white card on neutral background)", value: "light" },
        { label: "Dark (white card on dark background)", value: "dark" },
        { label: "Plain (no card, fits inside other sections)", value: "plain" },
      ],
    },
  ],
};
