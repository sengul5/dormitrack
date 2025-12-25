import React, { useState, useEffect } from 'react'
import {
  ClipboardList,
  CheckCircle,
  Clock,
  ShieldAlert,
  MapPin,
  ArrowRight,
} from 'lucide-react'
import { Card } from '@ui/Card.component'
import Badge from '@ui/Badge.component'

// SERVİSLER
import { requestService } from '@/services/requests'
import { complaintService } from '@/services/complaints'

const StaffDashboard: React.FC = () => {
  const [tasks, setTasks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [reqRes, compRes] = await Promise.all([
          requestService.getAll(),
          complaintService.getAll(),
        ])

        // Veri Güvenliği: Array mi kontrol et, değilse data içinden al
        const reqData = Array.isArray(reqRes) ? reqRes : (reqRes as any)?.data || []
        const compData = Array.isArray(compRes) ? compRes : (compRes as any)?.data || []

        // Formatlama ve Birleştirme
        const allTasks = [
          ...reqData.map((r: any) => ({
            ...r,
            id: r.id,
            type: 'Request',
            title: r.category || 'Maintenance Request',
            room: r.room || 'Unknown',
            priority: r.priority || 'Low',
            status: r.status || 'Pending',
          })),
          ...compData.map((c: any) => ({
            ...c,
            id: c.id,
            type: 'Complaint',
            // TypeScript hatasını önlemek için burada manuel atama yapıyoruz
            title: c.subject || c.type || 'Complaint',
            room: c.room || 'Unknown',
            priority: c.priority || 'Low',
            status: c.status || 'Pending',
          })),
        ]

        // En yeni en üstte olacak şekilde sırala
        setTasks(allTasks.reverse())
      } catch (error) {
        console.error('Personel verisi alınamadı', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  // İstatistikler
  const pendingTasks = tasks.filter((t) => t.status !== 'Completed' && t.status !== 'Resolved')
  const urgentTasks = pendingTasks.filter((t) => t.priority === 'High' || t.priority === 'Critical')
  
  // High ve Critical olmayanlar Upcoming listesine
  const upcomingTasks = pendingTasks.filter(
    (t) => t.priority !== 'High' && t.priority !== 'Critical'
  )

  const completedCount = tasks.filter((t) => t.status === 'Completed' || t.status === 'Resolved').length

  if (loading) return <div className="p-10 text-center text-gray-400">Loading Tasks...</div>

  return (
    <div className="h-full space-y-8 pb-10">
      {/* HERO SECTION */}
      <div className="relative flex flex-col items-center justify-between gap-6 overflow-hidden rounded-[30px] bg-blue-600 p-8 text-white shadow-lg md:flex-row">
        <div className="relative z-10">
          <h2 className="mb-2 text-3xl font-bold">Hello, Staff! 👋</h2>
          <p className="text-lg text-blue-100 opacity-90">
            You have <span className="font-bold underline decoration-orange-400 decoration-2 underline-offset-4">{pendingTasks.length} tasks</span>{' '}
            pending today.
          </p>
        </div>
        <div className="relative z-10">
           {/* My Tasks sayfasına yönlendirme */}
           <a href="/my-tasks" className="flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-bold text-blue-600 shadow-sm hover:bg-blue-50">
             <ClipboardList size={18}/> Manage Tasks
           </a>
        </div>
      </div>

      {/* QUICK STATS */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
         {/* Urgent */}
         <div className="flex items-center gap-5 rounded-[24px] border border-gray-100 bg-white p-6 shadow-sm">
             <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-600 border border-red-100">
                 <ShieldAlert size={32} />
             </div>
             <div>
                 <h3 className="mb-1 text-xs font-bold uppercase tracking-wider text-gray-400">Urgent Issues</h3>
                 <p className="text-4xl font-bold text-gray-800">{urgentTasks.length}</p>
             </div>
         </div>
         {/* Pending */}
         <div className="flex items-center gap-5 rounded-[24px] border border-gray-100 bg-white p-6 shadow-sm">
             <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 border border-blue-100">
                 <Clock size={32} />
             </div>
             <div>
                 <h3 className="mb-1 text-xs font-bold uppercase tracking-wider text-gray-400">Pending</h3>
                 <p className="text-4xl font-bold text-gray-800">{pendingTasks.length}</p>
             </div>
         </div>
         {/* Done */}
         <div className="flex items-center gap-5 rounded-[24px] border border-gray-100 bg-white p-6 shadow-sm">
             <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-green-50 text-green-600 border border-green-100">
                 <CheckCircle size={32} />
             </div>
             <div>
                 <h3 className="mb-1 text-xs font-bold uppercase tracking-wider text-gray-400">Total Done</h3>
                 <p className="text-4xl font-bold text-gray-800">{completedCount}</p>
             </div>
         </div>
      </div>

      <div className="grid grid-cols-1 gap-8 xl:grid-cols-2">
        {/* ACİL İŞLER (SOL) */}
        <div>
          <h3 className="mb-4 text-lg font-bold text-gray-800 flex items-center gap-2">
            <div className="w-2 h-6 bg-red-500 rounded-full"></div> Requires Attention
          </h3>
          <div className="space-y-3">
            {urgentTasks.map((task) => (
              <div
                key={`${task.type}-${task.id}`}
                className="flex items-center justify-between rounded-2xl border border-red-100 bg-red-50/50 p-5 transition-colors hover:bg-red-50"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                      <Badge variant="dangerSoft">{task.priority} Priority</Badge>
                      <span className="text-xs font-mono text-red-400">#{task.id}</span>
                  </div>
                  <h4 className="text-lg font-bold text-gray-800">{task.title}</h4>
                  <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                    <MapPin size={14} /> {task.room}
                    <span className="text-xs bg-white px-2 py-0.5 rounded border border-red-100 ml-2">{task.type}</span>
                  </div>
                </div>
                <a href="/my-tasks" className="w-10 h-10 flex items-center justify-center bg-white rounded-xl text-red-500 shadow-sm border border-red-100">
                    <ArrowRight size={20}/>
                </a>
              </div>
            ))}
            {urgentTasks.length === 0 && <p className="text-gray-400 text-sm">No urgent tasks right now.</p>}
          </div>
        </div>

        {/* SIRADAKİ İŞLER (SAĞ) */}
        <div>
          <h3 className="mb-4 text-lg font-bold text-gray-800 flex items-center gap-2">
             <div className="w-2 h-6 bg-blue-500 rounded-full"></div> Upcoming Tasks
          </h3>
          <div className="space-y-3">
            {upcomingTasks.slice(0, 5).map((task) => (
              <Card key={`${task.type}-${task.id}`} className="flex items-center justify-between p-4 hover:border-blue-200">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-100 flex flex-col items-center justify-center text-xs font-bold text-gray-500">
                        <span className="text-[9px] font-normal text-gray-400">ID</span>
                        {task.id}
                    </div>
                    <div>
                        <h4 className="font-bold text-gray-800">{task.title}</h4>
                        <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                            <span className="bg-gray-100 px-1.5 py-0.5 rounded flex items-center gap-1"><MapPin size={10}/> {task.room}</span>
                            <span>• {task.type}</span>
                        </div>
                    </div>
                </div>
                <Badge variant={task.status === 'In Progress' ? 'info' : 'warning'}>{task.status}</Badge>
              </Card>
            ))}
            {upcomingTasks.length === 0 && <p className="text-gray-400 text-sm">No pending tasks.</p>}
          </div>
        </div>
      </div>
    </div>
  )
}

export default StaffDashboard