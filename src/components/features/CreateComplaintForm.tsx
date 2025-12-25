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
} from 'lucide-react'

// SERVİS BAĞLANTISI
import { complaintService } from '@/services/complaints'

const CreateComplaintForm: React.FC = () => {
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Form State
  const [type, setType] = useState('')
  const [priority, setPriority] = useState('Low')
  const [room, setRoom] = useState('')
  const [desc, setDesc] = useState('')

  const categories = [
    { id: 'Noise', name: 'Noise', icon: VolumeX },
    { id: 'Hygiene', name: 'Hygiene', icon: Trash2 },
    { id: 'Security', name: 'Security', icon: ShieldAlert },
    { id: 'Rule Violation', name: 'Rule Violation', icon: Ban },
    { id: 'Other', name: 'Other Issue', icon: AlertTriangle },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!type || !desc || !room) {
      alert('Please fill in Issue Type, Room, and Description.')
      return
    }

    setIsSubmitting(true)

    try {
      // Servise veri gönderiyoruz
      await complaintService.create({
        type: type,
        subject: `${type} Issue in ${room}`, // Başlığı otomatik oluşturuyoruz
        desc: desc,
        room: room,
        priority: priority,
        status: 'Pending',
      } as any) // TypeScript tip hatasını geçici engellemek için

      setSubmitted(true)
    } catch (error) {
      console.error('Şikayet hatası:', error)
      alert('Şikayet iletilemedi (Backend kapalı olabilir).')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="flex h-[600px] animate-in zoom-in-95 flex-col items-center justify-center rounded-[30px] border border-gray-100 bg-white p-12 text-center shadow-sm">
        <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-red-50 text-red-600">
          <CheckCircle size={48} />
        </div>
        <h2 className="mb-2 text-3xl font-bold text-gray-800">Complaint Submitted</h2>
        <p className="mx-auto mb-8 max-w-md text-gray-500">
          Your report has been received. We will check Room {room} shortly.
        </p>
        <div className="flex gap-4">
          <a
            href="/"
            className="rounded-xl bg-gray-100 px-6 py-3 font-bold text-gray-700 transition-colors hover:bg-gray-200"
          >
            Dashboard
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="grid h-full grid-cols-1 gap-8 pb-10 lg:grid-cols-3">
      {/* SOL: KATEGORİ VE ODA */}
      <div className="flex flex-col gap-6 rounded-[30px] border border-gray-100 bg-white p-8 shadow-sm lg:col-span-2">
        <div>
          <h2 className="mb-4 text-xl font-bold text-gray-800">1. Issue Type</h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setType(cat.id)}
                className={`flex h-32 flex-col items-center justify-center gap-2 rounded-2xl border-2 p-4 transition-all ${
                  type === cat.id
                    ? 'border-red-600 bg-red-50 text-red-700 shadow-md'
                    : 'border-gray-100 bg-white text-gray-500 hover:border-red-200 hover:bg-red-50'
                }`}
              >
                <cat.icon size={28} strokeWidth={1.5} />
                <span className="text-sm font-bold">{cat.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <h2 className="mb-4 text-xl font-bold text-gray-800">2. Location</h2>
          <input
            type="text"
            placeholder="Room Number or Area"
            value={room}
            onChange={(e) => setRoom(e.target.value)}
            className="w-full rounded-2xl border border-gray-100 bg-gray-50 p-4 font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-100"
          />
        </div>

        <div>
          <h2 className="mb-4 text-xl font-bold text-gray-800">3. Details</h2>
          <textarea
            className="h-32 w-full resize-none rounded-2xl border border-gray-100 bg-gray-50 p-4 font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-100"
            placeholder="Describe the issue..."
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
          ></textarea>
        </div>
      </div>

      {/* SAĞ: ÖNCELİK VE GÖNDER */}
      <div className="flex flex-col gap-6">
        <div className="rounded-[30px] border border-gray-100 bg-white p-8 shadow-sm">
          <h2 className="mb-4 text-lg font-bold text-gray-800">Severity</h2>
          <div className="space-y-3">
            {['Low', 'Medium', 'High', 'Critical'].map((level) => (
              <button
                key={level}
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
        </div>

        <div className="flex flex-1 flex-col justify-end rounded-[30px] border border-gray-100 bg-white p-8 shadow-sm">
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 py-4 text-lg font-bold text-white shadow-xl shadow-red-200 transition-transform active:scale-95 hover:bg-red-700 disabled:opacity-70"
          >
            {isSubmitting ? (
              'Sending...'
            ) : (
              <>
                Submit Report <ArrowRight size={20} />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default CreateComplaintForm