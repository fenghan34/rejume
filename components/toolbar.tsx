import { Printer, Github, FileDown } from 'lucide-react'
import { useHotkeys } from 'react-hotkeys-hook'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { cn, downloadMarkdown } from '@/lib/utils'
import { useAppStore } from '@/providers/app'
import { ModeToggle } from './mode-toggle'

export function Toolbar({ onPrint }: { onPrint: () => void }) {
  useHotkeys('meta+s, ctrl+s', () => {}, {
    preventDefault: true,
    enableOnFormTags: ['input', 'textarea', 'select'],
  })

  useHotkeys(
    'meta+p, ctrl+p',
    () => onPrint(),
    {
      preventDefault: true,
      enableOnFormTags: ['input', 'textarea', 'select'],
    },
    [onPrint],
  )

  return (
    <div className="p-2 flex items-center gap-2 bg-card border-b">
      <div>
        <ExportMarkdownButton />

        <ToolbarButton title="Export PDF" onClick={onPrint}>
          <Printer />
        </ToolbarButton>
      </div>

      <Separator orientation="vertical" className="h-3!" />

      <div>
        <a href="https://github.com/fenghan34/rejume" target="_blank">
          <ToolbarButton title="GitHub">
            <Github />
          </ToolbarButton>
        </a>

        <ModeToggle />
      </div>
    </div>
  )
}

function ExportMarkdownButton() {
  const resume = useAppStore((state) => state.resume)

  return (
    <ToolbarButton
      title="Export Markdown"
      onClick={() => downloadMarkdown(resume)}
    >
      <FileDown />
    </ToolbarButton>
  )
}

function ToolbarButton({
  className,
  ...rest
}: Omit<React.ComponentProps<typeof Button>, 'variant' | 'size'>) {
  return (
    <Button
      {...rest}
      variant="ghost"
      size="icon"
      className={cn('cursor-pointer', className)}
    />
  )
}
