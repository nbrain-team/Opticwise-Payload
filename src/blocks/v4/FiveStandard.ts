import type { Block } from 'payload'

export const FiveStandard: Block = {
  slug: 'fiveStandard',
  labels: {
    singular: '5S® Standard',
    plural: '5S® Standards',
  },
  fields: [
    {
      name: 'eyebrow',
      type: 'text',
      defaultValue: 'The User Experience Standard',
    },
    {
      name: 'heading',
      type: 'text',
      required: true,
      defaultValue: '5S® — Non-Negotiable',
    },
    {
      name: 'tagline',
      type: 'textarea',
    },
    {
      name: 'standards',
      type: 'array',
      minRows: 5,
      maxRows: 5,
      labels: { singular: 'Standard', plural: 'Standards' },
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'text', required: true },
      ],
    },
  ],
}
