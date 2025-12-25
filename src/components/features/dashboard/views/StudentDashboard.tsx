import React, { useEffect, useState } from 'react'
import {
  FileText,
  Megaphone,
  Plus,
  ArrowRight,
  Clock,
  CheckCircle,
  AlertCircle,
  ChevronRight,
} from 'lucide-react'
import { Card } from '@ui/Card.component'
import Badge from '@ui/Badge.component'
import Button from '@ui/Button.component' // Button componentini ekledik
import toast from 'react-hot-toast'

const StudentDashboard: React.FC = () => {
  const [stats, setStats] = useState({ activeRequests: 0, openComplaints: 0 })
  const [recentRequests, setRecentRequests] = useState<any[]>([])
  const [recentComplaints, setRecentComplaints] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [reqRes, compRes] = await Promise.all([
          fetch('/api/requests/my'),
          fetch('/api/complaints/my'),
        ])

        const reqData = await reqRes.json()
        const compData = await compRes.json()

        setStats({
          activeRequests: reqData.filter((r: any) => r.status !== 'Completed').length,
          openComplaints: compData.filter((c: any) => c.status !== 'Resolved').length,
        })

        // Dashboard temiz dursun diye son 3 kaydı alıyoruz
        setRecentRequests(reqData.slice(0, 3))
        setRecentComplaints(compData.slice(0, 3))
      } catch (error) {
        toast.error('Dashboard verileri yüklenemedi.')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const getStatusBadge = (status: string) => {
    const s = status?.toLowerCase() || ''
    if (s.includes('progress') || s.includes('investigating')) {
      return (
        <Badge variant="info" className="w-28 justify-center text-[10px]">
          <Clock size={12} className="mr-1" /> Processing
        </Badge>
      )
    }
    if (s.includes('completed') || s.includes('resolved')) {
      return (
        <Badge variant="success" className="w-28 justify-center text-[10px]">
          <CheckCircle size={12} className="mr-1" /> Done
        </Badge>
      )
    }
    return (
      <Badge variant="warning" className="w-28 justify-center text-[10px]">
        <AlertCircle size={12} className="mr-1" /> Pending
      </Badge>
    )
  }

  if (loading) return <div className="p-8 text-center text-gray-400">Loading your dashboard...</div>

  return (
    <div className="h-full space-y-8 pb-10">
      {/* Hero */}
      <div className="relative flex flex-col items-center justify-between gap-6 overflow-hidden rounded-[30px] bg-blue-600 p-8 text-white shadow-lg shadow-blue-200 md:flex-row">
        <div className="relative z-10">
          <h2 className="mb-2 text-3xl font-bold">Welcome! 👋</h2>
          <p className="text-lg text-blue-100 opacity-90">Manage your dormitory life easily.</p>
        </div>
        <div className="relative z-10">
          <a
            href="/dashboard/new-request"
            className="flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-bold text-blue-600 shadow-sm transition-all hover:scale-105 hover:bg-blue-50"
          >
            <Plus size={18} /> New Request
          </a>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card className="flex items-center justify-between rounded-[24px] p-6 transition-all hover:shadow-md">
          <div className="flex items-center gap-5">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <FileText size={32} />
            </div>
            <div>
              <h3 className="mb-1 text-xs font-bold uppercase tracking-wider text-gray-400">Active Requests</h3>
              <p className="text-4xl font-bold text-gray-800">{stats.activeRequests}</p>
            </div>
          </div>
          <a href="/dashboard/my-requests" className="rounded-full p-2 hover:bg-gray-100 transition-colors">
            <ArrowRight className="text-gray-300 hover:text-blue-600" />
          </a>
        </Card>

        <Card className="flex items-center justify-between rounded-[24px] p-6 transition-all hover:shadow-md">
          <div className="flex items-center gap-5">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-600">
              <Megaphone size={32} />
            </div>
            <div>
              <h3 className="mb-1 text-xs font-bold uppercase tracking-wider text-gray-400">Open Complaints</h3>
              <p className="text-4xl font-bold text-gray-800">{stats.openComplaints}</p>
            </div>
          </div>
          <a href="/dashboard/my-complaints" className="rounded-full p-2 hover:bg-gray-100 transition-colors">
            <ArrowRight className="text-gray-300 hover:text-red-600" />
          </a>
        </Card>
      </div>

      {/* Lists */}
      <div className="grid grid-cols-1 gap-8 xl:grid-cols-2">
        {/* Recent Requests Section */}
        <div className="flex flex-col">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="flex items-center gap-2 text-lg font-bold text-gray-800">
              <FileText className="text-blue-600" size={20} /> Recent Requests
            </h3>
          </div>
          <div className="space-y-3">
            {recentRequests.map((item) => (
              <Card key={item.id} className="flex items-center justify-between p-4 transition-all hover:border-blue-200">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-xs font-bold text-blue-600">
                    #{item.id}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-800">{item.category}</h4>
                    <div className="mt-1 text-xs text-gray-400">{item.date || 'Today'}</div>
                  </div>
                </div>
                {getStatusBadge(item.status)}
              </Card>
            ))}
            
            {/* View All Requests Button */}
            <div className="pt-2">
              <a href="/dashboard/my-requests" className="group flex items-center justify-center gap-2 rounded-xl border border-dashed border-gray-200 py-3 text-sm font-semibold text-gray-500 transition-all hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50/30">
                View All Requests
                <ChevronRight size={16} className="transition-transform group-hover:translate-x-1" />
              </a>
            </div>
          </div>
        </div>

        {/* Recent Complaints Section */}
        <div className="flex flex-col">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="flex items-center gap-2 text-lg font-bold text-gray-800">
              <Megaphone className="text-red-600" size={20} /> Recent Complaints
            </h3>
          </div>
          <div className="space-y-3">
            {recentComplaints.map((item) => (
              <Card key={item.id} className="flex items-center justify-between p-4 transition-all hover:border-red-200">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-xs font-bold text-red-600">
                    #{item.id}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-800">{item.category}</h4>
                    <div className="mt-1 text-xs text-gray-400">{item.date || 'Today'}</div>
                  </div>
                </div>
                {getStatusBadge(item.status)}
              </Card>
            ))}

            {/* View All Complaints Button */}
            <div className="pt-2">
              <a href="/dashboard/my-complaints" className="group flex items-center justify-center gap-2 rounded-xl border border-dashed border-gray-200 py-3 text-sm font-semibold text-gray-500 transition-all hover:border-red-400 hover:text-red-600 hover:bg-red-50/30">
                View All Complaints
                <ChevronRight size={16} className="transition-transform group-hover:translate-x-1" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StudentDashboard