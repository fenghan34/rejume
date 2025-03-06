import { clsx, type ClassValue } from "clsx"
import { IRange } from 'monaco-editor'
import { twMerge } from 'tailwind-merge'
import { POSITION_ATTRIBUTE } from './md2html'

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs))
}

export const getSelectedElement = () => {
  const selection = window.getSelection()
  if (!selection || selection.rangeCount === 0) return null

  const range = selection.getRangeAt(0)
  let selectedElement = range.commonAncestorContainer

  if (selectedElement.nodeType === Node.TEXT_NODE) {
    selectedElement = selectedElement.parentElement as HTMLElement
  }

  return selectedElement as HTMLElement
}

export const parsePositionAttribute = (element: HTMLElement) => {
  const position = element.getAttribute(POSITION_ATTRIBUTE)
  if (!position) return

  const [start, end] = position.split('-')
  const [startLine, startColumn] = start.split(':').map(Number)
  const [endLine, endColumn] = end.split(':').map(Number)

  return {
    startLineNumber: startLine,
    startColumn: startColumn,
    endLineNumber: endLine,
    endColumn: endColumn,
  } satisfies IRange
}
