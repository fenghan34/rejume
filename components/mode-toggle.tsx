'use client'

import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { Button } from './ui/button'

export function ModeToggle() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  const isDarkMode = theme === 'dark'

  if (!mounted) {
    return (
      <Button
        variant="ghost"
        title="Toggle Mode"
        className="cursor-pointer size-8"
      />
    )
  }

  return (
    <Button
      variant="ghost"
      title="Toggle Mode"
      className="cursor-pointer size-8"
      onClick={() => setTheme(isDarkMode ? 'light' : 'dark')}
    >
      {isDarkMode ? <Moon /> : <Sun />}
    </Button>
  )
}
