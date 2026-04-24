/**
 * Minimal Lexical -> HTML renderer for server-side rendering of rich text.
 * Handles headings, paragraphs, lists, bold, italic, and links.
 */

type LexicalNode = {
  type?: string
  tag?: string
  format?: number | string
  text?: string
  children?: LexicalNode[]
  fields?: any
  listType?: string
  url?: string
}

const FORMAT_BOLD = 1
const FORMAT_ITALIC = 2
const FORMAT_UNDERLINE = 8

function renderText(node: LexicalNode): string {
  let text = escapeHtml(node.text || '')
  const format = typeof node.format === 'number' ? node.format : 0
  if (format & FORMAT_BOLD) text = `<strong>${text}</strong>`
  if (format & FORMAT_ITALIC) text = `<em>${text}</em>`
  if (format & FORMAT_UNDERLINE) text = `<u>${text}</u>`
  return text
}

function renderChildren(children: LexicalNode[] | undefined): string {
  if (!children) return ''
  return children.map(renderNode).join('')
}

function renderNode(node: LexicalNode): string {
  if (!node) return ''
  if (node.type === 'text') return renderText(node)

  switch (node.type) {
    case 'heading': {
      const tag = node.tag || 'h2'
      return `<${tag}>${renderChildren(node.children)}</${tag}>`
    }
    case 'paragraph':
      return `<p>${renderChildren(node.children)}</p>`
    case 'list': {
      const tag = node.listType === 'number' ? 'ol' : 'ul'
      return `<${tag}>${renderChildren(node.children)}</${tag}>`
    }
    case 'listitem':
      return `<li>${renderChildren(node.children)}</li>`
    case 'quote':
      return `<blockquote>${renderChildren(node.children)}</blockquote>`
    case 'link': {
      const url = node.fields?.url || node.url || '#'
      return `<a href="${escapeHtml(url)}">${renderChildren(node.children)}</a>`
    }
    case 'linebreak':
      return '<br />'
    default:
      return renderChildren(node.children)
  }
}

export function lexicalToHTML(content: any): string {
  if (!content) return ''
  if (typeof content === 'string') return content
  const root = content?.root || content
  if (!root?.children) return ''
  return renderChildren(root.children)
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}
