import type { AppStore } from './app-store'
import type { StateCreator } from 'zustand'

type PreviewSliceState = {
  previewElement: HTMLDivElement | null
}

type PreviewSliceActions = {
  setPreviewElement: (element: HTMLDivElement | null) => void
}

export type PreviewSlice = PreviewSliceState & PreviewSliceActions

export const createPreviewSlice: StateCreator<
  AppStore,
  [['zustand/immer', never]],
  [],
  PreviewSlice
> = (set) => ({
  previewElement: null,

  setPreviewElement(element) {
    set(() => ({ previewElement: element }))
  },
})
