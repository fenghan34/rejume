import type { Element } from 'hast'
import type { Plugin } from 'unified'
import rehypeStringify from 'rehype-stringify'
import remarkFrontmatter from 'remark-frontmatter'
import remarkGfm from 'remark-gfm'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import { unified } from 'unified'
import { visit } from 'unist-util-visit'
import { matter } from 'vfile-matter'

export interface FrontMatter {
  name: string
  title: string
  email: string
  phone: string
  github: string
}

export const POSITION_ATTRIBUTE = 'data-source-pos'

const extractFrontmatter: Plugin = () => {
  return (_, file) => {
    matter(file)
  }
}

/**
 * Wrap all text nodes in a <span> tag when they have <strong> tag siblings
 */
const wrapTextWithSpan: Plugin = () => {
  return (tree) => {
    visit(tree, 'element', (node: Element) => {
      if (!node.children)
        return

      const hasStrongSibling = node.children.some(
        child => child.type === 'element' && child.tagName === 'strong',
      )

      if (hasStrongSibling) {
        node.children = node.children.map((child) => {
          if (child.type === 'text') {
            return {
              type: 'element',
              tagName: 'span',
              properties: {},
              children: [child],
              position: child.position,
            }
          }
          return child
        })
      }
    })
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
        node.properties = {
          ...node.properties,
          [POSITION_ATTRIBUTE]: `${start.line}:${start.column}-${end.line}:${end.column}`,
        }
      }
    })
  }
}

export async function parseMarkdown(markdown: string) {
  return await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkFrontmatter)
    .use(extractFrontmatter)
    .use(remarkRehype)
    .use(wrapTextWithSpan)
    .use(addPositionAttribute)
    .use(rehypeStringify)
    .process(markdown)
    .then((file) => {
      return {
        meta: file.data.matter as FrontMatter,
        html: String(file),
      }
    })
}
