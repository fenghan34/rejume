import React from 'react'

export default function DashboardLoading() {
  return (
    <div className="fixed top-0 left-0 right-0">
      <div className="h-1 bg-purple-600 animate-dashboard-progress" />
    </div>
  )
}
