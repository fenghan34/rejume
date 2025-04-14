import type { Element as HastElement, Root } from 'hast'
import type { IRange } from 'monaco-editor'
import rehypeExternalLinks from 'rehype-external-links'
import rehypeRaw from 'rehype-raw'
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize'
import rehypeStringify from 'rehype-stringify'
import remarkFrontmatter from 'remark-frontmatter'
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
 * Split HTML elements into sections
 */
function rehypeSectionSplit() {
  return (tree: Root) => {
    const newChildren: HastElement[] = []

    while (tree.children.length) {
      const current = tree.children.shift()!
      if (current.type !== 'element') continue

      if (['h1', 'h2'].includes(current.tagName)) {
        newChildren.push({
          type: 'element',
          tagName: 'section',
          children: [],
          properties: {},
        })
      }

      const last = newChildren.at(-1)
      if (last?.tagName === 'section') {
        last.children.push(current)
      } else {
        newChildren.push(current)
      }
    }

    tree.children = newChildren
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

export async function parseMarkdown(markdown: string) {
  return await unified()
    .use(remarkParse)
    .use(remarkFrontmatter)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeElementPosition)
    .use(rehypeSectionSplit)
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
