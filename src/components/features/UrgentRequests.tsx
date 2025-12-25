import React, { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle } from '@ui/Card.component'
import Badge from '@ui/Badge.component'

// SERVİS BAĞLANTISI
import { requestService } from '@/services/requests'

interface RequestItem {
  id: number
  name: string
  category: string
  // 'Critical' seviyesini de ekliyoruz
  level: 'High' | 'Critical' | 'Medium' | 'Low'
  room: string
}

const UrgentRequests: React.FC = () => {
  const [urgents, setUrgents] = useState<RequestItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUrgentRequests = async () => {
      try {
        const response = await requestService.getAll()
        const data = Array.isArray(response) ? response : (response as any)?.data || []

        // Backend verisini formatla
        const formattedData: RequestItem[] = data.map((item: any) => ({
          id: item.id,
          name: item.student?.name || 'Unknown Student',
          category: item.category || 'General Issue',
          level: item.priority || 'Low',
          room: item.room || 'Unknown',
          status: item.status || 'Pending' // Filtreleme için gerekli olabilir
        }))

        // FİLTRELEME MANTIĞI:
        // 1. Sadece 'High' veya 'Critical' olanlar
        // 2. Henüz çözülmemiş (Completed/Resolved olmayanlar) olanlar
        const urgentItems = formattedData.filter(
          (item: any) => 
            (item.level === 'High' || item.level === 'Critical') &&
            !['Resolved', 'Completed', 'Cancelled'].includes(item.status)
        )

        setUrgents(urgentItems.reverse())
      } catch (error) {
        console.error('Acil talepler yüklenemedi:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchUrgentRequests()
  }, [])

  return (
    <Card className="flex h-full flex-col">
      <CardHeader variant="red">
        <CardTitle className="text-sm uppercase tracking-wide">🚨 Urgent Requests</CardTitle>
        <span className="rounded-md bg-white px-2 py-1 text-xs font-bold text-red-600 shadow-sm">
          {urgents.length} Pending
        </span>
      </CardHeader>

      <div className="flex-1 overflow-y-auto">
        {loading ? (
            <div className="p-6 text-center text-xs text-gray-400">Loading critical tasks...</div>
        ) : urgents.length === 0 ? (
            <div className="p-6 text-center text-sm text-gray-500">
                No urgent issues right now. <br/> Everything looks good! ✅
            </div>
        ) : (
            urgents.map((item) => (
            <div
                key={item.id}
                className="flex items-center justify-between border-b border-gray-50 p-4 transition-colors hover:bg-red-50/30"
            >
                <div>
                <div className="mb-1 flex items-center gap-2">
                    <span className="text-sm font-bold text-gray-800">{item.name}</span>
                    <span className="text-xs font-medium text-gray-400">Room {item.room}</span>
                </div>
                <div className="text-xs text-gray-500">{item.category}</div>
                </div>

                <Badge variant={item.level === 'Critical' ? 'danger' : 'warning'}>{item.level}</Badge>
            </div>
            ))
        )}
      </div>
    </Card>
  )
}

export default UrgentRequests