import type { Root } from 'hast'
import type { IRange } from 'monaco-editor'
import rehypeExternalLinks from 'rehype-external-links'
import rehypeRaw from 'rehype-raw'
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize'
import rehypeStringify from 'rehype-stringify'
import remarkFrontmatter from 'remark-frontmatter'
import remarkGfm from 'remark-gfm'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import { unified } from 'unified'
import { visit } from 'unist-util-visit'

const POSITION_ATTRIBUTE = 'data-source-pos'

export function parsePositionAttribute(element: Element): IRange | undefined {
  const position = element.getAttribute(POSITION_ATTRIBUTE)
  if (!position) return

  const [start, end] = position.split('-')
  const [startLine, startColumn] = start.split(':').map(Number)
  const [endLine, endColumn] = end.split(':').map(Number)

  return {
    startLineNumber: startLine,
    startColumn,
    endLineNumber: endLine,
    endColumn,
  }
}

/**
 * Set the position data (line, column) of each node as an HTML attribute
 */
function rehypeElementPosition() {
  return (tree: Root) => {
    visit(tree, 'element', (node) => {
      if (node.position) {
        const { start, end } = node.position
        const value = `${start.line}:${start.column}-${end.line}:${end.column}`
        node.properties = {
          ...node.properties,
          [POSITION_ATTRIBUTE]: value,
        }
      }
    })
  }
}

function rehypeHeading3() {
  return (tree: Root) => {
    visit(tree, 'element', (node) => {
      if (node.tagName === 'h3') {
        if (
          node.children.length === 1 &&
          node.children[0].type === 'text' &&
          node.children[0].value.includes('|')
        ) {
          const [name, position, date] = node.children[0].value.split('|')
          node.children = [
            {
              type: 'element',
              tagName: 'strong',
              children: [{ type: 'text', value: name }],
              properties: {},
            },
            {
              type: 'element',
              tagName: 'span',
              children: [{ type: 'text', value: position }],
              properties: {},
            },
            {
              type: 'element',
              tagName: 'span',
              children: [{ type: 'text', value: date }],
              properties: {},
            },
          ]
        }
      }
    })
  }
}

export async function parseMarkdown(markdown: string) {
  return await unified()
    .use(remarkParse)
    .use(remarkFrontmatter)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeElementPosition)
    .use(rehypeHeading3)
    .use(rehypeSanitize, {
      ...defaultSchema,
      attributes: {
        ...defaultSchema.attributes,
        '*': [
          ...defaultSchema.attributes!['*'],
          'className',
          'style',
          POSITION_ATTRIBUTE,
        ],
      },
      protocols: {
        cite: ['http', 'https', 'tel', 'mailto'],
      },
    })
    .use(rehypeExternalLinks, {
      rel: ['noopener', 'noreferrer'],
      target: '_blank',
      protocols: ['http', 'https', 'tel', 'mailto'],
    })
    .use(rehypeStringify)
    .process(markdown)
    .then((file) => String(file))
}
