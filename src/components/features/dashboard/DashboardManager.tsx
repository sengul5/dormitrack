import React from 'react'
import { authClient } from '@/lib/auth-client'

// Görünümler (Views)
import AdminDashboard from './views/AdminDashboard' // Yeni eklediğimiz kapsayıcı
import StudentDashboard from './views/StudentDashboard'
import StaffDashboard from './views/StaffDashboard'

const DashboardManager: React.FC = () => {
  const { data: session, isPending } = authClient.useSession()

  if (isPending) {
    return <div className="p-10 text-center text-gray-400">Loading dashboard...</div>
  }

  // Rol kontrolünü garantiye almak için küçük harfe çeviriyoruz
  const role = session?.user?.role?.toLowerCase() || 'student'

  // 1. Öğrenci Görünümü
  if (role === 'student') {
    return <StudentDashboard />
  }

  // 2. Personel Görünümü
  if (role === 'staff') {
    return <StaffDashboard />
  }

  // 3. Admin Görünümü
  // Artık tüm o StatsRow, NewRequests vb. kodları AdminDashboard.tsx içine taşıdığın için
  // burada sadece bu bileşeni çağırmak yeterli.
  if (role === 'admin') {
    return <AdminDashboard />
  }

  // Hiçbir role uymuyorsa varsayılan (Örn: Yetkisiz giriş denemesi)
  return <StudentDashboard />
}

export default DashboardManager