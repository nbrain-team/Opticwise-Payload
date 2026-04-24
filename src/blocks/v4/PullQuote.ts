import type { Block } from 'payload'

export const PullQuote: Block = {
  slug: 'pullQuote',
  labels: {
    singular: 'Pull Quote',
    plural: 'Pull Quotes',
  },
  fields: [
    {
      name: 'eyebrow',
      type: 'text',
      admin: { description: 'Small label above the quote, e.g. "The Skybox Principle"' },
    },
    {
      name: 'quote',
      type: 'textarea',
      required: true,
    },
    {
      name: 'attribution',
      type: 'text',
      admin: { description: 'Optional attribution line.' },
    },
    {
      name: 'style',
      type: 'select',
      defaultValue: 'dark',
      options: [
        { label: 'Dark (OW blue)', value: 'dark' },
        { label: 'Ultra Dark (charcoal)', value: 'ultradark' },
        { label: 'Light', value: 'light' },
      ],
    },
  ],
}
