import type { CSSProperties } from 'react'
import { useCallback, useEffect, useRef, useState } from 'react'

function createContainer() {
  const container = document.createElement('div')
  container.style.position = 'fixed'
  container.style.visibility = 'hidden'
  container.id = 'rejume-preview'
  document.body.appendChild(container)
  return container
}

type Page = {
  html: string
  pageNumber: number
  pageStyle: CSSProperties
}

type AutoPaginationOptions = {
  pageSize: { width: number; height: number }
  padding: { x: number; y: number }
}

/**
 * Automatically paginates a given HTML string based on the specified page size and padding
 * @param html - The HTML string to paginate
 * @param options - The options for the pagination
 * @returns An array of pages with the HTML content, page number, and page style
 */
export function useAutoPagination(
  html: string,
  options: AutoPaginationOptions,
) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [pages, setPages] = useState<Page[]>()

  const {
    pageSize: { width, height },
    padding: { x: paddingX, y: paddingY },
  } = options

  const calculatePages = useCallback(
    (container: HTMLDivElement, html: string) => {
      container.innerHTML = html
      container.style.width = `${width}px`
      container.style.padding = `0px ${paddingX}px`

      const items = Array.from(container.children).map((child) => ({
        height:
          (child as HTMLElement).offsetHeight +
          Number.parseFloat(getComputedStyle(child).marginBottom),
        html: child.outerHTML,
      }))

      let currentHeight = 0
      let currentPage = ''
      let currentPageNumber = 0
      const pages: Page[] = []

      const pushPage = () => {
        pages.push({
          html: currentPage,
          pageNumber: ++currentPageNumber,
          pageStyle: { height, padding: `${paddingY}px ${paddingX}px` },
        })
      }

      items.forEach((item, index) => {
        if (currentHeight + item.height > height - 2 * paddingY) {
          pushPage()
          currentPage = item.html
          currentHeight = item.height
        } else {
          currentPage += item.html
          currentHeight += item.height
        }

        if (index === items.length - 1) pushPage()
      })

      return pages
    },
    [width, height, paddingX, paddingY],
  )

  useEffect(() => {
    containerRef.current ??= createContainer()
    setPages(calculatePages(containerRef.current, html))
  }, [html, calculatePages])

  useEffect(() => {
    return () => {
      if (containerRef.current?.isConnected) {
        document.body.removeChild(containerRef.current)
      }
      containerRef.current = null
    }
  }, [])

  return pages
}
