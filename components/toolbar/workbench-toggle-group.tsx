import { BotMessageSquare, Files } from 'lucide-react'
import { useHotkeys } from 'react-hotkeys-hook'
import { useShallow } from 'zustand/react/shallow'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { useAppStore } from '@/providers/app'

export function WorkBenchToggleGroup() {
  const [workbenchSubPanels, setWorkbenchSubPanels, toggleWorkbenchSubPanel] =
    useAppStore(
      useShallow((state) => [
        state.workbenchSubPanels,
        state.setWorkbenchSubPanels,
        state.toggleWorkbenchSubPanel,
      ]),
    )

  useHotkeys('meta+b', () => toggleWorkbenchSubPanel('resume-list'), {
    preventDefault: true,
    enableOnFormTags: ['input', 'textarea', 'select'],
  })

  useHotkeys('meta+shift+b', () => toggleWorkbenchSubPanel('chatbot'), {
    preventDefault: true,
    enableOnFormTags: ['input', 'textarea', 'select'],
  })

  return (
    <ToggleGroup
      type="multiple"
      value={workbenchSubPanels}
      onValueChange={setWorkbenchSubPanels}
    >
      <ToggleGroupItem
        className="cursor-pointer"
        title="Toggle Chatbot (⌘⇧B)"
        value="chatbot"
      >
        <BotMessageSquare />
      </ToggleGroupItem>

      <ToggleGroupItem
        className="cursor-pointer"
        title="Toggle Resume List (⌘B)"
        value="resume-list"
      >
        <Files />
      </ToggleGroupItem>
    </ToggleGroup>
  )
}
