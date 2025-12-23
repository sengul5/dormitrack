import React, { useState } from 'react';
import { 
  Search, Archive, CheckCircle, Eye, X, MapPin, 
  AlertCircle, Calendar, ArrowUpDown, ArrowUp, ArrowDown, User
} from 'lucide-react';
import AssignStaffModal from './AssignStaffModal';

const RequestTable = () => {
  const [viewHistory, setViewHistory] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  
  // SIRALAMA
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });
  
  // MODAL
  const [showAssignModal, setShowAssignModal] = useState(false);

  // DATA
  const [activeData, setActiveData] = useState([
    { 
      id: 1, name: 'James Carter', img: 'https://i.pravatar.cc/150?u=10', 
      category: 'Wifi / Internet', room: '101', priority: 'High',
      date: '15.10.2025', status: 'Active', 
      desc: 'İnternet bağlantısı sürekli kopuyor, online derse giremiyorum.' 
    },
    { 
      id: 2, name: 'Sofia Martinez', img: 'https://i.pravatar.cc/150?u=11', 
      category: 'Room Maintenance', room: '204', priority: 'Medium',
      date: '14.10.2025', status: 'Active', 
      desc: 'Dolap kapağı menteşesinden çıktı, kapanmıyor.' 
    },
    { 
      id: 3, name: 'Daniel Lee', img: 'https://i.pravatar.cc/150?u=12', 
      category: 'Plumbing', room: '305', priority: 'High',
      date: '17.10.2025', status: 'Active', 
      desc: 'Lavabo altından su damlatıyor, halı ıslandı.' 
    },
    { 
      id: 4, name: 'Emma Johansson', img: 'https://i.pravatar.cc/150?u=13', 
      category: 'Heating', room: '102', priority: 'Low',
      date: '13.10.2025', status: 'Active', 
      desc: 'Kalorifer peteği yeterince ısınmıyor.' 
    },
    { 
      id: 5, name: 'Michael Jordan', img: 'https://i.pravatar.cc/150?u=14', 
      category: 'Furniture', room: '401', priority: 'Critical',
      date: '18.10.2025', status: 'Active', 
      desc: 'Yatak bazası kırıldı, yatamıyorum.' 
    },
  ]);

  const historyData = [
    { id: 99, name: 'Michael Scott', img: 'https://i.pravatar.cc/150?u=20', category: 'Cleaning', room: 'Lobby', priority: 'Medium', date: '01.09.2025', status: 'Resolved', desc: 'Koridorun temizlenmesi gerekiyordu.' }
  ];

  const baseData = viewHistory ? historyData : activeData;

  // SIRALAMA FONKSİYONU
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedData = [...baseData].sort((a, b) => {
    if (sortConfig.key === 'priority') {
        const levels = { 'Critical': 4, 'High': 3, 'Medium': 2, 'Low': 1 };
        const valA = levels[a.priority] || 0;
        const valB = levels[b.priority] || 0;
        return sortConfig.direction === 'asc' ? valA - valB : valB - valA;
    } 
    else if (sortConfig.key === 'date') {
        const dateA = a.date.split('.').reverse().join('');
        const dateB = b.date.split('.').reverse().join('');
        return sortConfig.direction === 'asc' ? dateA.localeCompare(dateB) : dateB.localeCompare(dateA);
    }
    return 0;
  });

  const handleAssignStaff = (staff) => {
    const updatedList = activeData.map(item => 
        item.id === selectedRequest.id ? { ...item, status: 'In Progress' } : item
    );
    setActiveData(updatedList);
    alert(`Task assigned to ${staff.name}!`);
    setShowAssignModal(false);
    setSelectedRequest(null);
  };

  // STİL: Artık border yok, sadece soft renkler var.
  const getPriorityStyle = (p) => {
    switch(p) {
        case 'Critical': return 'text-red-600 bg-red-50';
        case 'High': return 'text-orange-600 bg-orange-50';
        case 'Medium': return 'text-yellow-600 bg-yellow-50';
        case 'Low': return 'text-green-600 bg-green-50';
        default: return 'text-gray-600 bg-gray-50';
    }
  };

  const renderSortIcon = (columnKey) => {
    if (sortConfig.key !== columnKey) return <ArrowUpDown size={14} className="text-gray-300 ml-1" />;
    return sortConfig.direction === 'asc' 
        ? <ArrowUp size={14} className="text-blue-600 ml-1" /> 
        : <ArrowDown size={14} className="text-blue-600 ml-1" />;
  };

  return (
    <div className="bg-white rounded-[20px] shadow-sm border border-gray-100 flex flex-col h-full overflow-hidden">
      
      {/* HEADER */}
      <div className="px-8 py-6 border-b border-gray-50 flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                {viewHistory ? <Archive className="text-gray-400" size={28}/> : <CheckCircle className="text-blue-600" size={28}/>}
                {viewHistory ? 'Archive' : 'Requests Center'}
            </h2>
            <p className="text-sm text-gray-500 mt-1 pl-1">
                {viewHistory ? 'Past completed tasks.' : 'Manage current technical issues.'}
            </p>
        </div>

        <div className="flex gap-3">
            <div className="relative hidden md:block">
                <Search className="absolute left-4 top-3 text-gray-400" size={18} />
                <input 
                    type="text" 
                    placeholder="Search..." 
                    className="pl-11 pr-4 py-2.5 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-100 text-sm w-64 text-gray-700 placeholder-gray-400 font-medium" 
                />
            </div>
            <button 
                onClick={() => setViewHistory(!viewHistory)}
                className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                    viewHistory 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' 
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                }`}
            >
                {viewHistory ? 'Back to Active' : 'History'}
            </button>
        </div>
      </div>

      {/* TABLO - KUTUCUKLAR GİTTİ, SADELEŞTİ */}
      <div className="flex-1 overflow-auto">
        <table className="w-full text-left border-collapse">
            <thead className="bg-white text-gray-400 text-xs uppercase font-bold sticky top-0 z-10 border-b border-gray-50">
                <tr>
                    <th className="px-8 py-5">Student</th>
                    <th className="px-6 py-5">Category</th>
                    <th className="px-6 py-5">Room</th>
                    
                    <th 
                        className="px-6 py-5 cursor-pointer hover:text-blue-600 transition-colors select-none group"
                        onClick={() => handleSort('priority')}
                    >
                        <div className="flex items-center">
                            Priority {renderSortIcon('priority')}
                        </div>
                    </th>

                    <th className="px-6 py-5">Status</th>
                    
                     <th 
                        className="px-6 py-5 cursor-pointer hover:text-blue-600 transition-colors select-none"
                        onClick={() => handleSort('date')}
                    >
                        <div className="flex items-center">
                            Date {renderSortIcon('date')}
                        </div>
                    </th>

                    <th className="px-8 py-5 text-right">Action</th>
                </tr>
            </thead>
            <tbody className="text-sm text-gray-700">
                {sortedData.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50/80 transition-colors border-b border-gray-50 last:border-0 group">
                        
                        {/* 1. Student Info */}
                        <td className="px-8 py-5">
                            <div className="flex items-center gap-4">
                                <img src={item.img} alt={item.name} className="w-10 h-10 rounded-full object-cover shadow-sm bg-gray-100" />
                                <div>
                                    <p className="font-bold text-gray-800 text-[15px]">{item.name}</p>
                                    <p className="text-xs text-gray-400 mt-0.5 font-medium">#{item.id}</p>
                                </div>
                            </div>
                        </td>

                        {/* 2. Category - KUTUCUK YOK, SADE METİN */}
                        <td className="px-6 py-5">
                            <span className="text-gray-600 font-semibold text-[13px]">
                                {item.category}
                            </span>
                        </td>
                        
                        {/* 3. Room */}
                        <td className="px-6 py-5 font-medium text-gray-500">{item.room}</td>
                        
                        {/* 4. Priority - SADECE RENKLİ YAZI + HAFİF ARKA PLAN (BORDER YOK) */}
                        <td className="px-6 py-5">
                            <span className={`px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-wider ${getPriorityStyle(item.priority)}`}>
                                {item.priority}
                            </span>
                        </td>

                        {/* 5. Status */}
                        <td className="px-6 py-5">
                            <div className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${
                                    item.status === 'Active' ? 'bg-red-500 animate-pulse' : 
                                    item.status === 'In Progress' ? 'bg-yellow-500' : 'bg-green-500'
                                }`}></div>
                                <span className={`font-bold text-xs ${
                                    item.status === 'Active' ? 'text-red-500' : 
                                    item.status === 'In Progress' ? 'text-yellow-600' : 'text-green-600'
                                }`}>
                                    {item.status}
                                </span>
                            </div>
                        </td>

                        {/* 6. Date */}
                        <td className="px-6 py-5 text-gray-400 font-medium text-xs">
                            {item.date}
                        </td>

                        {/* 7. Action */}
                        <td className="px-8 py-5 text-right">
    <button 
        onClick={() => setSelectedRequest(item)}
        className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-xl text-sm font-bold hover:bg-blue-100 transition-colors"
    >
        <Eye size={18} />
        <span>Details</span>
    </button>
