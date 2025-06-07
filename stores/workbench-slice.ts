import type { AppStore } from './app-store'
import type { ResumeModel } from '@/lib/db/schema'
import type { MonacoEditor } from '@/lib/monaco/types'
import type { StateCreator } from 'zustand'

type WorkbenchSliceState = {
  resume?: ResumeModel
  sidebar: 'editor' | 'chat'
  editor: MonacoEditor | null
}

type WorkbenchSliceActions = {
  setResume: (resume: ResumeModel) => void
  setSidebar: (sidebar: 'editor' | 'chat') => void
  setEditor: (editor: MonacoEditor | null) => void
}

export type WorkbenchSlice = WorkbenchSliceState & WorkbenchSliceActions

export const partializeWorkbenchSlice = (state: WorkbenchSliceState) => ({
  sidebar: state.sidebar,
})

export const createWorkbenchSlice: StateCreator<
  AppStore,
  [['zustand/immer', never]],
  [],
  WorkbenchSlice
> = (set) => ({
  sidebar: 'editor',
  editor: null,

  setResume: (resume) => {
    set((state) => {
      state.resume = resume
    })
  },

  setSidebar: (sidebar) => {
    set((state) => {
      state.sidebar = sidebar
    })
  },

  setEditor: (editor) => {
    set((state) => {
      state.editor = editor
    })
  },
})
