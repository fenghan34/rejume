import type { Element } from 'hast'
import type { Plugin } from 'unified'
import rehypeStringify from 'rehype-stringify'
import remarkFrontmatter from 'remark-frontmatter'
import rehypeRaw from 'rehype-raw'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize'
import rehypeExternalLinks from 'rehype-external-links'
import { unified } from 'unified'
import { visit } from 'unist-util-visit'
import { matter } from 'vfile-matter'

export interface Frontmatter { }

export const POSITION_ATTRIBUTE = 'data-source-pos'

const extractFrontmatter: Plugin = () => {
  return (_, file) => {
    matter(file)
  }
}

const splitIntoSections: Plugin = () => {
  return (_tree) => {
    const tree = _tree as Element
    const children = tree.children as Element[]
    const chunks: Element[] = []

    while (children.length) {
      const current = children.shift()!
      if (current.tagName === 'h2' || current.tagName === 'h1') {
        chunks.push({
          type: 'element',
          tagName: 'section',
          children: [],
          properties: {},
        })
      }

      const last = chunks.at(-1)
      if (last?.tagName === 'section') {
        last.children.push(current)
      } else {
        chunks.push(current)
      }
    }

    tree.children = chunks
  }
}

/**
 * Set the position data (line, column) of each node as an HTML attribute
 */
const addPositionAttribute: Plugin = () => {
  return (tree) => {
    visit(tree, 'element', (node: Element) => {
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
    .use(extractFrontmatter)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(addPositionAttribute)
    .use(splitIntoSections)
    .use(rehypeSanitize, {
      ...defaultSchema,
      attributes: {
        ...defaultSchema.attributes,
        '*': [
          ...defaultSchema.attributes!['*'],
          'className',
          'style',
          POSITION_ATTRIBUTE
        ],
      },
      protocols: {
        cite: ['http', 'https', 'tel', 'mailto']
      },
    })
    .use(rehypeExternalLinks, {
      rel: ['noopener', 'noreferrer'],
      target: '_blank',
      protocols: ['http', 'https', 'tel', 'mailto']
    })
    .use(rehypeStringify)
    .process(markdown)
    .then(file => ({
      frontmatter: file.data.matter as Frontmatter,
      html: String(file),
    }))
}
