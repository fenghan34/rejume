import { RefCallback, useEffect, useRef } from 'react'

/**
 * Automatically scales a container based on its parent's width while preserving the content layout
 * @returns A ref callback for the container element
 */
export function useAutoScale(): RefCallback<HTMLDivElement> {
  const ref = useRef<HTMLDivElement>(null)

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

      container.style.transform = `scale(${scale})`
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
  }, [])

  return (containerElement) => {
    ref.current = containerElement
  }
}
