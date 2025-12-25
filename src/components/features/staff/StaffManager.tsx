import React, { useState } from 'react'
import { Trash2, Plus, X, Edit, CheckCircle, XCircle, Clock } from 'lucide-react'
import { Card, CardHeader, CardTitle } from '@ui/Card.component'
import Button from '@ui/Button.component'
import Badge from '@ui/Badge.component'
import Avatar from '@ui/Avatar.component'
import Modal from '@ui/Modal.component'
import { Input, Select } from '@ui/Input.component'

interface Staff {
  id: number
  name: string
  role: string
  phone: string
  status: 'active' | 'busy' | 'offline'
  img: string
}

const StaffManager: React.FC = () => {
  const [staff, setStaff] = useState<Staff[]>([
    {
      id: 1,
      name: 'Carl Max',
      role: 'Cleaner',
      phone: '+90 533 111 2233',
      status: 'active',
      img: 'https://i.pravatar.cc/150?u=60',
    },
    {
      id: 2,
      name: 'Necder Zorluer',
      role: 'Cleaner',
      phone: '+90 533 222 3344',
      status: 'busy',
      img: 'https://i.pravatar.cc/150?u=61',
    },
    {
      id: 3,
      name: 'Beyza Beyaz',
      role: 'IT&Network',
      phone: '+90 533 444 5566',
      status: 'active',
      img: 'https://i.pravatar.cc/150?u=62',
    },
    {
      id: 4,
      name: 'Mustafa Dönmez',
      role: 'Security',
      phone: '+90 533 555 6677',
      status: 'offline',
      img: 'https://i.pravatar.cc/150?u=63',
    },
  ])

  const [isAdding, setIsAdding] = useState(false)
  const [newPerson, setNewPerson] = useState<Partial<Staff>>({
    name: '',
    role: 'Cleaner',
    phone: '',
  })
  const [editingPerson, setEditingPerson] = useState<Staff | null>(null)

  const handleDelete = (id: number) => {
    if (window.confirm('Remove staff member?')) setStaff(staff.filter((p) => p.id !== id))
  }

  const handleUpdate = () => {
    if (!editingPerson) return
    setStaff(staff.map((p) => (p.id === editingPerson.id ? editingPerson : p)))
    setEditingPerson(null)
  }

  const handleAdd = () => {
    if (!newPerson.name) return
    const newItem: Staff = {
      id: Date.now(),
      name: newPerson.name,
      role: newPerson.role || 'Cleaner',
      phone: newPerson.phone || 'N/A',
      status: 'offline',
      img: `https://i.pravatar.cc/150?u=${Date.now()}`,
    }
    setStaff([newItem, ...staff])
    setIsAdding(false)
    setNewPerson({ name: '', role: 'Cleaner', phone: '' })
  }

  const getStatusBadge = (status: Staff['status']) => {
    switch (status) {
      case 'active':
        return (
          <Badge variant="success" className="flex w-fit items-center gap-1">
            <CheckCircle size={10} /> Active
          </Badge>
        )
      case 'busy':
        return (
          <Badge variant="dangerSoft" className="flex w-fit items-center gap-1">
            <XCircle size={10} /> Busy
          </Badge>
        )
      default:
        return (
          <Badge variant="default" className="flex w-fit items-center gap-1">
            <Clock size={10} /> Offline
          </Badge>
        )
    }
  }

  return (
    <Card className="relative flex h-full flex-col">
      <CardHeader variant="gray">
        <div>
          <CardTitle>Staff Management</CardTitle>
          <p className="text-sm font-normal text-gray-500">Manage your team members.</p>
        </div>
        <Button onClick={() => setIsAdding(!isAdding)}>
          {isAdding ? <X size={18} /> : <Plus size={18} />} {isAdding ? 'Cancel' : 'Add New'}
        </Button>
      </CardHeader>

      {/* ADD FORM */}
      {isAdding && (
        <div className="animate-in slide-in-from-top-2 grid grid-cols-1 gap-4 border-b border-blue-100 bg-blue-50 p-6 md:grid-cols-3">
          <Input
            placeholder="Full Name"
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
              value={newPerson.role}
              onChange={(e) => setNewPerson({ ...newPerson, role: e.target.value })}
              options={['Cleaner', 'Security', 'IT&Network', 'Maintenance']}
            />
            <Button variant="success" onClick={handleAdd}>
              Save
            </Button>
          </div>
        </div>
      )}

      {/* LIST */}
      <div className="flex-1 overflow-auto p-6">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-gray-100 text-xs font-bold uppercase text-gray-400">
              <th className="pb-3 pl-2">Member</th>
              <th className="pb-3">Role</th>
              <th className="pb-3">Contact</th>
              <th className="pb-3">Status</th>
              <th className="pb-3 pr-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm text-gray-700">
            {staff.map((person) => (
              <tr
                key={person.id}
                className="group border-b border-gray-50 transition-colors last:border-0 hover:bg-blue-50/50"
              >
                <td className="flex items-center gap-3 py-3 pl-2 font-semibold">
                  <Avatar src={person.img} alt={person.name} />
                  {person.name}
                </td>
                <td className="py-3">
                  <Badge variant="outline">{person.role}</Badge>
                </td>
                <td className="py-3 font-mono text-xs text-gray-500">{person.phone}</td>
                <td className="py-3">{getStatusBadge(person.status)}</td>
                <td className="py-3 pr-2 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="icon"
                      className="bg-blue-50 text-blue-600"
                      onClick={() => setEditingPerson({ ...person })}
                    >
                      <Edit size={16} />
                    </Button>
                    <Button
                      variant="icon"
                      className="bg-red-50 text-red-600"
                      onClick={() => handleDelete(person.id)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* EDIT MODAL */}
      <Modal
        isOpen={!!editingPerson}
        onClose={() => setEditingPerson(null)}
        title="Edit Staff Member"
      >
        {editingPerson && (
          <div className="space-y-4">
            <div className="mb-4 flex justify-center">
              <Avatar src={editingPerson.img} size="lg" className="border-4 border-blue-50" />
            </div>
            <Input
              label="Name"
              value={editingPerson.name}
              onChange={(e) => setEditingPerson({ ...editingPerson, name: e.target.value })}
            />
            <Select
              label="Role"
              value={editingPerson.role}
              onChange={(e) => setEditingPerson({ ...editingPerson, role: e.target.value })}
              options={['Cleaner', 'Security', 'IT&Network', 'Maintenance']}
            />
            <Input
              label="Phone"
              value={editingPerson.phone}
              onChange={(e) => setEditingPerson({ ...editingPerson, phone: e.target.value })}
            />

            <div className="mt-6 flex gap-3">
              <Button variant="ghost" className="flex-1" onClick={() => setEditingPerson(null)}>
                Cancel
              </Button>
              <Button variant="primary" className="flex-1" onClick={handleUpdate}>
                Save Changes
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </Card>
  )
}

export default StaffManager
