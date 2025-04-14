import type { Resume } from '@/stores/resume-slice'
import type { ClassValue } from 'clsx'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getSelectedElement() {
  const selection = window.getSelection()
  if (!selection || selection.isCollapsed || selection.rangeCount === 0)
    return null

  const range = selection.getRangeAt(0)
  const node = range.commonAncestorContainer

  if (node.nodeType === Node.TEXT_NODE) {
    return node.parentElement
  }

  return node instanceof Element ? node : null
}

export function downloadMarkdown(resume: Resume) {
  const blob = new Blob([resume.content], { type: 'text/markdown' })
  const url = URL.createObjectURL(blob)

  const link = document.createElement('a')
  link.href = url
  link.download = `${resume.title.split(' ').join('-')}.md`

  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  URL.revokeObjectURL(url)
}
