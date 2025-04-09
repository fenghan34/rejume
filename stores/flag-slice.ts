import type { AppStore } from './app-store'
import type { StateCreator } from 'zustand'

type FlagSliceState = {
  showHistory: boolean
}

type FlagSliceActions = {
  toggleShowHistory: () => void
}

export type FlagSlice = FlagSliceState & FlagSliceActions

export const createFlagSlice: StateCreator<
  AppStore,
  [['zustand/immer', never]],
  [],
  FlagSlice
> = (set) => ({
  showHistory: false,

  toggleShowHistory: () =>
    set((state) => {
      state.showHistory = !state.showHistory
    }),
})
