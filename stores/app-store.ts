import type { WorkbenchSlice } from './workbench-slice'
import { createStore } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import { ChatSlice, createChatSlice } from './chat-slice'
import {
  createWorkbenchSlice,
  partializeWorkbenchSlice,
} from './workbench-slice'

export type AppStore = WorkbenchSlice & ChatSlice

export const createAppStore = () =>
  createStore<AppStore>()(
    persist(
      immer((...a) => ({
        ...createWorkbenchSlice(...a),
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
