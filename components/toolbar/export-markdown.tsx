import { FileDown } from 'lucide-react'
import { useHotkeys } from 'react-hotkeys-hook'
import { downloadMarkdown } from '@/lib/utils'
import { useAppStore } from '@/providers/app'
import { ToolbarButton } from './toolbar-button'

export function ExportMarkdown() {
  const resume = useAppStore((state) => state.resume)

  useHotkeys('meta+s, ctrl+s', () => downloadMarkdown(resume), {
    preventDefault: true,
    enableOnFormTags: ['input', 'textarea', 'select'],
  })

  return (
    <ToolbarButton
      title="Export Markdown (⌘S)"
      onClick={() => downloadMarkdown(resume)}
    >
      <FileDown />
    </ToolbarButton>
  )
}
