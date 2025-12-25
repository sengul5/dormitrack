import React, { useState, useEffect } from 'react'
import { Search, Archive, Megaphone, Eye, MapPin, Calendar, User, RefreshCw } from 'lucide-react'
import { Card, CardHeader, CardTitle } from '@ui/Card.component'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@ui/Table.component'
import Badge from '@ui/Badge.component'
import Button from '@ui/Button.component'
import Avatar from '@ui/Avatar.component'
import Modal from '@ui/Modal.component'
import AssignStaffModal from './AssignStaffModal'

// SERVİS BAĞLANTISI
import { complaintService } from '@/services/complaints'

// Types
interface Complaint {
  id: number
  name: string
  img: string
  category: string
  room: string
  priority: 'Critical' | 'High' | 'Medium' | 'Low'
  date: string
  status: 'Pending' | 'Investigating' | 'Open' | 'Resolved' | 'Closed'
  desc: string
  studentId?: string
}

const ComplaintsTable: React.FC = () => {
  const [viewHistory, setViewHistory] = useState(false)
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null)
  const [showAssignModal, setShowAssignModal] = useState(false)

  // DATA STATE
  const [allComplaints, setAllComplaints] = useState<Complaint[]>([])
  const [loading, setLoading] = useState(true)

  // --- VERİ ÇEKME ---
  const fetchComplaints = async () => {
    setLoading(true)
    try {
      const response = await complaintService.getAll()
      // Veri Güvenliği
      const data = Array.isArray(response) ? response : (response as any)?.data || []

      // Backend verisini UI formatına dönüştür
      const formattedData: Complaint[] = data.map((item: any) => ({
        id: item.id,
        name: item.student?.name || 'Unknown Student',
        studentId: item.student?.studentId || '',
        // Avatar yoksa oluştur
        img: item.student?.photo || `https://ui-avatars.com/api/?name=${item.student?.name || 'S'}&background=random`,
        // Tip veya Konu başlığını kategori yap
        category: item.type || item.subject || 'General Issue',
        room: item.room || 'Unknown',
        priority: item.priority || 'Low',
        date: item.date || new Date().toLocaleDateString('tr-TR'),
        status: item.status || 'Pending',
        desc: item.description || item.desc || 'No details provided.',
      }))

      // En yeniden eskiye sırala
      setAllComplaints(formattedData.reverse())
    } catch (error) {
      console.error('Şikayetler yüklenemedi:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchComplaints()
  }, [])

  // --- FİLTRELEME ---
  // Aktif Şikayetler (Çözülmemiş olanlar)
  const activeComplaints = allComplaints.filter(c => !['Resolved', 'Closed'].includes(c.status))
  
  // Geçmiş Şikayetler (Çözülmüş olanlar)
  const historyComplaints = allComplaints.filter(c => ['Resolved', 'Closed'].includes(c.status))

  const data = viewHistory ? historyComplaints : activeComplaints

  // --- ATAMA İŞLEMİ ---
  const handleAssignStaff = async (staff: any) => {
    if (!selectedComplaint) return

    try {
      // Backend güncellemesi (Varsa)
      // await complaintService.update(selectedComplaint.id, { status: 'Investigating', staffId: staff.id })
      
      console.log(`Assigned staff ${staff.name} to complaint #${selectedComplaint.id}`)

      // State Güncelleme (Optimistic UI)
      setAllComplaints((prev) =>
        prev.map((item) =>
          item.id === selectedComplaint.id ? { ...item, status: 'Investigating' } : item
        )
      )
      
      setShowAssignModal(false)
      setSelectedComplaint(null)
    } catch (error) {
      console.error('Atama hatası:', error)
      alert('Personel atanamadı.')
    }
  }

  const getPriorityVariant = (p: string) => {
    switch (p) {
      case 'Critical': return 'danger'
      case 'High': return 'warning'
      case 'Medium': return 'info'
      default: return 'success'
    }
  }

  const getStatusVariant = (s: string) => {
    if (s === 'Resolved' || s === 'Closed') return 'success'
    if (s === 'Investigating') return 'info'
    if (s === 'Pending' || s === 'Open') return 'dangerSoft'
    return 'outline'
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
              ? `Reviewing ${historyComplaints.length} past records.`
              : `Managing ${activeComplaints.length} behavioral and critical issues.`}
          </p>
        </div>

        <div className="ml-auto flex gap-3">
          <Button variant="ghost" size="icon" onClick={fetchComplaints} title="Refresh">
             <RefreshCw size={18} className={loading ? 'animate-spin text-red-500' : 'text-gray-500'} />
          </Button>
          <Button
            variant={viewHistory ? 'danger' : 'outline'}
            onClick={() => setViewHistory(!viewHistory)}
          >
            {viewHistory ? 'Back to Active' : 'History'}
          </Button>
        </div>
      </CardHeader>

      <div className="flex-1 overflow-auto p-2">
        {loading && allComplaints.length === 0 ? (
           <div className="flex h-40 items-center justify-center text-gray-400">Loading Complaints...</div>
        ) : (
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
             {data.length === 0 ? (
                <TableRow>
                    <td colSpan={7} className="h-32 text-center text-gray-400">
                        {viewHistory ? 'No past complaints found.' : 'No active complaints. Peaceful day!'}
                    </td>
                </TableRow>
            ) : (
                data.map((item) => (
                <TableRow key={item.id}>
                    <TableCell className="pl-6">
                    <div className="flex items-center gap-3">
                        <Avatar src={item.img} alt={item.name} />
                        <div>
                        <p className="text-[15px] font-bold text-gray-800">{item.name}</p>
                        <p className="mt-0.5 text-xs font-medium text-gray-400">#{item.studentId || item.id}</p>
                        </div>
                    </div>
                    </TableCell>
                    <TableCell className="font-semibold text-gray-600">{item.category}</TableCell>
                    <TableCell className="font-medium text-gray-500">{item.room}</TableCell>
                    <TableCell>
                    <Badge variant={getPriorityVariant(item.priority) as any}>{item.priority}</Badge>
                    </TableCell>
                    <TableCell>
                    <Badge variant={getStatusVariant(item.status) as any}>
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
                ))
            )}
          </TableBody>
        </Table>
        )}
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
            
            <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                 <div className='flex gap-2'>
                    <Badge variant={getPriorityVariant(selectedComplaint.priority) as any}>{selectedComplaint.priority}</Badge>
                    <Badge variant={getStatusVariant(selectedComplaint.status) as any}>{selectedComplaint.status}</Badge>
                </div>

                <div className="flex gap-3">
                <Button variant="ghost" onClick={() => setSelectedComplaint(null)}>
                    Close
                </Button>
                {/* Çözülmemişse Atama Yapılabilsin */}
                {!['Resolved', 'Closed'].includes(selectedComplaint.status) && (
                    <Button variant="danger" onClick={() => setShowAssignModal(true)}>
                        <User size={16} /> Assign Investigation
                    </Button>
                )}
                </div>
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