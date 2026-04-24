import type { Block } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'

export const TwoColumn: Block = {
  slug: 'twoColumn',
  labels: {
    singular: 'Two Column (Text)',
    plural: 'Two Column Blocks',
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
      name: 'body',
      type: 'richText',
      editor: lexicalEditor(),
    },
    {
      name: 'authorityNote',
      type: 'textarea',
      admin: {
        description: 'Optional italic authority/credential line at the bottom.',
      },
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
  ],
}
