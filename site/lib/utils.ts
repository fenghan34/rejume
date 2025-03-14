import type { ClassValue } from 'clsx'
import type { IRange } from 'monaco-editor'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { POSITION_ATTRIBUTE } from './md2html'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getSelectedElement() {
  const selection = window.getSelection()
  if (!selection || selection.isCollapsed || selection.rangeCount === 0)
    return null

  const range = selection.getRangeAt(0)
  let selectedElement = range.commonAncestorContainer

  if (selectedElement.nodeType === Node.TEXT_NODE) {
    selectedElement = selectedElement.parentElement as HTMLElement
  }

  return selectedElement as HTMLElement
}

export function parsePositionAttribute(element: HTMLElement): IRange | undefined {
  const position = element.getAttribute(POSITION_ATTRIBUTE)
  if (!position)
    return

  const [start, end] = position.split('-')
  const [startLine, startColumn] = start.split(':').map(Number)
  const [endLine, endColumn] = end.split(':').map(Number)

  return {
    startLineNumber: startLine,
    startColumn,
    endLineNumber: endLine,
    endColumn,
  }
}
