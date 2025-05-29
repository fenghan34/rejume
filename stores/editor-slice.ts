import type { AppStore } from './app-store'
import type { MonacoEditor } from '@/lib/monaco/types'
import type { StateCreator } from 'zustand'

type SaveStatus = 'saved' | 'saving' | 'error'

type EditorSliceState = {
  editor: MonacoEditor | null
  editorContent: string
  saveStatus: SaveStatus
}

type EditorSliceActions = {
  setEditor: (editor: MonacoEditor | null) => void
  setEditorContent: (content: string) => void
  setSaveStatus: (status: SaveStatus) => void
}

export type EditorSlice = EditorSliceState & EditorSliceActions

export const createEditorSlice: StateCreator<
  AppStore,
  [['zustand/immer', never]],
  [],
  EditorSlice
> = (set) => ({
  editor: null,
  editorContent: '',
  saveStatus: 'saved',

  setEditor(editor) {
    set((state) => {
      state.editor = editor
    })
  },

  setEditorContent(content) {
    set((state) => {
      state.editorContent = content
    })
  },

  setSaveStatus(status) {
    set((state) => {
      state.saveStatus = status
    })
  },
})
