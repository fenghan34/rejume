import type { AppStore } from './app-store'
import type { WorkBenchSubPanel } from '@/components/workbench-panel'
import type { StateCreator } from 'zustand'

type PanelSliceState = {
  workbenchSubPanels: WorkBenchSubPanel[]
}

type PanelSliceActions = {
  setWorkbenchSubPanels: (panels: WorkBenchSubPanel[]) => void
  toggleWorkbenchSubPanel: (panel: WorkBenchSubPanel) => void
}

export type PanelSlice = PanelSliceState & PanelSliceActions

export const partializePanelSlice = (state: PanelSliceState) => ({
  workbenchSubPanels: state.workbenchSubPanels,
})

export const createPanelSlice: StateCreator<
  AppStore,
  [['zustand/immer', never]],
  [],
  PanelSlice
> = (set) => ({
  workbenchSubPanels: [],

  setWorkbenchSubPanels: (panels) => {
    set((state) => {
      state.workbenchSubPanels = panels
    })
  },

  toggleWorkbenchSubPanel: (panel) => {
    set((state) => {
      const index = state.workbenchSubPanels.indexOf(panel)

      if (index > -1) {
        state.workbenchSubPanels.splice(index, 1)
      } else {
        state.workbenchSubPanels.push(panel)
      }
    })
  },
})
