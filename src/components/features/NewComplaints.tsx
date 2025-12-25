import React, { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle } from '@ui/Card.component'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@ui/Table.component'
import Badge from '@ui/Badge.component'
import Button from '@ui/Button.component'
import Avatar from '@ui/Avatar.component'

// SERVİS BAĞLANTISI
import { complaintService } from '@/services/complaints'

interface Complaint {
  id: number
  photo: string
  name: string
  room: string
  severity: 'Critical' | 'High' | 'Medium' | 'Low'
  date: string
  desc: string
}

const NewComplaints: React.FC = () => {
  const [complaints, setComplaints] = useState<Complaint[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const response = await complaintService.getAll()
        // Veri güvenliği
        const data = Array.isArray(response) ? response : (response as any)?.data || []

        // Backend verisini UI formatına çeviriyoruz
        const formattedData: Complaint[] = data.map((item: any) => ({
          id: item.id,
          // Eğer backend'den fotoğraf gelmiyorsa isim baş harflerinden avatar yap
          photo: item.student?.photo || `https://ui-avatars.com/api/?name=${item.student?.name || 'Student'}&background=random`,
          name: item.student?.name || 'Unknown Student',
          room: item.room || 'Unknown',
          // Backend 'priority' diyor, UI 'severity' istiyor
          severity: item.priority || 'Low',
          date: item.date || new Date().toLocaleDateString('tr-TR'),
          desc: item.subject || item.type || item.description || 'No details',
        }))

        // Ters çevir (en yeni en üstte) ve ilk 5 tanesini al
        setComplaints(formattedData.reverse().slice(0, 5))
      } catch (error) {
        console.error('NewComplaints widget hatası:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchComplaints()
  }, [])

  const getSeverityVariant = (s: string) => {
    switch (s) {
      case 'Critical':
      case 'High':
        return 'danger'
      case 'Medium':
        return 'warning'
      default:
        return 'info' // Low
    }
  }

  if (loading) {
    return (
      <Card className="mt-8 p-4 text-center text-gray-400">
        Loading recent complaints...
      </Card>
    )
  }

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>
          Recent Complaints{' '}
          <span className="ml-1 text-sm font-medium text-gray-400">
            ({complaints.length})
          </span>
        </CardTitle>
      </CardHeader>

      <div className="p-2">
        <Table>
          <TableHeader>
            <TableHead className="pl-2">Photo</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Room</TableHead>
            <TableHead>Severity</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Description</TableHead>
          </TableHeader>
          <TableBody>
            {complaints.length === 0 ? (
              <TableRow>
                <td colSpan={6} className="h-24 text-center text-gray-500">
                  No new complaints.
                </td>
              </TableRow>
            ) : (
              complaints.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="pl-2">
                    <Avatar src={item.photo} alt={item.name} />
                  </TableCell>
                  <TableCell className="font-bold text-gray-800">{item.name}</TableCell>
                  <TableCell className="font-medium text-gray-500">{item.room}</TableCell>
                  <TableCell>
                    <Badge variant={getSeverityVariant(item.severity) as any}>
                      {item.severity}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs text-gray-500">{item.date}</TableCell>
                  <TableCell className="max-w-[150px] truncate text-xs text-gray-400">
                    {item.desc}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="border-t border-gray-50 p-4 text-right">
        <a href="/complaints">
          <Button size="sm">See All</Button>
        </a>
      </div>
    </Card>
  )
}

export default NewComplaints