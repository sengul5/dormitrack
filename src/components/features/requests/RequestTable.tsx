import React, { useState, useEffect } from 'react'
import { Archive, ClipboardList, Eye, MapPin, Calendar, Star } from 'lucide-react'
import { Card, CardHeader, CardTitle } from '@ui/Card.component'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@ui/Table.component'
import Badge from '@ui/Badge.component'
import Button from '@ui/Button.component'
import Modal from '@ui/Modal.component'
import Avatar from '@ui/Avatar.component'

import GiveFeedbackModal from '../../modals/GiveFeedbackModal'
import toast from 'react-hot-toast'

interface Request {
  id: number
  name: string

  category: string
  room: string
  priority: 'High' | 'Medium' | 'Low'
  date: string
  status: 'In Progress' | 'Pending' | 'Completed'
  desc: string
  img: string

  rated?: boolean
  rating?: number
}

const RequestsTable: React.FC = () => {
  const [viewHistory, setViewHistory] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null)
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false)
  const [itemToRate, setItemToRate] = useState<Request | null>(null)
  
  const [requests, setRequests] = useState<Request[]>([])
  const [loading, setLoading] = useState(true)

  // VERİLERİ ÇEK (Admin Complaint mantığıyla aynı query yapısı)
  const fetchRequests = async () => {
    setLoading(true)
    try {
      const viewType = viewHistory ? 'history' : 'active'
      const res = await fetch(`/api/requests/admin?view=${viewType}`)
      if (!res.ok) throw new Error('Failed to fetch')
      const data = await res.json()
      setRequests(data)
    } catch (error) {
      toast.error('Could not load requests')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRequests()
  }, [viewHistory])

  const handleOpenRate = (item: Request) => {
    setItemToRate(item)
    setFeedbackModalOpen(true)
  }

  const handleFeedbackSubmit = async (data: { rating: number; comment: string }) => {
    if (!itemToRate) return
    const toastId = toast.loading('Submitting feedback...')
    try {
      const res = await fetch(`/api/requests/${itemToRate.id}/rate`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      if (res.ok) {
        toast.success('Feedback submitted successfully!', { id: toastId })
        fetchRequests()
        setFeedbackModalOpen(false)
        setItemToRate(null)
      }
    } catch (error) {
      toast.error('Failed to submit feedback', { id: toastId })
    }
  }

  const getPriorityVariant = (p: string) => {
    if (p === 'High') return 'danger'
    if (p === 'Medium') return 'warning'
    return 'success'
  }

  return (
    <Card className="flex h-full flex-col">
      <CardHeader className="flex-col gap-4">
        <div className="flex w-full items-center justify-between">
          <div>
            <CardTitle
              icon={viewHistory ? Archive : ClipboardList}
              className={viewHistory ? '' : 'text-blue-600'}
            >
              {viewHistory ? 'Request Archive' : 'Active Requests'}
            </CardTitle>
            <p className="mt-1 pl-1 text-sm text-gray-500">
              {viewHistory ? 'Review your past service requests.' : 'Track your ongoing service requests.'}
            </p>
          </div>

          <Button
            variant={viewHistory ? 'primary' : 'outline'}
            onClick={() => setViewHistory(!viewHistory)}
          >
            {viewHistory ? 'Back to Active' : 'History'}
          </Button>
        </div>
      </CardHeader>

      <div className="flex-1 overflow-auto p-2">
        {loading ? (
          <div className="flex h-40 items-center justify-center text-gray-400">Loading data...</div>
        ) : (
          <Table>
            <TableHeader>
              <TableHead className="pl-6">Category</TableHead>
              <TableHead>Room</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="pr-6">Action</TableHead>
            </TableHeader>
            <TableBody>
              {requests.length === 0 ? (
                <TableRow>
                   <td colSpan={6} className="py-8 text-center text-gray-500">
                    No requests found. </td>
                  
                </TableRow>
              ) : (
                requests.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="pl-6">
                      <div className="flex items-center gap-3">
                        <Avatar src={item.img} alt={item.name} />
                        <div>
                          <p className="text-[15px] font-bold text-gray-800">{item.name}</p>
                          <p className="mt-0.5 text-xs font-medium text-gray-400">#{item.id}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium text-gray-500">{item.room}</TableCell>
                    <TableCell>
                      <Badge variant={getPriorityVariant(item.priority) as any}>
                        {item.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          item.status === 'Completed' ? 'success' : 
                          item.status === 'In Progress' ? 'info' : 'dangerSoft'
                        }
                      >
                        {item.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-mono text-xs text-gray-400">{item.date}</TableCell>
                    <TableCell className="pr-6 text-right">
  <Button
    size="sm"
    variant="ghost"
    className="bg-blue-50 text-blue-600 hover:bg-blue-100"
    onClick={() => setSelectedRequest(item)}
  >
    <Eye size={16} /> Details
  </Button>
</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </div>

      <Modal
        isOpen={!!selectedRequest}
        onClose={() => setSelectedRequest(null)}
        title={`Request #${selectedRequest?.id}`}
      >
        {selectedRequest && (
          <div className="space-y-6">
            <div className="flex items-center gap-5">
                <Avatar size="lg" src={selectedRequest.img} alt={selectedRequest.name} />

              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                <span className="text-2xl font-bold text-blue-600">
                  {selectedRequest.category.charAt(0)}
                </span>
              </div>
              <div>
                <h4 className="text-xl font-bold text-gray-900">{selectedRequest.category}</h4>
                <div className="mt-1 flex items-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1.5">
                    <MapPin size={14} /> Room {selectedRequest.room}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Calendar size={14} /> {selectedRequest.date}
                  </span>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
              <label className="mb-2 block text-xs font-bold uppercase text-blue-400">
                Description
              </label>
              <p className="text-sm font-medium text-gray-700">"{selectedRequest.desc}"</p>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button variant="ghost" onClick={() => setSelectedRequest(null)}>
                Close
              </Button>
              {selectedRequest.status === 'Completed' && !selectedRequest.rated && (
                <Button
                  className="bg-amber-500 text-white hover:bg-amber-600"
                  onClick={() => {
                    setSelectedRequest(null)
                    handleOpenRate(selectedRequest)
                  }}
                >
                  <Star size={16} className="mr-2" /> Rate Service
                </Button>
              )}
            </div>
          </div>
        )}
      </Modal>

      <GiveFeedbackModal
        isOpen={feedbackModalOpen}
        onClose={() => {
          setFeedbackModalOpen(false)
          setItemToRate(null)
        }}
        itemTitle={itemToRate?.category}
        onSubmit={handleFeedbackSubmit}
      />
    </Card>
  )
}

export default RequestsTable