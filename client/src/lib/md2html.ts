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

export interface Frontmatter {
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

const splitIntoSections: Plugin = () => {
  return (_tree) => {
    const tree = _tree as Element
    const children = tree.children as Element[]
    const chunks: Element[] = []

    while (children.length) {
      const current = children.shift()!
      if (current.tagName === 'h2') {
        chunks.push({
          type: 'element',
          tagName: 'div',
          children: [],
          properties: {
            id: 'section',
          },
        })
      }

      const last = chunks.at(-1)
      if (last?.properties.id === 'section') {
        last.children.push(current)
      }
      else {
        chunks.push(current)
      }
    }

    tree.children = chunks
  }
}

/**
 * Wrap td content with span tag
 */
const ProcessTdTag: Plugin = () => {
  return (tree) => {
    visit(tree, 'element', (node: Element) => {
      if (!node.children)
        return

      if (node.tagName === 'td') {
        node.children = [{
          type: 'element',
          tagName: 'span',
          properties: {},
          children: node.children,
          position: node.position,
        }]
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
    .use(ProcessTdTag)
    .use(addPositionAttribute)
    .use(splitIntoSections)
    .use(rehypeStringify)
    .process(markdown)
    .then(file => ({
      frontmatter: file.data.matter as Frontmatter,
      html: String(file),
    }))
}
