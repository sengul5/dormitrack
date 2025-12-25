import React, { useState, useEffect } from 'react'
import { Trash2, Plus, X, Edit, CheckCircle, Clock, XCircle } from 'lucide-react'
import { Card, CardHeader, CardTitle } from '@ui/Card.component'
import Button from '@ui/Button.component'
import Badge from '@ui/Badge.component'
import Avatar from '@ui/Avatar.component'
import Modal from '@ui/Modal.component'
import { Input, Select } from '@ui/Input.component'
import toast from 'react-hot-toast'

interface Staff {
  id: number
  name: string
  role: string
  phone: string
  status: 'active' | 'busy' | 'offline'
  img: string
}

const StaffManager: React.FC = () => {
  const [staff, setStaff] = useState<Staff[]>([])
  const [isAdding, setIsAdding] = useState(false)
  const [newPerson, setNewPerson] = useState({ name: '', role: 'Cleaner', phone: '' })

  // API'den Veri Çekme
  const fetchStaff = async () => {
    try {
      const res = await fetch('/api/staff')
      const data = await res.json()
      setStaff(data)
    } catch (err) {
      toast.error('Failed to load staff')
    }
  }

  useEffect(() => {
    fetchStaff()
  }, [])

  // Personel Ekleme
  const handleAdd = async () => {
    if (!newPerson.name) return
    const toastId = toast.loading('Adding staff...')
    try {
      const res = await fetch('/api/staff', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPerson),
      })
      if (res.ok) {
        toast.success('Staff added', { id: toastId })
        fetchStaff() // Listeyi yenile
        setIsAdding(false)
        setNewPerson({ name: '', role: 'Cleaner', phone: '' })
      }
    } catch (e) {
      toast.error('Error', { id: toastId })
    }
  }

  // Personel Silme
  const handleDelete = async (id: number) => {
    if (!window.confirm('Delete user?')) return
    await fetch(`/api/staff/${id}`, { method: 'DELETE' })
    toast.success('Staff deleted')
    setStaff(staff.filter((s) => s.id !== id))
  }

  // Status Badge Helper (Değişmedi)
  const getStatusBadge = (status: string) => {
    if (status === 'active')
      return (
        <Badge variant="success">
          <CheckCircle size={10} /> Active
        </Badge>
      )
    if (status === 'busy')
      return (
        <Badge variant="dangerSoft">
          <XCircle size={10} /> Busy
        </Badge>
      )
    return (
      <Badge variant="default">
        <Clock size={10} /> Offline
      </Badge>
    )
  }

  return (
    <Card className="flex h-full flex-col">
      <CardHeader variant="gray">
        <CardTitle>Staff Management</CardTitle>
        <Button onClick={() => setIsAdding(!isAdding)}>
          {isAdding ? <X size={18} /> : <Plus size={18} />} {isAdding ? 'Cancel' : 'Add New'}
        </Button>
      </CardHeader>

      {/* Add Form */}
      {isAdding && (
        <div className="grid grid-cols-1 gap-4 bg-blue-50 p-6 md:grid-cols-3">
          <Input
            placeholder="Name"
            value={newPerson.name}
            onChange={(e) => setNewPerson({ ...newPerson, name: e.target.value })}
          />
          <Input
            placeholder="Phone"
            value={newPerson.phone}
            onChange={(e) => setNewPerson({ ...newPerson, phone: e.target.value })}
          />
          <div className="flex gap-2">
            <Select
              options={['Cleaner', 'Security', 'IT', 'Maintenance']}
              value={newPerson.role}
              onChange={(e) => setNewPerson({ ...newPerson, role: e.target.value })}
            />
            <Button onClick={handleAdd}>Save</Button>
          </div>
        </div>
      )}

      {/* List */}
      <div className="flex-1 overflow-auto p-6">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b text-xs uppercase text-gray-400">
              <th className="pb-2">Name</th>
              <th>Role</th>
              <th>Status</th>
              <th className="text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {staff.map((person) => (
              <tr key={person.id} className="border-b border-gray-50 hover:bg-gray-50">
                <td className="flex items-center gap-2 py-3">
                  <Avatar src={person.img} /> {person.name}
                </td>
                <td>
                  <Badge variant="outline">{person.role}</Badge>
                </td>
                <td>{getStatusBadge(person.status)}</td>
                <td className="text-right">
                  <Button
                    variant="icon"
                    className="text-red-500"
                    onClick={() => handleDelete(person.id)}
                  >
                    <Trash2 size={16} />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}
export default StaffManager
