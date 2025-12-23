import React, { useState } from 'react';
import { Search, Eye, MapPin, Calendar, X } from 'lucide-react';

const MyRequestsTable = () => {
  const [selectedRequest, setSelectedRequest] = useState(null);

  const myRequests = [
    { id: 1, category: 'Wifi / Internet', room: '101', priority: 'High', date: '15.10.2025', status: 'In Progress', desc: 'Internet connection keeps dropping.' },
    { id: 4, category: 'Heating', room: '101', priority: 'Low', date: '13.10.2025', status: 'Pending', desc: 'Radiator is not warm enough.' },
    { id: 9, category: 'Furniture', room: '101', priority: 'Medium', date: '01.09.2025', status: 'Completed', desc: 'Chair leg was broken.' },
  ];

  const getPriorityStyle = (p) => {
    switch(p) {
        case 'High': return 'text-orange-600 bg-orange-50';
        case 'Medium': return 'text-yellow-600 bg-yellow-50';
        default: return 'text-green-600 bg-green-50';
    }
  };

  return (
    <div className="bg-white rounded-[20px] shadow-sm border border-gray-100 flex flex-col h-full overflow-hidden">
      <div className="px-8 py-6 border-b border-gray-50">
        <h2 className="text-2xl font-bold text-gray-800">My Requests</h2>
        <p className="text-sm text-gray-500 mt-1">Track the status of your maintenance requests.</p>
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
                {myRequests.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50 border-b border-gray-50 last:border-0">
                        <td className="px-8 py-5 font-bold text-gray-800">{item.category}</td>
                        <td className="px-6 py-5 text-gray-500 font-mono text-xs">{item.date}</td>
                        <td className="px-6 py-5"><span className={`px-3 py-1 rounded-lg text-[11px] font-bold uppercase ${getPriorityStyle(item.priority)}`}>{item.priority}</span></td>
                        <td className="px-6 py-5">
                            <span className={`font-bold text-xs ${item.status === 'Completed' ? 'text-green-600' : item.status === 'In Progress' ? 'text-blue-600' : 'text-gray-500'}`}>
                                {item.status}
                            </span>
                        </td>
                        <td className="px-8 py-5 text-right">
                            <button onClick={() => setSelectedRequest(item)} className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-xl text-sm font-bold hover:bg-blue-100">
                                <Eye size={16} /> View
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
      </div>

      {selectedRequest && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/10 backdrop-blur-sm p-4">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6 animate-in zoom-in-95">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-lg">Request #{selectedRequest.id}</h3>
                    <button onClick={() => setSelectedRequest(null)}><X size={20} className="text-gray-400"/></button>
                </div>
                <div className="space-y-4">
                    <div className="bg-blue-50 p-4 rounded-xl text-sm text-gray-700">"{selectedRequest.desc}"</div>
                    <div className="flex justify-between text-sm"><span className="text-gray-500">Status</span> <span className="font-bold">{selectedRequest.status}</span></div>
                    <div className="flex justify-between text-sm"><span className="text-gray-500">Date</span> <span className="font-bold">{selectedRequest.date}</span></div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};
export default MyRequestsTable;