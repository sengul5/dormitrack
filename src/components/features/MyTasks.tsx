import React, { useState, useEffect } from 'react'
import { CheckCircle, Check, MapPin, CheckSquare, RefreshCw, AlertCircle } from 'lucide-react'
import { Card } from '@ui/Card.component'
import Badge from '@ui/Badge.component'
import Button from '@ui/Button.component'

// SERVİSLER
import { requestService } from '@/services/requests'
import { complaintService } from '@/services/complaints'

// Ortak Veri Tipi
interface Task {
  id: number
  // Hangi servisten geldiğini ayırt etmek için
  type: 'Request' | 'Complaint' 
  title: string
  location: string
  priority: 'High' | 'Medium' | 'Low' | 'Critical'
  date: string
  // Backend'den gelebilecek tüm durumları kapsayalım
  status: 'In Progress' | 'Pending' | 'Completed' | 'Resolved' | 'Active' | 'Investigating' | 'Open' | 'Closed'
  desc: string
}

const MyTasks: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'active' | 'completed'>('active')
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)

  // --- VERİ ÇEKME ---
  const fetchTasks = async () => {
    setLoading(true)
    try {
      // İki servisten paralel veri çekiyoruz
      const [reqRes, compRes] = await Promise.all([
        requestService.getAll(),
        complaintService.getAll(),
      ])

      const reqData = Array.isArray(reqRes) ? reqRes : (reqRes as any)?.data || []
      const compData = Array.isArray(compRes) ? compRes : (compRes as any)?.data || []

      // 1. Talepleri Dönüştür
      const formattedRequests: Task[] = reqData.map((item: any) => ({
        id: item.id,
        type: 'Request',
        title: item.category || 'Maintenance Request',
        location: item.room || 'Unknown',
        priority: item.priority || 'Low',
        date: item.date || new Date().toLocaleDateString('tr-TR'),
        status: item.status || 'Pending',
        desc: item.desc || item.description || 'No details provided.',
      }))

      // 2. Şikayetleri Dönüştür
      const formattedComplaints: Task[] = compData.map((item: any) => ({
        id: item.id,
        type: 'Complaint',
        title: item.type || item.subject || 'Complaint Issue',
        location: item.room || 'Unknown',
        priority: item.priority || 'Low',
        date: item.date || new Date().toLocaleDateString('tr-TR'),
        status: item.status || 'Pending',
        desc: item.description || item.desc || 'No details provided.',
      }))

      // Hepsini birleştir ve tarihe göre sırala
      const allTasks = [...formattedRequests, ...formattedComplaints]
      setTasks(allTasks.reverse()) // En yeni en üstte
    } catch (error) {
      console.error('Görevler yüklenemedi:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTasks()
  }, [])

  // --- FİLTRELEME MANTIĞI ---
  const isCompleted = (status: string) => 
    ['Completed', 'Resolved', 'Closed'].includes(status)

  const filteredTasks = tasks.filter((task) =>
    activeTab === 'active' ? !isCompleted(task.status) : isCompleted(task.status)
  )

  // --- GÖREV TAMAMLAMA ---
  const handleComplete = async (task: Task) => {
    if (!window.confirm('Mark this task as completed?')) return

    try {
      // Backend'e güncelleme isteği (Servislerde update metodu açıldığında burası çalışacak)
      /*
      if (task.type === 'Request') {
        await requestService.update(task.id, { status: 'Completed' })
      } else {
        await complaintService.update(task.id, { status: 'Resolved' })
      }
      */
      
      console.log(`Task #${task.id} (${task.type}) completed.`)

      // Optimistic UI (Arayüzü hemen güncelle)
      setTasks((prev) =>
        prev.map((t) =>
          t.id === task.id 
            ? { ...t, status: t.type === 'Request' ? 'Completed' : 'Resolved' } 
            : t
        )
      )
    } catch (error) {
      console.error('Güncelleme hatası:', error)
      alert('İşlem başarısız oldu.')
    }
  }

  const getPriorityVariant = (p: Task['priority']) => {
    switch (p) {
      case 'Critical': return 'danger'
      case 'High': return 'dangerSoft'
      case 'Medium': return 'warning'
      default: return 'success'
    }
  }

  return (
    <div className="flex h-full flex-col gap-6">
      {/* HEADER */}
      <div className="flex flex-col items-end justify-between gap-4 md:flex-row">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">My Tasks</h1>
          <p className="mt-1 text-gray-500">
             {loading ? 'Loading assignments...' : `You have ${filteredTasks.length} ${activeTab} tasks.`}
          </p>
        </div>
        <div className="flex items-center gap-3">
             <Button variant="ghost" size="icon" onClick={fetchTasks} title="Refresh">
                 <RefreshCw size={20} className={loading ? 'animate-spin text-blue-600' : 'text-gray-400'} />
             </Button>
            <div className="flex rounded-xl border border-gray-100 bg-white p-1 shadow-sm">
            <button
                onClick={() => setActiveTab('active')}
                className={`rounded-lg px-6 py-2 text-sm font-bold transition-all ${activeTab === 'active' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}
            >
                Active
            </button>
            <button
                onClick={() => setActiveTab('completed')}
                className={`rounded-lg px-6 py-2 text-sm font-bold transition-all ${activeTab === 'completed' ? 'bg-green-600 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}
            >
                Completed
            </button>
            </div>
        </div>
      </div>

      {/* GRID LIST */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {loading && tasks.length === 0 ? (
           <div className="col-span-full flex h-64 items-center justify-center text-gray-400">
             Loading tasks...
           </div>
        ) : filteredTasks.length === 0 ? (
          <Card className="col-span-full flex flex-col items-center p-16 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-50 text-gray-400">
              {activeTab === 'active' ? <CheckCircle size={32} /> : <AlertCircle size={32}/>}
            </div>
            <h3 className="text-lg font-bold text-gray-700">
                {activeTab === 'active' ? 'No pending tasks!' : 'No completed tasks yet.'}
            </h3>
            {activeTab === 'active' && <p className="text-gray-400">Good job, you are all caught up.</p>}
          </Card>
        ) : (
          filteredTasks.map((task) => (
            <Card key={`${task.type}-${task.id}`} className="flex h-full flex-col p-6 transition-all hover:shadow-md">
              <div className="mb-4 flex items-center justify-between border-b border-gray-50 pb-4">
                <Badge variant={task.type === 'Request' ? 'info' : 'dangerSoft'}>{task.type}</Badge>
                <div className="flex items-center gap-3 text-xs font-medium text-gray-400">
                  <span className="font-mono text-gray-500">#{task.id}</span>
                  <span className="h-1 w-1 rounded-full bg-gray-300"></span>
                  <span>{task.date}</span>
                </div>
              </div>

              <h3 className="mb-3 text-xl font-bold leading-tight text-gray-800 line-clamp-2" title={task.title}>{task.title}</h3>
              <div className="mb-6 flex-1 rounded-xl border border-gray-100 bg-gray-50 p-4 text-sm font-medium text-gray-600 line-clamp-3">
                {task.desc}
              </div>

              <div className="mb-2 grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wide text-gray-400">
                    Location
                  </span>
                  <div className="flex items-center gap-2 text-sm font-bold text-gray-700">
                    <MapPin size={16} className="text-gray-400" /> {task.location}
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wide text-gray-400">
                    Priority
                  </span>
                  <div className="w-fit">
                    <Badge variant={getPriorityVariant(task.priority)}>{task.priority}</Badge>
                  </div>
                </div>
              </div>

              <div className="mt-auto border-t border-gray-50 pt-6">
                {!isCompleted(task.status) ? (
                  <Button size="lg" onClick={() => handleComplete(task)}>
                    <CheckSquare size={18} /> Mark as Done
                  </Button>
                ) : (
                  <div className="flex w-full cursor-default items-center justify-center gap-2 rounded-xl border border-green-100 bg-green-50 py-3.5 text-sm font-bold text-green-600">
                    <Check size={18} /> Completed
                  </div>
                )}
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}

export default MyTasks