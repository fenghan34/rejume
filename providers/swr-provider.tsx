'use client'
import { SWRConfig } from 'swr'

export const defaultFetcher = async (url: string) => {
  const res = await fetch(url)
  if (!res.ok) {
    throw new Error(res.statusText)
  }
  return await res.json()
}

export const SWRProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <SWRConfig
      value={{
        fetcher: defaultFetcher,
      }}
    >
      {children}
    </SWRConfig>
  )
}
