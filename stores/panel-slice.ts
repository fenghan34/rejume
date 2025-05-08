import type { AppStore } from './app-store'
import type { StateCreator } from 'zustand'

type PanelSliceState = {
  chatbotPanel: boolean
}

type PanelSliceActions = {
  toggleChatbotPanel: () => void
}

export type PanelSlice = PanelSliceState & PanelSliceActions

export const partializePanelSlice = (state: PanelSliceState) => ({
  chatbotPanel: state.chatbotPanel,
})

export const createPanelSlice: StateCreator<
  AppStore,
  [['zustand/immer', never]],
  [],
  PanelSlice
> = (set) => ({
  chatbotPanel: false,

  toggleChatbotPanel: () => {
    set((state) => {
      state.chatbotPanel = !state.chatbotPanel
    })
  },
})
