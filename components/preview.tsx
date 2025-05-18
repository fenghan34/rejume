'use client'

import { useAutoPagination } from '@/hooks/useAutoPagination'
import { useAutoScale, UseAutoScaleOptions } from '@/hooks/useAutoScale'
import { useRemark } from '@/hooks/useRemark'
import { A4_HEIGHT, A4_WIDTH, A4_PAGE_PADDING } from '@/lib/constants'
import { cn } from '@/lib/utils'

export function Preview({
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

  return (
    <div
      ref={ref}
      id="rejume-preview"
      style={{ width: A4_WIDTH, height: A4_HEIGHT, visibility: 'hidden' }}
      className={cn(
        'font-nunito-sans text-pretty will-change-transform',
        !pages?.length && 'bg-background',
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
