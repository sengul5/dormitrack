import React, { useEffect, useState } from 'react'
import { 
  Users, MessageSquare, ClipboardCheck, TrendingUp, 
  Search, Bell, MoreVertical, UserCog, ChevronRight,
  ArrowUpRight 
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

      setRecentRequests(requests.slice(0, 4))
      setRecentComplaints(complaints.slice(0, 4))
      
      setStats(prev => ({
        ...prev,
        totalStaff: staffList.length
      }))
      

    } catch (error) {
      toast.error('Dashboard data could not be loaded from backend.')
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

  return (
    <div className="min-h-screen bg-[#F4F9FF] p-4 lg:p-8 animate-in fade-in duration-700">
      
      {/* Search Bar */}
      <div className="bg-white rounded-[20px] p-4 mb-6 flex items-center justify-between shadow-sm">
        <h2 className="text-xl font-bold px-4 text-slate-800">Dashboard</h2>
        <div className="flex items-center gap-6">
          <div className="relative">
            <Search className="absolute left-3 top-2 text-gray-300" size={18} />
            <input 
              type="text" 
              placeholder="Search anything.." 
              className="bg-[#F8FBFF] border-none rounded-full py-1.5 pl-10 pr-4 text-sm w-64 focus:ring-2 focus:ring-blue-100" 
            />
          </div>
          <Bell size={20} className="text-gray-400 cursor-pointer hover:text-blue-500 transition-colors" />
        </div>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 text-center">
        {[
          { label: 'Total Students', val: stats.totalStudents, color: 'text-blue-600' },
          { label: 'Total Manager', val: stats.totalManagers, color: 'text-red-600' },
          { label: 'Total Staff', val: stats.totalStaff, color: 'text-amber-600' }
        ].map((s, i) => (
          <Card key={i} className="p-6 border-none shadow-sm rounded-[24px] bg-white">
            <p className="text-[11px] text-gray-400 uppercase font-extrabold mb-1 tracking-widest">{s.label}</p>
            <p className={`text-3xl font-black ${s.color}`}>{s.val}</p>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Recent Requests */}
          <Card className="border-none shadow-sm p-6 rounded-[24px] bg-white">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-slate-800">New Requests <span className="text-gray-300 font-normal">({recentRequests.length})</span></h3>
              <Button variant="ghost" size="sm" className="text-blue-600 font-bold" onClick={() => handleNavigate('/dashboard/admin/requests')}>
                See All <ArrowUpRight size={14} className="ml-1" />
              </Button>
            </div>
            <Table>
              <TableHeader>
                <TableRow className="border-none text-gray-400 text-[11px] uppercase">
                  <TableHead>Photo</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Room</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentRequests.map((req) => (
                  <TableRow key={req.id} className="border-b border-gray-50 last:border-none hover:bg-slate-50/50">
                    <TableCell><Avatar src={req.img || `https://i.pravatar.cc/150?u=${req.id}`} className="w-8 h-8" /></TableCell>
                    <TableCell className="font-bold text-gray-700 text-sm">{req.name}</TableCell>
                    <TableCell className="text-gray-600 font-bold text-xs">{req.room}</TableCell>
                    <TableCell>
                      <Badge variant={req.priority === 'High' ? 'danger' : 'warning' as any} className="text-[10px] px-3">{req.priority}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button size="sm" variant="ghost" onClick={() => handleNavigate(`/dashboard/admin/requests`)}>
                        <ChevronRight size={16} />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>

          {/* Recent Complaints */}
          <Card className="border-none shadow-sm p-6 rounded-[24px] bg-white">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-slate-800 text-amber-600">Recent Complaints <span className="text-gray-300 font-normal">({recentComplaints.length})</span></h3>
              <Button variant="ghost" size="sm" className="text-amber-600 font-bold" onClick={() => handleNavigate('/dashboard/admin/complaints')}>
                See All <ArrowUpRight size={14} className="ml-1" />
              </Button>
            </div>
            <Table>
              <TableHeader>
                <TableRow className="border-none text-gray-400 text-[11px] uppercase">
                  <TableHead>Photo</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Room</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentComplaints.map((comp) => (
                  <TableRow key={comp.id} className="border-b border-gray-50 last:border-none hover:bg-slate-50/50">
                    <TableCell><Avatar src={comp.img || `https://i.pravatar.cc/150?u=c${comp.id}`} className="w-8 h-8" /></TableCell>
                    <TableCell className="font-bold text-gray-700 text-sm">{comp.name}</TableCell>
                    <TableCell className="text-gray-600 font-bold text-xs">{comp.room}</TableCell>
                    <TableCell>
                      <Badge variant={comp.priority === 'Critical' ? 'danger' : 'warning' as any} className="text-[10px] px-3">{comp.priority}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button size="sm" variant="ghost" onClick={() => handleNavigate(`/dashboard/admin/complaints`)}>
                        <ChevronRight size={16} />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </div>

        <div className="space-y-8">
          {/* Feedback & Rate Section */}
          <Card className="p-6 border-none shadow-sm rounded-[24px] bg-white">
            <h3 className="text-lg font-bold mb-6 text-slate-800">Feedback & Rate</h3>
            <div className="flex flex-col items-center">
              <div className="relative flex items-center justify-center mb-8">
                <svg className="w-36 h-36 transform -rotate-90">
                  <circle cx="72" cy="72" r="66" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-gray-100" />
                  <circle 
                    cx="72" cy="72" r="66" 
                    stroke="currentColor" strokeWidth="12" 
                    fill="transparent" 
                    className="text-green-500" 
                    strokeDasharray={414.6} 
                    strokeDashoffset={414.6 - (414.6 * stats.feedbackRate) / 100} 
                  />
                </svg>
                <span className="absolute text-3xl font-extrabold text-slate-800">%{stats.feedbackRate}</span>
              </div>
              <div className="w-full space-y-4">
                {[
                  { label: 'Positive Feedbacks', rate: 70, color: 'bg-green-500' },
                  { label: 'Negative Feedbacks', rate: 20, color: 'bg-red-500' },
                  { label: 'Neutral Feedbacks', rate: 10, color: 'bg-gray-300' }
                ].map((f, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-[11px] mb-1.5 font-bold">
                      <span className="text-gray-400">{f.label}</span>
                      <span className="text-slate-700">{f.rate}%</span>
                    </div>
                    <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                      <div className={`${f.color} h-2 rounded-full transition-all duration-1000`} style={{ width: `${f.rate}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard;