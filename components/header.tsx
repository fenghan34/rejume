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

      <CurrentResumeTitle />

      <div className="flex items-center gap-4">
        <Toolbar />
        <div className="flex items-center gap-4">
          <div>
            <Button
              className="cursor-pointer"
              variant="ghost"
              title="GitHub"
              size="icon"
              asChild
            >
              <Link href="https://github.com/fenghan34/rejume" target="_blank">
                <GitHub />
              </Link>
            </Button>
            <ModeToggle />
          </div>

          <UserAvatar />
        </div>
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
