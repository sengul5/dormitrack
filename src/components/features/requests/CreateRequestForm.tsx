import React, { useState } from 'react'
import {
  Wifi,
  Droplets,
  Zap,
  Bed,
  Thermometer,
  CheckCircle,
  AlertTriangle,
  Home, // Oda simgesi için eklendi
} from 'lucide-react'
import { Card } from '@ui/Card.component'
import Button from '@ui/Button.component'
import toast from 'react-hot-toast'

const CreateRequestForm: React.FC = () => {
  const [submitted, setSubmitted] = useState(false)
  const [category, setCategory] = useState('')
  const [priority, setPriority] = useState<'Low' | 'Medium' | 'High'>('Low')
  const [room, setRoom] = useState('') // Oda numarası state'i eklendi
  const [desc, setDesc] = useState('')
  const [loading, setLoading] = useState(false)

  const categories = [
    { id: 'wifi', name: 'Wifi / Network', icon: Wifi },
    { id: 'plumbing', name: 'Plumbing', icon: Droplets },
    { id: 'electric', name: 'Electrical', icon: Zap },
    { id: 'furniture', name: 'Furniture', icon: Bed },
    { id: 'heating', name: 'Heating / AC', icon: Thermometer },
    { id: 'other', name: 'Other Issue', icon: AlertTriangle },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Oda numarası kontrolü eklendi
    if (!category || !desc || !room) {
      toast.error('Please fill in all fields including Room Number.')
      return
    }

    setLoading(true)
    const toastId = toast.loading('Sending request...')

    try {
      const res = await fetch('/api/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // room: '101' yerine state'den gelen room gönderiliyor
        body: JSON.stringify({ category, room, priority, description: desc }),
      })

      if (!res.ok) throw new Error('Failed')

      toast.success('Request sent!', { id: toastId })
      setSubmitted(true)
    } catch (error) {
      toast.error('Error submitting request', { id: toastId })
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <Card className="flex h-[600px] flex-col items-center justify-center p-12 text-center">
        <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-green-50 text-green-600">
          <CheckCircle size={48} />
        </div>
        <h2 className="mb-2 text-3xl font-bold text-gray-800">Request Submitted!</h2>
        <div className="mt-8 flex gap-4">
          <a href="/dashboard">
            <Button variant="outline">Go to Dashboard</Button>
          </a>
          <a href="/dashboard/my-requests">
            <Button>Track Status</Button>
          </a>
        </div>
      </Card>
    )
  }

  return (
    <div className="grid h-full grid-cols-1 gap-8 lg:grid-cols-3">
      <Card className="p-8 lg:col-span-2">
        <h2 className="mb-6 text-xl font-bold text-gray-800">1. Select Issue</h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setCategory(cat.name)}
              className={`flex h-40 flex-col items-center justify-center gap-3 rounded-2xl border-2 p-6 transition-all ${
                category === cat.name
                  ? 'border-blue-600 bg-blue-50 text-blue-700'
                  : 'border-gray-100 bg-white hover:bg-gray-50'
              }`}
            >
              <cat.icon size={32} />
              <span className="text-sm font-bold">{cat.name}</span>
            </button>
          ))}
        </div>

        {/* ODA NUMARASI ALANI - YENİ EKLENDİ */}
        <div className="mt-8">
          <h2 className="mb-4 text-xl font-bold text-gray-800">2. Room Information</h2>
          <div className="relative">
            <Home className="absolute left-4 top-3.5 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Enter your room number (e.g. 404)"
              value={room}
              onChange={(e) => setRoom(e.target.value)}
              className="w-full rounded-xl border bg-gray-50 p-3 pl-12 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="mt-8">
          <h2 className="mb-4 text-xl font-bold text-gray-800">3. Description</h2>
          <textarea
            className="h-32 w-full rounded-xl border bg-gray-50 p-4 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Describe the problem in detail..."
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
          ></textarea>
        </div>
      </Card>

      <div className="flex flex-col gap-6">
        <Card className="p-8">
          <h2 className="mb-4 text-lg font-bold">Priority</h2>
          <div className="flex flex-col gap-2">
            {['Low', 'Medium', 'High'].map((level) => (
              <button
                key={level}
                type="button"
                onClick={() => setPriority(level as any)}
                className={`w-full rounded-xl border p-3 text-left transition-all ${
                  priority === level 
                    ? 'border-blue-500 bg-blue-50 text-blue-600 shadow-sm' 
                    : 'border-gray-100 bg-white hover:border-gray-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`h-2 w-2 rounded-full ${
                    level === 'High' ? 'bg-red-500' : level === 'Medium' ? 'bg-yellow-500' : 'bg-green-500'
                  }`} />
                  <span className="font-medium">{level} Priority</span>
                </div>
              </button>
            ))}
          </div>
        </Card>
        
        <Button onClick={handleSubmit} disabled={loading} className="py-4 text-lg shadow-lg shadow-blue-100">
          {loading ? 'Submitting...' : 'Submit Request'}
        </Button>
      </div>
    </div>
  )
}

export default CreateRequestForm