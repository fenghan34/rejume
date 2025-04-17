import { useAutoPagination } from '@/hooks/useAutoPagination'
import { useRemark } from '@/hooks/useRemark'
import { A4_HEIGHT, A4_WIDTH, A4_PAGE_PADDING } from '@/lib/constants'
import { cn } from '@/lib/utils'

export type PreviewProps = {
  content: string
} & Omit<React.HTMLProps<HTMLDivElement>, 'style' | 'id'>

export function Preview({ content, className, ...rest }: PreviewProps) {
  const html = useRemark(content)
  const pages = useAutoPagination(html, {
    pageSize: { width: A4_WIDTH, height: A4_HEIGHT },
    padding: { x: A4_PAGE_PADDING, y: A4_PAGE_PADDING },
  })

  return (
    <div
      {...rest}
      id="rejume-preview"
      style={{ width: A4_WIDTH, height: A4_HEIGHT }}
      className={cn(
        'overflow-y-auto rounded font-nunito-sans text-pretty shadow-xl',
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
