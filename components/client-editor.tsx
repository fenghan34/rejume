'use client'

import dynamic from 'next/dynamic'

export const Editor = dynamic(
  () => import('@/components/editor').then((module) => module.Editor),
  {
    ssr: false,
  },
)
