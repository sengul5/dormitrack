import React, { useState, useEffect } from 'react'
import { Users, UserCheck, Briefcase, Loader2 } from 'lucide-react'
import { Card } from '@ui/Card.component'

const StatsRow: React.FC = () => {
  // State tanımları (Başlangıçta 0)
  const [counts, setCounts] = useState({
    students: 0,
    managers: 0,
    staff: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // NOT: Burası ileride Backend'den gerçek veri çekecek.
    // Örnek: const data = await adminService.getDashboardStats();
    const fetchStats = async () => {
      try {
        // Şimdilik Backend varmış gibi 1 saniye bekletip veriyi set ediyoruz
        await new Promise((resolve) => setTimeout(resolve, 1000))
        
        setCounts({
          students: 842, // Bu sayılar Backend'den gelecek
          managers: 14,
          staff: 62,
        })
      } catch (error) {
        console.error('İstatistik hatası:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  const stats = [
    {
      label: 'Total Students',
      value: counts.students,
      icon: Users,
      color: 'bg-blue-100 text-blue-600',
    },
    {
      label: 'Total Manager',
      value: counts.managers,
      icon: UserCheck,
      color: 'bg-red-100 text-red-600',
    },
    {
      label: 'Total Staff',
      value: counts.staff,
      icon: Briefcase,
      color: 'bg-yellow-100 text-yellow-600',
    },
  ]

  return (
    <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-4">
      {stats.map((stat, index) => (
        <Card key={index} className="flex items-center gap-4 p-6 transition-shadow hover:shadow-md">
          <div className={`rounded-full p-3 ${stat.color}`}>
            <stat.icon size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">{stat.label}</p>
            {loading ? (
              // Yükleniyor animasyonu
              <div className="mt-2 h-6 w-16 animate-pulse rounded bg-gray-200"></div>
            ) : (
              // Gerçek Veri
              <h3 className="text-2xl font-bold text-gray-800">{stat.value}</h3>
            )}
          </div>
        </Card>
      ))}

      {/* Özel Tarih Kartı (Statik kalabilir) */}
      <Card className="flex flex-col items-center justify-center bg-blue-600 p-6 text-center text-white shadow-lg shadow-blue-200">
        <p className="text-sm font-medium opacity-80">Current Term</p>
        <p className="text-lg font-bold">2025 - 2026 Fall</p>
      </Card>
    </div>
  )
}

export default StatsRow