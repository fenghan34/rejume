'use client'

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
        title={value}
        className="w-full text-sm font-medium cursor-text whitespace-nowrap overflow-hidden overflow-ellipsis"
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
      className="w-full h-auto py-0 border-0 shadow-none focus-visible:ring-1 text-sm font-medium rounded-xs text-center"
      autoFocus
      maxLength={30}
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
