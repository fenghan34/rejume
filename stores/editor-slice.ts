import type { AppStore } from './app-store'
import type { StateCreator } from 'zustand'
import { MonacoEditor, Monaco } from '@/components/editor/types'

type EditorSliceState = {
  editor: MonacoEditor | null
  monaco: Monaco | null
}

type EditorSliceActions = {
  setMonacoEditor: (monaco: Monaco | null, editor: MonacoEditor | null) => void
}

export type EditorSlice = EditorSliceState & EditorSliceActions

export const createEditorSlice: StateCreator<
  AppStore,
  [['zustand/immer', never]],
  [],
  EditorSlice
> = (set) => ({
  editor: null,
  monaco: null,

  setMonacoEditor(monaco, editor) {
    set(() => ({ monaco, editor }))
  },
})
