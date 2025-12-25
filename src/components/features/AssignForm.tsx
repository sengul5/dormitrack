import React, { useState, useEffect } from 'react'
import { UserCheck, Loader2, CheckCircle } from 'lucide-react'
import { Card, CardHeader, CardContent, CardTitle } from '@ui/Card.component'
import { Select } from '@ui/Input.component'
import Button from '@ui/Button.component'

// SERVİS
import { requestService } from '@/services/requests'

interface RequestOption {
  id: number
  label: string
}

interface StaffOption {
  id: number
  name: string
  role: string
}

const AssignForm: React.FC = () => {
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  const [requestOptions, setRequestOptions] = useState<RequestOption[]>([])
  const [staffOptions, setStaffOptions] = useState<StaffOption[]>([])

  const [selectedRequest, setSelectedRequest] = useState('')
  const [selectedStaff, setSelectedStaff] = useState('')

  // --- VERİ ÇEKME ---
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        // 1. Talepleri Çek (requestService)
        const response = await requestService.getAll()
        const data = Array.isArray(response) ? response : (response as any)?.data || []
        
        // Sadece 'Pending' veya 'Active' olanları filtrele
        const pendingRequests = data
          .filter((item: any) => !['Completed', 'Resolved', 'In Progress'].includes(item.status))
          .map((item: any) => ({
            id: item.id,
            label: `Req #${item.id} - ${item.category || 'Issue'} (${item.room})`
          }))

        setRequestOptions(pendingRequests)

        // 2. Personeli Çek (Simülasyon - staffService olmadığı için)
        // const staffData = await staffService.getAvailable();
        await new Promise(r => setTimeout(r, 500)) 
        
        setStaffOptions([
          { id: 1, name: 'Beyza Beyaz', role: 'IT' },
          { id: 2, name: 'Carl Max', role: 'Cleaner' },
          { id: 3, name: 'Mustafa Sönmez', role: 'Security' },
          { id: 4, name: 'George Stalge', role: 'Maintenance' },
        ])

      } catch (error) {
        console.error('Veri yüklenemedi:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // --- ATAMA YAPMA ---
  const handleAssign = async () => {
    if (!selectedRequest || !selectedStaff) return
    
    setSubmitting(true)
    try {
      // Backend Simülasyonu
      // await taskService.assign({ requestId: selectedRequest, staffId: selectedStaff });
      await new Promise((resolve) => setTimeout(resolve, 1000))
      
      setSuccess(true)
      
      // 2 saniye sonra formu resetle
      setTimeout(() => {
        setSuccess(false)
        setSelectedRequest('')
        setSelectedStaff('')
        // Listeden atanan işi çıkar (Optimistic UI)
        setRequestOptions(prev => prev.filter(r => !selectedRequest.includes(String(r.id)))) // Basit filtreleme
      }, 2000)

    } catch (error) {
      alert('Atama başarısız oldu.')
    } finally {
      setSubmitting(false)
    }
  }

  // Select bileşeni string array bekliyor, bu yüzden map ediyoruz
  const reqLabels = requestOptions.map(r => r.label)
  const staffLabels = staffOptions.map(s => `${s.name} (${s.role})`)

  return (
    <Card>
      <CardHeader variant="blue">
        <CardTitle icon={UserCheck}>Assign Task</CardTitle>
        <span className="text-xs text-blue-200">New Assignment</span>
      </CardHeader>

      <CardContent className="space-y-5 p-6">
        {loading ? (
           <div className="flex justify-center py-4 text-gray-400 text-sm">Loading options...</div>
        ) : requestOptions.length === 0 ? (
            <div className="text-center py-4 text-gray-500 text-sm">
                No pending requests found. Good job!
            </div>
        ) : success ? (
            <div className="flex flex-col items-center justify-center py-4 text-green-600 animate-in zoom-in">
                <CheckCircle size={32} className="mb-2" />
                <span className="font-bold">Task Assigned Successfully!</span>
            </div>
        ) : (
        <>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Select
                label="Request Issue"
                placeholder="Select Request..."
                options={reqLabels}
                value={selectedRequest}
                onChange={(e) => setSelectedRequest(e.target.value)}
            />
            <Select
                label="Staff Member"
                placeholder="Choose Staff..."
                options={staffLabels}
                value={selectedStaff}
                onChange={(e) => setSelectedStaff(e.target.value)}
            />
            </div>

            <Button 
                size="lg" 
                className="mt-2 w-full md:w-auto" 
                onClick={handleAssign}
                disabled={submitting || !selectedRequest || !selectedStaff}
            >
            {submitting ? <Loader2 className="animate-spin mr-2" /> : null}
            {submitting ? 'Assigning...' : 'Confirm Assignment'}
            </Button>
        </>
        )}
      </CardContent>
    </Card>
  )
}

export default AssignForm