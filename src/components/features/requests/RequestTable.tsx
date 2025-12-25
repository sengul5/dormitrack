import React, { useState } from 'react'
import { Archive, CheckCircle, Eye, MapPin, Calendar, User } from 'lucide-react'
import { Card, CardHeader, CardTitle } from '@ui/Card.component'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@ui/Table.component'
import Badge from '@ui/Badge.component'
import Button from '@ui/Button.component'
import Avatar from '@ui/Avatar.component'
import Modal from '@ui/Modal.component'
import AssignStaffModal from '../complaints/AssignStaffModal'

// Types
interface RequestItem {
  id: number
  name: string
  img: string
  category: string
  room: string
  priority: 'Critical' | 'High' | 'Medium' | 'Low'
  date: string
  status: 'Active' | 'In Progress' | 'Resolved'
  desc: string
}

const RequestTable: React.FC = () => {
  const [viewHistory, setViewHistory] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState<RequestItem | null>(null)
  const [showAssignModal, setShowAssignModal] = useState(false)

  const [activeData, setActiveData] = useState<RequestItem[]>([
    {
      id: 1,
      name: 'James Carter',
      img: 'https://i.pravatar.cc/150?u=10',
      category: 'Wifi / Internet',
      room: '101',
      priority: 'High',
      date: '15.10.2025',
      status: 'Active',
      desc: 'İnternet bağlantısı sürekli kopuyor.',
    },
    {
      id: 2,
      name: 'Sofia Martinez',
      img: 'https://i.pravatar.cc/150?u=11',
      category: 'Room Maintenance',
      room: '204',
      priority: 'Medium',
      date: '14.10.2025',
      status: 'Active',
      desc: 'Dolap kapağı menteşesinden çıktı.',
    },
    {
      id: 3,
      name: 'Daniel Lee',
      img: 'https://i.pravatar.cc/150?u=12',
      category: 'Plumbing',
      room: '305',
      priority: 'High',
      date: '17.10.2025',
      status: 'Active',
      desc: 'Lavabo altından su damlatıyor.',
    },
  ])

  const historyData: RequestItem[] = [
    {
      id: 99,
      name: 'Michael Scott',
      img: 'https://i.pravatar.cc/150?u=20',
      category: 'Cleaning',
      room: 'Lobby',
      priority: 'Medium',
      date: '01.09.2025',
      status: 'Resolved',
      desc: 'Koridorun temizlenmesi gerekiyordu.',
    },
  ]

  const data = viewHistory ? historyData : activeData

  const handleAssignStaff = (staff: any) => {
    if (selectedRequest) {
      setActiveData((prev) =>
        prev.map((item) =>
          item.id === selectedRequest.id ? { ...item, status: 'In Progress' } : item
        )
      )
      setShowAssignModal(false)
      setSelectedRequest(null)
    }
  }

  const getPriorityVariant = (p: string) => {
    switch (p) {
      case 'Critical':
        return 'danger'
      case 'High':
        return 'warning'
      case 'Medium':
        return 'info'
      default:
        return 'success'
    }
  }

  return (
    <Card className="flex h-full flex-col">
      <CardHeader className="flex-col items-center gap-4 md:flex-row">
        <div>
          <CardTitle
            icon={viewHistory ? Archive : CheckCircle}
            className={viewHistory ? '' : 'text-blue-600'}
          >
            {viewHistory ? 'Archive' : 'Requests Center'}
          </CardTitle>
          <p className="mt-1 pl-1 text-sm text-gray-500">
            {viewHistory ? 'Past completed tasks.' : 'Manage current technical issues.'}
          </p>
        </div>
        <div className="ml-auto">
          <Button
            variant={viewHistory ? 'primary' : 'outline'}
            onClick={() => setViewHistory(!viewHistory)}
          >
            {viewHistory ? 'Back to Active' : 'History'}
          </Button>
        </div>
      </CardHeader>

      <div className="flex-1 overflow-auto p-2">
        <Table>
          <TableHeader>
            <TableHead className="pl-6">Student</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Room</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="pr-6 text-right">Action</TableHead>
          </TableHeader>
          <TableBody>
            {data.map((item) => (
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
                <TableCell className="font-semibold text-gray-600">{item.category}</TableCell>
                <TableCell className="font-medium text-gray-500">{item.room}</TableCell>
                <TableCell>
                  <Badge variant={getPriorityVariant(item.priority) as any}>{item.priority}</Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      item.status === 'Active'
                        ? 'dangerSoft'
                        : item.status === 'In Progress'
                          ? 'warning'
                          : 'success'
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
          <div className="space-y-6">
            <div className="flex items-center gap-5">
              <Avatar size="lg" src={selectedRequest.img} alt={selectedRequest.name} />
              <div>
                <h4 className="text-xl font-bold text-gray-900">{selectedRequest.name}</h4>
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

            <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
              <label className="mb-2 block text-xs font-bold uppercase text-gray-400">
                Description
              </label>
              <p className="text-sm font-medium text-gray-700">"{selectedRequest.desc}"</p>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button variant="ghost" onClick={() => setSelectedRequest(null)}>
                Close
              </Button>
              <Button onClick={() => setShowAssignModal(true)}>
                <User size={16} /> Assign Staff
              </Button>
            </div>
          </div>
        )}
      </Modal>

      <AssignStaffModal
        isOpen={showAssignModal}
        onClose={() => setShowAssignModal(false)}
        onAssign={handleAssignStaff}
        taskTitle={selectedRequest?.category}
      />
    </Card>
  )
}

export default RequestTable
