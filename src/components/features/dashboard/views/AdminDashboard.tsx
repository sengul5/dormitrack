import React, { useEffect, useState } from 'react'
import { 
  Users, Search, Bell, ChevronRight,
  ArrowUpRight, Loader2 
} from 'lucide-react'
import { Card } from '@ui/Card.component'
import Badge from '@ui/Badge.component'
import Button from '@ui/Button.component'
import Avatar from '@ui/Avatar.component'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@ui/Table.component'
import toast from 'react-hot-toast'

const AdminDashboard: React.FC = () => {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalStudents: 225, 
    totalManagers: 5,
    totalStaff: 0,      
    feedbackRate: 70
  })
  const [recentRequests, setRecentRequests] = useState<any[]>([])
  const [recentComplaints, setRecentComplaints] = useState<any[]>([])

  const fetchAdminData = async () => {
    try {
      setLoading(true)
      const [reqRes, compRes, staffRes] = await Promise.all([
        fetch('/api/requests/admin'),
        fetch('/api/complaints/admin'),
        fetch('/api/staff') 
      ])

      const requests = await reqRes.json()
      const complaints = await compRes.json()
      const staffList = await staffRes.json()

      const formatData = (data: any[]) => data.map(item => ({
        ...item,
        // Backend verisini güvenli bir şekilde eşle
        studentName: item.student_name || item.user?.name || item.name || 'Unknown Student',
        date: item.date || (item.createdAt ? new Date(item.createdAt).toLocaleDateString('tr-TR') : 'N/A'),
        category: item.category || 'General',
        room: item.room || 'N/A',
        priority: (item.priority || 'Medium').toUpperCase()
      })).slice(0, 5)

      setRecentRequests(formatData(requests))
      setRecentComplaints(formatData(complaints))
      
      setStats(prev => ({ ...prev, totalStaff: staffList.length }))

    } catch (error) {
      toast.error('Dashboard verileri yüklenemedi.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAdminData()
  }, [])

  const handleNavigate = (path: string) => {
    window.location.href = path
  }

  const getPriorityVariant = (p: string) => {
    if (p === 'CRITICAL' || p === 'HIGH') return 'danger'
    if (p === 'MEDIUM') return 'warning'
    return 'success'
  }

  return (
    <div className="min-h-screen bg-[#F4F9FF] p-4 lg:p-8 animate-in fade-in duration-700">
      
      {/* Search Bar */}
      <div className="bg-white rounded-[20px] p-4 mb-6 flex items-center justify-between shadow-sm border border-blue-50">
        <h2 className="text-xl font-bold px-4 text-slate-800 tracking-tight">Admin Overview</h2>
        <div className="flex items-center gap-6">
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-2.5 text-gray-300" size={16} />
            <input 
              type="text" 
              placeholder="Quick search..." 
              className="bg-[#F8FBFF] border border-gray-100 rounded-full py-2 pl-10 pr-4 text-sm w-64 focus:ring-2 focus:ring-blue-100 outline-none transition-all" 
            />
          </div>
          <div className="bg-gray-50 p-2 rounded-full cursor-pointer hover:bg-blue-50 transition-colors">
            <Bell size={20} className="text-gray-400" />
          </div>
        </div>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[
          { label: 'Total Students', val: stats.totalStudents, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Total Manager', val: stats.totalManagers, color: 'text-rose-600', bg: 'bg-rose-50' },
          { label: 'Total Staff', val: stats.totalStaff, color: 'text-amber-600', bg: 'bg-amber-50' }
        ].map((s, i) => (
          <Card key={i} className="p-6 border-none shadow-sm rounded-[24px] bg-white flex flex-col items-center text-center">
            <div className={`w-10 h-10 ${s.bg} rounded-xl flex items-center justify-center mb-3`}>
               <Users className={s.color} size={20} />
            </div>
            <p className="text-[11px] text-gray-400 uppercase font-black mb-1 tracking-widest">{s.label}</p>
            <p className={`text-3xl font-black ${s.color}`}>{s.val}</p>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          
          {/* New Maintenance Requests */}
          <Card className="border-none shadow-sm p-6 rounded-[24px] bg-white">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-slate-800">New Requests</h3>
                <p className="text-xs text-gray-400 font-medium">Recent maintenance updates</p>
              </div>
              <Button variant="ghost" size="sm" className="text-blue-600 font-bold bg-blue-50 hover:bg-blue-100 rounded-full" onClick={() => handleNavigate('/dashboard/admin/requests')}>
                See All <ArrowUpRight size={14} className="ml-1" />
              </Button>
            </div>
            <Table>
              <TableHeader>
                <TableRow className="border-none bg-gray-50/50">
                  <TableHead className="rounded-l-lg pl-4">Student</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Room</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead className="text-right rounded-r-lg pr-4">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                   <TableRow>
                     <td colSpan={6} className="text-center py-10 italic text-gray-400">
                        <Loader2 className="animate-spin mx-auto text-blue-500 mb-2" /> Loading data...
                     </td>
                   </TableRow>
                ) : recentRequests.length === 0 ? (
                  <TableRow>
                    <td colSpan={6} className="text-center py-10 text-gray-400 text-sm italic">No recent requests found.</td>
                  </TableRow>
                ) : (
                  recentRequests.map((req) => (
                    <TableRow key={req.id} className="border-b border-gray-50 last:border-none hover:bg-blue-50/30 transition-colors">
                      <TableCell className="pl-4">
                        <div className="flex items-center gap-3">
                          <Avatar src={req.img || `https://i.pravatar.cc/150?u=${req.id}`} className="w-9 h-9 border-2 border-white shadow-sm" />
                          <span className="font-bold text-gray-700 text-sm whitespace-nowrap">{req.studentName}</span>
                        </div>
                      </TableCell>
                      <TableCell><Badge variant="outline" className="text-[10px] font-bold uppercase">{req.category}</Badge></TableCell>
                      <TableCell className="text-blue-600 font-black text-xs">#{req.room}</TableCell>
                      <TableCell className="text-gray-500 text-xs font-medium">{req.date}</TableCell>
                      <TableCell>
                        <Badge variant={getPriorityVariant(req.priority) as any} className="text-[10px] px-3 font-bold">{req.priority}</Badge>
                      </TableCell>
                      <TableCell className="text-right pr-4">
                        <Button size="sm" variant="ghost" className="hover:bg-blue-100 rounded-full p-2" onClick={() => handleNavigate(`/dashboard/admin/requests`)}>
                          <ChevronRight size={18} className="text-blue-600" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </Card>

          {/* Recent Complaints */}
          <Card className="border-none shadow-sm p-6 rounded-[24px] bg-white">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-slate-800">Recent Complaints</h3>
                <p className="text-xs text-gray-400 font-medium">Urgent student reports</p>
              </div>
              <Button variant="ghost" size="sm" className="text-amber-600 font-bold bg-amber-50 hover:bg-amber-100 rounded-full" onClick={() => handleNavigate('/dashboard/admin/complaints')}>
                See All <ArrowUpRight size={14} className="ml-1" />
              </Button>
            </div>
            <Table>
              <TableHeader>
                <TableRow className="border-none bg-gray-50/50">
                  <TableHead className="rounded-l-lg pl-4">Student</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Room</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead className="text-right rounded-r-lg pr-4">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                   <TableRow>
                     <td colSpan={6} className="text-center py-10 italic text-gray-400">
                        <Loader2 className="animate-spin mx-auto text-amber-500 mb-2" /> Loading data...
                     </td>
                   </TableRow>
                ) : recentComplaints.length === 0 ? (
                  <TableRow>
                    <td colSpan={6} className="text-center py-10 text-gray-400 text-sm italic">No recent complaints found.</td>
                  </TableRow>
                ) : (
                  recentComplaints.map((comp) => (
                    <TableRow key={comp.id} className="border-b border-gray-50 last:border-none hover:bg-amber-50/30 transition-colors">
                      <TableCell className="pl-4">
                        <div className="flex items-center gap-3">
                          <Avatar src={comp.img || `https://i.pravatar.cc/150?u=c${comp.id}`} className="w-9 h-9 border-2 border-white shadow-sm" />
                          <span className="font-bold text-gray-700 text-sm whitespace-nowrap">{comp.studentName}</span>
                        </div>
                      </TableCell>
                      <TableCell><Badge variant="outline" className="text-[10px] font-bold uppercase">{comp.category}</Badge></TableCell>
                      <TableCell className="text-amber-600 font-black text-xs">#{comp.room}</TableCell>
                      <TableCell className="text-gray-500 text-xs font-medium">{comp.date}</TableCell>
                      <TableCell>
                        <Badge variant={getPriorityVariant(comp.priority) as any} className="text-[10px] px-3 font-bold">{comp.priority}</Badge>
                      </TableCell>
                      <TableCell className="text-right pr-4">
                        <Button size="sm" variant="ghost" className="hover:bg-amber-100 rounded-full p-2" onClick={() => handleNavigate(`/dashboard/admin/complaints`)}>
                          <ChevronRight size={18} className="text-amber-600" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </Card>
        </div>

        {/* Satisfaction sidebar omitted for brevity but should be kept from original */}
        <div className="space-y-8">
          <Card className="p-6 border-none shadow-sm rounded-[24px] bg-white">
            <h3 className="text-lg font-bold mb-6 text-slate-800">System Satisfaction</h3>
            <div className="flex flex-col items-center">
              <div className="relative flex items-center justify-center mb-8">
                <svg className="w-40 h-40 transform -rotate-90">
                  <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-gray-50" />
                  <circle 
                    cx="80" cy="80" r="70" 
                    stroke="currentColor" strokeWidth="12" 
                    fill="transparent" 
                    className="text-green-500" 
                    strokeDasharray={439.8} 
                    strokeDashoffset={439.8 - (439.8 * stats.feedbackRate) / 100}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-3xl font-black text-slate-800">%{stats.feedbackRate}</span>
                  <span className="text-[10px] uppercase text-gray-400 font-bold">Positive</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard;