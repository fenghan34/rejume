'use client'

import React from 'react'
import { ModeToggle } from './mode-toggle'
import { Preview } from './preview'

export function PublicResume({ content }: { content: string }) {
  return (
    <div className="bg-accent py-12 relative h-screen overflow-y-auto scrollbar-primary scrollbar-gutter-stable">
      <Preview
        className="mx-auto"
        content={content}
        autoScaleOptions={{ enabled: false }}
      />

      <ModeToggle className="fixed top-2 right-4" />
    </div>
  )
}
