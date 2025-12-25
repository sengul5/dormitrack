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

// SERVİS BAĞLANTISI
import { requestService } from '@/services/requests'

const CreateRequestForm: React.FC = () => {
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Form Verileri
  const [category, setCategory] = useState('')
  const [priority, setPriority] = useState<'Low' | 'Medium' | 'High'>('Low')
  const [room, setRoom] = useState('')
  const [desc, setDesc] = useState('')
  const [file, setFile] = useState<File | null>(null)

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

    if (!category || !desc || !room) {
      alert('Please select category, enter room and description.')
      return
    }

    setIsSubmitting(true)

    try {
      // Servise veri gönderimi
      await requestService.create({
        category,
        priority,
        desc,
        room,
        file: file || undefined, // Dosya varsa ekler
      })

      setSubmitted(true)
    } catch (error) {
      console.error('Talep hatası:', error)
      alert('Talep gönderilemedi.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <Card className="flex h-[600px] animate-in zoom-in-95 flex-col items-center justify-center p-12 text-center">
        <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-green-50 text-green-600">
          <CheckCircle size={48} />
        </div>
        <h2 className="mb-2 text-3xl font-bold text-gray-800">Request Submitted!</h2>
        <p className="mx-auto mb-8 max-w-md text-gray-500">
          Your request for <strong>{room}</strong> has been sent.
        </p>
        <div className="flex gap-4">
          <a href="/">
            <Button variant="outline">Go to Dashboard</Button>
          </a>
        </div>
      </Card>
    )
  }

  return (
    <div className="grid h-full grid-cols-1 gap-8 lg:grid-cols-3">
      <Card className="p-8 lg:col-span-2">
        <h2 className="mb-6 flex items-center gap-2 text-xl font-bold text-gray-800">
          1. What is the issue about?
        </h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.name)}
              className={`relative flex h-40 flex-col items-center justify-center gap-3 rounded-2xl border-2 p-6 transition-all ${
                category === cat.name
                  ? 'scale-105 transform border-blue-600 bg-blue-50 text-blue-700 shadow-md'
                  : 'border-gray-100 bg-white text-gray-500 hover:border-blue-200 hover:bg-gray-50'
              }`}
            >
              <cat.icon size={32} strokeWidth={1.5} />
              <span className="text-sm font-bold">{cat.name}</span>
              {category === cat.name && (
                <div className="absolute right-3 top-3 text-blue-600">
                  <CheckCircle size={16} />
                </div>
              )}
            </button>
          ))}
        </div>

        <div className="mt-8">
          <h2 className="mb-4 text-xl font-bold text-gray-800">2. Location</h2>
          <input
            type="text"
            placeholder="Where is the issue? (e.g. Room 101)"
            value={room}
            onChange={(e) => setRoom(e.target.value)}
            className="w-full rounded-2xl border border-gray-100 bg-gray-50 p-4 font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-100"
          />
        </div>

        <div className="mt-8">
          <h2 className="mb-4 text-xl font-bold text-gray-800">3. Problem Description</h2>
          <textarea
            className="h-40 w-full resize-none rounded-2xl border border-gray-100 bg-gray-50 p-4 font-medium text-gray-700 transition-all focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
            placeholder="Describe the issue..."
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
          ></textarea>
        </div>
      </Card>

      <div className="flex flex-col gap-6">
        <Card className="p-8">
          <h2 className="mb-4 text-lg font-bold text-gray-800">Urgency</h2>
          <div className="space-y-3">
            {['Low', 'Medium', 'High'].map((level) => (
              <button
                key={level}
                onClick={() => setPriority(level as any)}
                className={`flex w-full items-center justify-between rounded-xl border px-5 py-3 text-left text-sm font-bold transition-all ${
                  priority === level
                    ? 'bg-blue-50 border-blue-200 text-blue-600'
                    : 'border-gray-100 bg-white text-gray-500'
                }`}
              >
                {level} Priority
              </button>
            ))}
          </div>
        </Card>

        <Card className="flex-1 p-8">
          <h2 className="mb-4 text-lg font-bold text-gray-800">Add Photo</h2>
          <label className="flex h-32 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 text-gray-400 hover:bg-blue-50">
            <input
              type="file"
              className="hidden"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
            <UploadCloud size={24} className="mb-2" />
            <span className="text-xs font-bold">{file ? file.name : 'Click to upload'}</span>
          </label>

          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="mt-6 w-full py-4 text-lg shadow-xl"
          >
            {isSubmitting ? 'Sending...' : 'Submit Request'} <ArrowRight size={20} />
          </Button>
        </Card>
      </div>
    </div>
  )
}

export default CreateRequestForm