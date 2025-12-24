import React, { useEffect, useState } from 'react'
import { requestService } from '@/services/requests' // Servis importu
import type { RequestItem } from '@/services/requests/types' // Tip importu

const RequestTable = () => {
  // State tipini belirttik, artık TypeScript her şeyi biliyor
  const [requests, setRequests] = useState<RequestItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Veri Çekme
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        // client.ts sayesinde burası Promise<RequestItem[]> döner
        const data = await requestService.getAll()
        setRequests(data)
      } catch (err: any) {
        setError(err.message || 'Veri yüklenemedi')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) return <div>Yükleniyor...</div>
  if (error) return <div>Hata: {error}</div>

  return (
    <div>
      {requests.map((item) => (
        // item.name, item.status vs. otomatik tamamlanır
        <div key={item.id}>
          {item.name} - {item.status}
        </div>
      ))}
    </div>
  )
}
