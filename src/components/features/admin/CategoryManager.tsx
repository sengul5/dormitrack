import React, { useState } from 'react'
import {
  Wifi,
  Droplets,
  Zap,
  PenTool,
  Trash2,
  Plus,
  X,
  Volume2,
  ShieldAlert,
  AlertTriangle,
  Layers,
  Edit2,
  Bed,
  Key,
  Thermometer,
  Hammer,
  Fan,
  Lock,
  Music,
  Settings,
  Check,
} from 'lucide-react'
import { Card, CardHeader, CardTitle } from '@ui/Card.component'
import Button from '@ui/Button.component'
import Modal from '@ui/Modal.component'
import { Input } from '@ui/Input.component'

// --- Types ---
interface CategoryItem {
  id: number
  name: string
  iconId: string
  count: number
}

interface IconDef {
  id: string
  component: React.ElementType
  label: string
}

// --- Constants ---
const ICON_LIBRARY: IconDef[] = [
  { id: 'wifi', component: Wifi, label: 'Wifi' },
  { id: 'water', component: Droplets, label: 'Plumbing' },
  { id: 'electric', component: Zap, label: 'Electric' },
  { id: 'repair', component: PenTool, label: 'Repair' },
  { id: 'clean', component: Trash2, label: 'Cleaning' },
  { id: 'sound', component: Volume2, label: 'Noise' },
  { id: 'security', component: ShieldAlert, label: 'Security' },
  { id: 'alert', component: AlertTriangle, label: 'Danger' },
  { id: 'bed', component: Bed, label: 'Furniture' },
  { id: 'key', component: Key, label: 'Keys' },
  { id: 'heat', component: Thermometer, label: 'Heating' },
  { id: 'hammer', component: Hammer, label: 'Fix' },
  { id: 'fan', component: Fan, label: 'Air Cond.' },
  { id: 'lock', component: Lock, label: 'Lock' },
  { id: 'music', component: Music, label: 'Music' },
  { id: 'other', component: Layers, label: 'Other' },
]

const CategoryManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'requests' | 'complaints'>('requests')
  const [showModal, setShowModal] = useState(false)

  // Edit State
  const [editingId, setEditingId] = useState<number | null>(null)
  const [catName, setCatName] = useState('')
  const [selectedIcon, setSelectedIcon] = useState('other')

  // Data
  const [reqCategories, setReqCategories] = useState<CategoryItem[]>([
    { id: 1, name: 'Wifi & Internet', iconId: 'wifi', count: 12 },
    { id: 2, name: 'Plumbing', iconId: 'water', count: 5 },
    { id: 3, name: 'Electrical', iconId: 'electric', count: 3 },
    { id: 4, name: 'Furniture', iconId: 'bed', count: 8 },
  ])

  const [compCategories, setCompCategories] = useState<CategoryItem[]>([
    { id: 101, name: 'Noise Disturbance', iconId: 'sound', count: 4 },
    { id: 102, name: 'Theft / Lost Item', iconId: 'security', count: 2 },
    { id: 103, name: 'Hygiene Issue', iconId: 'clean', count: 6 },
  ])

  const currentList = activeTab === 'requests' ? reqCategories : compCategories
  const setCurrentList = activeTab === 'requests' ? setReqCategories : setCompCategories

  // --- Actions ---

  const handleDelete = (id: number) => {
    if (window.confirm('Delete this category?')) {
      setCurrentList(currentList.filter((c) => c.id !== id))
    }
  }

  const openAddModal = () => {
    setEditingId(null)
    setCatName('')
    setSelectedIcon('other')
    setShowModal(true)
  }

  const openEditModal = (item: CategoryItem) => {
    setEditingId(item.id)
    setCatName(item.name)
    setSelectedIcon(item.iconId)
    setShowModal(true)
  }

  const handleSave = () => {
    if (!catName) return

    if (editingId) {
      // Update
      setCurrentList(
        currentList.map((item) =>
          item.id === editingId ? { ...item, name: catName, iconId: selectedIcon } : item
        )
      )
    } else {
      // Create
      const newItem: CategoryItem = {
        id: Date.now(),
        name: catName,
        iconId: selectedIcon,
        count: 0,
      }
      setCurrentList([...currentList, newItem])
    }

    setShowModal(false)
  }

  const getIconComponent = (id: string) => {
    const item = ICON_LIBRARY.find((i) => i.id === id)
    const Icon = item ? item.component : Layers
    return <Icon size={24} />
  }

  return (
    <Card className="relative flex h-full flex-col">
      {/* HEADER */}
      <CardHeader className="flex-col items-center gap-4 md:flex-row">
        <div>
          <CardTitle icon={Settings}>System Categories</CardTitle>
          <p className="mt-1 text-sm font-normal text-gray-500">
            Define options available for student requests.
          </p>
        </div>

        {/* Custom Tab Switcher */}
        <div className="flex rounded-xl border border-gray-100 bg-gray-50 p-1">
          <button
            onClick={() => setActiveTab('requests')}
            className={`rounded-lg px-6 py-2 text-sm font-bold transition-all ${
              activeTab === 'requests'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            Request Types
          </button>
          <button
            onClick={() => setActiveTab('complaints')}
            className={`rounded-lg px-6 py-2 text-sm font-bold transition-all ${
              activeTab === 'complaints'
                ? 'bg-white text-red-600 shadow-sm'
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            Complaint Types
          </button>
        </div>
      </CardHeader>

      {/* CONTENT GRID */}
      <div className="flex-1 overflow-y-auto bg-gray-50/30 p-6">
        <div className="mb-6 flex justify-end">
          <Button variant={activeTab === 'requests' ? 'primary' : 'danger'} onClick={openAddModal}>
            <Plus size={16} /> Define New Category
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {currentList.map((item) => (
            <div
              key={item.id}
              className="group relative rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all hover:border-gray-300 hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <div
                  className={`mb-4 flex h-12 w-12 items-center justify-center rounded-2xl transition-colors ${
                    activeTab === 'requests'
                      ? 'bg-blue-50 text-blue-600 group-hover:bg-blue-100'
                      : 'bg-red-50 text-red-600 group-hover:bg-red-100'
                  }`}
                >
                  {getIconComponent(item.iconId)}
                </div>
                {/* Action Buttons */}
                <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                  <button
                    onClick={() => openEditModal(item)}
                    className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-blue-50 hover:text-blue-600"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <h3 className="text-sm font-bold text-gray-700">{item.name}</h3>
              <div className="mt-3 flex items-center justify-between border-t border-gray-50 pt-3">
                <span className="text-xs font-medium text-gray-400">{item.count} Active Items</span>
                <span className="h-2 w-2 rounded-full bg-green-500"></span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* --- MODAL --- */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingId ? 'Edit Category' : 'New Configuration'}
      >
        <div className="space-y-6">
          {/* Input */}
          <Input
            label="Display Name"
            placeholder="e.g. Broken Furniture"
            value={catName}
            onChange={(e) => setCatName(e.target.value)}
          />

          {/* Icon Grid */}
          <div>
            <label className="mb-3 block text-xs font-bold uppercase text-gray-400">
              Assign System Icon
            </label>
            <div className="grid grid-cols-5 gap-3">
              {ICON_LIBRARY.map((icon) => (
                <button
                  key={icon.id}
                  onClick={() => setSelectedIcon(icon.id)}
                  className={`relative flex aspect-square items-center justify-center rounded-xl border-2 transition-all ${
                    selectedIcon === icon.id
                      ? 'scale-105 border-blue-600 bg-blue-600 text-white shadow-md'
                      : 'border-gray-100 bg-white text-gray-400 hover:border-blue-200 hover:bg-gray-50'
                  }`}
                >
                  <icon.component size={20} />
                  {selectedIcon === icon.id && (
                    <div className="absolute -right-1 -top-1 rounded-full border border-blue-100 bg-white text-blue-600 shadow-sm">
                      <Check size={10} strokeWidth={4} />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="flex gap-3 pt-2">
            <Button variant="ghost" className="flex-1" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button
              variant={activeTab === 'requests' ? 'primary' : 'danger'}
              className="flex-1"
              onClick={handleSave}
            >
              {editingId ? 'Update' : 'Save'}
            </Button>
          </div>
        </div>
      </Modal>
    </Card>
  )
}

export default CategoryManager
