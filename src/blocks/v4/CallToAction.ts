import type { Block } from 'payload'

export const CallToAction: Block = {
  slug: 'callToAction',
  labels: {
    singular: 'Call to Action',
    plural: 'Calls to Action',
  },
  fields: [
    {
      name: 'eyebrow',
      type: 'text',
      defaultValue: 'Your Next Step',
    },
    {
      name: 'heading',
      type: 'text',
      required: true,
      defaultValue: 'Complimentary CRE Data & Digital Review',
    },
    {
      name: 'subheading',
      type: 'textarea',
    },
    {
      name: 'bulletPoints',
      type: 'array',
      labels: { singular: 'Bullet', plural: 'Bullets' },
      fields: [
        { name: 'text', type: 'text', required: true },
      ],
    },
    {
      name: 'buttonLabel',
      type: 'text',
      defaultValue: 'Schedule Your Review',
    },
    {
      name: 'style',
      type: 'select',
      defaultValue: 'blue',
      options: [
        { label: 'Blue gradient (default)', value: 'blue' },
        { label: 'Charcoal', value: 'charcoal' },
        { label: 'Light', value: 'light' },
      ],
    },
  ],
}
