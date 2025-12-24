import React, { useState } from 'react'
import { Search, Archive, Megaphone, Eye, MapPin, Calendar, User } from 'lucide-react'
import { Card, CardHeader, CardTitle } from '@ui/Card.component'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@ui/Table.component'
import Badge from '@ui/Badge.component'
import Button from '@ui/Button.component'
import Avatar from '@ui/Avatar.component'
import Modal from '@ui/Modal.component'
import AssignStaffModal from '@features/AssignStaffModal'

// Types
interface Complaint {
  id: number
  name: string
  img: string
  category: string
  room: string
  priority: 'Critical' | 'High' | 'Medium' | 'Low'
  date: string
  status: 'Pending' | 'Investigating' | 'Open' | 'Resolved'
  desc: string
}

const ComplaintsTable: React.FC = () => {
  const [viewHistory, setViewHistory] = useState(false)
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null)
  const [showAssignModal, setShowAssignModal] = useState(false)

  // DATA
  const [activeComplaints, setActiveComplaints] = useState<Complaint[]>([
    {
      id: 301,
      name: 'Alice Wonderland',
      img: 'https://i.pravatar.cc/150?u=30',
      category: 'Noise Disturbance',
      room: '404',
      priority: 'High',
      date: '01.11.2025',
      status: 'Pending',
      desc: "Yan odadaki (405) öğrenciler gece 3'e kadar yüksek sesle müzik dinliyor.",
    },
    {
      id: 302,
      name: 'Bob Marley',
      img: 'https://i.pravatar.cc/150?u=31',
      category: 'Theft / Lost Item',
      room: '101',
      priority: 'Critical',
      date: '02.11.2025',
      status: 'Investigating',
      desc: 'Spor salonunda bıraktığım kulaklığım çalındı.',
    },
    {
      id: 303,
      name: 'Charlie Chaplin',
      img: 'https://i.pravatar.cc/150?u=32',
      category: 'Hygiene Issue',
      room: 'Kitchen',
      priority: 'Medium',
      date: '03.11.2025',
      status: 'Open',
      desc: '3. Kat ortak mutfağı çok kirli bırakılıyor.',
    },
    {
      id: 304,
      name: 'Donald Trump',
      img: 'https://i.pravatar.cc/150?u=33',
      category: 'Rule Violation',
      room: 'Lobby',
      priority: 'Low',
      date: '04.11.2025',
      status: 'Pending',
      desc: 'Lobi alanında izinsiz afiş asılması.',
    },
  ])

  const historyComplaints: Complaint[] = [
    {
      id: 299,
      name: 'John Doe',
      img: 'https://i.pravatar.cc/150?u=40',
      category: 'Rule Violation',
      room: '202',
      priority: 'Low',
      date: '20.10.2025',
      status: 'Resolved',
      desc: 'Odaya yasaklı elektrikli ısıtıcı sokulmuştu.',
    },
  ]

  const data = viewHistory ? historyComplaints : activeComplaints

  const handleAssignStaff = (staff: any) => {
    if (selectedComplaint) {
      setActiveComplaints((prev) =>
        prev.map((item) =>
          item.id === selectedComplaint.id ? { ...item, status: 'Investigating' } : item
        )
      )
      setShowAssignModal(false)
      setSelectedComplaint(null)
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
            icon={viewHistory ? Archive : Megaphone}
            className={viewHistory ? '' : 'text-red-600'}
          >
            {viewHistory ? 'Complaint Archive' : 'Active Complaints'}
          </CardTitle>
          <p className="mt-1 pl-1 text-sm text-gray-500">
            {viewHistory
              ? 'Review past disciplinary records.'
              : 'Manage behavioral and critical issues.'}
          </p>
        </div>

        <div className="ml-auto flex gap-3">
          <Button
            variant={viewHistory ? 'danger' : 'outline'}
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
                      item.status === 'Pending'
                        ? 'dangerSoft'
                        : item.status === 'Investigating'
                          ? 'info'
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
                    onClick={() => setSelectedComplaint(item)}
                  >
                    <Eye size={16} /> Details
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* DETAY MODALI */}
      <Modal
        isOpen={!!selectedComplaint}
        onClose={() => setSelectedComplaint(null)}
        title={`Complaint #${selectedComplaint?.id}`}
      >
        {selectedComplaint && (
          <div className="space-y-6">
            <div className="flex items-center gap-5">
              <Avatar size="lg" src={selectedComplaint.img} alt={selectedComplaint.name} />
              <div>
                <h4 className="text-xl font-bold text-gray-900">{selectedComplaint.name}</h4>
                <div className="mt-1 flex items-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1.5">
                    <MapPin size={14} /> Room {selectedComplaint.room}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Calendar size={14} /> {selectedComplaint.date}
                  </span>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-red-100 bg-red-50 p-4">
              <label className="mb-2 block text-xs font-bold uppercase text-red-400">
                Description
              </label>
              <p className="text-sm font-medium text-gray-700">"{selectedComplaint.desc}"</p>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button variant="ghost" onClick={() => setSelectedComplaint(null)}>
                Close
              </Button>
              <Button variant="danger" onClick={() => setShowAssignModal(true)}>
                <User size={16} /> Assign Investigation
              </Button>
            </div>
          </div>
        )}
      </Modal>

      <AssignStaffModal
        isOpen={showAssignModal}
        onClose={() => setShowAssignModal(false)}
        onAssign={handleAssignStaff}
        taskTitle={selectedComplaint?.category}
      />
    </Card>
  )
}

export default ComplaintsTable
