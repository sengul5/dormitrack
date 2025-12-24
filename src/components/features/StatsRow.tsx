import React from 'react'
import { Users, UserCheck, Briefcase } from 'lucide-react'
import { Card } from '@ui/Card.component'

const StatsRow: React.FC = () => {
  const stats = [
    { label: 'Total Students', value: '842', icon: Users, color: 'bg-blue-100 text-blue-600' },
    { label: 'Total Manager', value: '14', icon: UserCheck, color: 'bg-red-100 text-red-600' },
    { label: 'Total Staff', value: '62', icon: Briefcase, color: 'bg-yellow-100 text-yellow-600' },
  ]

  return (
    <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-4">
      {stats.map((stat, index) => (
        <Card key={index} className="flex items-center gap-4 p-6">
          <div className={`rounded-full p-3 ${stat.color}`}>
            <stat.icon size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">{stat.label}</p>
            <h3 className="text-2xl font-bold text-gray-800">{stat.value}</h3>
          </div>
        </Card>
      ))}

      {/* Özel Tarih Kartı */}
      <Card className="flex flex-col items-center justify-center bg-white p-6 text-center">
        <p className="text-sm font-semibold text-gray-500">2025 - 2026</p>
        <p className="font-bold text-gray-800">Fall Academic Term</p>
      </Card>
    </div>
  )
}

export default StatsRow
