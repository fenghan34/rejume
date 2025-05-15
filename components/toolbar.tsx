'use client'

import {
  FileDown,
  PanelRight,
  PanelRightClose,
  Printer,
  CheckCircle2,
  Loader2,
  AlertCircle,
} from 'lucide-react'
import { useCallback } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'
import { useReactToPrint } from 'react-to-print'
import { useShallow } from 'zustand/react/shallow'
import { updateResume } from '@/app/resume/actions'
import { Toggle } from '@/components/ui/toggle'
import { ResumeSchema } from '@/lib/db/schema'
import { downloadMarkdown } from '@/lib/utils'
import { useAppStore } from '@/providers/app'
import { EditableTitle } from './editable-title'
import { PREVIEW_CLASS } from './preview-panel'
import { Button } from './ui/button'

export function Toolbar({ resume }: { resume: ResumeSchema }) {
  const [chatPanel, toggleChatPanel, saveStatus] = useAppStore(
    useShallow((state) => [
      state.chatPanel,
      state.toggleChatPanel,
      state.saveStatus,
    ]),
  )

  const print = useReactToPrint({ documentTitle: resume.name })
  const printHandler = useCallback(
    () => print(() => document.querySelector(`.${PREVIEW_CLASS}`)),
    [print],
  )

  useHotkeys('meta+p, ctrl+p', printHandler, {
    preventDefault: true,
    enableOnFormTags: ['input', 'textarea', 'select'],
  })

  const renderSaveStatus = () => {
    switch (saveStatus) {
      case 'saved':
        return <CheckCircle2 className="size-4 text-green-500" />
      case 'saving':
        return <Loader2 className="size-4 animate-spin" />
      case 'error':
        return <AlertCircle className="size-4 text-red-500" />
    }
  }

  return (
    <div className="p-1.5 flex items-center justify-between space-x-2 bg-background/10 border-b">
      <div className="space-x-1">
        <Button
          variant="ghost"
          className="cursor-pointer size-8"
          title="Export Markdown"
          onClick={() => downloadMarkdown(resume)}
        >
          <FileDown />
        </Button>

        <Button
          variant="ghost"
          className="cursor-pointer size-8"
          title="Export PDF (⌘P)"
          onClick={printHandler}
        >
          <Printer />
        </Button>

        <div className="inline-flex items-center ml-2">
          {renderSaveStatus()}
        </div>
      </div>

      <EditableTitle
        value={resume.name}
        onSave={(name) => updateResume(resume.id, { name })}
      />

      <Toggle
        pressed={chatPanel}
        onPressedChange={toggleChatPanel}
        className="cursor-pointer"
        title="Toggle AI Chat (⌘L)"
        size="sm"
      >
        {chatPanel ? <PanelRightClose /> : <PanelRight />}
      </Toggle>
    </div>
  )
}
