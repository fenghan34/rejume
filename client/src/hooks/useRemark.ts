import type { Frontmatter } from '@/lib/md2html'
import { parseMarkdown } from '@/lib/md2html'
import { useEffect, useState } from 'react'

export function useRemark(markdown: string) {
  const [data, setData] = useState<{
    html: string
    frontmatter?: Frontmatter
  }>({ html: '' })

  useEffect(() => {
    ;(async function () {
      if (!markdown)
        return
      const data = await parseMarkdown(markdown)
      setData(data)
    })()
  }, [markdown])

  return data
}
