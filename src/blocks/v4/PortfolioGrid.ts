import type { Block } from 'payload'

export const PortfolioGrid: Block = {
  slug: 'portfolioGrid',
  labels: {
    singular: 'Portfolio Grid',
    plural: 'Portfolio Grids',
  },
  fields: [
    {
      name: 'eyebrow',
      type: 'text',
      defaultValue: 'Portfolio',
    },
    {
      name: 'heading',
      type: 'text',
      required: true,
      defaultValue: 'Infrastructure We\'ve Built',
    },
    {
      name: 'projects',
      type: 'array',
      minRows: 1,
      labels: { singular: 'Project', plural: 'Projects' },
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'location', type: 'text', required: true },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'caption',
          type: 'textarea',
          required: true,
          admin: {
            description: 'Pattern caption describing what OpticWise did. Do NOT invent metrics.',
          },
        },
      ],
    },
  ],
}
