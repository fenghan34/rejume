import type { ClassValue } from 'clsx'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { v4 as uuidv4 } from 'uuid'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateUUID() {
  return uuidv4()
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

export function downloadMarkdown(markdown: string) {
  const blob = new Blob([markdown], {
    type: 'text/markdown',
  })
  const url = URL.createObjectURL(blob)

  const link = document.createElement('a')
  link.href = url
  link.download = `${document.title}.md`

  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  URL.revokeObjectURL(url)
}

export function detectLang(text: string) {
  const zhChars = text.match(/[\u4e00-\u9fa5]/g)?.length || 0
  const enChars = text.match(/[a-zA-Z]/g)?.length || 0

  return zhChars >= enChars ? 'zh-CN' : 'en'
}
