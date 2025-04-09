'use client'

import type { AppStore } from '@/stores/app-store'
import type { ReactNode } from 'react'
import { createContext, useRef, useContext } from 'react'
import { useStore } from 'zustand'
import { createAppStore } from '@/stores/app-store'

export type AppStoreApi = ReturnType<typeof createAppStore>

export const AppStoreContext = createContext<AppStoreApi | undefined>(undefined)

export const AppStoreProvider = ({ children }: { children: ReactNode }) => {
  const storeRef = useRef<AppStoreApi>(createAppStore())

  return (
    <AppStoreContext.Provider value={storeRef.current}>
      {children}
    </AppStoreContext.Provider>
  )
}

export const useAppStore = <T,>(selector: (store: AppStore) => T): T => {
  const appStoreContext = useContext(AppStoreContext)

  if (!appStoreContext) {
    throw new Error(`useAppStore must be used within AppStoreProvider`)
  }

  return useStore(appStoreContext, selector)
}
