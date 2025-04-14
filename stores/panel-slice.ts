import type { AppStore } from './app-store'
import type { StateCreator } from 'zustand'

type TaggablePanel = 'editor' | 'resume-list'

type PanelSliceState = {
  workbenchPanel: TaggablePanel
}

type PanelSliceActions = {
  setWorkbenchPanel: (panel: TaggablePanel) => void
}

export type PanelSlice = PanelSliceState & PanelSliceActions

export const partializePanelSlice = (state: PanelSliceState) => ({
  workbenchPanel: state.workbenchPanel,
})

export const createPanelSlice: StateCreator<
  AppStore,
  [['zustand/immer', never]],
  [],
  PanelSlice
> = (set) => ({
  workbenchPanel: 'editor',

  setWorkbenchPanel: (panel) => {
    set((state) => {
      state.workbenchPanel = panel
    })
  },
})
