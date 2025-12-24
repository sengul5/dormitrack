import React from 'react';
import { 
  FileText, Megaphone, Plus, ArrowRight, 
  Clock, CheckCircle, AlertCircle 
} from 'lucide-react';

const StudentDashboard = () => {
  // SAHTE VERİLER
  const stats = {
    activeRequests: 2,
    openComplaints: 1,
  };

  const recentRequests = [
    { id: 101, title: 'Wifi Connection Issue', date: 'Today, 10:30 AM', status: 'In Progress' },
    { id: 105, title: 'Broken Chair', date: '12.10.2025', status: 'Completed' },
    { id: 106, title: 'Leaking Tap', date: '10.10.2025', status: 'Pending' },
  ];

  const recentComplaints = [
    { id: 302, title: 'Noise from Room 404', date: 'Yesterday', status: 'Pending' },
    { id: 301, title: 'Gym Equipment Issue', date: '01.11.2025', status: 'Resolved' },
  ];

  // Helper: Status Rengi
  const getStatusStyle = (status) => {
    switch (status) {
        case 'Completed': 
        case 'Resolved':
            return 'bg-green-50 text-green-600 border-green-100';
        case 'In Progress': return 'bg-blue-50 text-blue-600 border-blue-100';
        case 'Pending': return 'bg-orange-50 text-orange-600 border-orange-100';
        default: return 'bg-gray-50 text-gray-600';
    }
  };

  // Helper: Status İkonu
  const getStatusIcon = (status) => {
    if (status === 'Completed' || status === 'Resolved') return <CheckCircle size={14} />;
    if (status === 'In Progress') return <Clock size={14} />;
    return <AlertCircle size={14} />;
  };

  return (
    <div className="space-y-8 h-full pb-10">
      
      {/* --- 1. HERO SECTION --- */}
      <div className="bg-blue-600 text-white p-8 rounded-[30px] shadow-lg shadow-blue-200 relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl pointer-events-none"></div>
        
        <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-2">Welcome, Student! 👋</h2>
            <p className="text-blue-100 text-lg opacity-90">Everything looks good in Room 101. Have a nice day!</p>
        </div>

        <div className="relative z-10 flex gap-3">
            <a href="/new-request" className="bg-white text-blue-600 px-6 py-3.5 rounded-xl font-bold hover:bg-blue-50 transition-colors shadow-sm flex items-center gap-2 text-sm">
                <Plus size={18} /> New Request
            </a>
            <a href="/new-complaint" className="bg-blue-700/40 text-white border border-blue-400/30 px-6 py-3.5 rounded-xl font-bold hover:bg-blue-700/60 transition-colors flex items-center gap-2 text-sm backdrop-blur-sm">
                <Megaphone size={18} /> New Complaint
            </a>
        </div>
      </div>

      {/* --- 2. STATS CARDS --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Active Requests */}
        <div className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow cursor-default">
            <div className="flex items-center gap-5">
                <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                    <FileText size={32} />
                </div>
                <div>
                    <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Active Requests</h3>
                    <p className="text-4xl font-bold text-gray-800">{stats.activeRequests}</p>
                </div>
            </div>
            <a href="/my-requests" className="w-10 h-10 rounded-full bg-gray-50 text-gray-400 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all">
                <ArrowRight size={20} />
            </a>
        </div>

        {/* Open Complaints */}
        <div className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow cursor-default">
            <div className="flex items-center gap-5">
                <div className="w-16 h-16 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center">
                    <Megaphone size={32} />
                </div>
                <div>
                    <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Open Complaints</h3>
                    <p className="text-4xl font-bold text-gray-800">{stats.openComplaints}</p>
                </div>
            </div>
            <a href="/my-complaints" className="w-10 h-10 rounded-full bg-gray-50 text-gray-400 flex items-center justify-center hover:bg-red-600 hover:text-white transition-all">
                <ArrowRight size={20} />
            </a>
        </div>
      </div>

      {/* --- 3. RECENT ACTIVITIES (FIXED WIDTH BADGES) --- */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        
        {/* RECENT REQUESTS */}
        <div>
            <div className="flex justify-between items-center mb-4 px-1">
                <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                    <FileText className="text-blue-600" size={20}/> Recent Requests
                </h3>
                <a href="/my-requests" className="text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors">View All</a>
            </div>
            
            <div className="space-y-3">
                {recentRequests.map(item => (
                    <div key={item.id} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between hover:border-blue-100 transition-colors group">
                        
                        {/* LEFT: INFO */}
                        <div className="flex items-center gap-4">
                             <div className="hidden sm:flex w-12 h-12 bg-blue-50 text-blue-600 rounded-xl items-center justify-center font-bold text-xs group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                #{item.id}
                             </div>
                             <div>
                                 <h4 className="font-bold text-gray-800 text-sm md:text-base">{item.title}</h4>
                                 <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
                                    <span className="sm:hidden font-bold text-blue-500">#{item.id}</span>
                                    <span className="hidden sm:block">•</span>
                                    <span className="flex items-center gap-1"><Clock size={12}/> {item.date}</span>
                                 </div>
                             </div>
                        </div>
                        
                        {/* RIGHT: STATUS BADGE (FIXED WIDTH) */}
                        <div className={`w-32 h-10 flex items-center justify-center gap-2 rounded-xl text-xs font-bold border ${getStatusStyle(item.status)}`}>
                            {getStatusIcon(item.status)} 
                            <span>{item.status}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* RECENT COMPLAINTS */}
        <div>
            <div className="flex justify-between items-center mb-4 px-1">
                <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                    <Megaphone className="text-red-600" size={20}/> Recent Complaints
                </h3>
                <a href="/my-complaints" className="text-sm font-bold text-red-600 hover:text-red-700 transition-colors">View All</a>
            </div>
            
            <div className="space-y-3">
                {recentComplaints.map(item => (
                    <div key={item.id} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between hover:border-red-100 transition-colors group">
                        
                        {/* LEFT: INFO */}
                        <div className="flex items-center gap-4">
                             <div className="hidden sm:flex w-12 h-12 bg-red-50 text-red-600 rounded-xl items-center justify-center font-bold text-xs group-hover:bg-red-600 group-hover:text-white transition-colors">
                                #{item.id}
                             </div>
                             <div>
                                 <h4 className="font-bold text-gray-800 text-sm md:text-base">{item.title}</h4>
                                 <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
                                    <span className="sm:hidden font-bold text-red-500">#{item.id}</span>
                                    <span className="hidden sm:block">•</span>
                                    <span className="flex items-center gap-1"><Clock size={12}/> {item.date}</span>
                                 </div>
                             </div>
                        </div>
                        
                        {/* RIGHT: STATUS BADGE (FIXED WIDTH) */}
                        <div className={`w-32 h-10 flex items-center justify-center gap-2 rounded-xl text-xs font-bold border ${getStatusStyle(item.status)}`}>
                            {getStatusIcon(item.status)} 
                            <span>{item.status}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>

      </div>

    </div>
  );
};

export default StudentDashboard;