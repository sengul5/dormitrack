import React, { useState } from 'react'
import { CheckCircle, Check, MapPin, CheckSquare } from 'lucide-react'
import { Card } from '@ui/Card.component'
import Badge from '@ui/Badge.component'
import Button from '@ui/Button.component'

// Veri tipi tanımı
interface Task {
  id: number
  type: 'Request' | 'Complaint'
  title: string
  location: string
  priority: 'High' | 'Medium' | 'Low'
  date: string
  status: 'In Progress' | 'Pending' | 'Completed'
  desc: string
}

const MyTasks: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'active' | 'completed'>('active')

  const [tasks, setTasks] = useState<Task[]>([
    {
      id: 101,
      type: 'Request',
      title: 'Wifi Connection Issue',
      location: 'Room 101',
      priority: 'High',
      date: 'Today, 10:30 AM',
      status: 'In Progress',
      desc: 'Student reports no internet connectivity.',
    },
    {
      id: 302,
      type: 'Complaint',
      title: 'Noise Disturbance',
      location: 'Room 404',
      priority: 'Medium',
      date: 'Yesterday',
      status: 'Pending',
      desc: 'Check the noise complaint reported by neighbors.',
    },
    {
      id: 105,
      type: 'Request',
      title: 'Broken Chair',
      location: 'Lobby',
      priority: 'Low',
      date: '12.10.2025',
      status: 'Completed',
      desc: 'Replace the broken leg of the sofa.',
    },
  ])

  const filteredTasks = tasks.filter((task) =>
    activeTab === 'active' ? task.status !== 'Completed' : task.status === 'Completed'
  )

  const handleComplete = (id: number) => {
    if (window.confirm('Mark this task as completed?')) {
      setTasks(tasks.map((t) => (t.id === id ? { ...t, status: 'Completed' } : t)))
    }
  }

  const getPriorityVariant = (p: Task['priority']) => {
    switch (p) {
      case 'High':
        return 'dangerSoft'
      case 'Medium':
        return 'warning'
      default:
        return 'success'
    }
  }

  return (
    <div className="flex h-full flex-col gap-6">
      <div className="flex flex-col items-end justify-between gap-4 md:flex-row">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">My Tasks</h1>
          <p className="mt-1 text-gray-500">Assignments waiting for your action.</p>
        </div>
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

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {filteredTasks.length === 0 ? (
          <Card className="col-span-full flex flex-col items-center p-16 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-50 text-gray-400">
              <CheckCircle size={32} />
            </div>
            <h3 className="text-lg font-bold text-gray-700">No tasks found</h3>
          </Card>
        ) : (
          filteredTasks.map((task) => (
            <Card key={task.id} className="flex h-full flex-col p-6 transition-all hover:shadow-md">
              <div className="mb-4 flex items-center justify-between border-b border-gray-50 pb-4">
                <Badge variant={task.type === 'Request' ? 'info' : 'dangerSoft'}>{task.type}</Badge>
                <div className="flex items-center gap-3 text-xs font-medium text-gray-400">
                  <span className="font-mono text-gray-500">#{task.id}</span>
                  <span className="h-1 w-1 rounded-full bg-gray-300"></span>
                  <span>{task.date}</span>
                </div>
              </div>

              <h3 className="mb-3 text-xl font-bold leading-tight text-gray-800">{task.title}</h3>
              <div className="mb-6 flex-1 rounded-xl border border-gray-100 bg-gray-50 p-4 text-sm font-medium text-gray-600">
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
                {task.status !== 'Completed' ? (
                  <Button size="lg" onClick={() => handleComplete(task.id)}>
                    <CheckSquare size={18} /> Mark as Done
                  </Button>
                ) : (
                  <div className="flex w-full cursor-default items-center justify-center gap-2 rounded-xl border border-green-100 bg-green-50 py-3.5 text-sm font-bold text-green-600">
                    <Check size={18} /> Task Completed
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
