import React, { useState } from 'react';
import { 
  Search, Archive, Megaphone, Eye, X, MapPin, 
  AlertCircle, Calendar, ArrowUpDown, ArrowUp, ArrowDown, User 
} from 'lucide-react';
import AssignStaffModal from './AssignStaffModal';

const ComplaintsTable = () => {
  const [viewHistory, setViewHistory] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  
  // SIRALAMA
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });
  
  // MODAL KONTROLÜ
  const [showAssignModal, setShowAssignModal] = useState(false);

  // DATA
  const [activeComplaints, setActiveComplaints] = useState([
    { 
      id: 301, name: 'Alice Wonderland', img: 'https://i.pravatar.cc/150?u=30', 
      category: 'Noise Disturbance', room: '404', priority: 'High', 
      date: '01.11.2025', status: 'Pending', 
      desc: 'Yan odadaki (405) öğrenciler gece 3\'e kadar yüksek sesle müzik dinliyor, uyuyamıyorum.' 
    },
    { 
      id: 302, name: 'Bob Marley', img: 'https://i.pravatar.cc/150?u=31', 
      category: 'Theft / Lost Item', room: '101', priority: 'Critical',
      date: '02.11.2025', status: 'Investigating', 
      desc: 'Spor salonunda bıraktığım kulaklığım çalındı, kamera kayıtlarının incelenmesini istiyorum.' 
    },
    { 
      id: 303, name: 'Charlie Chaplin', img: 'https://i.pravatar.cc/150?u=32', 
      category: 'Hygiene Issue', room: 'Kitchen', priority: 'Medium',
      date: '03.11.2025', status: 'Open', 
      desc: '3. Kat ortak mutfağı çok kirli bırakılıyor, çöpler taşmış durumda.' 
    },
    { 
      id: 304, name: 'Donald Trump', img: 'https://i.pravatar.cc/150?u=33', 
      category: 'Rule Violation', room: 'Lobby', priority: 'Low',
      date: '04.11.2025', status: 'Pending', 
      desc: 'Lobi alanında izinsiz afiş asılması.' 
    },
  ]);

  const historyComplaints = [
    { 
      id: 299, name: 'John Doe', img: 'https://i.pravatar.cc/150?u=40', 
      category: 'Rule Violation', room: '202', priority: 'Low',
      date: '20.10.2025', status: 'Resolved', 
      desc: 'Odaya yasaklı elektrikli ısıtıcı sokulmuştu, uyarıldı ve kaldırıldı.' 
    }
  ];

  const baseData = viewHistory ? historyComplaints : activeComplaints;

  // SIRALAMA MANTIĞI
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
    const updatedList = activeComplaints.map(item => 
        item.id === selectedComplaint.id ? { ...item, status: 'Investigating' } : item
    );
    setActiveComplaints(updatedList);
    alert(`Complaint assigned to ${staff.name}!`);
    setShowAssignModal(false);
    setSelectedComplaint(null);
  };

  // STİL: REQUEST TABLE İLE BİREBİR AYNI (SOFT & CLEAN)
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
                {viewHistory ? <Archive className="text-gray-400" size={28}/> : <Megaphone className="text-red-600" size={28}/>}
                {viewHistory ? 'Complaint Archive' : 'Active Complaints'}
            </h2>
            <p className="text-sm text-gray-500 mt-1 pl-1">
                {viewHistory ? 'Review past disciplinary records.' : 'Manage behavioral and critical issues.'}
            </p>
        </div>

        <div className="flex gap-3">
            <div className="relative hidden md:block">
                <Search className="absolute left-4 top-3 text-gray-400" size={18} />
                <input 
                    type="text" 
                    placeholder="Search..." 
                    className="pl-11 pr-4 py-2.5 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-red-100 text-sm w-64 text-gray-700 placeholder-gray-400 font-medium" 
                />
            </div>
            <button 
                onClick={() => setViewHistory(!viewHistory)}
                className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                    viewHistory 
                    ? 'bg-red-600 text-white shadow-lg shadow-red-200' 
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                }`}
            >
                {viewHistory ? 'Back to Active' : 'History'}
            </button>
        </div>
      </div>

      {/* TABLO - REQUEST TABLE İLE AYNI TEMİZ TASARIM */}
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

                        {/* 2. Category - TEMİZ METİN (KUTU YOK) */}
                        <td className="px-6 py-5">
                            <span className="text-gray-600 font-semibold text-[13px]">
                                {item.category}
                            </span>
                        </td>
                        
                        {/* 3. Room */}
                        <td className="px-6 py-5 font-medium text-gray-500">{item.room}</td>
                        
                        {/* 4. Priority - SOFT STYLE (BORDER YOK) */}
                        <td className="px-6 py-5">
                            <span className={`px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-wider ${getPriorityStyle(item.priority)}`}>
                                {item.priority}
                            </span>
                        </td>

                        {/* 5. Status - DOT STYLE */}
                        <td className="px-6 py-5">
                            <div className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${
                                    item.status === 'Pending' ? 'bg-red-500 animate-pulse' : 
                                    item.status === 'Investigating' ? 'bg-blue-500' : 'bg-green-500'
                                }`}></div>
                                <span className={`font-bold text-xs ${
                                    item.status === 'Pending' ? 'text-red-500' : 
                                    item.status === 'Investigating' ? 'text-blue-600' : 'text-green-600'
                                }`}>
                                    {item.status}
                                </span>
                            </div>
                        </td>

                        {/* 6. Date */}
                        <td className="px-6 py-5 text-gray-400 font-medium text-xs">
                            {item.date}
                        </td>

                        {/* 7. Action - MAVİ REVIEW BUTONU */}
                        <td className="px-8 py-5 text-right">
                            <button 
                                onClick={() => setSelectedComplaint(item)}
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

      {/* --- DETAY MODALI --- */}
      {selectedComplaint && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/10 backdrop-blur-sm p-4">
            <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-gray-100 flex flex-col animate-in zoom-in-95 overflow-hidden">
                <div className="p-6 border-b border-gray-50 flex justify-between items-center">
                    <h3 className="font-bold text-xl text-gray-800 flex items-center gap-2">
                        <Megaphone size={20} className="text-red-600"/> Complaint #{selectedComplaint.id}
                    </h3>
                    <button onClick={() => setSelectedComplaint(null)} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><X size={20} className="text-gray-400"/></button>
                </div>
                
                <div className="p-8 space-y-6">
                    <div className="flex items-center gap-5">
                        <img src={selectedComplaint.img} className="w-16 h-16 rounded-full border-4 border-gray-50" />
                        <div>
                            <h4 className="text-xl font-bold text-gray-900">{selectedComplaint.name}</h4>
                            <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                                <span className="flex items-center gap-1.5"><MapPin size={14}/> Room {selectedComplaint.room}</span>
                                <span className="flex items-center gap-1.5"><Calendar size={14}/> {selectedComplaint.date}</span>
                            </div>
                        </div>
                    </div>

                    <div>
                         <label className="text-xs font-bold text-gray-400 uppercase mb-2 block tracking-wide">Complaint Detail</label>
                         <p className="text-gray-700 bg-red-50 p-4 rounded-xl leading-relaxed text-sm font-medium border border-red-100">
                            "{selectedComplaint.desc}"
                         </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 rounded-xl border border-gray-100 bg-white">
                            <span className="block text-xs font-bold text-gray-400 uppercase mb-1">Category</span>
                            <span className="font-bold text-gray-700">{selectedComplaint.category}</span>
                        </div>
                        <div className="p-4 rounded-xl border border-gray-100 bg-white">
                            <span className="block text-xs font-bold text-gray-400 uppercase mb-1">Priority</span>
                            <span className={`inline-block px-2 py-0.5 rounded text-xs font-bold uppercase ${getPriorityStyle(selectedComplaint.priority)}`}>
                                {selectedComplaint.priority}
                            </span>
                        </div>
                    </div>
                </div>
                
                <div className="p-6 border-t border-gray-50 flex justify-end gap-3 bg-gray-50/50">
                    <button onClick={() => setSelectedComplaint(null)} className="px-6 py-2.5 text-gray-600 font-bold hover:bg-white hover:shadow-sm rounded-xl transition-all text-sm">Close</button>
                    <button 
                        onClick={() => setShowAssignModal(true)}
                        className="px-6 py-2.5 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 shadow-lg shadow-red-200 transition-all text-sm flex items-center gap-2"
                    >
                        <User size={16}/> Assign Investigation
                    </button>
                </div>
            </div>
        </div>
      )}

      {/* --- PERSONEL ATAMA MODALI --- */}
      <AssignStaffModal 
        isOpen={showAssignModal}
        onClose={() => setShowAssignModal(false)}
        onAssign={handleAssignStaff}
        taskTitle={selectedComplaint?.category}
      />

    </div>
  );
};

export default ComplaintsTable;