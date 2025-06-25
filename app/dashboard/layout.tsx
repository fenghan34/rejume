import { TooltipProvider } from '@/components/ui/tooltip'
import { AppStoreProvider } from '@/providers/app'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <TooltipProvider>
      <AppStoreProvider>{children}</AppStoreProvider>
    </TooltipProvider>
  )
}
