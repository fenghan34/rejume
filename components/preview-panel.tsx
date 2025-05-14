'use client'

import { useRef, useEffect, useCallback, useState } from 'react'
import {
  getPanelGroupElement,
  ImperativePanelHandle,
} from 'react-resizable-panels'
import { ResizablePanel } from '@/components/ui/resizable'
import { A4_WIDTH, A4_HEIGHT, RESUME_PANEL_GROUP_ID } from '@/lib/constants'
import { parsePositionAttribute } from '@/lib/md2html'
import { getSelectedElement } from '@/lib/utils'
import { useAppStore } from '@/providers/app'
import { Preview } from './preview'

export const PREVIEW_CLASS = 'preview-panel'

const MIN_SIZE = 30
const MAX_SIZE = 60

export function PreviewPanel() {
  const panelRef = useRef<ImperativePanelHandle>(null)
  const editorContent = useAppStore((state) => state.editorContent)
  const editor = useAppStore((state) => state.editor)
  const [minSize, setMinSize] = useState(MIN_SIZE)

  const mouseupHandler = useCallback(() => {
    const el = getSelectedElement()
    if (!el) return

    const range = parsePositionAttribute(el)
    if (range) {
      editor?.setSelection(range)
      editor?.revealRangeInCenter(range)
    }
  }, [editor])

  useEffect(() => {
    const resizePanel = getPanelGroupElement(RESUME_PANEL_GROUP_ID)!

    function updatePanelSize() {
      const estimatedWidth = resizePanel.clientHeight * (A4_WIDTH / A4_HEIGHT)
      const size = Math.min(
        (estimatedWidth / resizePanel.clientWidth) * 100,
        MAX_SIZE,
      )
      panelRef.current?.resize(size)
      setMinSize(size)
    }

    updatePanelSize()

    const observer = new ResizeObserver(updatePanelSize)
    observer.observe(resizePanel)
    return () => {
      observer.disconnect()
    }
  }, [])

  return (
    <ResizablePanel
      ref={panelRef}
      minSize={minSize}
      maxSize={MAX_SIZE}
      defaultSize={40}
    >
      <Preview
        className={PREVIEW_CLASS}
        content={editorContent}
        onMouseUp={mouseupHandler}
        autoScaleOptions={{ heightScaling: 'stretch' }}
      />
    </ResizablePanel>
  )
}
