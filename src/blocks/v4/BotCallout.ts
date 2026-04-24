import type { Block } from 'payload'

export const BotCallout: Block = {
  slug: 'botCallout',
  labels: {
    singular: 'BoT® Callout (Layer 1)',
    plural: 'BoT® Callouts',
  },
  fields: [
    {
      name: 'layerLabel',
      type: 'text',
      defaultValue: 'Layer 1',
    },
    {
      name: 'eyebrow',
      type: 'text',
      defaultValue: 'The Foundation You Own',
    },
    {
      name: 'heading',
      type: 'text',
      required: true,
      defaultValue: 'Managed Data & Digital Infrastructure',
    },
    {
      name: 'botDescription',
      type: 'textarea',
      admin: {
        description: 'BoT® explanation in the callout box.',
      },
    },
    {
      name: 'pillars',
      type: 'array',
      minRows: 1,
      maxRows: 4,
      labels: {
        singular: 'Pillar',
        plural: 'Pillars',
      },
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'textarea', required: true },
      ],
    },
    {
      name: 'closingLine',
      type: 'text',
      admin: {
        description: 'Italic closing line.',
      },
    },
  ],
}
