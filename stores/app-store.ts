import type { EditorSlice } from './editor-slice'
import type { PanelSlice } from './panel-slice'
import { createStore } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import { createEditorSlice } from './editor-slice'
import { createPanelSlice, partializePanelSlice } from './panel-slice'

export type AppStore = PanelSlice & EditorSlice

export const createAppStore = () =>
  createStore<AppStore>()(
    persist(
      immer((...a) => ({
        ...createPanelSlice(...a),
        ...createEditorSlice(...a),
      })),
      {
        name: 'rejume-storage',
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({
          ...partializePanelSlice(state),
        }),
      },
    ),
  )
