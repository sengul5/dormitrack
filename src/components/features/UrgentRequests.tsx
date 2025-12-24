import React from 'react'
import { Card, CardHeader, CardTitle } from '@ui/Card.component'
import Badge from '@ui/Badge.component'

interface RequestItem {
  name: string
  category: string
  level: 'High' | 'Medium' | 'Low'
  room: string
}

const UrgentRequests: React.FC = () => {
  const urgents: RequestItem[] = [
    { name: 'John Walker', category: 'Wifi/Network', level: 'High', room: '101' },
    { name: 'Mustafa Genç', category: 'Plumbing', level: 'High', room: '204' },
    { name: 'Niran Öz', category: 'Light Broken', level: 'High', room: '305' },
    { name: 'Şeyma Yangın', category: 'Cleaning', level: 'Medium', room: '102' },
    { name: 'Kerem Yıldız', category: 'Furniture', level: 'Medium', room: '401' },
  ]

  return (
    <Card className="flex h-full flex-col">
      <CardHeader variant="red">
        <CardTitle className="text-sm uppercase tracking-wide">🚨 Urgent Requests</CardTitle>
        <span className="rounded-md bg-white px-2 py-1 text-xs font-bold text-red-600 shadow-sm">
          {urgents.length} Pending
        </span>
      </CardHeader>

      <div className="flex-1 overflow-y-auto">
        {urgents.map((item, index) => (
          <div
            key={index}
            className="flex items-center justify-between border-b border-gray-50 p-4 transition-colors hover:bg-red-50/30"
          >
            <div>
              <div className="mb-1 flex items-center gap-2">
                <span className="text-sm font-bold text-gray-800">{item.name}</span>
                <span className="text-xs font-medium text-gray-400">Room {item.room}</span>
              </div>
              <div className="text-xs text-gray-500">{item.category}</div>
            </div>

            <Badge variant={item.level === 'High' ? 'danger' : 'warning'}>{item.level}</Badge>
          </div>
        ))}
      </div>
    </Card>
  )
}

export default UrgentRequests
