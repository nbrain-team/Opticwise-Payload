import type { Block } from 'payload'

export const BrainBlock: Block = {
  slug: 'brainBlock',
  labels: {
    singular: 'Brain Block (Layer 2)',
    plural: 'Brain Blocks',
  },
  fields: [
    {
      name: 'layerLabel',
      type: 'text',
      defaultValue: 'Layer 2',
    },
    {
      name: 'eyebrow',
      type: 'text',
      defaultValue: 'Owner-Controlled Intelligence',
    },
    {
      name: 'heading',
      type: 'text',
      required: true,
      defaultValue: 'Property Brain™ → Portfolio Brain™',
    },
    {
      name: 'tagline',
      type: 'text',
      defaultValue: 'Vendor- and LLM-agnostic. Owner-controlled by design.',
    },
    {
      name: 'body',
      type: 'array',
      minRows: 1,
      labels: { singular: 'Paragraph', plural: 'Paragraphs' },
      fields: [
        { name: 'text', type: 'textarea', required: true },
      ],
    },
    {
      name: 'flowLine',
      type: 'text',
      defaultValue: 'One standard intelligence substrate → Many decision engines → Scaled across your portfolio.',
    },
  ],
}
