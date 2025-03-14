import type { Frontmatter } from '@/lib/md2html'
import type { Ref } from 'react'
import { A4_HEIGHT, A4_WIDTH, PAGE_PADDING } from '@/lib/constants'
import { useAutoPagination } from '@/hooks/useAutoPagination'
import { useAutoScale } from '@/hooks/useAutoScale'
import { useRemark } from '@/hooks/useRemark'
import { getSelectedElement } from '@/lib/utils'
import { useCallback, useImperativeHandle, useRef } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { useReactToPrint } from 'react-to-print'

export interface PreviewerRef {
  print: () => void
  layout: (margin: number) => void
}

export interface PreviewerProps {
  markdown?: string
  className?: string
  onSelectionChange?: (selectedElement: HTMLElement) => void
  ref: Ref<PreviewerRef>
}

export function Previewer({ className, markdown = '', onSelectionChange, ref }: PreviewerProps) {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  const { html: bodyHtml, frontmatter } = useRemark(markdown)
  const headerHtml = renderToStaticMarkup(<Header data={frontmatter} />)
  const pages = useAutoPagination(`${headerHtml}${bodyHtml}`, {
    pageSize: { width: A4_WIDTH, height: A4_HEIGHT },
    padding: { x: PAGE_PADDING, y: PAGE_PADDING },
  })

  useAutoScale({ contentRef })
  const print = useReactToPrint({ contentRef })
  const layout = useCallback((margin: number) => {
    if (!wrapperRef.current) return
    wrapperRef.current.style.margin = `${margin}px`
  }, [])

  useImperativeHandle(ref, () => ({
    print,
    layout
  }), [print])

  const mouseupHandler = useCallback(() => {
    const selectedElement = getSelectedElement()
    if (!selectedElement)
      return

    onSelectionChange?.(selectedElement)
  }, [onSelectionChange])

  if (!pages)
    return null

  return (
    <div ref={wrapperRef}>
      <div
        id="rejume-preview"
        className={className}
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

function Header({ data }: { data?: Frontmatter }) {
  if (!data)
    return

  return (
    <div id="header">
      <h1 className="text-[2em] font-bold">{data.name}</h1>
      <div>
        <span className="text-xl font-medium">{data.title}</span>
      </div>
      <div>
        <span>{data.email}</span>
        {' '}
        |
        {' '}
        <span>{data.phone}</span>
        {' '}
        |
        {' '}
        <a href={data.github} target="_blank">
          <span className="icon-[mdi--github] w-[1.1em] h-[1.1em] align-[-0.2em] mr-0.5"></span>
          {data.github?.replace('https://github.com/', '')}
        </a>
      </div>
    </div>
  )
}
