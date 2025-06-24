import { Logo } from '@/components/logo'
import { ModeToggle } from '@/components/mode-toggle'
import { CurrentResumeTitle } from '@/components/resume-title'
import { Toolbar } from '@/components/toolbar'
import { TooltipProvider } from '@/components/ui/tooltip'
import { UserAvatar } from '@/components/user-avatar'
import { AppStoreProvider } from '@/providers/app'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <TooltipProvider>
      <AppStoreProvider>
        <div className="flex flex-col h-screen">
          <header className="flex items-center justify-between px-6 h-14">
            <Logo />

            <div className="grow flex items-center justify-center">
              <CurrentResumeTitle />
            </div>

            <Toolbar />

            <div className="flex items-center gap-2">
              <ModeToggle />

              <UserAvatar />
            </div>
          </header>
          <main className="flex-1 overflow-hidden">{children}</main>
        </div>
      </AppStoreProvider>
    </TooltipProvider>
  )
}
