import { TooltipProvider } from '@/components/ui/tooltip'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <TooltipProvider>{children}</TooltipProvider>
}
