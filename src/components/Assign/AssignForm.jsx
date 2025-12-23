import React from 'react';
import { CheckSquare, ChevronDown, UserCheck } from 'lucide-react';

const AssignForm = () => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      
      {/* Mavi Başlık Şeridi */}
      <div className="bg-blue-600 p-4 flex items-center justify-between">
        <h3 className="text-white font-bold flex items-center gap-2">
            <UserCheck size={20} /> Assign Task
        </h3>
        <span className="text-blue-200 text-xs">New Assignment</span>
      </div>

      <div className="p-6 space-y-5">
        
        {/* Üst Kısım: Formlar Yan Yana */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Sol: İş Seçimi */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase ml-1">Request Issue</label>
            <div className="relative">
                <select className="w-full appearance-none bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-xl px-4 py-3 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-medium cursor-pointer">
                    <option>Select Request...</option>
                    <option>Wifi Issue (Room 101)</option>
                    <option>Plumbing (Room 204)</option>
                </select>
                <ChevronDown className="absolute right-3 top-3.5 text-gray-400 pointer-events-none" size={16} />
            </div>
          </div>

          {/* Sağ: Personel Seçimi */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase ml-1">Staff Member</label>
            <div className="relative">
                <select className="w-full appearance-none bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-xl px-4 py-3 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-medium cursor-pointer">
                    <option>Choose Staff...</option>
                    <option>Beyza Beyaz (IT)</option>
                    <option>Carl Max (Cleaner)</option>
                </select>
                <ChevronDown className="absolute right-3 top-3.5 text-gray-400 pointer-events-none" size={16} />
            </div>
          </div>
        </div>

        {/* Alt Kısım: Büyük Onay Butonu */}
        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold text-sm shadow-md shadow-blue-200 transition-all flex justify-center items-center gap-2 mt-2">
            Confirm Assignment
        </button>

      </div>
    </div>
  );
};

export default AssignForm;