import type { EditorSlice } from './editor-slice'
import type { WorkbenchSlice } from './workbench-slice'
import { createStore } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import { createEditorSlice } from './editor-slice'
import {
  createWorkbenchSlice,
  partializeWorkbenchSlice,
} from './workbench-slice'

export type AppStore = WorkbenchSlice & EditorSlice

export const createAppStore = () =>
  createStore<AppStore>()(
    persist(
      immer((...a) => ({
        ...createWorkbenchSlice(...a),
        ...createEditorSlice(...a),
      })),
      {
        name: 'rejume-storage',
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({
          ...partializeWorkbenchSlice(state),
        }),
      },
    ),
  )
