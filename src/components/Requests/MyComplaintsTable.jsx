import React, { useState } from 'react';
import { Search, Eye, X, Star, AlertTriangle, CheckCircle, ShieldAlert, Shield, ShieldCheck, MapPin, Calendar } from 'lucide-react';
import GiveFeedbackModal from './GiveFeedbackModal';

const MyComplaintsTable = () => {
  const [selected, setSelected] = useState(null);
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [itemToRate, setItemToRate] = useState(null);

  const [myComplaints, setMyComplaints] = useState([
    { id: 302, category: 'Theft / Lost Item', room: 'Gym Area', priority: 'Critical', date: '02.11.2025', status: 'Investigating', desc: 'My headphones were stolen from the gym.', rated: false, rating: 0 },
    { id: 305, category: 'Noise', room: 'Room 405', priority: 'High', date: '20.10.2025', status: 'Resolved', desc: 'Room 405 was very loud.', rated: false, rating: 0 },
    { id: 308, category: 'Hygiene', room: 'Main Kitchen', priority: 'Medium', date: '15.10.2025', status: 'Resolved', desc: 'Kitchen was dirty.', rated: true, rating: 4 },
  ]);

  const handleOpenRate = (item) => {
    setItemToRate(item);
    setFeedbackModalOpen(true);
  };

  const handleFeedbackSubmit = (data) => {
    const updatedList = myComplaints.map(item => 
        item.id === itemToRate.id ? { ...item, rated: true, rating: data.rating } : item
    );
    setMyComplaints(updatedList);
  };

  const getPriorityConfig = (p) => {
    switch(p) {
        case 'Critical': return { style: 'bg-red-50 text-red-600 border-red-100', icon: ShieldAlert };
        case 'High': return { style: 'bg-orange-50 text-orange-600 border-orange-100', icon: Shield };
        default: return { style: 'bg-yellow-50 text-yellow-600 border-yellow-100', icon: ShieldCheck };
    }
  };

  const getStatusConfig = (s) => {
    if (s === 'Resolved') return { style: 'bg-green-50 text-green-600 border-green-100', icon: CheckCircle };
    if (s === 'Investigating') return { style: 'bg-blue-50 text-blue-600 border-blue-100', icon: Search };
    return { style: 'bg-gray-50 text-gray-600 border-gray-100', icon: AlertTriangle };
  };

  return (
    <div className="bg-white rounded-[20px] shadow-sm border border-gray-100 flex flex-col h-full overflow-hidden relative">
      <div className="px-8 py-6 border-b border-gray-50">
        <h2 className="text-2xl font-bold text-gray-800">My Complaints</h2>
        <p className="text-sm text-gray-500 mt-1">Status of your reported issues.</p>
      </div>

      <div className="flex-1 overflow-auto">
        <table className="w-full text-left border-collapse">
            <thead className="bg-white text-gray-400 text-xs uppercase font-bold border-b border-gray-50 sticky top-0 z-10">
                <tr>
                    <th className="px-6 py-5 text-left w-1/4">Category</th>
                    {/* Room Sütunu Ortalı */}
                    <th className="px-6 py-5 text-center w-1/6">Room</th>
                    <th className="px-6 py-5 text-left w-1/6">Date</th>
                    <th className="px-6 py-5 text-center w-1/6">Priority</th>
                    <th className="px-6 py-5 text-center w-1/6">Status</th>
                    <th className="px-8 py-5 text-right">Action</th>
                </tr>
            </thead>
            <tbody className="text-sm text-gray-700">
                {myComplaints.map((item) => {
                    const priorityCfg = getPriorityConfig(item.priority);
                    const statusCfg = getStatusConfig(item.status);

                    return (
                        <tr key={item.id} className="hover:bg-gray-50 border-b border-gray-50 last:border-0 group transition-colors">
                            
                            {/* 1. CATEGORY */}
                            <td className="px-6 py-5 align-middle">
                                <div className="font-bold text-gray-800 text-base">{item.category}</div>
                            </td>

                            {/* 2. ROOM (DÜZENLENDİ: Sabit Genişlik ve Ortalı) */}
                            <td className="px-6 py-5 align-middle">
                                <div className="w-28 h-10 flex items-center justify-center mx-auto text-gray-600 font-medium bg-gray-50 rounded-xl border border-gray-100">
                                    {item.room}
                                </div>
                            </td>
                            
                            {/* 3. DATE */}
                            <td className="px-6 py-5 align-middle">
                                <div className="flex items-center gap-2 text-gray-500 font-mono text-xs">
                                    <Calendar size={14} className="text-gray-400"/>
                                    {item.date}
                                </div>
                            </td>
                            
                            {/* 4. PRIORITY */}
                            <td className="px-6 py-5 align-middle">
                                <div className={`w-32 h-11 grid grid-cols-[24px_1fr] items-center px-4 rounded-xl text-sm font-bold border mx-auto ${priorityCfg.style}`}>
                                    <priorityCfg.icon size={16} strokeWidth={2.5}/> 
                                    <span className="text-left">{item.priority}</span>
                                </div>
                            </td>

                            {/* 5. STATUS */}
                            <td className="px-6 py-5 align-middle">
                                <div className={`w-36 h-11 grid grid-cols-[24px_1fr] items-center px-4 rounded-xl text-xs font-bold border mx-auto ${statusCfg.style}`}>
                                    <statusCfg.icon size={16}/> 
                                    <span className="text-left">{item.status}</span>
                                </div>
                            </td>
                            
                            {/* 6. ACTION */}
                            <td className="px-8 py-5 text-right align-middle">
                                 <div className="flex justify-end">
                                    {item.status === 'Resolved' && !item.rated ? (
                                        <button 
                                            onClick={() => handleOpenRate(item)}
                                            className="w-36 h-10 flex items-center justify-center gap-2 bg-green-50 text-green-700 rounded-xl text-sm font-bold hover:bg-green-100 transition-colors border border-green-100 shadow-sm"
                                        >
                                            <Star size={16} /> Rate Solution
                                        </button>
                                    ) : item.rated ? (
                                        <div className="w-36 h-10 flex items-center justify-center gap-1.5 bg-gray-50 text-gray-400 border border-gray-100 rounded-xl text-sm font-bold cursor-default">
                                            <Star size={16} className="text-yellow-400 fill-yellow-400"/> 
                                            <span className="text-gray-600">{item.rating}.0</span>
                                        </div>
                                    ) : (
                                        <button 
                                            onClick={() => setSelected(item)} 
                                            className="w-36 h-10 flex items-center justify-center gap-2 bg-red-50 text-red-600 rounded-xl text-sm font-bold hover:bg-red-100 transition-colors"
                                        >
                                            <Eye size={16} /> View
                                        </button>
                                    )}
                                 </div>
                            </td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
      </div>
      
      {selected && (
        <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/10 backdrop-blur-sm p-4">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6 animate-in zoom-in-95 border border-gray-100">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-lg text-gray-800">Complaint #{selected.id}</h3>
                    <button onClick={() => setSelected(null)}><X size={20} className="text-gray-400"/></button>
                </div>
                <div className="bg-red-50 p-4 rounded-xl text-sm text-gray-700 mb-4 border border-red-100">"{selected.desc}"</div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                    <MapPin size={16}/> Location: <span className="font-bold text-gray-800">{selected.room}</span>
                </div>
            </div>
        </div>
      )}

      <GiveFeedbackModal 
        isOpen={feedbackModalOpen}
        onClose={() => setFeedbackModalOpen(false)}
        itemTitle={itemToRate?.category}
        onSubmit={handleFeedbackSubmit}
      />
    </div>
  );
};
export default MyComplaintsTable;