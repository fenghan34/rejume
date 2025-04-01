import type { Ref } from 'react'
import { useCallback, useImperativeHandle, useRef } from 'react'
import { useReactToPrint } from 'react-to-print'
import { useAutoPagination } from '@/hooks/useAutoPagination'
import { useAutoScale } from '@/hooks/useAutoScale'
import { useRemark } from '@/hooks/useRemark'
import { A4_HEIGHT, A4_WIDTH, PAGE_PADDING } from '@/lib/constants'
import { getSelectedElement } from '@/lib/utils'

export interface PreviewerRef {
  print: () => void
}

export interface PreviewerProps {
  markdown?: string
  className?: string
  onSelectionChange?: (selectedElement: HTMLElement) => void
  ref: Ref<PreviewerRef>
}

export function Previewer({
  className,
  markdown = '',
  onSelectionChange,
  ref,
}: PreviewerProps) {
  const contentRef = useRef<HTMLDivElement>(null)

  const { html } = useRemark(markdown)
  const pages = useAutoPagination(html, {
    pageSize: { width: A4_WIDTH, height: A4_HEIGHT },
    padding: { x: PAGE_PADDING, y: PAGE_PADDING },
  })

  const print = useReactToPrint({ contentRef })
  useAutoScale({ contentRef })

  useImperativeHandle(
    ref,
    () => ({
      print,
    }),
    [print],
  )

  const mouseupHandler = useCallback(() => {
    const selectedElement = getSelectedElement()
    if (!selectedElement) return

    onSelectionChange?.(selectedElement)
  }, [onSelectionChange])

  if (!pages) return null

  return (
    <div className={className}>
      <div
        id="rejume-preview"
        style={{ width: A4_WIDTH, height: A4_HEIGHT }}
        onMouseUp={mouseupHandler}
        ref={contentRef}
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
    </div>
  )
}
