import React, { useState } from 'react';
import { Eye, X, Star, CheckCircle, Clock, AlertCircle, ShieldAlert, Shield, ShieldCheck, MapPin, Calendar } from 'lucide-react';
import GiveFeedbackModal from './GiveFeedbackModal';

const MyRequestsTable = () => {
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [itemToRate, setItemToRate] = useState(null);

  const [myRequests, setMyRequests] = useState([
    { id: 1, category: 'Wifi / Internet', room: 'Room 101', priority: 'High', date: '15.10.2025', status: 'In Progress', desc: 'Internet connection keeps dropping.' },
    { id: 4, category: 'Heating', room: 'Room 101', priority: 'Low', date: '13.10.2025', status: 'Pending', desc: 'Radiator is not warm enough.' },
    { id: 9, category: 'Furniture', room: 'Lobby', priority: 'Medium', date: '01.09.2025', status: 'Completed', desc: 'Chair leg was broken.', rated: false, rating: 0 },
    { id: 10, category: 'Plumbing', room: 'Room 101', priority: 'High', date: '05.09.2025', status: 'Completed', desc: 'Sink was leaking.', rated: true, rating: 5 },
  ]);

  const handleOpenRate = (item) => {
    setItemToRate(item);
    setFeedbackModalOpen(true);
  };

  const handleFeedbackSubmit = (data) => {
    const updatedList = myRequests.map(req => 
        req.id === itemToRate.id ? { ...req, rated: true, rating: data.rating } : req
    );
    setMyRequests(updatedList);
  };

  const getPriorityConfig = (p) => {
    switch(p) {
        case 'High': return { style: 'bg-orange-50 text-orange-600 border-orange-100', icon: ShieldAlert };
        case 'Medium': return { style: 'bg-yellow-50 text-yellow-600 border-yellow-100', icon: Shield };
        default: return { style: 'bg-green-50 text-green-600 border-green-100', icon: ShieldCheck };
    }
  };

  const getStatusConfig = (s) => {
    if (s === 'Completed') return { style: 'bg-green-50 text-green-600 border-green-100', icon: CheckCircle };
    if (s === 'In Progress') return { style: 'bg-blue-50 text-blue-600 border-blue-100', icon: Clock };
    return { style: 'bg-gray-50 text-gray-500 border-gray-100', icon: AlertCircle };
  };

  return (
    <div className="bg-white rounded-[20px] shadow-sm border border-gray-100 flex flex-col h-full overflow-hidden relative">
      <div className="px-8 py-6 border-b border-gray-50">
        <h2 className="text-2xl font-bold text-gray-800">My Requests</h2>
        <p className="text-sm text-gray-500 mt-1">Track the status of your maintenance requests.</p>
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
                {myRequests.map((item) => {
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
                                    {item.status === 'Completed' && !item.rated ? (
                                        <button 
                                            onClick={() => handleOpenRate(item)}
                                            className="w-36 h-10 flex items-center justify-center gap-2 bg-yellow-50 text-yellow-600 rounded-xl text-sm font-bold hover:bg-yellow-100 transition-colors border border-yellow-100 shadow-sm"
                                        >
                                            <Star size={16} fill="currentColor" /> Rate Service
                                        </button>
                                    ) : item.rated ? (
                                        <div className="w-36 h-10 flex items-center justify-center gap-1.5 bg-gray-50 text-gray-400 border border-gray-100 rounded-xl text-sm font-bold cursor-default">
                                            <Star size={16} className="text-yellow-400 fill-yellow-400"/> 
                                            <span className="text-gray-600">{item.rating}.0</span>
                                        </div>
                                    ) : (
                                        <button 
                                            onClick={() => setSelectedRequest(item)} 
                                            className="w-36 h-10 flex items-center justify-center gap-2 bg-blue-50 text-blue-600 rounded-xl text-sm font-bold hover:bg-blue-100 transition-colors"
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

      {selectedRequest && (
        <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/10 backdrop-blur-sm p-4">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6 animate-in zoom-in-95 border border-gray-100">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-lg text-gray-800">Request #{selectedRequest.id}</h3>
                    <button onClick={() => setSelectedRequest(null)} className="p-2 hover:bg-gray-100 rounded-full"><X size={20} className="text-gray-400"/></button>
                </div>
                <div className="bg-blue-50 p-4 rounded-xl text-sm text-gray-700 mb-4 border border-blue-100">"{selectedRequest.desc}"</div>
                 <div className="flex items-center gap-2 text-sm text-gray-500">
                    <MapPin size={16}/> Location: <span className="font-bold text-gray-800">{selectedRequest.room}</span>
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
export default MyRequestsTable;