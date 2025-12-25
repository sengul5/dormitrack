import React, { useEffect, useState } from 'react'
import { ClipboardList, CheckCircle, Clock, ShieldAlert, MapPin, ArrowRight } from 'lucide-react'
import { Card } from '@ui/Card.component'
import Badge from '@ui/Badge.component'
import toast from 'react-hot-toast'

// API'den gelen veri tipi (MyTasks.tsx ile uyumlu)
interface Task {
  id: number
  type: string // 'Request' | 'Complaint'
  title: string
  location: string // API 'location' dönüyor, UI'da 'room' olarak kullanacağız
  priority: 'Critical' | 'High' | 'Medium' | 'Low'
  date: string
  status: string
  desc: string
}

const StaffDashboard: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)

  // İstatistikleri state'de tutuyoruz
  const [stats, setStats] = useState({ pending: 0, completed: 0, urgent: 0 })

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        // Personelin üzerindeki görevleri çek
        const res = await fetch('/api/staff/tasks')
        if (!res.ok) throw new Error('Veri çekilemedi')

        const data: Task[] = await res.json()
        setTasks(data)

        // İstatistikleri hesapla
        const pendingCount = data.filter(
          (t) => t.status !== 'Completed' && t.status !== 'Resolved'
        ).length
        const completedCount = data.filter(
          (t) => t.status === 'Completed' || t.status === 'Resolved'
        ).length
        const urgentCount = data.filter(
          (t) => (t.priority === 'High' || t.priority === 'Critical') && t.status !== 'Completed'
        ).length

        setStats({
          pending: pendingCount,
          completed: completedCount,
          urgent: urgentCount,
        })
      } catch (error) {
        toast.error('Could not load dashboard data')
      } finally {
        setLoading(false)
      }
    }

    fetchTasks()
  }, [])

  // Görevleri filtrele
  const urgentTasks = tasks.filter(
    (t) => (t.priority === 'High' || t.priority === 'Critical') && t.status !== 'Completed'
  )

  // Acil olmayan ve tamamlanmamış diğer işler (Upcoming)
  const upcomingTasks = tasks.filter(
    (t) => t.priority !== 'High' && t.priority !== 'Critical' && t.status !== 'Completed'
  )

  if (loading) {
    return <div className="p-10 text-center text-gray-400">Loading your schedule...</div>
  }

  return (
    <div className="h-full space-y-8 pb-10">
      {/* Hero Section */}
      <div className="relative flex flex-col items-center justify-between gap-6 overflow-hidden rounded-[30px] bg-blue-600 p-8 text-white shadow-lg shadow-blue-200 md:flex-row">
        <div className="pointer-events-none absolute right-0 top-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>
        <div className="relative z-10">
          <h2 className="mb-2 text-3xl font-bold">Hello, Staff! 👋</h2>
          <p className="text-lg text-blue-100 opacity-90">
            You have{' '}
            <span className="font-bold text-white underline decoration-orange-400 decoration-2 underline-offset-4">
              {stats.pending} tasks
            </span>{' '}
            pending.
          </p>
        </div>
        <div className="relative z-10">
          <a
            href="/dashboard/staff/my-tasks"
            className="flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-bold text-blue-600 shadow-sm transition-colors hover:bg-blue-50"
          >
            <ClipboardList size={18} /> Go to My Tasks
          </a>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <StatsWidget icon={ShieldAlert} title="Urgent Issues" value={stats.urgent} color="red" />
        <StatsWidget icon={Clock} title="Pending Tasks" value={stats.pending} color="blue" />
        <StatsWidget
          icon={CheckCircle}
          title="Completed Total"
          value={stats.completed}
          color="green"
        />
      </div>

      {/* Lists */}
      <div className="grid grid-cols-1 gap-8 xl:grid-cols-2">
        {/* ACİL İŞLER */}
        <div>
          <SectionHeader title="Requires Attention" color="bg-red-500" />
          <div className="space-y-3">
            {urgentTasks.length === 0 ? (
              <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 p-4 text-sm text-gray-400">
                No urgent tasks right now.
              </div>
            ) : (
              urgentTasks.map((task) => (
                <div
                  key={task.id}
                  className="group flex items-center justify-between rounded-2xl border border-red-100 bg-red-50/50 p-5 transition-colors hover:bg-red-50"
                >
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="dangerSoft">High Priority</Badge>
                      <span className="font-mono text-xs text-red-400">#{task.id}</span>
                    </div>
                    <h4 className="text-lg font-bold text-gray-800">{task.title}</h4>
                    <div className="mt-1 flex items-center gap-3 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <MapPin size={14} /> {task.location}
                      </span>
                      <span className="h-1 w-1 rounded-full bg-gray-300"></span>
                      <span className="flex items-center gap-1">
                        <Clock size={14} /> {task.date.split(' ')[0]}
                      </span>
                    </div>
                  </div>
                  <a
                    href="/dashboard/staff/my-tasks"
                    className="flex h-12 w-12 items-center justify-center rounded-xl border border-red-100 bg-white text-red-600 shadow-sm transition-transform hover:scale-105"
                  >
                    <ArrowRight size={24} />
                  </a>
                </div>
              ))
            )}
          </div>
        </div>

        {/* SIRADAKİ İŞLER */}
        <div>
          <SectionHeader title="Upcoming Tasks" color="bg-blue-500" />
          <div className="space-y-3">
            {upcomingTasks.length === 0 ? (
              <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 p-4 text-sm text-gray-400">
                No other pending tasks.
              </div>
            ) : (
              upcomingTasks.map((task) => (
                <Card
                  key={task.id}
                  className="flex items-center justify-between p-4 hover:border-blue-200"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 flex-col items-center justify-center rounded-xl border border-gray-100 bg-gray-50 text-xs font-bold text-gray-500">
                      <span className="text-[10px] font-normal text-gray-400">ID</span>
                      {task.id}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800">{task.title}</h4>
                      <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
                        <span className="flex items-center gap-1 rounded bg-gray-100 px-1.5 py-0.5 font-medium text-gray-600">
                          <MapPin size={10} /> {task.location}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1.5">
                    <Badge
                      variant={task.priority === 'Medium' ? 'warning' : 'success'}
                      className="w-28 justify-center text-center"
                    >
                      {task.priority}
                    </Badge>
                    <Badge variant="outline" className="w-28 justify-center bg-gray-50 text-center">
                      {task.status}
                    </Badge>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// Alt Bileşenler
const StatsWidget = ({ icon: Icon, title, value, color }: any) => {
  const colors: any = {
    red: 'bg-red-50 text-red-600 border-red-100',
    blue: 'bg-blue-50 text-blue-600 border-blue-100',
    green: 'bg-green-50 text-green-600 border-green-100',
  }
  return (
    <div className="flex items-center gap-5 rounded-[24px] border border-gray-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
      <div
        className={`flex h-16 w-16 items-center justify-center rounded-2xl border ${colors[color]}`}
      >
        <Icon size={32} />
      </div>
      <div>
        <h3 className="mb-1 text-xs font-bold uppercase tracking-wider text-gray-400">{title}</h3>
        <p className="text-4xl font-bold text-gray-800">{value}</p>
      </div>
    </div>
  )
}

const SectionHeader = ({ title, color }: { title: string; color: string }) => (
  <div className="mb-4 flex items-center gap-2 px-1">
    <div className={`h-6 w-2 rounded-full ${color}`}></div>
    <h3 className="text-lg font-bold text-gray-800">{title}</h3>
  </div>
)

export default StaffDashboard
