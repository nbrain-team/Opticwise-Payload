import type { Block } from 'payload'

export const StarterKit: Block = {
  slug: 'starterKit',
  labels: {
    singular: 'Starter Kit (Lead Magnet)',
    plural: 'Starter Kits',
  },
  fields: [
    {
      name: 'eyebrow',
      type: 'text',
      defaultValue: 'Free Download',
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
      name: 'bulletPoints',
      type: 'array',
      minRows: 2,
      labels: { singular: 'Bullet', plural: 'Bullets' },
      fields: [
        { name: 'text', type: 'text', required: true },
      ],
    },
    {
      name: 'bookImage',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Optional book cover image.',
      },
    },
    {
      name: 'bookLabel',
      type: 'text',
      defaultValue: 'Fast Company Press',
    },
    {
      name: 'buttonLabel',
      type: 'text',
      defaultValue: 'Get the PPP Starter Kit',
    },
  ],
}
