import type { Block } from 'payload'

export const AvoidFailure: Block = {
  slug: 'avoidFailure',
  labels: {
    singular: 'Avoid Failure',
    plural: 'Avoid Failure Blocks',
  },
  fields: [
    {
      name: 'eyebrow',
      type: 'text',
      defaultValue: 'The Cost of Inaction',
    },
    {
      name: 'heading',
      type: 'text',
      required: true,
    },
    {
      name: 'lede',
      type: 'textarea',
    },
    {
      name: 'consequences',
      type: 'array',
      minRows: 3,
      labels: { singular: 'Consequence', plural: 'Consequences' },
      fields: [
        { name: 'text', type: 'text', required: true },
      ],
    },
    {
      name: 'punchLine',
      type: 'text',
      admin: { description: 'Italic line below the list, e.g. "Governance debt comes due with interest."' },
    },
  ],
}
