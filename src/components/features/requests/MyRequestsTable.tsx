import React, { useState, useEffect } from 'react'
import { Eye, Star, MapPin, Loader2 } from 'lucide-react'
import { Card, CardHeader, CardTitle } from '@ui/Card.component'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@ui/Table.component'
import Badge from '@ui/Badge.component'
import Button from '@ui/Button.component'
import Modal from '@ui/Modal.component'
import GiveFeedbackModal from '../../modals/GiveFeedbackModal'
import toast from 'react-hot-toast'

interface MyRequest {
  id: number
  category: string
  room: string
  priority: 'High' | 'Medium' | 'Low'
  date: string
  status: 'In Progress' | 'Pending' | 'Completed'
  desc: string
  rated?: boolean
  rating?: number
}

const MyRequestsTable: React.FC = () => {
  const [selectedRequest, setSelectedRequest] = useState<MyRequest | null>(null)
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false)
  const [itemToRate, setItemToRate] = useState<MyRequest | null>(null)
  
  // Dashboard'daki gibi state ve loading yönetimi
  const [myRequests, setMyRequests] = useState<MyRequest[]>([])
  const [loading, setLoading] = useState(true)

  // VERİLERİ ÇEK (Dashboard'daki fetch mantığı ile aynı)
  const fetchRequests = async () => {
    try {
      setLoading(true)
      // Önemli: API adresinin /api/requests/my olduğundan emin ol
      const res = await fetch('/api/requests/my')
      if (!res.ok) throw new Error('Failed to fetch')
      
      const data = await res.json()
      
      // Backend'den gelen veriyi tabloya göre formatla
      const formatted = data.map((item: any) => ({
        id: item.id,
        category: item.category,
        room: item.room || 'N/A',
        priority: item.priority || 'Medium',
        // Tarihi Dashboard'daki gibi okunabilir yap
       status: item.status,
        desc: item.description || item.desc,
        rated: item.rated || false,
        rating: item.rating || 0
      }))

      setMyRequests(formatted.reverse()) // En yeni en üstte
    } catch (error) {
      toast.error('Talepler yüklenemedi.')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRequests()
  }, [])

  const handleOpenRate = (item: MyRequest) => {
    setItemToRate(item)
    setFeedbackModalOpen(true)
  }

  const handleFeedbackSubmit = async (data: { rating: number; comment: string }) => {
    if (!itemToRate) return
    
    try {
      const res = await fetch(`/api/requests/${itemToRate.id}/rate`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      
      if (res.ok) {
        toast.success('Geri bildiriminiz alındı!')
        fetchRequests() // Listeyi yenile
        setFeedbackModalOpen(false)
      }
    } catch (error) {
      toast.error('Hata oluştu.')
    }
  }

  const getPriorityVariant = (p: string) => {
    if (p === 'High') return 'dangerSoft'
    if (p === 'Medium') return 'warning'
    return 'success'
  }

  return (
    <Card className="flex h-full flex-col">
      <CardHeader>
        <CardTitle>My Requests</CardTitle>
      </CardHeader>

      <div className="flex-1 overflow-auto p-2">
        {loading ? (
          <div className="flex h-40 items-center justify-center">
            <Loader2 className="animate-spin text-blue-600" size={32} />
          </div>
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
              {myRequests.length === 0 ? (
                <TableRow>
                  <td colSpan={6} className="py-10 text-center text-gray-500">
                    Henüz kayıtlı talebiniz bulunmuyor.
                  </td>
                </TableRow>
              ) : (
                myRequests.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="pl-6 font-bold text-gray-800">{item.category}</TableCell>
                    <TableCell className="text-center">
                      <span className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-1 text-xs font-bold text-gray-600">
                        {item.room}
                      </span>
                    </TableCell>
                    <TableCell className="font-mono text-xs text-gray-500">{item.date}</TableCell>
                    <TableCell>
                      <Badge variant={getPriorityVariant(item.priority) as any}>{item.priority}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={item.status === 'Completed' ? 'success' : item.status === 'In Progress' ? 'info' : 'outline'}>
                        {item.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="pr-6 text-right">
                      {item.status === 'Completed' && !item.rated ? (
                        <Button size="sm" variant="outline" onClick={() => handleOpenRate(item)}>
                          <Star size={14} className="mr-1" /> Rate
                        </Button>
                      ) : (
                        <Button size="sm" variant="ghost" onClick={() => setSelectedRequest(item)}>
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

      <Modal isOpen={!!selectedRequest} onClose={() => setSelectedRequest(null)} title={`Request #${selectedRequest?.id}`}>
        {selectedRequest && (
          <div className="space-y-4">
            <div className="rounded-xl border border-blue-100 bg-blue-50 p-4 text-sm text-blue-900 italic">
              "{selectedRequest.desc}"
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <MapPin size={16} /> Location: <span className="font-bold text-gray-800">{selectedRequest.room}</span>
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

export default MyRequestsTable