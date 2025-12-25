import React, { useState, useEffect } from 'react'
import { Eye, Star, MapPin } from 'lucide-react'
import { Card, CardHeader, CardTitle } from '@ui/Card.component'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@ui/Table.component'
import Badge from '@ui/Badge.component'
import Button from '@ui/Button.component'
import Modal from '@ui/Modal.component'
import GiveFeedbackModal from './GiveFeedbackModal'

// SERVİS BAĞLANTISI
import { complaintService } from '@/services/complaints'

interface MyComplaint {
  id: number
  category: string
  room: string
  // Genişletilmiş tipler (Backend uyumu için)
  priority: 'Critical' | 'High' | 'Medium' | 'Low'
  date: string
  status: 'Investigating' | 'Resolved' | 'Pending' | 'Open'
  desc: string
  rated?: boolean
  rating?: number
}

const MyComplaintsTable: React.FC = () => {
  const [selected, setSelected] = useState<MyComplaint | null>(null)
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false)
  const [itemToRate, setItemToRate] = useState<MyComplaint | null>(null)

  const [myComplaints, setMyComplaints] = useState<MyComplaint[]>([])
  const [loading, setLoading] = useState(true)

  // --- VERİ ÇEKME ---
  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        // Sadece benim şikayetlerimi getir
        const response = await complaintService.getMyComplaints()
        const data = Array.isArray(response) ? response : (response as any)?.data || []

        const formattedData: MyComplaint[] = data.map((item: any) => ({
          id: item.id,
          category: item.type || item.subject || 'General Complaint', // Backend alan adı değişebilir diye önlem
          room: item.room || 'Unknown',
          priority: item.priority || 'Low',
          date: item.date || new Date().toLocaleDateString('tr-TR'),
          status: item.status || 'Pending',
          desc: item.description || item.desc || 'No details provided.',
          rated: false,
          rating: 0,
        }))

        setMyComplaints(formattedData.reverse())
      } catch (error) {
        console.error('Şikayetler yüklenemedi:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchComplaints()
  }, [])

  const handleOpenRate = (item: MyComplaint) => {
    setItemToRate(item)
    setFeedbackModalOpen(true)
  }

  const handleFeedbackSubmit = (data: { rating: number }) => {
    if (itemToRate) {
      setMyComplaints((prev) =>
        prev.map((item) =>
          item.id === itemToRate.id ? { ...item, rated: true, rating: data.rating } : item
        )
      )
    }
  }

  // Rozet Rengi Belirleyici
  const getPriorityVariant = (p: string) => {
    if (p === 'Critical') return 'danger'
    if (p === 'High') return 'warning'
    return 'info' // Medium ve Low için
  }

  const getStatusVariant = (s: string) => {
    if (s === 'Resolved') return 'success'
    if (s === 'Investigating') return 'warning'
    return 'info' // Pending vb.
  }

  if (loading) {
    return (
      <Card className="flex h-full flex-col p-6">
        <div className="text-center text-gray-400">Loading complaints...</div>
      </Card>
    )
  }

  return (
    <Card className="flex h-full flex-col">
      <CardHeader>
        <CardTitle>My Complaints</CardTitle>
      </CardHeader>

      <div className="flex-1 overflow-auto p-2">
        <Table>
          <TableHeader>
            <TableHead className="pl-6">Category</TableHead>
            <TableHead>Room</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="pr-6 text-right">Action</TableHead>
          </TableHeader>
          <TableBody>
            {myComplaints.length === 0 ? (
              <TableRow>
                <td colSpan={6} className="h-24 text-center text-gray-500">
                  You haven't submitted any complaints yet.
                </td>
              </TableRow>
            ) : (
              myComplaints.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="pl-6 font-bold text-gray-800">{item.category}</TableCell>
                  <TableCell className="text-center">
                    <span className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-1 text-xs font-bold text-gray-600">
                      {item.room}
                    </span>
                  </TableCell>
                  <TableCell className="font-mono text-xs text-gray-500">{item.date}</TableCell>
                  <TableCell>
                    <Badge variant={getPriorityVariant(item.priority) as any}>
                      {item.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(item.status) as any}>{item.status}</Badge>
                  </TableCell>
                  <TableCell className="pr-6 text-right">
                    {item.status === 'Resolved' && !item.rated ? (
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-green-200 text-green-600 hover:bg-green-50"
                        onClick={() => handleOpenRate(item)}
                      >
                        <Star size={14} className="mr-1" /> Rate
                      </Button>
                    ) : item.rated ? (
                      <div className="inline-flex items-center gap-1 rounded-lg border border-gray-100 bg-gray-50 px-3 py-1.5 text-xs font-bold text-gray-500">
                        <Star size={12} className="fill-yellow-400 text-yellow-400" />{' '}
                        {item.rating}.0
                      </div>
                    ) : (
                      <Button
                        size="sm"
                        variant="danger"
                        className="border-transparent bg-red-50 text-red-600 hover:bg-red-100"
                        onClick={() => setSelected(item)}
                      >
                        <Eye size={16} className="mr-1" /> View
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Modal
        isOpen={!!selected}
        onClose={() => setSelected(null)}
        title={`Complaint #${selected?.id}`}
      >
        {selected && (
          <div className="space-y-4">
            <div className="rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-900">
              "{selected.desc}"
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <MapPin size={16} /> Location:{' '}
              <span className="font-bold text-gray-800">{selected.room}</span>
            </div>
          </div>
        )}
      </Modal>

      <GiveFeedbackModal
        isOpen={feedbackModalOpen}
        onClose={() => setFeedbackModalOpen(false)}
        itemTitle={itemToRate?.category}
        onSubmit={handleFeedbackSubmit}
      />
    </Card>
  )
}

export default MyComplaintsTable