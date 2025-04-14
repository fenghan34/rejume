import { useRef, useEffect, useCallback } from 'react'
import { ImperativePanelHandle } from 'react-resizable-panels'
import { useShallow } from 'zustand/react/shallow'
import { ResizablePanel } from '@/components/ui/resizable'
import { useAutoScale } from '@/hooks/useAutoScale'
import { A4_WIDTH, A4_HEIGHT } from '@/lib/constants'
import { parsePositionAttribute } from '@/lib/md2html'
import { getSelectedElement } from '@/lib/utils'
import { useAppStore } from '@/providers/app'
import { Preview } from './preview'

export function PreviewPanel() {
  const LeftPanel = useRef<ImperativePanelHandle>(null)
  const autoScaleRef = useAutoScale()
  const [content, editor, setPreviewElement] = useAppStore(
    useShallow((state) => [
      state.resume.content,
      state.editor,
      state.setPreviewElement,
    ]),
  )

  const mouseupHandler = useCallback(() => {
    const el = getSelectedElement()
    if (!el) return

    const range = parsePositionAttribute(el)
    if (range) {
      editor?.setSelection(range)
      editor?.revealRangeInCenter(range)
    }
  }, [])

  useEffect(() => {
    function computeLeftPanelSize() {
      const xl = window.matchMedia(`(min-width: 1280px)`).matches && 16
      const doubleXl = window.matchMedia(`(min-width: 1536px)`).matches && 24
      const margin = xl || doubleXl || 0
      const w = (document.body.clientHeight + margin) * (A4_WIDTH / A4_HEIGHT)
      return (w / document.body.clientWidth) * 100
    }

    const observer = new ResizeObserver(() => {
      LeftPanel.current?.resize(computeLeftPanelSize())
    })
    observer.observe(document.body)
    return () => {
      observer.disconnect()
    }
  }, [])

  return (
    <ResizablePanel ref={LeftPanel} minSize={30} maxSize={70}>
      <div className="xl:m-4 2xl:m-6">
        <Preview
          content={content}
          onMouseUp={mouseupHandler}
          ref={(e) => {
            autoScaleRef(e)
            setPreviewElement(e)
          }}
        />
      </div>
    </ResizablePanel>
  )
}
