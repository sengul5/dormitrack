import React from 'react';
import { 
  ClipboardList, CheckCircle, Clock, AlertTriangle, 
  MapPin, ArrowRight, Calendar, ShieldAlert 
} from 'lucide-react';

const StaffDashboard = () => {
  // SAHTE VERİLER
  const stats = {
    pending: 5,
    completedToday: 12,
    urgent: 2
  };

  const urgentTasks = [
    { id: 101, title: 'Leaking Pipe', room: 'Room 101', type: 'Plumbing', time: '10:30 AM' },
    { id: 302, title: 'Broken Window', room: 'Lobby', type: 'Repair', time: '09:15 AM' },
  ];

  const upcomingTasks = [
    { id: 204, title: 'Wifi Check', room: 'Room 205', priority: 'Medium', status: 'Pending' },
    { id: 205, title: 'Cleaning', room: 'Gym Area', priority: 'Low', status: 'In Progress' },
    { id: 206, title: 'Light Bulb', room: 'Corridor A', priority: 'Medium', status: 'Pending' },
  ];

  // Helper: Priority Rengi
  const getPriorityStyle = (p) => {
    switch (p) {
        case 'High': return 'bg-orange-50 text-orange-600 border-orange-100';
        case 'Medium': return 'bg-yellow-50 text-yellow-600 border-yellow-100';
        default: return 'bg-green-50 text-green-600 border-green-100';
    }
  };

  return (
    <div className="space-y-8 h-full pb-10">
      
      {/* --- 1. HERO SECTION (HOŞGELDİN) --- */}
      <div className="bg-blue-600 text-white p-8 rounded-[30px] shadow-lg shadow-blue-200 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl pointer-events-none"></div>
        
        <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-2">Hello, Staff! 👋</h2>
            <p className="text-blue-100 text-lg opacity-90">You have <span className="font-bold text-white underline decoration-orange-400 decoration-2 underline-offset-4">{stats.pending} tasks</span> pending today.</p>
        </div>

        <div className="relative z-10">
            <a href="/my-tasks" className="bg-white text-blue-600 px-6 py-3.5 rounded-xl font-bold hover:bg-blue-50 transition-colors shadow-sm flex items-center gap-2 text-sm">
                <ClipboardList size={18} /> Go to My Tasks
            </a>
        </div>
      </div>

      {/* --- 2. QUICK STATS (3 KART) --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Urgent Card */}
        <div className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm flex items-center gap-5 hover:shadow-md transition-shadow">
            <div className="w-16 h-16 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center border border-red-100">
                <ShieldAlert size={32} />
            </div>
            <div>
                <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Urgent Issues</h3>
                <p className="text-4xl font-bold text-gray-800">{stats.urgent}</p>
            </div>
        </div>

        {/* Pending Card */}
        <div className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm flex items-center gap-5 hover:shadow-md transition-shadow">
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center border border-blue-100">
                <Clock size={32} />
            </div>
            <div>
                <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Pending Tasks</h3>
                <p className="text-4xl font-bold text-gray-800">{stats.pending}</p>
            </div>
        </div>

        {/* Completed Card */}
        <div className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm flex items-center gap-5 hover:shadow-md transition-shadow">
            <div className="w-16 h-16 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center border border-green-100">
                <CheckCircle size={32} />
            </div>
            <div>
                <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Done Today</h3>
                <p className="text-4xl font-bold text-gray-800">{stats.completedToday}</p>
            </div>
        </div>
      </div>

      {/* --- 3. URGENT TASKS & UPCOMING LIST --- */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        
        {/* SOL: URGENT ATTENTION (Kırmızı Vurgulu) */}
        <div>
            <div className="flex items-center gap-2 mb-4 px-1">
                <div className="w-2 h-6 bg-red-500 rounded-full"></div>
                <h3 className="text-lg font-bold text-gray-800">Requires Attention</h3>
            </div>

            <div className="space-y-3">
                {urgentTasks.map(task => (
                    <div key={task.id} className="bg-red-50/50 p-5 rounded-2xl border border-red-100 flex items-center justify-between group hover:bg-red-50 transition-colors">
                        <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                                <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">High Priority</span>
                                <span className="text-xs text-red-400 font-mono">#{task.id}</span>
                            </div>
                            <h4 className="font-bold text-gray-800 text-lg">{task.title}</h4>
                            <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                                <span className="flex items-center gap-1"><MapPin size={14}/> {task.room}</span>
                                <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                <span className="flex items-center gap-1"><Clock size={14}/> {task.time}</span>
                            </div>
                        </div>
                        
                        <a href="/my-tasks" className="w-12 h-12 bg-white text-red-600 rounded-xl flex items-center justify-center shadow-sm border border-red-100 hover:scale-105 transition-transform">
                            <ArrowRight size={24} />
                        </a>
                    </div>
                ))}
            </div>
        </div>

        {/* SAĞ: OTHER TASKS (Normal Liste) */}
        <div>
            <div className="flex items-center gap-2 mb-4 px-1">
                <div className="w-2 h-6 bg-blue-500 rounded-full"></div>
                <h3 className="text-lg font-bold text-gray-800">Upcoming Tasks</h3>
            </div>

            <div className="space-y-3">
                {upcomingTasks.map(task => (
                    <div key={task.id} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between hover:border-blue-200 transition-colors">
                        
                        {/* TASK INFO */}
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gray-50 text-gray-500 rounded-xl flex flex-col items-center justify-center font-bold text-xs border border-gray-100">
                                <span className="text-[10px] text-gray-400 font-normal">ID</span>
                                {task.id}
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-800">{task.title}</h4>
                                <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                                    <span className="bg-gray-100 px-1.5 py-0.5 rounded text-gray-600 font-medium flex items-center gap-1">
                                        <MapPin size={10}/> {task.room}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* STATUS & PRIORITY BADGES (Fixed Width for Alignment) */}
                        <div className="flex flex-col gap-1.5">
                             <div className={`w-28 h-7 flex items-center justify-center rounded-lg text-[10px] font-bold uppercase border ${getPriorityStyle(task.priority)}`}>
                                {task.priority}
                             </div>
                             <div className="w-28 h-7 flex items-center justify-center rounded-lg text-[10px] font-bold uppercase border bg-gray-50 text-gray-500 border-gray-100">
                                {task.status}
                             </div>
                        </div>

                    </div>
                ))}
            </div>
        </div>

      </div>
    </div>
  );
};

export default StaffDashboard;