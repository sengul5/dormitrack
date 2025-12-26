import React, { useState, useEffect } from 'react'
import { Eye, Star, MapPin, Loader2, Calendar } from 'lucide-react'
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
  priority: string
  date: string
  status: string
  desc: string
  rated?: boolean
  rating?: number
}

const MyRequestsTable: React.FC = () => {
  const [selectedRequest, setSelectedRequest] = useState<MyRequest | null>(null)
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false)
  const [itemToRate, setItemToRate] = useState<MyRequest | null>(null)
  const [myRequests, setMyRequests] = useState<MyRequest[]>([])
  const [loading, setLoading] = useState(true)

  const fetchRequests = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/requests/my')
      if (!res.ok) throw new Error('Failed to fetch')
      const data = await res.json()
      
      const formatted = data.map((item: any) => {
        // Tarih formatı ve fallback mekanizması
        const formattedDate = item.date || 
          (item.createdAt ? new Date(item.createdAt).toLocaleDateString('tr-TR') : new Date().toLocaleDateString('tr-TR'));

        return {
          id: item.id,
          category: item.category || 'Maintenance',
          room: item.room || 'N/A',
          priority: (item.priority || 'Medium').toUpperCase(),
          date: formattedDate,
          status: (item.status || 'PENDING').toUpperCase(),
          // Backend'den 'description' veya 'desc' gelebilir, ikisini de kontrol ediyoruz
          desc: item.description || item.desc || 'No description provided.',
          rated: item.rated || item.is_rated || false,
          rating: item.rating || 0
        }
      })

      // En yeni talepleri en üstte göster
      setMyRequests(formatted)
    } catch (error) {
      toast.error('Talepler yüklenemedi.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRequests()
  }, [])

  // Badge Renk Yönetimi
  const getStatusVariant = (status: string) => {
    const s = status.toUpperCase()
    if (s === 'PENDING' || s === 'OPEN') return 'dangerSoft'
    if (s === 'IN PROGRESS' || s === 'INVESTIGATING' || s === 'PROCESSING') return 'info'
    if (s === 'COMPLETED' || s === 'RESOLVED' || s === 'DONE') return 'success'
    return 'outline'
  }

  const getPriorityVariant = (priority: string) => {
    const p = priority.toUpperCase()
    if (p === 'CRITICAL' || p === 'HIGH') return 'danger'
    if (p === 'MEDIUM') return 'warning'
    return 'success'
  }

  const handleOpenRate = (item: MyRequest) => {
    setItemToRate(item)
    setFeedbackModalOpen(true)
  }

  const handleFeedbackSubmit = async (data: { rating: number; comment?: string }) => {
    if (!itemToRate) return
    const toastId = toast.loading('Geri bildirim gönderiliyor...')
    try {
      const res = await fetch(`/api/requests/${itemToRate.id}/rate`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      if (res.ok) {
        toast.success('Geri bildiriminiz alındı!', { id: toastId })
        fetchRequests()
        setFeedbackModalOpen(false)
      } else {
        throw new Error()
      }
    } catch (error) {
      toast.error('Hata oluştu.', { id: toastId })
    }
  }

  return (
    <Card className="flex h-full flex-col">
      <CardHeader>
        <CardTitle>My Requests</CardTitle>
      </CardHeader>

      <div className="flex-1 overflow-auto p-2">
        {loading ? (
          <div className="flex h-40 items-center justify-center text-gray-400">
            <Loader2 className="animate-spin mr-2" /> Loading...
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableHead className="pl-6">Category</TableHead>
              <TableHead className="text-left">Room</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="pr-12 text-right">Action</TableHead>
            </TableHeader>
            <TableBody>
              {myRequests.length === 0 ? (
                <TableRow>
                  <td colSpan={6} className="py-12 text-center text-gray-500 text-sm">
                    Henüz kayıtlı bir bakım talebiniz bulunmuyor.
                  </td>
                </TableRow>
              ) : (
                myRequests.map((item) => (
                  <TableRow key={item.id} className="align-middle">
                    <TableCell className="pl-6 font-bold text-gray-800">
                      {item.category}
                    </TableCell>
                    
                    <TableCell className="text-left py-4">
                      <span className="inline-flex items-center justify-center rounded-lg border border-gray-100 bg-gray-50 px-3 py-1 text-xs font-bold text-gray-600">
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
                      <Badge variant={getStatusVariant(item.status) as any}>
                        {item.status}
                      </Badge>
                    </TableCell>

                    <TableCell className="pr-6 text-right w-[140px]">
                      <div className="flex justify-end items-center h-10">
                        {(item.status === 'COMPLETED' || item.status === 'DONE') && !item.rated ? (
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => handleOpenRate(item)} 
                            className="h-9 w-full border-green-200 text-green-600 hover:bg-green-50 justify-center"
                          >
                            <Star size={14} className="mr-1" /> Rate
                          </Button>
                        ) : item.rated ? (
                          <div className="inline-flex items-center justify-center gap-1 rounded-lg border border-gray-100 bg-gray-50 h-9 w-full text-xs font-bold text-gray-500">
                            <Star size={12} className="fill-yellow-400 text-yellow-400" />
                            {item.rating}.0
                          </div>
                        ) : (
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            onClick={() => setSelectedRequest(item)} 
                            className="h-9 w-full flex items-center justify-center gap-2 text-red-500 hover:bg-red-50"
                          >
                            <Eye size={16} /> 
                            <span className="font-bold">View</span>
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Detay Modalı */}
      <Modal 
        isOpen={!!selectedRequest} 
        onClose={() => setSelectedRequest(null)} 
        title={`Request Details #${selectedRequest?.id}`}
      >
        {selectedRequest && (
          <div className="space-y-4">
            <div className="rounded-xl border border-blue-100 bg-blue-50 p-4 text-sm text-blue-900 leading-relaxed">
              <p className="font-bold mb-1 underline">Description:</p>
              "{selectedRequest.desc}"
            </div>
            <div className="flex flex-col gap-3 pt-2">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin size={16} className="text-blue-500" /> 
                Location: <span className="font-bold text-gray-900">Room {selectedRequest.room}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar size={16} className="text-blue-500" /> 
                Submitted on: <span className="font-bold text-gray-900">{selectedRequest.date}</span>
              </div>
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