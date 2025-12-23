import React from 'react';
import { Search, Bell } from 'lucide-react';

const Header = ({ title = "Dashboard" }) => {
  return (
    <header className="flex justify-between items-center bg-white p-5 rounded-xl shadow-sm mb-6">
      {/* Sol taraf: Sayfa Başlığı */}
      <h2 className="text-2xl font-bold text-gray-800">{title}</h2>

      {/* Sağ taraf: Arama ve Bildirim */}
      <div className="flex items-center gap-4">
        
        {/* Arama Çubuğu */}
        <div className="relative">
          <input 
            type="text" 
            placeholder="Search anything..." 
            className="bg-gray-50 border border-gray-100 pl-4 pr-10 py-2 rounded-lg text-sm w-64 focus:outline-none focus:ring-2 focus:ring-blue-100"
          />
          <Search className="absolute right-3 top-2.5 text-gray-400" size={18} />
        </div>

        {/* Bildirim Zili */}
        <button className="relative p-2 bg-white hover:bg-gray-50 rounded-full border border-gray-100">
            <Bell size={20} className="text-gray-600" />
            <span className="absolute top-1 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
        </button>

      </div>
    </header>
  );
};

export default Header;