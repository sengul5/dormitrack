import React, { useState } from 'react';
import { Eye, X, Star, Check } from 'lucide-react';
import GiveFeedbackModal from './GiveFeedbackModal';

const MyRequestsTable = () => {
  const [selectedRequest, setSelectedRequest] = useState(null);
  
  // FEEDBACK STATE
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [itemToRate, setItemToRate] = useState(null);

  // SAHTE VERİ
  const [myRequests, setMyRequests] = useState([
    { id: 1, category: 'Wifi / Internet', room: '101', priority: 'High', date: '15.10.2025', status: 'In Progress', desc: 'Internet connection keeps dropping.' },
    { id: 4, category: 'Heating', room: '101', priority: 'Low', date: '13.10.2025', status: 'Pending', desc: 'Radiator is not warm enough.' },
    { id: 9, category: 'Furniture', room: '101', priority: 'Medium', date: '01.09.2025', status: 'Completed', desc: 'Chair leg was broken.', rated: false, rating: 0 },
    { id: 10, category: 'Plumbing', room: '101', priority: 'High', date: '05.09.2025', status: 'Completed', desc: 'Sink was leaking.', rated: true, rating: 5 },
  ]);

  const getPriorityStyle = (p) => {
    switch(p) {
        case 'High': return 'text-orange-600 bg-orange-50';
        case 'Medium': return 'text-yellow-600 bg-yellow-50';
        default: return 'text-green-600 bg-green-50';
    }
  };

  const handleOpenRate = (item) => {
    setItemToRate(item);
    setFeedbackModalOpen(true);
  };

  const handleFeedbackSubmit = (data) => {
    // Listeyi güncelle (Frontend'de değişikliği görmek için)
    const updatedList = myRequests.map(req => 
        req.id === itemToRate.id ? { ...req, rated: true, rating: data.rating } : req
    );
    setMyRequests(updatedList);
    alert(`Thank you! You rated it ${data.rating} stars.`);
  };

  return (
    <div className="bg-white rounded-[20px] shadow-sm border border-gray-100 flex flex-col h-full overflow-hidden relative">
      <div className="px-8 py-6 border-b border-gray-50">
        <h2 className="text-2xl font-bold text-gray-800">My Requests</h2>
        <p className="text-sm text-gray-500 mt-1">Track the status of your maintenance requests.</p>
      </div>

      <div className="flex-1 overflow-auto">
        <table className="w-full text-left">
            <thead className="bg-white text-gray-400 text-xs uppercase font-bold border-b border-gray-50 sticky top-0 z-10">
                <tr>
                    <th className="px-8 py-5">Category</th>
                    <th className="px-6 py-5">Date</th>
                    <th className="px-6 py-5">Priority</th>
                    <th className="px-6 py-5">Status</th>
                    <th className="px-8 py-5 text-right">Action</th>
                </tr>
            </thead>
            <tbody className="text-sm text-gray-700">
                {myRequests.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50 border-b border-gray-50 last:border-0 group">
                        <td className="px-8 py-5 font-bold text-gray-800">{item.category}</td>
                        <td className="px-6 py-5 text-gray-500 font-mono text-xs">{item.date}</td>
                        <td className="px-6 py-5"><span className={`px-3 py-1 rounded-lg text-[11px] font-bold uppercase ${getPriorityStyle(item.priority)}`}>{item.priority}</span></td>
                        <td className="px-6 py-5">
                            <span className={`font-bold text-xs ${item.status === 'Completed' ? 'text-green-600' : item.status === 'In Progress' ? 'text-blue-600' : 'text-gray-500'}`}>
                                {item.status}
                            </span>
                        </td>
                        
                        {/* DÜZENLENEN ACTION KISMI */}
                        <td className="px-8 py-5 text-right">
                            <div className="flex justify-end">
                                {item.status === 'Completed' && !item.rated ? (
                                    // 1. DURUM: RATE BUTONU (SARI)
                                    <button 
                                        onClick={() => handleOpenRate(item)}
                                        className="w-32 h-10 flex items-center justify-center gap-2 bg-yellow-50 text-yellow-600 rounded-xl text-sm font-bold hover:bg-yellow-100 transition-colors border border-yellow-100 shadow-sm"
                                    >
                                        <Star size={16} fill="currentColor" /> Rate
                                    </button>
                                ) : item.rated ? (
                                    // 2. DURUM: PUANLANMIŞ (SABİT KUTU - DAHA DÜZENLİ)
                                    <div className="w-32 h-10 flex items-center justify-center gap-1.5 bg-gray-50 text-gray-400 border border-gray-100 rounded-xl text-sm font-bold cursor-default">
                                        <Star size={16} className="text-yellow-400 fill-yellow-400"/> 
                                        <span className="text-gray-600">{item.rating}.0</span>
                                    </div>
                                ) : (
                                    // 3. DURUM: VIEW BUTONU (MAVİ)
                                    <button 
                                        onClick={() => setSelectedRequest(item)} 
                                        className="w-32 h-10 flex items-center justify-center gap-2 bg-blue-50 text-blue-600 rounded-xl text-sm font-bold hover:bg-blue-100 transition-colors"
                                    >
                                        <Eye size={16} /> View
                                    </button>
                                )}
                            </div>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
      </div>

      {/* DETAY MODALI */}
      {selectedRequest && (
        <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/10 backdrop-blur-sm p-4">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6 animate-in zoom-in-95 border border-gray-100">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-lg text-gray-800">Request #{selectedRequest.id}</h3>
                    <button onClick={() => setSelectedRequest(null)} className="p-2 hover:bg-gray-100 rounded-full"><X size={20} className="text-gray-400"/></button>
                </div>
                <div className="space-y-4">
                    <div className="bg-blue-50 p-4 rounded-xl text-sm text-gray-700 border border-blue-100">"{selectedRequest.desc}"</div>
                    <div className="flex justify-between text-sm"><span className="text-gray-500">Status</span> <span className="font-bold text-blue-600">{selectedRequest.status}</span></div>
                    <div className="flex justify-between text-sm"><span className="text-gray-500">Date</span> <span className="font-bold">{selectedRequest.date}</span></div>
                </div>
            </div>
        </div>
      )}

      {/* FEEDBACK MODALI */}
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