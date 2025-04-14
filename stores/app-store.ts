import type { PanelSlice } from './panel-slice'
import type { ResumeSlice } from './resume-slice'
import { createStore } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import { createPanelSlice, partializePanelSlice } from './panel-slice'
import { createPreviewSlice, PreviewSlice } from './preview-slice'
import { createResumeSlice, partializeResumeSlice } from './resume-slice'

export type AppStore = PanelSlice & ResumeSlice & PreviewSlice

export const createAppStore = () =>
  createStore<AppStore>()(
    persist(
      immer((...a) => ({
        ...createPanelSlice(...a),
        ...createResumeSlice(...a),
        ...createPreviewSlice(...a),
      })),
      {
        name: 'rejume-storage',
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({
          ...partializeResumeSlice(state),
          ...partializePanelSlice(state),
        }),
      },
    ),
  )
