import React from 'react'
import { Search, Bell } from 'lucide-react'
import Button from '@ui/Button.component'

interface HeaderProps {
  title?: string
}

const Header: React.FC<HeaderProps> = ({ title = 'Dashboard' }) => {
  return (
    <header className="mb-6 flex flex-col items-center justify-between gap-4 rounded-xl bg-white p-5 shadow-sm md:flex-row">
      {/* Sol taraf: Sayfa Başlığı */}
      <h2 className="w-full text-2xl font-bold text-gray-800 md:w-auto">{title}</h2>

      {/* Sağ taraf: Arama ve Bildirim */}
      <div className="flex w-full items-center gap-4 md:w-auto">
        {/* Arama Çubuğu */}
        <div className="relative flex-1 md:flex-none">
          <input
            type="text"
            placeholder="Search anything..."
            className="w-full rounded-lg border border-gray-100 bg-gray-50 py-2 pl-4 pr-10 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-100 md:w-64"
          />
          <Search className="absolute right-3 top-2.5 text-gray-400" size={18} />
        </div>

        {/* Bildirim Zili */}
        <button className="relative rounded-full border border-gray-100 bg-white p-2 transition-colors hover:bg-gray-50">
          <Bell size={20} className="text-gray-600" />
          <span className="absolute right-2 top-1 h-2 w-2 rounded-full border border-white bg-red-500"></span>
        </button>
      </div>
    </header>
  )
}

export default Header
