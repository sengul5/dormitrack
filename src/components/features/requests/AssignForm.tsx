import React, { useState, useEffect } from 'react'
import { UserCheck } from 'lucide-react'
import { Card, CardHeader, CardContent, CardTitle } from '@ui/Card.component'
import Button from '@ui/Button.component'
import toast from 'react-hot-toast'

const AssignForm: React.FC = () => {
  const [requests, setRequests] = useState([])
  const [staffList, setStaffList] = useState([])

  const [selectedReq, setSelectedReq] = useState('')
  const [selectedStaff, setSelectedStaff] = useState('')
  const [loading, setLoading] = useState(false)

  // Verileri Çek
  useEffect(() => {
    const fetchData = async () => {
      const [reqRes, staffRes] = await Promise.all([
        fetch('/api/requests/admin'), // Tüm talepler
        fetch('/api/staff'), // Tüm personel
      ])

      const reqData = await reqRes.json()
      const staffData = await staffRes.json()

      // Sadece atanmamış talepleri filtrele
      setRequests(reqData.filter((r: any) => r.status !== 'Completed' && r.status !== 'Resolved'))
      // Sadece aktif personeli filtrele
      setStaffList(staffData)
    }
    fetchData()
  }, [])

  const handleAssign = async () => {
    if (!selectedReq || !selectedStaff) return toast.error('Please select both request and staff')

    setLoading(true)
    try {
      await fetch(`/api/requests/${selectedReq}/assign`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ staffId: parseInt(selectedStaff) }),
      })
      toast.success('Assigned successfully!')
      setRequests(requests.filter((r: any) => r.id !== parseInt(selectedReq))) // Listeden düşür
      setSelectedReq('')
    } catch (e) {
      toast.error('Failed to assign')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader variant="blue">
        <CardTitle icon={UserCheck}>Quick Assign Task</CardTitle>
        <span className="text-xs text-blue-200">Manual Override</span>
      </CardHeader>

      <CardContent className="space-y-5 p-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* REQUEST SELECT */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-gray-700">Select Pending Request</label>
            <select
              className="w-full rounded-xl border border-gray-200 bg-gray-50 p-3 transition-all focus:bg-white"
              value={selectedReq}
              onChange={(e) => setSelectedReq(e.target.value)}
            >
              <option value="">-- Choose Issue --</option>
              {requests.map((r: any) => (
                <option key={r.id} value={r.id}>
                  #{r.id} {r.category} ({r.room}) - {r.priority}
                </option>
              ))}
            </select>
          </div>

          {/* STAFF SELECT */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-gray-700">Select Staff Member</label>
            <select
              className="w-full rounded-xl border border-gray-200 bg-gray-50 p-3 transition-all focus:bg-white"
              value={selectedStaff}
              onChange={(e) => setSelectedStaff(e.target.value)}
            >
              <option value="">-- Choose Staff --</option>
              {staffList.map((s: any) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.role}) - {s.status}
                </option>
              ))}
            </select>
          </div>
        </div>

        <Button
          size="lg"
          className="mt-2 w-full md:w-auto"
          onClick={handleAssign}
          disabled={loading}
        >
          {loading ? 'Assigning...' : 'Confirm Assignment'}
        </Button>
      </CardContent>
    </Card>
  )
}

export default AssignForm
