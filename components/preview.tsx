'use client'

import { isEqual } from 'lodash'
import { memo } from 'react'
import { useAutoPagination } from '@/hooks/useAutoPagination'
import { useAutoScale, UseAutoScaleOptions } from '@/hooks/useAutoScale'
import { useRemark } from '@/hooks/useRemark'
import { A4_HEIGHT, A4_WIDTH, A4_PAGE_PADDING } from '@/lib/constants'
import { cn, detectLang } from '@/lib/utils'

function PurePreview({
  content,
  className,
  autoScaleOptions,
}: {
  content: string
  className?: string
  autoScaleOptions?: UseAutoScaleOptions
}) {
  const ref = useAutoScale(autoScaleOptions)
  const html = useRemark(content)
  const pages = useAutoPagination(html, {
    pageSize: { width: A4_WIDTH, height: A4_HEIGHT },
    padding: { x: A4_PAGE_PADDING, y: A4_PAGE_PADDING },
  })

  const lang = detectLang(content)

  return (
    <div
      ref={ref}
      lang={lang}
      id="rejume-preview"
      style={{ width: A4_WIDTH, height: A4_HEIGHT, visibility: 'hidden' }}
      className={cn(
        'text-pretty will-change-transform',
        {
          'bg-background': !pages?.length,
        },
        className,
      )}
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
  )
}

export const Preview = memo(PurePreview, (prev, next) => {
  if (prev.content !== next.content) return false
  if (prev.className !== next.className) return false
  if (!isEqual(prev.autoScaleOptions, next.autoScaleOptions)) return false

  return true
})
