import rehypeStringify from 'rehype-stringify'
import remarkFrontmatter from 'remark-frontmatter'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import { Plugin, unified } from 'unified'
import { matter } from 'vfile-matter'

export type FrontMatter = {
  name: string
  title: string
  email: string
  phone: string
  github: string
}

const extractFrontmatter: Plugin = () => {
  return (_, file) => {
    matter(file)
  }
}

export const parseMarkdown = async (markdown: string) => {
  return await unified()
    .use(remarkParse)
    .use(remarkFrontmatter)
    .use(extractFrontmatter)
    .use(remarkRehype)
    .use(rehypeStringify)
    .process(markdown)
    .then((file) => {
      return {
        meta: file.data.matter as FrontMatter,
        html: String(file),
      }
    })
}
