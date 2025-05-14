import type { AppStore } from './app-store'
import type { StateCreator } from 'zustand'

type PanelSliceState = {
  chatPanel: boolean
}

type PanelSliceActions = {
  toggleChatPanel: () => void
}

export type PanelSlice = PanelSliceState & PanelSliceActions

export const partializePanelSlice = (state: PanelSliceState) => ({
  chatPanel: state.chatPanel,
})

export const createPanelSlice: StateCreator<
  AppStore,
  [['zustand/immer', never]],
  [],
  PanelSlice
> = (set) => ({
  chatPanel: false,

  toggleChatPanel: () => {
    set((state) => {
      state.chatPanel = !state.chatPanel
    })
  },
})
