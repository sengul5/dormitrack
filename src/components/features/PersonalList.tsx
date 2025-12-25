import React, { useState, useEffect } from 'react'
import { User, Trash2, Plus, X, RefreshCw } from 'lucide-react'
import { Card, CardHeader, CardTitle } from '@ui/Card.component'
import Button from '@ui/Button.component'
import Badge from '@ui/Badge.component'
import { Input, Select } from '@ui/Input.component'

interface StaffLite {
  id: number
  name: string
  role: string
  status: 'active' | 'busy' | 'offline'
}

const PersonalList: React.FC = () => {
  const [staff, setStaff] = useState<StaffLite[]>([])
  const [loading, setLoading] = useState(true)

  // UI States
  const [isAdding, setIsAdding] = useState(false)
  const [newPerson, setNewPerson] = useState<Partial<StaffLite>>({ name: '', role: 'Cleaner' })
  const [filterRole, setFilterRole] = useState<string>('All')

  // --- VERİ ÇEKME ---
  const fetchStaff = async () => {
    setLoading(true)
    try {
      // Backend simülasyonu
      await new Promise((resolve) => setTimeout(resolve, 600))

      setStaff([
        { id: 1, name: 'Carl Max', role: 'Cleaner', status: 'active' },
        { id: 2, name: 'Necder Zorluer', role: 'Cleaner', status: 'active' },
        { id: 3, name: 'Necip Uysal', role: 'Cleaner', status: 'busy' },
        { id: 4, name: 'Beyza Beyaz', role: 'IT&Network', status: 'offline' },
        { id: 5, name: 'Mustafa Sönmez', role: 'Security', status: 'active' },
      ])
    } catch (error) {
      console.error('Liste yüklenemedi', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStaff()
  }, [])

  // --- DELETE ---
  const handleDelete = async (id: number) => {
    if (!window.confirm('Delete user?')) return
    
    // Optimistic UI
    setStaff(staff.filter((person) => person.id !== id))
  }

  // --- ADD ---
  const handleAdd = async () => {
    if (!newPerson.name) return

    const newItem: StaffLite = {
      id: Date.now(),
      name: newPerson.name,
      role: newPerson.role || 'Cleaner',
      status: 'offline', // Yeni eklenenler offline başlar
    }

    setStaff([newItem, ...staff])
    setIsAdding(false)
    setNewPerson({ name: '', role: 'Cleaner' })
  }

  // Filtreleme Mantığı
  const filteredStaff = filterRole === 'All' ? staff : staff.filter((p) => p.role === filterRole)

  return (
    <Card className="flex h-full flex-col">
      <CardHeader className="flex-col items-stretch space-y-3 pb-2">
        <div className="flex items-center justify-between">
          <CardTitle>Staff List ({staff.length})</CardTitle>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" onClick={fetchStaff} title="Refresh List">
                <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            </Button>
            <Button
                size="icon"
                variant={isAdding ? 'danger' : 'primary'}
                onClick={() => setIsAdding(!isAdding)}
            >
                {isAdding ? <X size={18} /> : <Plus size={18} />}
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
          {['All', 'Cleaner', 'Security', 'IT&Network'].map((role) => (
            <button
              key={role}
              onClick={() => setFilterRole(role)}
              className={`whitespace-nowrap rounded-full border px-3 py-1 text-xs transition-colors ${
                filterRole === role
                  ? 'border-blue-200 bg-blue-50 font-bold text-blue-700'
                  : 'border-gray-100 text-gray-500 hover:bg-gray-50'
              }`}
            >
              {role}
            </button>
          ))}
        </div>
      </CardHeader>

      {/* Add Form */}
      {isAdding && (
        <div className="animate-in slide-in-from-top-2 space-y-3 border-b border-blue-100 bg-blue-50/50 p-4">
          <Input
            placeholder="Name & Surname"
            value={newPerson.name}
            onChange={(e) => setNewPerson({ ...newPerson, name: e.target.value })}
            className="bg-white"
            autoFocus
          />
          <div className="flex gap-2">
            <Select
              className="bg-white"
              value={newPerson.role}
              onChange={(e) => setNewPerson({ ...newPerson, role: e.target.value })}
              options={['Cleaner', 'Security', 'IT&Network']}
            />
            <Button size="sm" onClick={handleAdd}>
              Add
            </Button>
          </div>
        </div>
      )}

      {/* List */}
      <div className="flex-1 space-y-1 overflow-y-auto p-2">
        {loading ? (
            <div className="py-8 text-center text-xs text-gray-400">Loading staff list...</div>
        ) : filteredStaff.length === 0 ? (
            <div className="py-8 text-center text-xs text-gray-400">No staff found.</div>
        ) : (
            filteredStaff.map((person) => (
            <div
                key={person.id}
                className="group flex items-center justify-between rounded-xl border border-transparent p-3 transition-all hover:border-gray-100 hover:bg-gray-50"
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
                className="p-2 text-gray-300 opacity-0 transition-opacity hover:text-red-500 group-hover:opacity-100"
                >
                <Trash2 size={16} />
                </button>
            </div>
            ))
        )}
      </div>
    </Card>
  )
}

export default PersonalList