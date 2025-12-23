import React, { useState } from 'react';
import { 
  CheckCircle, Check, MapPin, CheckSquare, 
  ArrowRight 
} from 'lucide-react';

const MyTasks = () => {
  const [activeTab, setActiveTab] = useState('active'); 

  // VERİLER
  const [tasks, setTasks] = useState([
    { 
      id: 101, type: 'Request', title: 'Wifi Connection Issue', 
      location: 'Room 101', priority: 'High', date: 'Today, 10:30 AM', 
      status: 'In Progress', desc: 'Student reports no internet connectivity in the bedroom area.' 
    },
    { 
      id: 302, type: 'Complaint', title: 'Noise Disturbance', 
      location: 'Room 404', priority: 'Medium', date: 'Yesterday', 
      status: 'Pending', desc: 'Check the noise complaint reported by neighbors. Verify decibel levels.' 
    },
    { 
      id: 105, type: 'Request', title: 'Broken Chair', 
      location: 'Lobby', priority: 'Low', date: '12.10.2025', 
      status: 'Completed', desc: 'Replace the broken leg of the sofa near the entrance.' 
    },
  ]);

  const filteredTasks = tasks.filter(task => 
    activeTab === 'active' ? task.status !== 'Completed' : task.status === 'Completed'
  );

  const handleComplete = (id) => {
    if(window.confirm('Mark this task as completed?')) {
        const updated = tasks.map(t => t.id === id ? { ...t, status: 'Completed' } : t);
        setTasks(updated);
    }
  };

  const getPriorityStyle = (p) => {
    switch(p) {
        case 'High': return 'text-orange-700 bg-orange-50 border-orange-100';
        case 'Medium': return 'text-yellow-700 bg-yellow-50 border-yellow-100';
        default: return 'text-green-700 bg-green-50 border-green-100';
    }
  };

  return (
    <div className="flex flex-col h-full gap-6">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-4">
        <div>
            <h1 className="text-3xl font-bold text-gray-800">My Tasks</h1>
            <p className="text-gray-500 mt-1">Assignments waiting for your action.</p>
        </div>
        
        {/* TABS */}
        <div className="bg-white p-1 rounded-xl border border-gray-100 flex shadow-sm">
            <button 
                onClick={() => setActiveTab('active')}
                className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${
                    activeTab === 'active' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'
                }`}
            >
                Active
            </button>
            <button 
                onClick={() => setActiveTab('completed')}
                className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${
                    activeTab === 'completed' ? 'bg-green-600 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'
                }`}
            >
                Completed
            </button>
        </div>
      </div>

      {/* --- TASK LIST (GRID) --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredTasks.length === 0 ? (
            <div className="col-span-full bg-white rounded-[20px] p-16 text-center border border-gray-100 flex flex-col items-center">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 text-gray-400">
                    <CheckCircle size={32}/>
                </div>
                <h3 className="text-lg font-bold text-gray-700">No tasks found</h3>
                <p className="text-gray-400 text-sm mt-1">You are all caught up!</p>
            </div>
        ) : (
            filteredTasks.map((task) => (
                <div key={task.id} className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all flex flex-col h-full relative overflow-hidden group">
                    
                    {/* 1. ÜST BİLGİ */}
                    <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-50">
                        <span className={`px-3 py-1 rounded-lg text-[11px] font-bold uppercase tracking-wider border ${
                            task.type === 'Request' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-red-50 text-red-600 border-red-100'
                        }`}>
                            {task.type}
                        </span>
                        
                        <div className="flex items-center gap-3 text-xs font-medium text-gray-400">
                            <span className="font-mono text-gray-500">#{task.id}</span>
                            <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                            <span>{task.date}</span>
                        </div>
                    </div>

                    {/* 2. BAŞLIK */}
                    <h3 className="text-xl font-bold text-gray-800 mb-3 leading-tight">{task.title}</h3>

                    {/* 3. AÇIKLAMA */}
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 mb-6 flex-1">
                        <p className="text-sm text-gray-600 leading-relaxed font-medium">
                            {task.desc}
                        </p>
                    </div>

                    {/* 4. KONUM & ÖNCELİK */}
                    <div className="grid grid-cols-2 gap-4 mb-2">
                        <div className="flex flex-col gap-1.5">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Location</span>
                            <div className="flex items-center gap-2 font-bold text-gray-700 text-sm">
                                <MapPin size={16} className="text-gray-400"/> {task.location}
                            </div>
                        </div>
                        <div className="flex flex-col gap-1.5">
                             <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Priority</span>
                             <div className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold border w-fit ${getPriorityStyle(task.priority)}`}>
                                {task.priority}
                             </div>
                        </div>
                    </div>

                    {/* 5. BUTON (GÜNCELLENDİ: mt-auto ve pt-6 eklendi) */}
                    <div className="mt-auto pt-6 border-t border-gray-50">
                        {task.status !== 'Completed' ? (
                            <button 
                                onClick={() => handleComplete(task.id)}
                                className="w-full py-3.5 bg-blue-600 text-white rounded-xl font-bold text-sm shadow-md hover:bg-blue-700 active:scale-95 transition-all flex items-center justify-center gap-2"
                            >
                                <CheckSquare size={18} /> Mark as Done
                            </button>
                        ) : (
                            <div className="w-full py-3.5 bg-green-50 text-green-600 border border-green-100 rounded-xl font-bold text-sm flex items-center justify-center gap-2 cursor-default">
                                <Check size={18} /> Task Completed
                            </div>
                        )}
                    </div>

                </div>
            ))
        )}
      </div>

    </div>
  );
};

export default MyTasks;