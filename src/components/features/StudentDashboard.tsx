import React, { useState, useEffect } from 'react'
import {
  FileText,
  Megaphone,
  Plus,
  ArrowRight,
  Clock,
  CheckCircle,
  AlertCircle,
} from 'lucide-react'
import { Card } from '@ui/Card.component'
import Badge from '@ui/Badge.component'

// ÖMER'İN İSTEDİĞİ SERVİS YAPISI
import { requestService } from '@/services/requests'
import { complaintService } from '@/services/complaints'

const StudentDashboard: React.FC = () => {
  // State Tanımları
  const [requests, setRequests] = useState<any[]>([])
  const [complaints, setComplaints] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Servislerden veriyi çekiyoruz (Backend bekliyoruz)
        const [reqRes, compRes] = await Promise.all([
          requestService.getAll(),
          complaintService.getMyComplaints(),
        ])

        // GÜVENLİ VERİ İŞLEME:
        // Ömer'in servisi bazen direkt array, bazen { data: [...] } dönebilir.
        // Bu kod her iki ihtimali de yakalar, patlamaz.
        const reqData = Array.isArray(reqRes) ? reqRes : (reqRes as any)?.data || []
        const compData = Array.isArray(compRes) ? compRes : (compRes as any)?.data || []

        setRequests(reqData.reverse())
        setComplaints(compData.reverse())
      } catch (error) {
        console.error('Veri çekme hatası:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // --- İSTATİSTİKLER ---
  const activeRequestsCount = requests.filter((r) => r.status !== 'Completed').length
  const openComplaintsCount = complaints.filter((c) => c.status !== 'Resolved').length

  // --- SON KAYITLAR (İlk 3) ---
  const recentRequests = requests.slice(0, 3)
  const recentComplaints = complaints.slice(0, 3)

  // Duruma göre Badge (Rozet) rengi
  const getStatusBadge = (status: string) => {
    let variant: 'info' | 'success' | 'warning' = 'warning'
    let Icon = AlertCircle

    if (status === 'Completed' || status === 'Resolved') {
      variant = 'success'
      Icon = CheckCircle
    } else if (status === 'In Progress' || status === 'Investigating') {
      variant = 'info'
      Icon = Clock
    }

    return (
      <Badge variant={variant} className="w-32 justify-center">
        <Icon size={12} className="mr-1" /> {status}
      </Badge>
    )
  }

  if (loading) {
    return <div className="p-10 text-center text-gray-400">Yükleniyor...</div>
  }

  return (
    <div className="h-full space-y-8 pb-10">
      {/* --- HERO SECTION --- */}
      <div className="relative flex flex-col items-center justify-between gap-6 overflow-hidden rounded-[30px] bg-blue-600 p-8 text-white shadow-lg shadow-blue-200 md:flex-row">
        <div className="pointer-events-none absolute right-0 top-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>
        <div className="relative z-10">
          <h2 className="mb-2 text-3xl font-bold">Welcome! 👋</h2>
          <p className="text-lg text-blue-100 opacity-90">Everything looks good.</p>
        </div>
        <div className="relative z-10 flex gap-3">
          <a
            href="/new-request"
            className="flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-bold text-blue-600 shadow-sm transition-colors hover:bg-blue-50"
          >
            <Plus size={18} /> New Request
          </a>
          <a
            href="/new-complaint"
            className="flex items-center gap-2 rounded-xl border border-blue-400/30 bg-blue-700/40 px-6 py-3.5 text-sm font-bold text-white backdrop-blur-sm transition-colors hover:bg-blue-700/60"
          >
            <Megaphone size={18} /> New Complaint
          </a>
        </div>
      </div>

      {/* --- STATS --- */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card className="flex items-center justify-between rounded-[24px] p-6 transition-shadow hover:shadow-md">
          <div className="flex items-center gap-5">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <FileText size={32} />
            </div>
            <div>
              <h3 className="mb-1 text-xs font-bold uppercase tracking-wider text-gray-400">
                Active Requests
              </h3>
              <p className="text-4xl font-bold text-gray-800">{activeRequestsCount}</p>
            </div>
          </div>
          <ArrowRight className="text-gray-300" />
        </Card>

        <Card className="flex items-center justify-between rounded-[24px] p-6 transition-shadow hover:shadow-md">
          <div className="flex items-center gap-5">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-600">
              <Megaphone size={32} />
            </div>
            <div>
              <h3 className="mb-1 text-xs font-bold uppercase tracking-wider text-gray-400">
                Open Complaints
              </h3>
              <p className="text-4xl font-bold text-gray-800">{openComplaintsCount}</p>
            </div>
          </div>
          <ArrowRight className="text-gray-300" />
        </Card>
      </div>

      {/* --- LISTS --- */}
      <div className="grid grid-cols-1 gap-8 xl:grid-cols-2">
        {/* REQUESTS LIST */}
        <div>
          <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-gray-800">
            <FileText className="text-blue-600" size={20} /> Recent Requests
          </h3>
          <div className="space-y-3">
            {recentRequests.map((item) => (
              <Card
                key={item.id}
                className="flex items-center justify-between p-4 hover:border-blue-100"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-xs font-bold text-blue-600">
                    #{item.id}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-800">{item.category}</h4>
                    <div className="mt-1 text-xs text-gray-400">{item.date || 'No Date'}</div>
                  </div>
                </div>
                {getStatusBadge(item.status)}
              </Card>
            ))}
          </div>
        </div>

        {/* COMPLAINTS LIST */}
        <div>
          <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-gray-800">
            <Megaphone className="text-red-600" size={20} /> Recent Complaints
          </h3>
          <div className="space-y-3">
            {recentComplaints.map((item) => (
              <Card
                key={item.id}
                className="flex items-center justify-between p-4 hover:border-red-100"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-xs font-bold text-red-600">
                    #{item.id}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-800">
                      {item.subject || item.type || 'Complaint'}
                    </h4>
                    <div className="mt-1 text-xs text-gray-400">{item.date || 'No Date'}</div>
                  </div>
                </div>
                {getStatusBadge(item.status)}
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default StudentDashboard