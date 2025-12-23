import React, { useState } from 'react';
import { Search, Eye, X } from 'lucide-react';

const MyComplaintsTable = () => {
  const [selected, setSelected] = useState(null);

  const myComplaints = [
    { id: 302, category: 'Theft / Lost Item', priority: 'Critical', date: '02.11.2025', status: 'Investigating', desc: 'My headphones were stolen from the gym.' },
    { id: 305, category: 'Noise', priority: 'High', date: '20.10.2025', status: 'Resolved', desc: 'Room 405 was very loud.' },
  ];

  return (
    <div className="bg-white rounded-[20px] shadow-sm border border-gray-100 flex flex-col h-full overflow-hidden">
      <div className="px-8 py-6 border-b border-gray-50">
        <h2 className="text-2xl font-bold text-gray-800">My Complaints</h2>
        <p className="text-sm text-gray-500 mt-1">Status of your reported issues.</p>
      </div>

      <div className="flex-1 overflow-auto">
        <table className="w-full text-left">
            <thead className="bg-white text-gray-400 text-xs uppercase font-bold border-b border-gray-50">
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
                    <tr key={item.id} className="hover:bg-gray-50 border-b border-gray-50 last:border-0">
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
                        <td className="px-8 py-5 text-right">
                            <button onClick={() => setSelected(item)} className="inline-flex items-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-xl text-sm font-bold hover:bg-red-100">
                                <Eye size={16} /> View
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
      </div>
      
      {/* Read-Only Modal */}
      {selected && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/10 backdrop-blur-sm p-4">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6 animate-in zoom-in-95">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-lg">Complaint #{selected.id}</h3>
                    <button onClick={() => setSelected(null)}><X size={20} className="text-gray-400"/></button>
                </div>
                <div className="bg-red-50 p-4 rounded-xl text-sm text-gray-700 mb-4">"{selected.desc}"</div>
                <div className="text-right">
                     <span className="text-xs font-bold text-gray-400 uppercase">Status:</span> 
                     <span className="ml-2 font-bold text-gray-800">{selected.status}</span>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};
export default MyComplaintsTable;