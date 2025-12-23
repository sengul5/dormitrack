import React, { useState } from 'react';
import { Search, Eye, X, Star } from 'lucide-react';
import GiveFeedbackModal from './GiveFeedbackModal';

const MyComplaintsTable = () => {
  const [selected, setSelected] = useState(null);
  
  // FEEDBACK STATE
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [itemToRate, setItemToRate] = useState(null);

  // VERİLER (State içinde tutuyoruz ki güncelleyebilelim)
  const [myComplaints, setMyComplaints] = useState([
    { id: 302, category: 'Theft / Lost Item', priority: 'Critical', date: '02.11.2025', status: 'Investigating', desc: 'My headphones were stolen from the gym.', rated: false, rating: 0 },
    { id: 305, category: 'Noise', priority: 'High', date: '20.10.2025', status: 'Resolved', desc: 'Room 405 was very loud.', rated: false, rating: 0 },
    { id: 308, category: 'Hygiene', priority: 'Medium', date: '15.10.2025', status: 'Resolved', desc: 'Kitchen was dirty.', rated: true, rating: 4 }, // Örnek: Zaten puanlanmış
  ]);

  const handleOpenRate = (item) => {
    setItemToRate(item);
    setFeedbackModalOpen(true);
  };

  const handleFeedbackSubmit = (data) => {
    // Listeyi güncelle (Frontend'de değişikliği anlık görmek için)
    const updatedList = myComplaints.map(item => 
        item.id === itemToRate.id ? { ...item, rated: true, rating: data.rating } : item
    );
    setMyComplaints(updatedList);
    alert('Thank you for your feedback regarding the resolution.');
  };

  return (
    <div className="bg-white rounded-[20px] shadow-sm border border-gray-100 flex flex-col h-full overflow-hidden relative">
      <div className="px-8 py-6 border-b border-gray-50">
        <h2 className="text-2xl font-bold text-gray-800">My Complaints</h2>
        <p className="text-sm text-gray-500 mt-1">Status of your reported issues.</p>
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
                {myComplaints.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50 border-b border-gray-50 last:border-0 group">
                        <td className="px-8 py-5 font-bold text-gray-800">{item.category}</td>
                        <td className="px-6 py-5 text-gray-500 font-mono text-xs">{item.date}</td>
                        <td className="px-6 py-5">
                            <span className={`px-3 py-1 rounded-lg text-[11px] font-bold uppercase ${item.priority === 'Critical' ? 'bg-red-50 text-red-600' : 'bg-orange-50 text-orange-600'}`}>
                                {item.priority}
                            </span>
                        </td>
                        <td className="px-6 py-5">
                            <span className={`font-bold text-xs ${item.status === 'Investigating' ? 'text-blue-600' : 'text-green-600'}`}>
                                {item.status}
                            </span>
                        </td>
                        
                        {/* DÜZENLENEN ACTION SÜTUNU */}
                        <td className="px-8 py-5 text-right">
                             <div className="flex justify-end">
                                {item.status === 'Resolved' && !item.rated ? (
                                    // 1. DURUM: RATE BUTONU (YEŞİL)
                                    <button 
                                        onClick={() => handleOpenRate(item)}
                                        className="w-32 h-10 flex items-center justify-center gap-2 bg-green-50 text-green-700 rounded-xl text-sm font-bold hover:bg-green-100 transition-colors border border-green-100 shadow-sm"
                                    >
                                        <Star size={16} /> Rate Solution
                                    </button>
                                ) : item.rated ? (
                                    // 2. DURUM: PUANLANMIŞ (GRİ KUTU)
                                    <div className="w-32 h-10 flex items-center justify-center gap-1.5 bg-gray-50 text-gray-400 border border-gray-100 rounded-xl text-sm font-bold cursor-default">
                                        <Star size={16} className="text-yellow-400 fill-yellow-400"/> 
                                        <span className="text-gray-600">{item.rating}.0</span>
                                    </div>
                                ) : (
                                    // 3. DURUM: VIEW BUTONU (KIRMIZI)
                                    <button 
                                        onClick={() => setSelected(item)} 
                                        className="w-32 h-10 flex items-center justify-center gap-2 bg-red-50 text-red-600 rounded-xl text-sm font-bold hover:bg-red-100 transition-colors"
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
      
      {/* Read-Only Modal */}
      {selected && (
        <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/10 backdrop-blur-sm p-4">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6 animate-in zoom-in-95 border border-gray-100">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-lg text-gray-800">Complaint #{selected.id}</h3>
                    <button onClick={() => setSelected(null)}><X size={20} className="text-gray-400"/></button>
                </div>
                <div className="bg-red-50 p-4 rounded-xl text-sm text-gray-700 mb-4 border border-red-100">"{selected.desc}"</div>
                <div className="text-right">
                     <span className="text-xs font-bold text-gray-400 uppercase">Status:</span> 
                     <span className="ml-2 font-bold text-gray-800">{selected.status}</span>
                </div>
            </div>
        </div>
      )}

      {/* --- FEEDBACK MODALI --- */}
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