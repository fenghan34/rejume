import { Github } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { ExportMarkdown } from './export-markdown'
import { ExportPDF } from './export-pdf'
import { ModeToggle } from './mode-toggle'
import { ToolbarButton } from './toolbar-button'
import { WorkBenchToggleGroup } from './workbench-toggle-group'

export function Toolbar() {
  return (
    <div className="p-2 flex items-center space-x-2 bg-card border-b">
      <div>
        <ExportMarkdown />

        <ExportPDF />
      </div>

      <Separator orientation="vertical" className="h-3!" />

      <WorkBenchToggleGroup />

      <Separator orientation="vertical" className="h-3!" />

      <div>
        <ToolbarButton title="GitHub" asChild>
          <a href="https://github.com/fenghan34/rejume" target="_blank">
            <Github />
          </a>
        </ToolbarButton>

        <ModeToggle />
      </div>
    </div>
  )
}
