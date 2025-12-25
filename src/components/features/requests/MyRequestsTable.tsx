import React, { useState } from 'react'
import { Eye, Star, Calendar, MapPin } from 'lucide-react'
import { Card, CardHeader, CardTitle } from '@ui/Card.component'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@ui/Table.component'
import Badge from '@ui/Badge.component'
import Button from '@ui/Button.component'
import Modal from '@ui/Modal.component'
import GiveFeedbackModal from '../../modals/GiveFeedbackModal'

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

  const [myRequests, setMyRequests] = useState<MyRequest[]>([
    {
      id: 1,
      category: 'Wifi / Internet',
      room: 'Room 101',
      priority: 'High',
      date: '15.10.2025',
      status: 'In Progress',
      desc: 'Internet connection keeps dropping.',
    },
    {
      id: 4,
      category: 'Heating',
      room: 'Room 101',
      priority: 'Low',
      date: '13.10.2025',
      status: 'Pending',
      desc: 'Radiator is not warm enough.',
    },
    {
      id: 9,
      category: 'Furniture',
      room: 'Lobby',
      priority: 'Medium',
      date: '01.09.2025',
      status: 'Completed',
      desc: 'Chair leg was broken.',
      rated: false,
      rating: 0,
    },
    {
      id: 10,
      category: 'Plumbing',
      room: 'Room 101',
      priority: 'High',
      date: '05.09.2025',
      status: 'Completed',
      desc: 'Sink was leaking.',
      rated: true,
      rating: 5,
    },
  ])

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
            {myRequests.map((item) => (
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
                      item.status === 'Completed'
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
                  {item.status === 'Completed' && !item.rated ? (
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
                      <Star size={12} className="fill-yellow-400 text-yellow-400" /> {item.rating}.0
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
            ))}
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
