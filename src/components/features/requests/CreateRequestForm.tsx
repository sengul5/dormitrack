import React, { useState } from 'react'
import {
  Wifi,
  Droplets,
  Zap,
  Bed,
  Thermometer,
  UploadCloud,
  CheckCircle,
  ArrowRight,
  AlertTriangle,
} from 'lucide-react'
import { Card } from '@ui/Card.component'
import Button from '@ui/Button.component'
import toast from 'react-hot-toast'

const CreateRequestForm: React.FC = () => {
  const [submitted, setSubmitted] = useState(false)
  const [category, setCategory] = useState('')
  const [priority, setPriority] = useState<'Low' | 'Medium' | 'High'>('Low')
  const [desc, setDesc] = useState('')
  const [loading, setLoading] = useState(false)

  // Kategoriler (Sabit kalabilir veya API'den çekilebilir)
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
    if (!category || !desc) {
      toast.error('Please select a category and describe the issue.')
      return
    }

    setLoading(true)
    const toastId = toast.loading('Sending request...')

    try {
      const res = await fetch('/api/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category, room: '101', priority, description: desc }),
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

        <div className="mt-8">
          <h2 className="mb-4 text-xl font-bold text-gray-800">2. Description</h2>
          <textarea
            className="h-32 w-full rounded-xl border bg-gray-50 p-4"
            placeholder="Describe the problem..."
            onChange={(e) => setDesc(e.target.value)}
          ></textarea>
        </div>
      </Card>

      <div className="flex flex-col gap-6">
        <Card className="p-8">
          <h2 className="mb-4 text-lg font-bold">Priority</h2>
          {['Low', 'Medium', 'High'].map((level) => (
            <button
              key={level}
              onClick={() => setPriority(level as any)}
              className={`mb-2 w-full rounded-xl border p-3 text-left ${priority === level ? 'border-blue-200 bg-blue-50 text-blue-600' : 'bg-white'}`}
            >
              {level}
            </button>
          ))}
        </Card>
        <Button onClick={handleSubmit} disabled={loading} className="py-4">
          {loading ? 'Sending...' : 'Submit Request'}
        </Button>
      </div>
    </div>
  )
}
export default CreateRequestForm
