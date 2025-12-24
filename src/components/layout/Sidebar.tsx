import React, { useState, useEffect } from 'react'
import {
  LayoutDashboard,
  UserPlus,
  FileText,
  Settings,
  LogOut,
  MessageSquare,
  List,
  AlertTriangle,
  PlusCircle,
  FolderOpen,
  Megaphone,
  AlertOctagon,
} from 'lucide-react'
// import { useAppConfig } from '@/hooks/useAppConfig'; // Hook yolunu düzenle

// --- Types ---
type UserRole = 'admin' | 'student' | 'staff'

// Mock Hook (Eğer hook dosyan yoksa bu kısmı kullanabilirsin, varsa import et)
const useAppConfig = () => {
  const [role, setRole] = useState<UserRole>('admin')
  return {
    role,
    setUserRole: setRole,
    t: {
      sidebar: {
        dashboard: 'Dashboard',
        staff: 'Staff',
        requests: 'Requests',
        complaints: 'Complaints',
        categories: 'Categories',
        settings: 'Settings',
        feedback: 'Feedback',
        newRequest: 'New Request',
        myRequests: 'My Requests',
        logout: 'Logout',
      },
    },
  }
}

const Sidebar: React.FC = () => {
  const [currentPath, setCurrentPath] = useState('')
  const { t, role, setUserRole } = useAppConfig()

  useEffect(() => {
    setCurrentPath(window.location.pathname)
  }, [])

  const adminLinks = [
    { name: t.sidebar.dashboard, icon: LayoutDashboard, href: '/' },
    { name: t.sidebar.staff, icon: UserPlus, href: '/assign' },
    { name: t.sidebar.requests, icon: FileText, href: '/requests' },
    { name: t.sidebar.complaints, icon: AlertTriangle, href: '/complaints' },
    { name: t.sidebar.categories, icon: List, href: '/categories' },
    { name: t.sidebar.settings, icon: Settings, href: '/settings' },
    { name: t.sidebar.feedback, icon: MessageSquare, href: '/feedbacks' },
  ]

  const studentLinks = [
    { name: t.sidebar.dashboard, icon: LayoutDashboard, href: '/' },
    { name: t.sidebar.newRequest, icon: PlusCircle, href: '/new-request' },
    { name: t.sidebar.myRequests, icon: FolderOpen, href: '/my-requests' },
    { name: 'New Complaint', icon: AlertOctagon, href: '/new-complaint' },
    { name: 'My Complaints', icon: Megaphone, href: '/my-complaints' },
    { name: t.sidebar.settings, icon: Settings, href: '/settings' },
  ]

  const staffLinks = [
    { name: t.sidebar.dashboard, icon: LayoutDashboard, href: '/' },
    { name: 'My Tasks', icon: FileText, href: '/my-tasks' },
    { name: t.sidebar.settings, icon: Settings, href: '/settings' },
  ]

  let links = adminLinks
  if (role === 'student') links = studentLinks
  if (role === 'staff') links = staffLinks

  const handleSwitchRole = () => {
    if (role === 'admin') setUserRole('student')
    else if (role === 'student') setUserRole('staff')
    else setUserRole('admin')
  }

  return (
    <aside className="relative z-10 flex h-screen w-72 flex-col rounded-r-3xl bg-[#007ADD] font-sans text-white shadow-2xl transition-all">
      {/* LOGO */}
      <div className="p-8 pb-4">
        <h1 className="text-3xl font-bold tracking-wide">DormiTrack</h1>
        <span className="rounded bg-white/20 px-2 py-1 text-xs font-bold uppercase tracking-wider text-blue-100">
          {role} View
        </span>
      </div>

      {/* MENÜ */}
      <nav className="custom-scrollbar mt-4 flex-1 space-y-2 overflow-y-auto px-4">
        {links.map((link) => {
          const isActive =
            currentPath === link.href || (link.href !== '/' && currentPath.startsWith(link.href))
          return (
            <a
              key={link.name}
              href={link.href}
              className={`flex items-center gap-4 rounded-xl px-4 py-4 transition-all duration-200 ${
                isActive ? 'bg-white font-bold text-[#007ADD] shadow-lg' : 'hover:bg-white/10'
              }`}
            >
              <link.icon size={22} />
              <span className="text-base">{link.name}</span>
            </a>
          )
        })}

        {/* ROLE SWITCHER */}
        <div className="mt-8 border-t border-white/20 pt-4">
          <button
            onClick={handleSwitchRole}
            className="flex w-full items-center gap-4 rounded-xl px-4 py-3 text-left transition-colors hover:bg-white/10"
          >
            <LogOut size={22} />
            <div className="flex flex-col">
              <span className="text-sm font-bold">{t.sidebar.logout}</span>
              <span className="text-[10px] text-blue-200">Current: {role.toUpperCase()}</span>
            </div>
          </button>
        </div>
      </nav>

      {/* PROFİL KARTI */}
      <div className="mt-auto p-6">
        <div className="flex items-center gap-3 rounded-2xl border border-blue-400/30 bg-blue-600/40 p-3 backdrop-blur-sm">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-white/20 bg-gray-200">
            <img
              src={`https://i.pravatar.cc/150?u=${role}`}
              alt="user"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="overflow-hidden">
            <p className="truncate text-sm font-semibold">
              {role === 'admin'
                ? 'Mesut Sefa'
                : role === 'student'
                  ? 'Ali Veli'
                  : 'Temizlikçi Ayşe'}
            </p>
            <p className="truncate text-xs capitalize text-blue-100">{role}</p>
          </div>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
