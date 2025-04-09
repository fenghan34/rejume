import { useEffect, useState } from 'react'
import { parseMarkdown } from '@/lib/md2html'

export function useRemark(markdown: string) {
  const [html, setHtml] = useState('')

  useEffect(() => {
    ;(async function () {
      if (!markdown) {
        setHtml('')
        return
      }

      const data = await parseMarkdown(markdown)
      setHtml(data)
    })()
  }, [markdown])

  return html
}
