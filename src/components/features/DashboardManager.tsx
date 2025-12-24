import React from 'react'
import { useAppConfig } from '@/hooks/useAppConfig'

import StatsRow from './StatsRow'
import NewRequests from './NewRequests'
import NewComplaints from './NewComplaints'
import FeedbackChart from './FeedbackChart'
import AvailableStaff from './AvailableStaff'
import StudentDashboard from './StudentDashboard'
import StaffDashboard from './StaffDashboard'

interface DashboardManagerProps {
  role?: 'admin' | 'staff' | 'student' // Opsiyonel, hook yoksa prop'tan alabilir
}

const DashboardManager: React.FC<DashboardManagerProps> = () => {
  const { role } = useAppConfig() // Eğer hook kullanacaksan burayı aç

  if (role === 'student') {
    return <StudentDashboard />
  }

  if (role === 'staff') {
    return <StaffDashboard />
  }

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
