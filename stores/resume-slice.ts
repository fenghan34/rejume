import type { AppStore } from './app-store'
import type { StateCreator } from 'zustand'
import { uniqueId } from 'lodash'

export type Resume = {
  id: string
  title: string
  content: string
  createdTime: number
  updatedTime: number
}

type ResumeSliceState = {
  resume: Resume
  resumeList: Resume[]
}

type ResumeSliceActions = {
  createResume: (resume: Resume) => void
  updateResume: (resume: Partial<Resume>) => void
  deleteResume: (resumeId: string) => void
  setResume: (resume: Resume) => void
}

export type ResumeSlice = ResumeSliceState & ResumeSliceActions

export const partializeResumeSlice = (s: ResumeSlice) => ({
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
    id: uniqueId('resume-'),
    title: '',
    content: '',
    createdTime: Date.now(),
    updatedTime: Date.now(),
  }

  return {
    resume: exampleResume,
    resumeList: [exampleResume],

    setResume: (resume) =>
      set((state) => {
        state.resume = resume
      }),

    createResume: (resume) =>
      set((state) => {
        state.resumeList.push(resume)
        state.resume = resume
      }),

    updateResume: (resume) =>
      set((state) => {
        const updated = {
          ...resume,
          updatedTime: Date.now(),
        }

        Object.assign(state.resume, updated)

        const index = state.resumeList.findIndex(
          (r) => r.id === state.resume.id,
        )

        if (index !== -1) {
          state.resumeList[index] = state.resume
        } else {
          state.resumeList.push(state.resume)
          state.resumeList.sort((a, b) => a.createdTime - b.createdTime)
        }
      }),

    deleteResume: (resumeId) =>
      set((state) => {
        const index = state.resumeList.findIndex(
          (resume) => resume.id === resumeId,
        )
        if (index !== -1) {
          state.resumeList.splice(index, 1)
        }

        if (state.resume.id === resumeId) {
          if (state.resumeList.length > 0) {
            state.resume = state.resumeList[0]
          } else {
            state.resume = exampleResume
            state.resumeList = [exampleResume]
          }
        }
      }),
  }
}
