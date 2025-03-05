import { FrontMatter, parseMarkdown } from '@/lib/md2html'
import { useEffect, useState } from 'react'

export const useRemark = (markdown: string) => {
  const [data, setData] = useState<{
    html: string
    meta: FrontMatter
  }>()

  useEffect(() => {
    ;(async function () {
      if (!markdown) return
      const result = await parseMarkdown(markdown)
      setData(result)
    })()
  }, [markdown])

  return data
}
