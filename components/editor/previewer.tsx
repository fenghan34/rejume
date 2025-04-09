import type { Ref } from 'react'
import { useCallback, useImperativeHandle, useRef } from 'react'
import { useReactToPrint } from 'react-to-print'
import { useShallow } from 'zustand/react/shallow'
import { useAutoPagination } from '@/hooks/useAutoPagination'
import { useAutoScale } from '@/hooks/useAutoScale'
import { useRemark } from '@/hooks/useRemark'
import { A4_HEIGHT, A4_WIDTH, PAGE_PADDING } from '@/lib/constants'
import { getSelectedElement } from '@/lib/utils'
import { useAppStore } from '@/providers/app'

export type PreviewerRef = {
  print: () => void
}

export type PreviewerProps = {
  onSelectionChange?: (selectedElement: HTMLElement) => void
  ref: Ref<PreviewerRef>
}

export function Previewer({ onSelectionChange, ref }: PreviewerProps) {
  const contentRef = useRef<HTMLDivElement>(null)
  const content = useAppStore(useShallow((state) => state.resume.content))
  const html = useRemark(content)
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

  return (
    <div className="xl:m-4 2xl:m-6">
      <div
        id="rejume-preview"
        style={{ width: A4_WIDTH, height: A4_HEIGHT }}
        onMouseUp={mouseupHandler}
        ref={contentRef}
      >
        {pages?.map(({ html, pageNumber, pageStyle }) => (
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
