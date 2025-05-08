'use client'

import { FileDown, PanelRight, PanelRightClose, Printer } from 'lucide-react'
import { useHotkeys } from 'react-hotkeys-hook'
import { useReactToPrint } from 'react-to-print'
import { useShallow } from 'zustand/react/shallow'
import { Toggle } from '@/components/ui/toggle'
import { downloadMarkdown } from '@/lib/utils'
import { useAppStore } from '@/providers/app'
import { EditableTitle } from './editable-title'
import { Button } from './ui/button'

export function Toolbar() {
  const [resume, chatbotPanel, previewEl, updateResume, toggleChatbotPanel] =
    useAppStore(
      useShallow((state) => [
        state.resume,
        state.chatbotPanel,
        state.previewElement,
        state.updateResume,
        state.toggleChatbotPanel,
      ]),
    )

  const print = useReactToPrint({ contentRef: { current: previewEl } })

  useHotkeys('meta+p, ctrl+p', () => print(), {
    preventDefault: true,
    enableOnFormTags: ['input', 'textarea', 'select'],
  })

  useHotkeys('meta+s, ctrl+s', () => downloadMarkdown(resume), {
    preventDefault: true,
    enableOnFormTags: ['input', 'textarea', 'select'],
  })

  return (
    <div className="p-1.5 flex items-center justify-between space-x-2 bg-background/10 border-b">
      <div className="space-x-1">
        <Button
          variant="ghost"
          className="cursor-pointer size-8"
          title="Export Markdown (⌘S)"
          onClick={() => downloadMarkdown(resume)}
        >
          <FileDown />
        </Button>

        <Button
          variant="ghost"
          className="cursor-pointer size-8"
          title="Export PDF (⌘P)"
          onClick={() => print()}
        >
          <Printer />
        </Button>
      </div>

      <EditableTitle
        value={resume.title}
        onSave={(title) => updateResume(resume.id, { title })}
      />

      <Toggle
        pressed={chatbotPanel}
        onPressedChange={toggleChatbotPanel}
        className="cursor-pointer"
        title="Toggle AI Chat (⌘L)"
        size="sm"
      >
        {chatbotPanel ? <PanelRightClose /> : <PanelRight />}
      </Toggle>
    </div>
  )
}
