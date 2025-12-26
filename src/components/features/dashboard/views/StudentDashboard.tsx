import React, { useEffect, useState } from 'react'
import { 
  FileText, Megaphone, PlusSquare, ArrowUpRight, AlertCircle 
} from 'lucide-react'
import { Card } from '@ui/Card.component'
import Badge from '@ui/Badge.component'
import Button from '@ui/Button.component'
import toast from 'react-hot-toast'

const StudentDashboard: React.FC = () => {
  const [stats, setStats] = useState({ open: 0, inProgress: 0, resolved: 0, total: 0 })
  const [recentRequests, setRecentRequests] = useState<any[]>([])
  const [recentComplaints, setRecentComplaints] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const fetchOptions = {
        headers: { 'Content-Type': 'application/json' } as HeadersInit
      }

      const [reqRes, compRes] = await Promise.all([
        fetch('/api/requests/my', fetchOptions),
        fetch('/api/complaints/my', fetchOptions)
      ])
      
      const reqData = await reqRes.json()
      const compData = await compRes.json()

      const allItems = [...reqData, ...compData]
      setStats({
        open: allItems.filter((r: any) => ['OPEN', 'PENDING', 'ACTIVE'].includes(r.status?.toUpperCase())).length,
        inProgress: allItems.filter((r: any) => ['IN PROGRESS', 'PROCESSING', 'INVESTIGATING'].includes(r.status?.toUpperCase())).length,
        resolved: allItems.filter((r: any) => ['RESOLVED', 'COMPLETED', 'DONE'].includes(r.status?.toUpperCase())).length,
        total: allItems.length,
      })

      setRecentRequests(reqData.slice(0, 5))
      setRecentComplaints(compData.slice(0, 5))
    } catch (error) {
      toast.error('Veriler yüklenemedi.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const handleNavigate = (path: string) => {
    window.location.href = path
  }

  const getStatusVariant = (status: string) => {
    const s = status?.toUpperCase()
    if (['OPEN', 'PENDING', 'ACTIVE'].includes(s)) return 'dangerSoft'
    if (['IN PROGRESS', 'PROCESSING', 'INVESTIGATING'].includes(s)) return 'info'
    if (['RESOLVED', 'COMPLETED', 'DONE'].includes(s)) return 'success'
    return 'outline'
  }

  if (loading) return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center font-bold text-blue-600 animate-pulse">
      Dashboard Loading...
    </div>
  )

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 lg:p-8">
      <div className="mx-auto max-w-5xl space-y-6">
        
        {/* Header Section with Dual Buttons */}
        <div className="bg-white rounded-[24px] p-6 shadow-sm border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Welcome Back! 👋</h1>
            <p className="text-slate-500 text-sm">Track your requests and report issues instantly.</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button 
  onClick={() => handleNavigate('/dashboard/new-complaint')} 
  className="bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl px-5 py-2.5 flex items-center transition-all active:scale-95 shadow-md shadow-rose-100"
>
  <AlertCircle size={18} className="mr-2" /> New Complaint
</Button>

<Button 
  onClick={() => handleNavigate('/dashboard/new-request')} 
  className="bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl px-5 py-2.5 flex items-center transition-all active:scale-95 shadow-md shadow-blue-100"
>
  <PlusSquare size={18} className="mr-2" /> New Request
</Button>
          </div>
        </div>

        {/* Dynamic Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'OPEN', val: stats.open, color: 'text-blue-600' },
            { label: 'IN PROGRESS', val: stats.inProgress, color: 'text-amber-500' },
            { label: 'RESOLVED', val: stats.resolved, color: 'text-emerald-500' },
            { label: 'TOTAL RECORD', val: stats.total, color: 'text-slate-700' }
          ].map((stat, i) => (
            <Card key={i} className="p-5 border-none shadow-sm text-center">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
              <h3 className={`text-3xl font-black ${stat.color}`}>{stat.val}</h3>
            </Card>
          ))}
        </div>

        {/* Centralized Tables Stack */}
        <div className="space-y-6">
          {/* Requests Table */}
          <Card className="p-6 border-none shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <FileText className="text-blue-500" size={20} /> Recent Requests
              </h3>
              <button 
                onClick={() => handleNavigate('/dashboard/my-requests')}
                className="text-xs font-bold text-slate-400 hover:text-blue-600 flex items-center gap-1 transition-colors"
              >
                View All <ArrowUpRight size={14} />
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-[10px] font-bold text-slate-400 uppercase border-b border-slate-50">
                    <th className="pb-3 text-left">Category</th>
                    <th className="pb-3 text-left">Status</th>
                    <th className="pb-3 text-right">Date</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {recentRequests.map((req) => (
                    <tr key={req.id} className="border-b border-slate-50 last:border-none hover:bg-slate-50/50 transition-colors">
                      <td className="py-4 font-bold text-slate-700">{req.category}</td>
                      <td className="py-4"><Badge variant={getStatusVariant(req.status)}>{req.status}</Badge></td>
                      <td className="py-4 text-right font-bold text-slate-400">{req.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Complaints Table */}
          <Card className="p-6 border-none shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <Megaphone className="text-rose-500" size={20} /> Recent Complaints
              </h3>
              <button 
                onClick={() => handleNavigate('/dashboard/my-complaints')}
                className="text-xs font-bold text-slate-400 hover:text-rose-600 flex items-center gap-1 transition-colors"
              >
                View All <ArrowUpRight size={14} />
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-[10px] font-bold text-slate-400 uppercase border-b border-slate-50">
                    <th className="pb-3 text-left">Issue</th>
                    <th className="pb-3 text-left">Priority</th>
                    <th className="pb-3 text-left">Status</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {recentComplaints.map((comp) => (
                    <tr key={comp.id} className="border-b border-slate-50 last:border-none hover:bg-slate-50/50 transition-colors">
                      <td className="py-4 font-bold text-slate-700">{comp.category}</td>
                      <td className="py-4">
                        <Badge variant={comp.priority === 'Critical' ? 'danger' : 'warning' as any} className="font-black">
                          {comp.priority}
                        </Badge>
                      </td>
                      <td className="py-4 font-bold"><Badge variant={getStatusVariant(comp.status)}>{comp.status}</Badge></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default StudentDashboard