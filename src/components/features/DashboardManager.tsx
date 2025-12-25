import React from 'react'
import { useAppConfig } from '@/hooks/useAppConfig'

import StatsRow from './StatsRow'
import NewRequests from './NewRequests'
import NewComplaints from './NewComplaints'
import FeedbackChart from './FeedbackChart'
import AvailableStaff from './AvailableStaff'
import StudentDashboard from './StudentDashboard' // .tsx olan dosyanı çağırır
import StaffDashboard from './StaffDashboard'

interface DashboardManagerProps {
  role?: 'admin' | 'staff' | 'student'
}

const DashboardManager: React.FC<DashboardManagerProps> = () => {
  // Config'den rolü çekiyoruz
  const { role } = useAppConfig()

  // 🛠️ DEBUG: Tarayıcı konsoluna (F12) bak.
  // Eğer burada "Aktif Rol: admin" yazıyorsa, sorun useAppConfig dosyasındadır.
  console.log('DashboardManager -> Aktif Rol:', role)

  // 1. ÖĞRENCİ GÖRÜNÜMÜ
  if (role === 'student') {
    return <StudentDashboard />
  }

  // 2. PERSONEL GÖRÜNÜMÜ
  if (role === 'staff') {
    return <StaffDashboard />
  }

  // 3. ADMIN GÖRÜNÜMÜ (Varsayılan)
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