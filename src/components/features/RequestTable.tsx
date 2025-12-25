import React, { useState, useEffect } from 'react'
import { Archive, CheckCircle, Eye, MapPin, Calendar, User, RefreshCw } from 'lucide-react'
import { Card, CardHeader, CardTitle } from '@ui/Card.component'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@ui/Table.component'
import Badge from '@ui/Badge.component'
import Button from '@ui/Button.component'
import Avatar from '@ui/Avatar.component'
import Modal from '@ui/Modal.component'
import AssignStaffModal from './AssignStaffModal'

// SERVİS BAĞLANTISI
import { requestService } from '@/services/requests'

// Types
interface RequestItem {
  id: number
  name: string
  img: string
  category: string
  room: string
  priority: 'Critical' | 'High' | 'Medium' | 'Low'
  date: string
  status: 'Active' | 'Pending' | 'In Progress' | 'Resolved' | 'Completed'
  desc: string
  studentId?: string
}

const RequestTable: React.FC = () => {
  const [viewHistory, setViewHistory] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState<RequestItem | null>(null)
  const [showAssignModal, setShowAssignModal] = useState(false)
  
  // Tüm talepleri tek bir state'te tutuyoruz, aşağıda filtreleyeceğiz
  const [allRequests, setAllRequests] = useState<RequestItem[]>([])
  const [loading, setLoading] = useState(true)

  // --- VERİ ÇEKME ---
  const fetchRequests = async () => {
    setLoading(true)
    try {
      const response = await requestService.getAll()
      const data = Array.isArray(response) ? response : (response as any)?.data || []

      const formattedData: RequestItem[] = data.map((item: any) => ({
        id: item.id,
        name: item.student?.name || 'Unknown Student',
        studentId: item.student?.studentId || '',
        // Avatar yoksa oluştur
        img: item.student?.photo || `https://ui-avatars.com/api/?name=${item.student?.name || 'S'}&background=random`,
        category: item.category || 'General',
        room: item.room || 'Unknown',
        priority: item.priority || 'Low',
        date: item.date || new Date().toLocaleDateString('tr-TR'),
        status: item.status || 'Pending',
        desc: item.desc || item.description || 'No description provided.',
      }))

      // En yeniden eskiye sırala
      setAllRequests(formattedData.reverse())
    } catch (error) {
      console.error('Talepler yüklenemedi:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRequests()
  }, [])

  // --- FİLTRELEME ---
  // Aktif İşler: Tamamlanmamış olanlar
  const activeData = allRequests.filter(req => 
    !['Resolved', 'Completed', 'Cancelled'].includes(req.status)
  )
  
  // Geçmiş İşler: Tamamlanmış olanlar
  const historyData = allRequests.filter(req => 
    ['Resolved', 'Completed', 'Cancelled'].includes(req.status)
  )

  const data = viewHistory ? historyData : activeData

  // --- PERSONEL ATAMA ---
  const handleAssignStaff = async (staff: any) => {
    if (!selectedRequest) return

    try {
      // 1. Backend'e güncelleme isteği at (Update metodu varsa)
      // await requestService.update(selectedRequest.id, { status: 'In Progress', staffId: staff.id })
      
      console.log(`Assigned staff ${staff.name} to request #${selectedRequest.id}`)

      // 2. State'i güncelle (Optimistic UI)
      setAllRequests((prev) =>
        prev.map((item) =>
          item.id === selectedRequest.id ? { ...item, status: 'In Progress' } : item
        )
      )
      
      setShowAssignModal(false)
      setSelectedRequest(null)
    } catch (error) {
      console.error('Atama sırasında hata:', error)
      alert('Personel atanamadı.')
    }
  }

  const getPriorityVariant = (p: string) => {
    switch (p) {
      case 'Critical': return 'danger'
      case 'High': return 'warning' // Turuncu daha iyi duruyor
      case 'Medium': return 'info'
      default: return 'success'
    }
  }

  const getStatusVariant = (s: string) => {
    if (s === 'Resolved' || s === 'Completed') return 'success'
    if (s === 'In Progress') return 'warning'
    if (s === 'Active' || s === 'Pending') return 'dangerSoft'
    return 'outline'
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
            {viewHistory 
              ? `Showing ${historyData.length} completed tasks.` 
              : `Managing ${activeData.length} active technical issues.`}
          </p>
        </div>
        <div className="ml-auto flex gap-3">
          <Button variant="ghost" size="icon" onClick={fetchRequests} title="Refresh Data">
             <RefreshCw size={18} className={loading ? 'animate-spin text-blue-500' : 'text-gray-500'} />
          </Button>
          <Button
            variant={viewHistory ? 'primary' : 'outline'}
            onClick={() => setViewHistory(!viewHistory)}
          >
            {viewHistory ? 'Back to Active' : 'View History'}
          </Button>
        </div>
      </CardHeader>

      <div className="flex-1 overflow-auto p-2">
        {loading && allRequests.length === 0 ? (
           <div className="flex h-40 items-center justify-center text-gray-400">Loading Requests...</div>
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
                        {viewHistory ? 'No completed tasks found.' : 'No active requests. Great job!'}
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
            
            <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                <div className='flex gap-2'>
                    <Badge variant={getPriorityVariant(selectedRequest.priority) as any}>{selectedRequest.priority}</Badge>
                    <Badge variant={getStatusVariant(selectedRequest.status) as any}>{selectedRequest.status}</Badge>
                </div>
                
                <div className="flex gap-3">
                    <Button variant="ghost" onClick={() => setSelectedRequest(null)}>
                        Close
                    </Button>
                    {/* Sadece Aktif İşlerde Atama Yapılabilsin */}
                    {!['Resolved', 'Completed'].includes(selectedRequest.status) && (
                        <Button onClick={() => setShowAssignModal(true)}>
                            <User size={16} /> Assign Staff
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
        taskTitle={selectedRequest?.category}
      />
    </Card>
  )
}

export default RequestTable