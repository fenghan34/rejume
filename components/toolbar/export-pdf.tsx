import { Printer } from 'lucide-react'
import { useHotkeys } from 'react-hotkeys-hook'
import { useReactToPrint } from 'react-to-print'
import { useAppStore } from '@/providers/app'
import { ToolbarButton } from './toolbar-button'

export function ExportPDF() {
  const previewEl = useAppStore((state) => state.previewElement)
  const print = useReactToPrint({ contentRef: { current: previewEl } })

  useHotkeys('meta+p, ctrl+p', () => print(), {
    preventDefault: true,
    enableOnFormTags: ['input', 'textarea', 'select'],
  })

  return (
    <ToolbarButton title="Export PDF (⌘P)" onClick={() => print()}>
      <Printer />
    </ToolbarButton>
  )
}
