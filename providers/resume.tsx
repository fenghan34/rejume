'use client'

import type { ResumeSchema } from '@/lib/db/schema'
import React, { createContext, useContext } from 'react'

const ResumeContext = createContext<ResumeSchema | null>(null)

export function ResumeProvider({
  value,
  children,
}: {
  value: ResumeSchema
  children: React.ReactNode
}) {
  return (
    <ResumeContext.Provider value={value}>{children}</ResumeContext.Provider>
  )
}

export function useResume() {
  const resume = useContext(ResumeContext)
  if (!resume) throw new Error('useResume must be used within ResumeProvider')
  return resume
}
