import React, { useState, useEffect, useMemo } from 'react'
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
import { authClient } from '@/lib/auth-client' // Auth Client importu

// --- PATH KONTROL FONKSİYONU (Aynı kalıyor) ---
const isLinkActive = (currentPath: string, linkHref: string, isExact = false) => {
  if (!currentPath || !linkHref) return false
  const cleanPath = currentPath.replace(/\/$/, '')
  const cleanHref = linkHref.replace(/\/$/, '')

  if (isExact) return cleanPath === cleanHref
  if (cleanPath === cleanHref) return true
  if (cleanPath.startsWith(`${cleanHref}/`)) return true

  return false
}

const Sidebar = () => {
  const [currentPath, setCurrentPath] = useState('')

  // Better-Auth Session Hook
  // Not: Veritabanında roller 'admin', 'student', 'staff' olarak tanımlı olmalı.
  const { data: session } = authClient.useSession()

  // Session yüklenmediyse veya role yoksa varsayılan olarak 'student' alalım (Hata almamak için)
  const role = session?.user?.role || 'student'

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentPath(window.location.pathname)
    }
  }, [])

  // --- LOGOUT İŞLEMİ ---
  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          window.location.href = '/login' // Çıkış sonrası yönlendirme
        },
      },
    })
  }

  // --- MENÜ YAPILANDIRMASI ---
  const menuItems = useMemo(() => {
    return {
      admin: [
        { name: 'Dashboard', icon: LayoutDashboard, href: '/dashboard/admin', exact: true },
        { name: 'Staff', icon: UserPlus, href: '/dashboard/admin/assign' },
        { name: 'Requests', icon: FileText, href: '/dashboard/admin/requests' },
        { name: 'Complaints', icon: AlertTriangle, href: '/dashboard/admin/complaints' },
        { name: 'Categories', icon: List, href: '/dashboard/admin/categories' },
        { name: 'Settings', icon: Settings, href: '/dashboard/admin/settings' },
        { name: 'Feedback', icon: MessageSquare, href: '/dashboard/admin/feedbacks' },
      ],
      student: [
        { name: 'Dashboard', icon: LayoutDashboard, href: '/dashboard', exact: true },
        { name: 'New Request', icon: PlusCircle, href: '/dashboard/new-request' },
        { name: 'My Requests', icon: FolderOpen, href: '/dashboard/my-requests' },
        { name: 'New Complaint', icon: AlertOctagon, href: '/dashboard/new-complaint' },
        { name: 'My Complaints', icon: Megaphone, href: '/dashboard/my-complaints' },
        { name: 'Settings', icon: Settings, href: '/dashboard/settings' },
      ],
      staff: [
        { name: 'Dashboard', icon: LayoutDashboard, href: '/dashboard/staff', exact: true },
        { name: 'My Tasks', icon: FileText, href: '/dashboard/staff/my-tasks' },
        { name: 'Settings', icon: Settings, href: '/dashboard/staff/settings' },
      ],
    }
  }, []) // Dependency array boş olabilir çünkü statik tanımlar

  // Rol veritabanında tanımlı değilse boş dizi döndür (güvenlik)
  const currentLinks = menuItems[role as keyof typeof menuItems] || menuItems['student']

  return (
    <aside className="relative z-10 flex h-screen w-72 flex-col rounded-r-3xl bg-[#007ADD] font-sans text-white shadow-2xl transition-all">
      {/* HEADER */}
      <div className="p-8 pb-4">
        <h1 className="text-3xl font-bold tracking-wide">DormiTrack</h1>
        <span className="inline-block rounded bg-white/20 px-2 py-1 text-xs font-bold uppercase tracking-wider text-blue-100">
          {role} View
        </span>
      </div>

      {/* MENÜ */}
      <nav className="custom-scrollbar mt-4 flex-1 space-y-2 overflow-y-auto px-4">
        {currentLinks.map((link) => {
          const isActive = isLinkActive(currentPath, link.href, link.exact)

          return (
            <a
              key={link.href}
              href={link.href}
              className={`flex items-center gap-4 rounded-xl px-4 py-4 transition-all duration-200 ${
                isActive
                  ? 'bg-white font-bold text-[#007ADD] shadow-lg'
                  : 'text-white/90 hover:bg-white/10 hover:text-white'
              }`}
            >
              <link.icon size={22} className={isActive ? 'text-[#007ADD]' : ''} />
              <span className="text-base">{link.name}</span>
            </a>
          )
        })}

        {/* LOGOUT */}
        <div className="mt-8 border-t border-white/20 pt-4">
          <button
            onClick={handleLogout}
            className="group flex w-full items-center gap-4 rounded-xl px-4 py-3 text-left transition-colors hover:bg-white/10"
          >
            <LogOut size={22} className="transition-transform group-hover:-translate-x-1" />
            <div className="flex flex-col">
              <span className="text-sm font-bold">Logout</span>
              <span className="text-[10px] uppercase text-blue-200">{role}</span>
            </div>
          </button>
        </div>
      </nav>

      {/* FOOTER / PROFILE */}
      <div className="mt-auto p-6">
        <div className="flex items-center gap-3 rounded-2xl border border-blue-400/30 bg-blue-600/40 p-3 backdrop-blur-sm transition-colors hover:bg-blue-600/60">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-white/20 bg-gray-200">
            <img
              // Better-auth'tan gelen resim yoksa varsayılan avatar
              src={session?.user?.image || `https://i.pravatar.cc/150?u=${session?.user?.id}`}
              alt="user avatar"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="overflow-hidden">
            <p className="truncate text-sm font-semibold">{session?.user?.name || 'User'}</p>
            <p className="truncate text-xs text-blue-100 opacity-80">{session?.user?.email}</p>
          </div>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
