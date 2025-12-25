import React, { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle } from '@ui/Card.component'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@ui/Table.component'
import Badge from '@ui/Badge.component'
import Button from '@ui/Button.component'
import Avatar from '@ui/Avatar.component'

// SERVİS BAĞLANTISI
import { requestService } from '@/services/requests'

// Types
interface Request {
  id: number
  name: string
  studentId: string
  priority: 'High' | 'Medium' | 'Low' | 'Critical'
  date: string
  desc: string
  avatar: string
}

const NewRequests: React.FC = () => {
  const [requests, setRequests] = useState<Request[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await requestService.getAll()
        // Veri Güvenliği: Array kontrolü
        const data = Array.isArray(response) ? response : (response as any)?.data || []

        // Backend verisini UI formatına dönüştür
        const formattedData: Request[] = data.map((item: any) => ({
          id: item.id,
          // Öğrenci bilgisi yoksa 'Unknown' yaz
          name: item.student?.name || 'Unknown Student',
          studentId: item.student?.studentId || 'N/A',
          // Avatar yoksa ismin baş harflerinden oluştur
          avatar: item.student?.photo || `https://ui-avatars.com/api/?name=${item.student?.name || 'S'}&background=random`,
          priority: item.priority || 'Low',
          date: item.date || new Date().toLocaleDateString('tr-TR'),
          desc: item.category ? `${item.category} in ${item.room}` : (item.desc || 'No details'),
        }))

        // En yeniden eskiye sırala ve ilk 5 tanesini al
        setRequests(formattedData.reverse().slice(0, 5))
      } catch (error) {
        console.error('NewRequests widget hatası:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchRequests()
  }, [])

  const getPriorityVariant = (p: string) => {
    switch (p) {
      case 'High':
      case 'Critical':
        return 'dangerSoft' // Kırmızımsı
      case 'Medium':
        return 'warning'    // Turuncu
      default:
        return 'success'    // Yeşil (Low için)
    }
  }

  if (loading) {
    return (
      <Card className="mb-6 p-4 text-center text-gray-400">
        Loading requests...
      </Card>
    )
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>
          New Requests <span className="ml-1 text-sm font-normal text-gray-400">({requests.length})</span>
        </CardTitle>
      </CardHeader>

      <div className="p-2">
        <Table>
          <TableHeader>
            <TableHead className="pl-2">Photo</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>ID Number</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Description</TableHead>
          </TableHeader>
          <TableBody>
            {requests.length === 0 ? (
              <TableRow>
                <td colSpan={6} className="h-24 text-center text-gray-500">
                  No new requests found.
                </td>
              </TableRow>
            ) : (
              requests.map((req) => (
                <TableRow key={req.id}>
                  <TableCell className="pl-2">
                    <Avatar src={req.avatar} alt={req.name} />
                  </TableCell>
                  <TableCell className="font-medium text-gray-700">{req.name}</TableCell>
                  <TableCell className="font-mono text-xs text-gray-500">{req.studentId}</TableCell>
                  <TableCell>
                    <Badge variant={getPriorityVariant(req.priority) as any}>{req.priority}</Badge>
                  </TableCell>
                  <TableCell className="text-xs text-gray-500">{req.date}</TableCell>
                  <TableCell className="max-w-[150px] truncate text-xs text-gray-400">
                    {req.desc}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="border-t border-gray-50 p-4 text-right">
        <a href="/requests">
          <Button size="sm">See All</Button>
        </a>
      </div>
    </Card>
  )
}

export default NewRequests