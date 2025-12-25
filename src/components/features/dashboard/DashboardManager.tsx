import React from 'react'
import { authClient } from '@/lib/auth-client' // Auth client importu

import StatsRow from './admin/StatsRow'
import NewRequests from './admin/NewRequests'
import NewComplaints from './admin/NewComplaints'
import FeedbackChart from './admin/FeedbackChart'
import AvailableStaff from './admin/AvailableStaff'
import StudentDashboard from './views/StudentDashboard'
import StaffDashboard from './views/StaffDashboard'

const DashboardManager: React.FC = () => {
  // Better-auth session hook'u
  const { data: session, isPending } = authClient.useSession()

  // Session yüklenirken boş veya loader göstermek,
  // Admin panelinin anlık olarak "flash" yapmasını engeller.
  if (isPending) {
    return (
      <div className="flex h-full w-full items-center justify-center p-10 text-gray-400">
        Loading dashboard...
      </div>
    )
  }

  const role = session?.user?.role

  // Öğrenci Görünümü
  if (role === 'student') {
    return <StudentDashboard />
  }

  // Personel Görünümü
  if (role === 'staff') {
    return <StaffDashboard />
  }

  // Varsayılan Görünüm (Admin)
  // role === 'admin' kontrolü de eklenebilir ama
  // tanımlı olmayan rollerin de admin görmesini istiyorsanız böyle kalabilir.
  return (
    <div className="animate-in fade-in duration-500">
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
    </div>
  )
}

export default DashboardManager
