import Link from 'next/link'
import { montserrat } from '@/lib/fonts'
import { GitHub } from './icons'
import { ModeToggle } from './mode-toggle'
import { CurrentResumeTitle } from './resume-title'
import { Toolbar } from './toolbar'
import { Button } from './ui/button'
import { UserAvatar } from './user-avatar'

export function Header() {
  return (
    <header className="flex items-center justify-between px-6 h-14">
      <Logo />

      <div className="grow flex items-center justify-center">
        <CurrentResumeTitle />
      </div>

      <Toolbar />

      <div className="flex items-center gap-2">
        <Button
          className="cursor-pointer size-8"
          variant="ghost"
          title="GitHub"
          asChild
        >
          <Link href="https://github.com/fenghan34/rejume" target="_blank">
            <GitHub />
          </Link>
        </Button>

        <ModeToggle />

        <UserAvatar />
      </div>
    </header>
  )
}

export function Logo() {
  return (
    <Link href="/" className={montserrat.className}>
      Rejume
    </Link>
  )
}
