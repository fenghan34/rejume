import type { AppStore } from './app-store'
import type { StateCreator } from 'zustand'

type ChatSliceState = {
  copiedMessageId?: string
}

type ChatSliceActions = {
  setCopiedMessageId: (messageId?: string) => void
}

export type ChatSlice = ChatSliceState & ChatSliceActions

export const createChatSlice: StateCreator<
  AppStore,
  [['zustand/immer', never]],
  [],
  ChatSlice
> = (set) => ({
  setCopiedMessageId: (messageId) => {
    set((state) => {
      state.copiedMessageId = messageId
    })
  },
})
