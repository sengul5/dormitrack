import React, { useState, useEffect } from 'react'
import { Eye, Star, MapPin } from 'lucide-react'
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
import Modal from '@ui/Modal.component'
import GiveFeedbackModal from './GiveFeedbackModal'

// SERVİS BAĞLANTISI
import { requestService } from '@/services/requests'

interface MyRequest {
  id: number
  category: string
  room: string
  // DÜZELTME 1: 'Resolved' buraya eklendi ki TS hata vermesin
  priority: 'High' | 'Medium' | 'Low' | 'Critical'
  date: string
  status: 'In Progress' | 'Pending' | 'Completed' | 'Resolved' 
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

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await requestService.getAll()
        const data = Array.isArray(response) ? response : (response as any)?.data || []

        const formattedData: MyRequest[] = data.map((item: any) => ({
          id: item.id,
          category: item.category,
          room: item.room || 'Unknown',
          priority: item.priority || 'Low',
          date: item.date || new Date().toLocaleDateString('tr-TR'),
          status: item.status || 'Pending',
          desc: item.desc || 'No description provided.',
          rated: false,
          rating: 0,
        }))

        setMyRequests(formattedData.reverse())
      } catch (error) {
        console.error('Talepler yüklenemedi:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchRequests()
  }, [])

  const handleOpenRate = (item: MyRequest) => {
    setItemToRate(item)
    setFeedbackModalOpen(true)
  }

  const handleFeedbackSubmit = (data: { rating: number; comment: string }) => {
    if (itemToRate) {
      setMyRequests((prev) =>
        prev.map((req) =>
          req.id === itemToRate.id ? { ...req, rated: true, rating: data.rating } : req
        )
      )
    }
  }

  const getPriorityVariant = (p: string) => {
    if (p === 'High' || p === 'Critical') return 'dangerSoft'
    if (p === 'Medium') return 'warning'
    return 'success'
  }

  if (loading) {
    return (
      <Card className="flex h-full flex-col p-6">
        <div className="text-center text-gray-400">Loading requests...</div>
      </Card>
    )
  }

  return (
    <Card className="flex h-full flex-col">
      <CardHeader>
        <CardTitle>My Requests</CardTitle>
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
            {myRequests.length === 0 ? (
              <TableRow>
                {/* DÜZELTME 2: TableCell yerine normal td kullandık (colSpan hatası için) */}
                <td colSpan={6} className="h-24 text-center text-gray-500">
                  You haven't made any requests yet.
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
                    <Badge
                      variant={
                        item.status === 'Completed' || item.status === 'Resolved'
                          ? 'success'
                          : item.status === 'In Progress'
                            ? 'info'
                            : 'outline'
                      }
                    >
                      {item.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="pr-6 text-right">
                    {(item.status === 'Completed' || item.status === 'Resolved') && !item.rated ? (
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-yellow-200 text-yellow-600 hover:bg-yellow-50"
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
                        variant="ghost"
                        className="bg-blue-50 text-blue-600"
                        onClick={() => setSelectedRequest(item)}
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
        isOpen={!!selectedRequest}
        onClose={() => setSelectedRequest(null)}
        title={`Request #${selectedRequest?.id}`}
      >
        {selectedRequest && (
          <div className="space-y-4">
            <div className="rounded-xl border border-blue-100 bg-blue-50 p-4 text-sm text-blue-900">
              "{selectedRequest.desc}"
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <MapPin size={16} /> Location:{' '}
              <span className="font-bold text-gray-800">{selectedRequest.room}</span>
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