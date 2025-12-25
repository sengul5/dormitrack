import React from 'react'
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

const StudentDashboard: React.FC = () => {
  const stats = { activeRequests: 2, openComplaints: 1 }

  const recentRequests = [
    { id: 101, title: 'Wifi Connection Issue', date: 'Today, 10:30 AM', status: 'In Progress' },
    { id: 105, title: 'Broken Chair', date: '12.10.2025', status: 'Completed' },
  ]

  const recentComplaints = [
    { id: 302, title: 'Noise from Room 404', date: 'Yesterday', status: 'Pending' },
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'In Progress':
        return (
          <Badge variant="info" className="w-32 justify-center">
            <Clock size={12} className="mr-1" /> In Progress
          </Badge>
        )
      case 'Completed':
        return (
          <Badge variant="success" className="w-32 justify-center">
            <CheckCircle size={12} className="mr-1" /> Completed
          </Badge>
        )
      default:
        return (
          <Badge variant="warning" className="w-32 justify-center">
            <AlertCircle size={12} className="mr-1" /> Pending
          </Badge>
        )
    }
  }

  return (
    <div className="h-full space-y-8 pb-10">
      {/* Hero */}
      <div className="relative flex flex-col items-center justify-between gap-6 overflow-hidden rounded-[30px] bg-blue-600 p-8 text-white shadow-lg shadow-blue-200 md:flex-row">
        <div className="pointer-events-none absolute right-0 top-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>
        <div className="relative z-10">
          <h2 className="mb-2 text-3xl font-bold">Welcome, Student! 👋</h2>
          <p className="text-lg text-blue-100 opacity-90">Everything looks good in Room 101.</p>
        </div>
        <div className="relative z-10 flex gap-3">
          <a
            href="/new-request"
            className="flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-bold text-blue-600 shadow-sm transition-colors hover:bg-blue-50"
          >
            <Plus size={18} /> New Request
          </a>
        </div>
      </div>

      {/* Stats */}
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
              <p className="text-4xl font-bold text-gray-800">{stats.activeRequests}</p>
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
              <p className="text-4xl font-bold text-gray-800">{stats.openComplaints}</p>
            </div>
          </div>
          <ArrowRight className="text-gray-300" />
        </Card>
      </div>

      {/* Lists */}
      <div className="grid grid-cols-1 gap-8 xl:grid-cols-2">
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
                    <h4 className="text-sm font-bold text-gray-800">{item.title}</h4>
                    <div className="mt-1 text-xs text-gray-400">{item.date}</div>
                  </div>
                </div>
                {getStatusBadge(item.status)}
              </Card>
            ))}
          </div>
        </div>
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
                    <h4 className="text-sm font-bold text-gray-800">{item.title}</h4>
                    <div className="mt-1 text-xs text-gray-400">{item.date}</div>
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
