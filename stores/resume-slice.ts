import type { AppStore } from './app-store'
import type { ResumeSchema } from '@/lib/db/schema'
import type { StateCreator } from 'zustand'

type ResumeSliceState = {
  resume: ResumeSchema | null
}

type ResumeSliceActions = {
  setResume: (resume: ResumeSchema) => void
}

export type ResumeSlice = ResumeSliceState & ResumeSliceActions

export const createResumeSlice: StateCreator<
  AppStore,
  [['zustand/immer', never]],
  [],
  ResumeSlice
> = (set) => ({
  resume: null,

  setResume(resume) {
    set((state) => {
      state.resume = resume
    })
  },
})
