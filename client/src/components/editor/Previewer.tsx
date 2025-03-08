import type { FrontMatter } from '@/lib/md2html'
import type { IRange } from 'monaco-editor'
import { A4_HEIGHT, A4_WIDTH, PAGE_PADDING } from '@/consts'
import { useAutoPagination } from '@/hooks/useAutoPagination'
import { useAutoScale } from '@/hooks/useAutoScale'
import { useRemark } from '@/hooks/useRemark'
import { getSelectedElement, parsePositionAttribute } from '@/lib/utils'
import { useCallback } from 'react'

export interface PreviewerProps {
  markdown: string
  className?: string
  onSelectionChange?: (selectedElement: HTMLElement, range?: IRange) => void
}

export function Previewer({ markdown, onSelectionChange }: PreviewerProps) {
  const html = useRemark(markdown)
  const previewerRef = useAutoScale()
  const pages = useAutoPagination(html, { pageSize: { width: A4_WIDTH, height: A4_HEIGHT }, padding: { x: PAGE_PADDING, y: PAGE_PADDING } },
  )

  const mouseupHandler = useCallback(() => {
    const selectedElement = getSelectedElement()
    if (!selectedElement)
      return

    const range = parsePositionAttribute(selectedElement)
    onSelectionChange?.(selectedElement, range)
  }, [onSelectionChange])

  if (!pages)
    return null

  return (
    <div
      id="rejume-preview"
      style={{ width: A4_WIDTH, height: A4_HEIGHT }}
      onMouseUp={mouseupHandler}
      ref={previewerRef}
    >
      {pages.map(({ html, pageNumber, pageStyle }) => (
        <div
          id="rejume-preview-page"
          key={pageNumber}
          style={pageStyle}
          dangerouslySetInnerHTML={{ __html: html }}
        />
      ))}
    </div>
  )
}

export function Header({ meta }: { meta: FrontMatter }) {
  return (
    <div className="text-center">
      <h1 className="text-[2em] font-bold">{meta.name}</h1>
      <div>
        <span className="text-xl font-medium">{meta.title}</span>
      </div>
      <div>
        <span>{meta.email}</span>
        {' '}
        |
        <span>{meta.phone}</span>
        {' '}
        |
        {' '}
        <a href={meta.github} target="_blank">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            className="inline-block w-[1.1em] h-[1.1em] align-[-0.2em] mr-0.5"
          >
            <path
              fill="currentColor"
              d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5c.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34c-.46-1.16-1.11-1.47-1.11-1.47c-.91-.62.07-.6.07-.6c1 .07 1.53 1.03 1.53 1.03c.87 1.52 2.34 1.07 2.91.83c.09-.65.35-1.09.63-1.34c-2.22-.25-4.55-1.11-4.55-4.92c0-1.11.38-2 1.03-2.71c-.1-.25-.45-1.29.1-2.64c0 0 .84-.27 2.75 1.02c.79-.22 1.65-.33 2.5-.33s1.71.11 2.5.33c1.91-1.29 2.75-1.02 2.75-1.02c.55 1.35.2 2.39.1 2.64c.65.71 1.03 1.6 1.03 2.71c0 3.82-2.34 4.66-4.57 4.91c.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2"
            />
          </svg>
          {meta.github.replace('https://github.com/', '')}
        </a>
      </div>
    </div>
  )
}
