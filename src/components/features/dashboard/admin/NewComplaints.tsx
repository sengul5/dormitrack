import React, { useEffect, useState } from 'react'
import { Card, CardHeader, CardTitle } from '@ui/Card.component'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@ui/Table.component'
import Badge from '@ui/Badge.component'
import Button from '@ui/Button.component'
import Avatar from '@ui/Avatar.component'
import { Loader2 } from 'lucide-react'

interface Complaint {
  id: number
  img: string
  name: string
  room: string
  priority: string
  date: string
  desc: string
}

const NewComplaints: React.FC = () => {
  const [complaints, setComplaints] = useState<Complaint[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        setLoading(true)
        // Backend endpoint'inden verileri çekiyoruz
        const res = await fetch('/api/complaints/admin?view=active')
        if (!res.ok) throw new Error('Fetch failed')
        const data = await res.json()
        
        // Backend'den gelen veriyi (formatted) alıyoruz
        // Sadece son 3 tanesini dashboard'da gösteriyoruz
        setComplaints(data.slice(0, 3))
      } catch (error) {
        console.error("Dashboard Complaints Hatası:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchComplaints()
  }, [])

  const getSeverityVariant = (s: string) => {
    switch (s?.toLowerCase()) {
      case 'critical': return 'danger'
      case 'high': return 'warning'
      default: return 'info'
    }
  }

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>
          Recent Complaints{' '}
          {!loading && <span className="ml-1 text-sm font-medium text-gray-400">({complaints.length})</span>}
        </CardTitle>
      </CardHeader>

      <div className="p-2 min-h-[200px] relative">
        {loading ? (
          <div className="flex h-32 items-center justify-center">
            <Loader2 className="animate-spin text-blue-600" />
          </div>
        ) : (
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
                  <TableCell className="py-8 text-center text-gray-500">
                    No active complaints.
                  </TableCell>
                </TableRow>
              ) : (
                complaints.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="pl-2">
                      <Avatar src={item.img} alt={item.name} />
                    </TableCell>
                    {/* Artık veritabanındaki GERÇEK isim gelecek */}
                    <TableCell className="font-bold text-gray-800">{item.name}</TableCell>
                    <TableCell className="font-medium text-gray-500">{item.room}</TableCell>
                    <TableCell>
                      <Badge variant={getSeverityVariant(item.priority) as any}>{item.priority}</Badge>
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
        )}
      </div>

      <div className="border-t border-gray-50 p-4 text-right">
        <a href="/dashboard/admin/complaints">
          <Button size="sm">See All</Button>
        </a>
      </div>
    </Card>
  )
}

export default NewComplaints