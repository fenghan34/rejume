import type { RefObject } from 'react'
import { useEffect } from 'react'

/**
 * Auto-scales a container based on its parent's width while preserving the content layout
 */
export function useAutoScale(options: { contentRef: RefObject<HTMLDivElement | null> }) {
  useEffect(() => {
    const container = options.contentRef.current
    if (!container)
      return
    const parent = container.parentElement
    if (!parent)
      return

    const originalWidth = container.offsetWidth
    const originalTransform = container.style.transform
    const originalTransformOrigin = container.style.transformOrigin

    const updateScale = () => {
      const parentWidth = parent.clientWidth
      const scale = parentWidth / originalWidth

      container.style.transform = `scale(${scale})`
      container.style.transformOrigin = 'top left'
    }

    updateScale()

    // Set up resize observer
    const resizeObserver = new ResizeObserver(updateScale)
    resizeObserver.observe(parent)

    return () => {
      resizeObserver.disconnect()
      container.style.transform = originalTransform
      container.style.transformOrigin = originalTransformOrigin
    }
  }, [options])
}
