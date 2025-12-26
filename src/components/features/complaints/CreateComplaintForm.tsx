import React, { useState } from 'react'
import {
  VolumeX,
  ShieldAlert,
  Trash2,
  Ban,
  AlertTriangle,
  UploadCloud,
  CheckCircle,
  ArrowRight,
  Home, // Oda simgesi için eklendi
} from 'lucide-react'
import { Card } from '@ui/Card.component'
import Button from '@ui/Button.component'
import toast from 'react-hot-toast'

const CreateComplaintForm: React.FC = () => {
  const [submitted, setSubmitted] = useState(false)
  const [category, setCategory] = useState('')
  const [priority, setPriority] = useState('Low')
  const [room, setRoom] = useState('') // Oda numarası state'i eklendi
  const [desc, setDesc] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)

  const categories = [
    { id: 'noise', name: 'Noise', icon: VolumeX },
    { id: 'hygiene', name: 'Hygiene', icon: Trash2 },
    { id: 'security', name: 'Security', icon: ShieldAlert },
    { id: 'rule', name: 'Rule Violation', icon: Ban },
    { id: 'other', name: 'Other Issue', icon: AlertTriangle },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Oda numarası kontrolü eklendi
    if (!category || !desc || !room) {
      toast.error('Please select a category, enter room number, and describe the issue.')
      return
    }

    setLoading(true)
    const toastId = toast.loading('Submitting report...')

    try {
      const res = await fetch('/api/complaints', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category,
          room, // Statik '101' yerine state'den gelen room gönderiliyor
          priority,
          description: desc,
        }),
      })

      if (!res.ok) throw new Error('Submission failed')

      toast.success('Complaint received!', { id: toastId })
      setSubmitted(true)
    } catch (error) {
      console.error(error)
      toast.error('Failed to submit complaint', { id: toastId })
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <Card className="animate-in zoom-in-95 flex h-[600px] flex-col items-center justify-center p-12 text-center">
        <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-red-50 text-red-600">
          <CheckCircle size={48} />
        </div>
        <h2 className="mb-2 text-3xl font-bold text-gray-800">Complaint Submitted</h2>
        <p className="mx-auto mb-8 max-w-md text-gray-500">
          Your report has been received confidentially.
        </p>
        <div className="flex gap-4">
          <a href="/dashboard">
            <Button variant="outline">Dashboard</Button>
          </a>
          <a href="/dashboard/my-complaints">
            <Button variant="danger">Track Status</Button>
          </a>
        </div>
      </Card>
    )
  }

  return (
    <div className="grid h-full grid-cols-1 gap-8 lg:grid-cols-3">
      <Card className="p-8 lg:col-span-2">
        <h2 className="mb-6 text-xl font-bold text-gray-800">1. What is the issue?</h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setCategory(cat.name)}
              className={`flex h-40 flex-col items-center justify-center gap-3 rounded-2xl border-2 p-6 transition-all ${
                category === cat.name
                  ? 'scale-105 transform border-red-600 bg-red-50 text-red-700 shadow-md'
                  : 'border-gray-100 bg-white text-gray-500 hover:border-red-200 hover:bg-red-50'
              }`}
            >
              <cat.icon size={32} strokeWidth={1.5} />
              <span className="text-sm font-bold">{cat.name}</span>
            </button>
          ))}
        </div>

        {/* ODA NUMARASI ALANI - YENİ EKLENDİ */}
        <div className="mt-8">
          <h2 className="mb-4 text-xl font-bold text-gray-800">2. Where did it happen? (Room No)</h2>
          <div className="relative">
            <Home className="absolute left-4 top-3.5 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Enter room number (e.g. 101, 404)"
              value={room}
              onChange={(e) => setRoom(e.target.value)}
              className="w-full rounded-xl border border-gray-100 bg-gray-50 p-3 pl-12 font-medium text-gray-700 transition-all focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-100"
            />
          </div>
        </div>

        <div className="mt-8">
          <h2 className="mb-4 text-xl font-bold text-gray-800">3. Incident Details</h2>
          <textarea
            className="h-40 w-full resize-none rounded-2xl border border-gray-100 bg-gray-50 p-4 font-medium text-gray-700 transition-all focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-100"
            placeholder="Describe what happened..."
            onChange={(e) => setDesc(e.target.value)}
            value={desc}
          ></textarea>
        </div>
      </Card>

      <div className="flex flex-col gap-6">
        <Card className="p-8">
          <h2 className="mb-4 text-lg font-bold text-gray-800">Severity</h2>
          <div className="space-y-3">
            {['Low', 'Medium', 'High', 'Critical'].map((level) => (
              <button
                key={level}
                type="button"
                onClick={() => setPriority(level)}
                className={`flex w-full items-center justify-between rounded-xl border px-5 py-3 text-left text-sm font-bold transition-all ${
                  priority === level
                    ? 'border-red-200 bg-red-50 text-red-600'
                    : 'border-gray-100 bg-white text-gray-500 hover:bg-gray-50'
                }`}
              >
                {level}
                {priority === level && <div className="h-3 w-3 rounded-full bg-red-500"></div>}
              </button>
            ))}
          </div>
        </Card>

        <Card className="flex-1 p-8">
          <h2 className="mb-4 text-lg font-bold text-gray-800">Evidence</h2>
          <label className="flex h-32 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 text-gray-400 transition-colors hover:border-red-300 hover:bg-red-50">
            <input
              type="file"
              className="hidden"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
            <UploadCloud size={24} className="mb-2" />
            <span className="text-xs font-bold">{file ? file.name : 'Upload Photo/Video'}</span>
          </label>

          <Button
            onClick={handleSubmit}
            variant="danger"
            disabled={loading}
            className="mt-6 w-full py-4 text-lg shadow-xl shadow-red-200"
          >
            {loading ? 'Submitting...' : 'Submit Report'} <ArrowRight size={20} />
          </Button>
        </Card>
      </div>
    </div>
  )
}

export default CreateComplaintForm