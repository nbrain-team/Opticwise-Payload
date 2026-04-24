import type { Block } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'

export const RichContent: Block = {
  slug: 'richContent',
  labels: {
    singular: 'Rich Content',
    plural: 'Rich Content Blocks',
  },
  fields: [
    {
      name: 'eyebrow',
      type: 'text',
    },
    {
      name: 'heading',
      type: 'text',
    },
    {
      name: 'content',
      type: 'richText',
      editor: lexicalEditor(),
      required: true,
    },
    {
      name: 'style',
      type: 'select',
      defaultValue: 'light',
      options: [
        { label: 'Light', value: 'light' },
        { label: 'Near-white', value: 'nearwhite' },
        { label: 'Dark', value: 'dark' },
      ],
    },
  ],
}
