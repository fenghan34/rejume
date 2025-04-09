import type { FlagSlice } from './flag-slice'
import type { ResumeSlice } from './resume-slice'
import { createStore } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import { createFlagSlice } from './flag-slice'
import { createResumeSlice, partializeResumeSlice } from './resume-slice'

export type AppStore = FlagSlice & ResumeSlice

export const createAppStore = () =>
  createStore<AppStore>()(
    persist(
      immer((...a) => ({
        ...createFlagSlice(...a),
        ...createResumeSlice(...a),
      })),
      {
        name: 'rejume-storage',
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({
          ...partializeResumeSlice(state),
        }),
      },
    ),
  )
