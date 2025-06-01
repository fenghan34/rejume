'use client'

import { RefObject, useLayoutEffect, useRef } from 'react'

type HeightScalingMode = 'stretch' | 'scale'

export type UseAutoScaleOptions = {
  minScale?: number
  maxScale?: number
  heightScaling?: HeightScalingMode
}

/**
 * Automatically scales a container based on its parent's width while preserving the content layout
 *
 * @param options - The options for the auto scale hook
 * @param options.minScale - The minimum scale of the container, default is 0
 * @param options.maxScale - The maximum scale of the container, default is 10
 * @param options.heightScaling - How to handle height scaling: 'scale' (default, maintain original height), 'stretch' (match parent height)
 * @returns A ref object for the container element
 */
export function useAutoScale(
  options?: UseAutoScaleOptions,
): RefObject<HTMLDivElement | null> {
  const ref = useRef<HTMLDivElement>(null)
  const { minScale = 0, maxScale = 10, heightScaling = 'scale' } = options || {}

  useLayoutEffect(() => {
    const container = ref.current
    const parent = container?.parentElement

    if (!container || !parent) return

    // Store original styles
    const originalStyles = {
      transform: container.style.transform,
      transformOrigin: container.style.transformOrigin,
      visibility: container.style.visibility,
      height: container.style.height,
    }

    const originalWidth = container.offsetWidth
    const originalHeight = container.offsetHeight

    const updateScale = () => {
      const parentWidth = parent.clientWidth
      const parentHeight = parent.clientHeight

      const scale = Math.min(
        Math.max(parentWidth / originalWidth, minScale),
        maxScale,
      )

      container.style.transform = `scale(${scale})`
      container.style.transformOrigin = 'top left'
      container.style.visibility = 'visible'

      // Handle height based on heightScaling option
      if (
        heightScaling === 'stretch' &&
        originalHeight * scale < parentHeight
      ) {
        container.style.height = `${parentHeight / scale}px`
      } else {
        container.style.height = `${originalHeight}px`
      }
    }

    updateScale()

    const resizeObserver = new ResizeObserver(updateScale)
    resizeObserver.observe(parent)

    return () => {
      resizeObserver.disconnect()
      // Restore original styles
      Object.entries(originalStyles).forEach(([key, value]) => {
        container.style[key as keyof typeof originalStyles] = value
      })
    }
  }, [maxScale, minScale, heightScaling])

  return ref
}
