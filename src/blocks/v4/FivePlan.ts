import type { Block } from 'payload'

export const FivePlan: Block = {
  slug: 'fivePlan',
  labels: {
    singular: 'PPP 5C™ Plan',
    plural: 'PPP 5C™ Plans',
  },
  fields: [
    {
      name: 'eyebrow',
      type: 'text',
      defaultValue: 'The Plan',
    },
    {
      name: 'heading',
      type: 'text',
      required: true,
      defaultValue: 'Peak Property Performance® — The 5C™ Plan',
    },
    {
      name: 'lede',
      type: 'textarea',
    },
    {
      name: 'steps',
      type: 'array',
      minRows: 5,
      maxRows: 5,
      labels: { singular: 'Step', plural: 'Steps' },
      fields: [
        { name: 'letter', type: 'text', required: true, admin: { description: 'e.g. "01" or "Clarify"' } },
        { name: 'title', type: 'text', required: true },
        { name: 'tag', type: 'text', admin: { description: 'e.g. "PPP Audit™" or "Property Brain™"' } },
        { name: 'description', type: 'textarea', required: true },
      ],
    },
    {
      name: 'punchLine',
      type: 'text',
      defaultValue: 'Start with Clarify. Scale with control.',
    },
  ],
}
