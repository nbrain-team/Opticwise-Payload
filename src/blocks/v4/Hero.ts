import type { Block } from 'payload'

export const Hero: Block = {
  slug: 'hero',
  labels: {
    singular: 'Hero',
    plural: 'Heroes',
  },
  fields: [
    {
      name: 'eyebrow',
      type: 'text',
      admin: {
        description: 'Small label above the headline, e.g. "Property Intelligence → Portfolio Intelligence"',
      },
    },
    {
      name: 'heading',
      type: 'text',
      required: true,
    },
    {
      name: 'lede',
      type: 'textarea',
      admin: {
        description: 'Large supporting paragraph under the headline.',
      },
    },
    {
      name: 'reframeLine',
      type: 'text',
      admin: {
        description: 'Italic reframing quote, e.g. "If you don\'t own your data & digital infrastructure, your vendors do."',
      },
    },
    {
      name: 'audienceLine',
      type: 'textarea',
      admin: {
        description: 'Who this page is for. Shows below the reframe line.',
      },
    },
    {
      name: 'primaryCtaLabel',
      type: 'text',
      defaultValue: 'Schedule Your Review',
    },
    {
      name: 'secondaryCtaLabel',
      type: 'text',
    },
    {
      name: 'secondaryCtaHref',
      type: 'text',
      admin: {
        description: 'Relative path like /pillars or full URL.',
      },
    },
    {
      name: 'style',
      type: 'select',
      defaultValue: 'dark',
      options: [
        { label: 'Dark (default)', value: 'dark' },
        { label: 'Light', value: 'light' },
        { label: 'Ultra Dark (charcoal)', value: 'ultradark' },
      ],
    },
  ],
}
