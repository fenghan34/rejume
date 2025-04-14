import { FilePenLine, Files } from 'lucide-react'
import { useShallow } from 'zustand/react/shallow'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { useAppStore } from '@/providers/app'

export function WorkBenchToggleGroup() {
  const [workbenchPanel, setWorkbenchPanel] = useAppStore(
    useShallow((state) => [state.workbenchPanel, state.setWorkbenchPanel]),
  )

  return (
    <ToggleGroup
      type="single"
      value={workbenchPanel}
      onValueChange={setWorkbenchPanel}
    >
      <ToggleGroupItem
        className="cursor-pointer disabled:opacity-100"
        title="Toggle Editor"
        value="editor"
        disabled={workbenchPanel === 'editor'}
      >
        <FilePenLine />
      </ToggleGroupItem>

      <ToggleGroupItem
        className="cursor-pointer disabled:opacity-100"
        title="Toggle Resume List"
        value="resume-list"
        disabled={workbenchPanel === 'resume-list'}
      >
        <Files />
      </ToggleGroupItem>
    </ToggleGroup>
  )
}
