import { useState } from 'react'
import { Input } from '@/components/ui/input'

const DEFAULT_TITLE = 'Untitled'

export function EditableTitle({
  value,
  onSave,
}: {
  value: string
  onSave: (value: string) => void
}) {
  const [editing, setEditing] = useState(false)

  if (!(editing || value.length === 0)) {
    return (
      <h3
        className="text-sm font-medium cursor-text"
        onClick={(e) => {
          e.stopPropagation()
          setEditing(true)
        }}
      >
        {value}
      </h3>
    )
  }

  return (
    <Input
      className="text-center h-auto py-0 px-1 border-0 shadow-none focus-visible:ring-0 bg-background text-sm font-medium rounded-xs"
      autoFocus
      defaultValue={value}
      onClick={(e) => e.stopPropagation()}
      onKeyUp={(e) => {
        if (e.key === 'Enter') {
          setEditing(false)
          onSave((e.target as HTMLInputElement).value.trim() || DEFAULT_TITLE)
        }
      }}
      onBlur={(e) => {
        setEditing(false)
        onSave(e.target.value.trim() || DEFAULT_TITLE)
      }}
    />
  )
}
