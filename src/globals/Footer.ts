import type { GlobalConfig } from "payload";

export const Footer: GlobalConfig = {
  slug: "footer",
  access: {
    read: () => true,
  },
  fields: [
    {
      name: "columns",
      type: "array",
      maxRows: 4,
      labels: { singular: "Column", plural: "Columns" },
      fields: [
        { name: "heading", type: "text", required: true },
        {
          name: "links",
          type: "array",
          fields: [
            { name: "label", type: "text", required: true },
            { name: "href", type: "text", required: true },
          ],
        },
      ],
    },
  ],
};
