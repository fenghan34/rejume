import type { RefCallback } from 'react'
import { useEffect, useState } from 'react'

/**
 * Auto-scales a container based on its parent's width while preserving the content layout
 *
 * @returns {RefCallback<HTMLDivElement>} Ref callback
 */
export function useAutoScale(): RefCallback<HTMLDivElement> {
  const [container, setContainer] = useState<HTMLDivElement | null>()

  useEffect(() => {
    if (!container)
      return
    const parent = container.parentElement
    if (!parent)
      return

    // Store original dimensions and styles
    const originalWidth = container.offsetWidth
    const originalHeight = container.offsetHeight
    const originalTransform = container.style.transform
    const originalTransformOrigin = container.style.transformOrigin

    // Set base dimensions for content layout
    container.style.width = `${originalWidth}px`
    container.style.height = `${originalHeight}px`

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
      // Restore original styles
      container.style.width = ''
      container.style.height = ''
      container.style.transform = originalTransform
      container.style.transformOrigin = originalTransformOrigin
    }
  }, [container])

  return (container) => {
    setContainer(container)
    return () => setContainer(null)
  }
}
