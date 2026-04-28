import type { GlobalConfig } from "payload";
import { stripArrayIdsBeforeChange } from "../hooks/stripArrayIds";

export const Navigation: GlobalConfig = {
  slug: "navigation",
  label: "Navigation",
  admin: {
    description: "Site header navigation.",
  },
  hooks: {
    beforeChange: [stripArrayIdsBeforeChange],
  },
  fields: [
    {
      name: "items",
      type: "array",
      labels: { singular: "Nav Item", plural: "Nav Items" },
      fields: [
        { name: "label", type: "text", required: true },
        { name: "href", type: "text" },
        {
          name: "style",
          type: "select",
          defaultValue: "link",
          options: [
            { label: "Link", value: "link" },
            { label: "Button (primary)", value: "button" },
            { label: "Dropdown", value: "dropdown" },
          ],
        },
        {
          name: "children",
          type: "array",
          labels: { singular: "Child Link", plural: "Child Links" },
          admin: {
            condition: (_, siblingData) => siblingData?.style === "dropdown",
            description: "Only used when style is set to Dropdown.",
          },
          fields: [
            { name: "label", type: "text", required: true },
            { name: "href", type: "text", required: true },
          ],
        },
      ],
    },
  ],
};
