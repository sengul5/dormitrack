import React from 'react'
import { authClient } from '@/lib/auth-client' // Auth client eklendi

import StatsRow from './admin/StatsRow'
import NewRequests from './admin/NewRequests'
import NewComplaints from './admin/NewComplaints'
import FeedbackChart from './admin/FeedbackChart'
import AvailableStaff from './admin/AvailableStaff'
import StudentDashboard from './views/StudentDashboard'
import StaffDashboard from './views/StaffDashboard'

const DashboardManager: React.FC = () => {
  // useAppConfig yerine gerçek session verisi
  const { data: session, isPending } = authClient.useSession()

  if (isPending) {
    return <div className="p-10 text-center text-gray-400">Loading dashboard...</div>
  }

  const role = session?.user?.role || 'student' // Varsayılan student

  if (role === 'student') {
    return <StudentDashboard />
  }

  if (role === 'staff') {
    return <StaffDashboard />
  }

  // Admin Dashboard (Varsayılan)
  return (
    <>
      <StatsRow />
      <div className="grid grid-cols-1 items-start gap-8 pb-10 lg:grid-cols-3">
        <div className="flex flex-col gap-8 lg:col-span-2">
          <NewRequests />
          <NewComplaints />
        </div>
        <div className="sticky top-6 flex flex-col gap-8">
          <FeedbackChart />
          <AvailableStaff />
        </div>
      </div>
    </>
  )
}

export default DashboardManager
