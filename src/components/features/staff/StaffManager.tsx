import React, { useState, useEffect } from 'react'
import { Trash2, Plus, X, CheckCircle, Clock, XCircle, User } from 'lucide-react'
import { Card, CardHeader, CardTitle } from '@ui/Card.component'
import Button from '@ui/Button.component'
import Badge from '@ui/Badge.component'
import Avatar from '@ui/Avatar.component'
import { Input, Select } from '@ui/Input.component'
import toast from 'react-hot-toast'

interface Staff {
  id: number
  name: string
  role: string
  phone: string
  status: 'active' | 'busy' | 'offline'
  img?: string
}

const StaffManager: React.FC = () => {
  const [staff, setStaff] = useState<Staff[]>([])
  const [isAdding, setIsAdding] = useState(false)
  const [newPerson, setNewPerson] = useState({ name: '', role: 'Cleaner', phone: '' })

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

  const handleAdd = async () => {
    if (!newPerson.name) return
    const toastId = toast.loading('Adding staff...')
    try {
      const res = await fetch('/api/staff', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newPerson, img: "" }),
      })
      if (res.ok) {
        toast.success('Staff added', { id: toastId })
        fetchStaff()
        setIsAdding(false)
        setNewPerson({ name: '', role: 'Cleaner', phone: '' })
      }
    } catch (e) {
      toast.error('Error', { id: toastId })
    }
  }

  const handleDelete = async (id: number) => {
    if (!window.confirm('Delete user?')) return
    try {
      const res = await fetch(`/api/staff/${id}`, { method: 'DELETE' })
      if (res.ok) {
        toast.success('Staff deleted')
        setStaff(staff.filter((s) => s.id !== id))
      }
    } catch (err) {
      toast.error('Could not delete staff')
    }
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      active: { variant: "success", icon: <CheckCircle size={10} />, text: "Active" },
      busy: { variant: "dangerSoft", icon: <XCircle size={10} />, text: "Busy" },
      offline: { variant: "default", icon: <Clock size={10} />, text: "Offline" }
    };
    const current = variants[status as keyof typeof variants] || variants.offline;
    return (
      <Badge variant={current.variant as any}>
        {current.icon} {current.text}
      </Badge>
    );
  }

  return (
    <Card className="flex h-full flex-col">
      <CardHeader variant="gray" className="flex items-center justify-between">
        <CardTitle>Staff Management</CardTitle>
        {/* Variant hatasını çözmek için 'as any' kullanıldı */}
        <Button 
          onClick={() => setIsAdding(!isAdding)} 
          variant={(isAdding ? "dangerSoft" : "primary") as any}
        >
          {isAdding ? <X size={18} /> : <Plus size={18} />} {isAdding ? 'Cancel' : 'Add New'}
        </Button>
      </CardHeader>

      {isAdding && (
        <div className="grid grid-cols-1 gap-4 bg-slate-50 border-b p-6 md:grid-cols-3 animate-in fade-in slide-in-from-top-2">
          <Input
            label="Staff Name"
            placeholder="Name"
            value={newPerson.name}
            onChange={(e) => setNewPerson({ ...newPerson, name: e.target.value })}
          />
          <Input
            label="Phone"
            placeholder="+90..."
            value={newPerson.phone}
            onChange={(e) => setNewPerson({ ...newPerson, phone: e.target.value })}
          />
          <div className="flex items-end gap-2">
            <div className="flex-1">
              <Select
                options={['Cleaner', 'Security', 'IT', 'Maintenance']}
                value={newPerson.role}
                onChange={(e) => setNewPerson({ ...newPerson, role: e.target.value })}
              />
            </div>
            <Button onClick={handleAdd}>Save</Button>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-auto p-6">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b text-[11px] uppercase text-gray-400">
              <th className="pb-3 font-extrabold">Staff</th>
              <th className="pb-3 font-extrabold">Role</th>
              <th className="pb-3 font-extrabold">Status</th>
              <th className="pb-3 text-right font-extrabold">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {staff.map((person) => (
              <tr key={person.id} className="hover:bg-blue-50/30 transition-colors">
                <td className="py-4">
                  <div className="flex items-center gap-3">
                    {person.img ? (
                      <Avatar src={person.img} />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <User size={16} className="text-gray-400" />
                      </div>
                    )}
                    <span className="font-bold text-gray-700">{person.name}</span>
                  </div>
                </td>
                <td><Badge variant="outline" className="text-[10px]">{person.role}</Badge></td>
                <td>{getStatusBadge(person.status)}</td>
                <td className="text-right">
                  <Button
                    variant="ghost"
                    className="text-gray-300 hover:text-red-500"
                    onClick={() => handleDelete(person.id)}
                  >
                    <Trash2 size={18} />
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

export default StaffManager;