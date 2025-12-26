import React, { useEffect, useState } from 'react'
import { Card, CardHeader, CardTitle } from '@ui/Card.component'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@ui/Table.component'
import Badge from '@ui/Badge.component'
import Button from '@ui/Button.component'
import Avatar from '@ui/Avatar.component'
import { Loader2 } from 'lucide-react'

// Types
interface Request {
  id: number
  name: string
  studentId: string
  room: string // Oda numarası eklendi
  priority: 'High' | 'Medium' | 'Low'
  date: string
  desc: string
  avatar: string
}

const NewRequests: React.FC = () => {
  const [requests, setRequests] = useState<Request[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchNewRequests = async () => {
      try {
        setLoading(true)
        const res = await fetch('/api/requests')
        if (!res.ok) throw new Error('Requests fetch failed')
        const data = await res.json()
        
        const formatted = data.map((item: any) => ({
          id: item.id,
          name: item.user?.name || item.name || 'Unknown',
          studentId: item.user?.studentId || item.studentId || 'N/A',
          room: item.room || 'N/A', // Oda numarası backend'den alınıyor
          priority: item.priority || 'Medium',
          date: item.date || (item.createdAt ? new Date(item.createdAt).toLocaleDateString('tr-TR') : 'N/A'),
          desc: item.description || item.desc || '',
          avatar: item.user?.image || `https://i.pravatar.cc/150?u=${item.id}`
        }))

        setRequests(formatted.slice(0, 3)) 
        setTotalCount(data.length)
      } catch (error) {
        console.error("Requests fetch error:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchNewRequests()
  }, [])

  const getPriorityVariant = (p: string) => {
    const priority = p.charAt(0).toUpperCase() + p.slice(1).toLowerCase()
    switch (priority) {
      case 'High':
      case 'Critical':
        return 'dangerSoft'
      case 'Medium':
        return 'warning'
      default:
        return 'success'
    }
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center">
          New Requests 
          {!loading && (
            <span className="ml-2 text-sm font-normal text-gray-400">
              ({totalCount})
            </span>
          )}
        </CardTitle>
      </CardHeader>

      <div className="p-2 min-h-[200px] relative">
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-white/50 z-10">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableHead className="pl-2">Photo</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Room</TableHead> {/* Başlık eklendi */}
              <TableHead>ID Number</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Description</TableHead>
            </TableHeader>
            <TableBody>
              {requests.length === 0 ? (
                <TableRow>
                  <TableCell  className="text-center py-10 text-gray-400">
                    No new requests found.
                  </TableCell>
                </TableRow>
              ) : (
                requests.map((req) => (
                  <TableRow key={req.id}>
                    <TableCell className="pl-2">
                      <Avatar src={req.avatar} alt={req.name} />
                    </TableCell>
                    <TableCell className="font-medium text-gray-700">{req.name}</TableCell>
                    {/* Oda Numarası Hücresi */}
                    <TableCell className="font-semibold text-blue-600">
                      {req.room}
                    </TableCell>
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
        )}
      </div>

      <div className="border-t border-gray-50 p-4 text-right">
        <a href="/dashboard/admin/requests">
          <Button size="sm">See All</Button>
        </a>
      </div>
    </Card>
  )
}

export default NewRequests