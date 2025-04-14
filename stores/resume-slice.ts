import type { AppStore } from './app-store'
import type { StateCreator } from 'zustand'
import { v4 as uuidv4 } from 'uuid'
import exampleResumeContent from '@/examples/en.md'

export type Resume = {
  id: string
  title: string
  content: string
  createdTime: number
  updatedTime: number
}

export type ResumeSliceState = {
  resume: Resume
  resumeList: Resume[]
}

export type ResumeSliceActions = {
  createResume: (resume: Resume) => void
  updateResume: (resumeId: string, resume: Partial<Omit<Resume, 'id'>>) => void
  removeResume: (resumeId: string) => void
  setResume: (resumeId: string) => void
}

export type ResumeSlice = ResumeSliceState & ResumeSliceActions

export const partializeResumeSlice = (s: ResumeSliceState) => ({
  resume: s.resume,
  resumeList: s.resumeList,
})

export const createResumeSlice: StateCreator<
  AppStore,
  [['zustand/immer', never], ['zustand/persist', unknown]],
  [],
  ResumeSlice
> = (set) => {
  const exampleResume: Resume = {
    id: uuidv4(),
    title: 'Example Resume',
    content: exampleResumeContent,
    createdTime: Date.now(),
    updatedTime: Date.now(),
  }

  return {
    resume: exampleResume,
    resumeList: [exampleResume],

    setResume: (id) =>
      set((state) => {
        const resume = state.resumeList.find((resume) => resume.id === id)
        if (resume) {
          state.resume = resume
        }
      }),

    createResume: (resume) =>
      set((state) => {
        state.resumeList.unshift(resume)
        state.resume = resume
      }),

    updateResume: (id, resume) =>
      set((state) => {
        const updated = {
          ...resume,
          updatedTime: Date.now(),
        }

        const index = state.resumeList.findIndex((r) => r.id === id)
        if (index >= 0) {
          Object.assign(state.resumeList[index], updated)
        }

        if (state.resume.id === id) {
          Object.assign(state.resume, updated)
        }
      }),

    removeResume: (id) =>
      set((state) => {
        if (state.resumeList.length <= 1) return

        const index = state.resumeList.findIndex((resume) => resume.id === id)
        if (index !== -1) {
          state.resumeList.splice(index, 1)
        }

        if (state.resume.id === id) {
          state.resume = state.resumeList[0]
        }
      }),
  }
}
