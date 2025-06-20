import { Spinner } from '@/components/icons'

export default function DashboardLoading() {
  return (
    <div className="p-6">
      <Spinner className="size-6 animate-spin" />
    </div>
  )
}