</td>
                    </tr>
                ))}
            </tbody>
        </table>
      </div>

      {/* --- DETAIL MODAL --- */}
      {selectedRequest && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/10 backdrop-blur-sm p-4">
            <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-gray-100 flex flex-col animate-in zoom-in-95 overflow-hidden">
                <div className="p-6 border-b border-gray-50 flex justify-between items-center">
                    <h3 className="font-bold text-xl text-gray-800">Request #{selectedRequest.id}</h3>
                    <button onClick={() => setSelectedRequest(null)} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><X size={20} className="text-gray-400"/></button>
                </div>
                
                <div className="p-8 space-y-6">
                    {/* Üst Bilgi */}
                    <div className="flex items-center gap-5">
                        <img src={selectedRequest.img} className="w-16 h-16 rounded-full border-4 border-gray-50" />
                        <div>
                            <h4 className="text-xl font-bold text-gray-900">{selectedRequest.name}</h4>
                            <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                                <span className="flex items-center gap-1.5"><MapPin size={14}/> Room {selectedRequest.room}</span>
                                <span className="flex items-center gap-1.5"><Calendar size={14}/> {selectedRequest.date}</span>
                            </div>
                        </div>
                    </div>

                    {/* Sorun Açıklaması */}
                    <div>
                         <label className="text-xs font-bold text-gray-400 uppercase mb-2 block tracking-wide">Description</label>
                         <p className="text-gray-700 bg-gray-50 p-4 rounded-xl leading-relaxed text-sm font-medium border border-gray-100">
                            "{selectedRequest.desc}"
                         </p>
                    </div>

                    {/* Etiketler */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 rounded-xl border border-gray-100 bg-white">
                            <span className="block text-xs font-bold text-gray-400 uppercase mb-1">Category</span>
                            <span className="font-bold text-gray-700">{selectedRequest.category}</span>
                        </div>
                        <div className="p-4 rounded-xl border border-gray-100 bg-white">
                            <span className="block text-xs font-bold text-gray-400 uppercase mb-1">Priority</span>
                            <span className={`inline-block px-2 py-0.5 rounded text-xs font-bold uppercase ${getPriorityStyle(selectedRequest.priority)}`}>
                                {selectedRequest.priority}
                            </span>
                        </div>
                    </div>
                </div>
                
                <div className="p-6 border-t border-gray-50 flex justify-end gap-3 bg-gray-50/50">
                    <button onClick={() => setSelectedRequest(null)} className="px-6 py-2.5 text-gray-600 font-bold hover:bg-white hover:shadow-sm rounded-xl transition-all text-sm">Close</button>
                    <button 
                         onClick={() => setShowAssignModal(true)}
                         className="px-6 py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all text-sm flex items-center gap-2"
                    >
                        <User size={16}/> Assign Staff
                    </button>
                </div>
            </div>
        </div>
      )}

      <AssignStaffModal 
        isOpen={showAssignModal}
        onClose={() => setShowAssignModal(false)}
        onAssign={handleAssignStaff}
        taskTitle={selectedRequest?.category}
      />

    </div>
  );
};

export default RequestTable;