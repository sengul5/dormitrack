import React, { useState, useEffect } from 'react'
import { User, Trash2, Plus, X } from 'lucide-react'
import { Card, CardHeader, CardTitle } from '@ui/Card.component'
import Button from '@ui/Button.component'
import Badge from '@ui/Badge.component'
import { Input, Select } from '@ui/Input.component'
import toast from 'react-hot-toast'

const PersonalList: React.FC = () => {
  const [staff, setStaff] = useState<any[]>([])
  const [isAdding, setIsAdding] = useState(false)
  const [newPerson, setNewPerson] = useState({ name: '', role: 'Cleaner' })
  const [filterRole, setFilterRole] = useState('All')

  // API'den Çek
  const fetchStaff = async () => {
    const res = await fetch('/api/staff')
    const data = await res.json()
    setStaff(data)
  }

  useEffect(() => {
    fetchStaff()
  }, [])

  // Ekle
  const handleAdd = async () => {
    if (!newPerson.name) return
    const res = await fetch('/api/staff', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...newPerson, phone: '-' }),
    })
    if (res.ok) {
      toast.success('Staff added')
      fetchStaff()
      setIsAdding(false)
      setNewPerson({ name: '', role: 'Cleaner' })
    }
  }

  // Sil
  const handleDelete = async (id: number) => {
    if (!confirm('Delete?')) return
    await fetch(`/api/staff/${id}`, { method: 'DELETE' })
    setStaff(staff.filter((s) => s.id !== id))
  }

  const filteredStaff = filterRole === 'All' ? staff : staff.filter((p) => p.role === filterRole)

  return (
    <Card className="flex h-full flex-col">
      <CardHeader className="flex-col items-stretch space-y-3 pb-2">
        <div className="flex items-center justify-between">
          <CardTitle>Quick Staff List ({staff.length})</CardTitle>
          <Button
            size="icon"
            variant={isAdding ? 'danger' : 'primary'}
            onClick={() => setIsAdding(!isAdding)}
          >
            {isAdding ? <X size={18} /> : <Plus size={18} />}
          </Button>
        </div>
        {/* Filters */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {['All', 'Cleaner', 'Security', 'IT', 'Maintenance'].map((role) => (
            <button
              key={role}
              onClick={() => setFilterRole(role)}
              className={`whitespace-nowrap rounded-full border px-3 py-1 text-xs transition-colors ${
                filterRole === role
                  ? 'border-blue-200 bg-blue-50 font-bold text-blue-700'
                  : 'border-gray-100 text-gray-500'
              }`}
            >
              {role}
            </button>
          ))}
        </div>
      </CardHeader>

      {isAdding && (
        <div className="space-y-3 border-b border-blue-100 bg-blue-50/50 p-4">
          <Input
            placeholder="Name"
            value={newPerson.name}
            onChange={(e) => setNewPerson({ ...newPerson, name: e.target.value })}
            className="bg-white"
          />
          <div className="flex gap-2">
            <Select
              className="bg-white"
              value={newPerson.role}
              onChange={(e) => setNewPerson({ ...newPerson, role: e.target.value })}
              options={['Cleaner', 'Security', 'IT', 'Maintenance']}
            />
            <Button size="sm" onClick={handleAdd}>
              Add
            </Button>
          </div>
        </div>
      )}

      <div className="flex-1 space-y-1 overflow-y-auto p-2">
        {filteredStaff.map((person) => (
          <div
            key={person.id}
            className="flex items-center justify-between rounded-xl border border-transparent p-3 hover:bg-gray-50"
          >
            <div className="flex items-center gap-3">
              <div
                className={`rounded-full p-2 ${person.status === 'active' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'}`}
              >
                <User size={16} />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800">{person.name}</p>
                <Badge variant="outline" className="text-[10px]">
                  {person.role}
                </Badge>
              </div>
            </div>
            <button
              onClick={() => handleDelete(person.id)}
              className="text-gray-300 hover:text-red-500"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>
    </Card>
  )
}
export default PersonalList
