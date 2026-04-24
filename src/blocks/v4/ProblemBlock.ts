import type { Block } from 'payload'

export const ProblemBlock: Block = {
  slug: 'problemBlock',
  labels: {
    singular: 'Problem Block (Two-Col + List)',
    plural: 'Problem Blocks',
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
      name: 'intro',
      type: 'textarea',
    },
    {
      name: 'items',
      type: 'array',
      minRows: 1,
      labels: {
        singular: 'Item',
        plural: 'Items',
      },
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
          admin: {
            description: 'Short label, e.g. "Networks"',
          },
        },
        {
          name: 'description',
          type: 'text',
          required: true,
          admin: {
            description: 'Short description, e.g. "Installed under vendor contracts"',
          },
        },
      ],
    },
    {
      name: 'closingLine',
      type: 'textarea',
      admin: {
        description: 'Italic line below the list.',
      },
    },
  ],
}
