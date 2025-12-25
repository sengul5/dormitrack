import React, { useState, useEffect } from 'react'
import { Eye, Star, MapPin } from 'lucide-react'
import { Card, CardHeader, CardTitle } from '@ui/Card.component'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@ui/Table.component'
import Badge from '@ui/Badge.component'
import Button from '@ui/Button.component'
import Modal from '@ui/Modal.component'
import GiveFeedbackModal from '@/components/modals/GiveFeedbackModal' // Ortak modal yolu
import toast from 'react-hot-toast'

interface MyComplaint {
  id: number
  category: string
  room: string
  priority: 'Critical' | 'High' | 'Medium' | 'Low'
  date: string
  status: 'Investigating' | 'Resolved' | 'Pending'
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

  // VERİLERİ ÇEK
  const fetchMyComplaints = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/complaints/my')
      if (!res.ok) throw new Error('Fetch failed')
      const data = await res.json()
      setMyComplaints(data)
    } catch (error) {
      toast.error('Could not load your complaints')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMyComplaints()
  }, [])

  const handleOpenRate = (item: MyComplaint) => {
    setItemToRate(item)
    setFeedbackModalOpen(true)
  }

  // PUAN VERME
  const handleFeedbackSubmit = async (data: { rating: number; comment?: string }) => {
    if (!itemToRate) return

    const toastId = toast.loading('Sending feedback...')
    try {
      const res = await fetch(`/api/complaints/${itemToRate.id}/rate`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rating: data.rating,
          comment: data.comment,
        }),
      })

      if (!res.ok) throw new Error('Rate failed')

      toast.success('Thank you for your feedback!', { id: toastId })

      // Listeyi güncelle
      fetchMyComplaints()
      setFeedbackModalOpen(false)
      setItemToRate(null)
    } catch (error) {
      toast.error('Failed to submit feedback', { id: toastId })
    }
  }

  return (
    <Card className="flex h-full flex-col">
      <CardHeader>
        <CardTitle>My Complaints</CardTitle>
      </CardHeader>

      <div className="flex-1 overflow-auto p-2">
        {loading ? (
          <div className="flex h-40 items-center justify-center text-gray-400">Loading...</div>
        ) : (
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
                  <TableCell className="py-8 text-center text-gray-500">
                    You haven't submitted any complaints yet.
                  </TableCell>
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
                      <Badge
                        variant={
                          item.priority === 'Critical'
                            ? 'danger'
                            : item.priority === 'High'
                              ? 'warning'
                              : 'info'
                        }
                      >
                        {item.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={item.status === 'Resolved' ? 'success' : 'info'}>
                        {item.status}
                      </Badge>
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
        )}
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
