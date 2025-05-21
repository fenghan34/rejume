import type { EditorSlice } from './editor-slice'
import type { WorkbenchSlice } from './workbench-slice'
import { createStore } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import { ChatSlice, createChatSlice } from './chat-slice'
import { createEditorSlice } from './editor-slice'
import {
  createWorkbenchSlice,
  partializeWorkbenchSlice,
} from './workbench-slice'

export type AppStore = WorkbenchSlice & EditorSlice & ChatSlice

export const createAppStore = () =>
  createStore<AppStore>()(
    persist(
      immer((...a) => ({
        ...createWorkbenchSlice(...a),
        ...createEditorSlice(...a),
        ...createChatSlice(...a),
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
