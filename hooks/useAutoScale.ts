import { RefCallback, useEffect, useRef } from 'react'

/**
 * Automatically scales a container based on its parent's width while preserving the content layout
 *
 * @param options - The options for the auto scale hook
 * @param options.minScale - The minimum scale of the container, default is 0
 * @param options.maxScale - The maximum scale of the container, default is 10
 * @returns A ref callback for the container element
 */
export function useAutoScale(options?: {
  minScale?: number
  maxScale?: number
}): RefCallback<HTMLDivElement> {
  const ref = useRef<HTMLDivElement>(null)
  const { minScale = 0, maxScale = 10 } = options || {}

  useEffect(() => {
    const container = ref.current
    if (!container) return

    const parent = container.parentElement
    if (!parent) return

    const originalWidth = container.offsetWidth
    const originalTransform = container.style.transform
    const originalTransformOrigin = container.style.transformOrigin

    const updateScale = () => {
      const parentWidth = parent.clientWidth
      const scale = parentWidth / originalWidth

      container.style.transform = `scale(${Math.min(
        Math.max(scale, minScale),
        maxScale,
      )})`
      container.style.transformOrigin = 'top left'
    }

    updateScale()

    const resizeObserver = new ResizeObserver(updateScale)
    resizeObserver.observe(parent)

    return () => {
      resizeObserver.disconnect()
      container.style.transform = originalTransform
      container.style.transformOrigin = originalTransformOrigin
    }
  }, [maxScale, minScale])

  return (containerElement) => {
    ref.current = containerElement
  }
}
