import type { AppStore } from './app-store'
import type { StateCreator } from 'zustand'

type WorkbenchSliceState = {
  sidebar: 'editor' | 'chat'
}

type WorkbenchSliceActions = {
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
  sidebar: 'editor',

  setSidebar: (sidebar) => {
    set((state) => {
      state.sidebar = sidebar
    })
  },
})
