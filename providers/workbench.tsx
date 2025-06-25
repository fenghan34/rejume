import React, { createContext, useContext } from 'react'
import { ResumeModel } from '@/lib/db/schema'
import { MonacoEditor } from '@/lib/monaco/types'

type WorkbenchContextType = {
  mode: string
  editor: MonacoEditor | null
  resume: ResumeModel
  updateResumeContent: (content: string) => void
}

const WorkbenchContext = createContext<WorkbenchContextType>({
  mode: 'editor',
  editor: null,
  resume: {} as ResumeModel,
  updateResumeContent: () => {},
})

export const WorkbenchProvider = ({
  children,
  value,
}: {
  children: React.ReactNode
  value: WorkbenchContextType
}) => {
  return (
    <WorkbenchContext.Provider value={value}>
      {children}
    </WorkbenchContext.Provider>
  )
}

export const useWorkbenchContext = () => {
  const context = useContext(WorkbenchContext)
  if (!context) {
    throw new Error(
      'useWorkbenchContext must be used within a WorkbenchProvider',
    )
  }
  return context
}
