import type { AppStore } from './app-store'
import type { ResumeModel } from '@/lib/db/schema'
import type { StateCreator } from 'zustand'

type WorkbenchSliceState = {
  resume: ResumeModel | null
  sidebar: 'editor' | 'chat'
}

type WorkbenchSliceActions = {
  setResume: (resume: ResumeModel) => void
  setSidebar: (sidebar: 'editor' | 'chat') => void
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
  resume: null,
  sidebar: 'editor',

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
})
