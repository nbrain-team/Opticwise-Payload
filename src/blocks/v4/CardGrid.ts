import type { Block } from 'payload'

export const CardGrid: Block = {
  slug: 'cardGrid',
  labels: {
    singular: 'Card Grid',
    plural: 'Card Grids',
  },
  fields: [
    {
      name: 'eyebrow',
      type: 'text',
    },
    {
      name: 'heading',
      type: 'text',
      required: true,
    },
    {
      name: 'subheading',
      type: 'textarea',
    },
    {
      name: 'columns',
      type: 'select',
      defaultValue: '2',
      options: [
        { label: '2 Columns', value: '2' },
        { label: '3 Columns', value: '3' },
        { label: '4 Columns', value: '4' },
      ],
    },
    {
      name: 'style',
      type: 'select',
      defaultValue: 'light',
      options: [
        { label: 'Light background', value: 'light' },
        { label: 'Near-white background', value: 'nearwhite' },
        { label: 'Dark background', value: 'dark' },
      ],
    },
    {
      name: 'cards',
      type: 'array',
      minRows: 2,
      labels: { singular: 'Card', plural: 'Cards' },
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'textarea', required: true },
        {
          name: 'href',
          type: 'text',
          admin: { description: 'Optional link URL.' },
        },
      ],
    },
    {
      name: 'closingLine',
      type: 'textarea',
      admin: { description: 'Optional italic line below the grid.' },
    },
  ],
}
