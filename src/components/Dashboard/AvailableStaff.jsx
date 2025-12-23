import React from 'react';
import { Phone, MessageSquare } from 'lucide-react';

const AvailableStaff = () => {
  const staff = [
    { id: 1, name: 'Carl Max', role: 'Cleaner', status: 'active', img: 'https://i.pravatar.cc/150?u=60' },
    { id: 2, name: 'Necder Zorluer', role: 'Cleaner', status: 'busy', img: 'https://i.pravatar.cc/150?u=61' },
    { id: 3, name: 'Beyza Beyaz', role: 'IT&Network', status: 'active', img: 'https://i.pravatar.cc/150?u=62' },
    { id: 4, name: 'Mustafa Dönmez', role: 'Security', status: 'offline', img: 'https://i.pravatar.cc/150?u=63' },
    { id: 5, name: 'George Stalge', role: 'Maintenance', status: 'active', img: 'https://i.pravatar.cc/150?u=64' },
  ];

  const getStatusColor = (status) => {
    switch(status) {
      case 'active': return 'bg-green-500 border-green-200';
      case 'busy': return 'bg-red-500 border-red-200';
      case 'offline': return 'bg-gray-400 border-gray-200';
      default: return 'bg-gray-400';
    }
  };

  // İŞLEVSELLİK FONKSİYONLARI
  const handleMessage = (name) => {
    alert(`💬 Chat window opening for: ${name}\n(Bu özellik backend ile bağlanacak)`);
  };

  const handleCall = (name) => {
    alert(`📞 Calling ${name}...\n(Arama başlatılıyor)`);
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-gray-800">Available Personals</h3>
        <span className="bg-blue-50 text-blue-600 text-xs font-bold px-3 py-1 rounded-full border border-blue-100">
          {staff.filter(s => s.status === 'active').length} Active
        </span>
      </div>

      <div className="space-y-4">
        {staff.map((person) => (
          <div key={person.id} className="flex items-center justify-between group">
            
            <div className="flex items-center gap-3">
              <div className="relative">
                <img src={person.img} alt={person.name} className="w-10 h-10 rounded-full object-cover border border-gray-100 shadow-sm" />
                <span className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white ${getStatusColor(person.status)}`}></span>
              </div>
              <div>
                <p className="text-sm font-bold text-gray-700">{person.name}</p>
                <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide">{person.role}</p>
              </div>
            </div>

            {/* BUTONLARA ONCLICK EKLENDİ */}
            <div className="flex gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
              <button 
                onClick={() => handleMessage(person.name)}
                className="p-2 bg-gray-50 hover:bg-blue-50 text-gray-400 hover:text-blue-600 rounded-full transition-colors border border-transparent hover:border-blue-100"
                title="Send Message"
              >
                <MessageSquare size={16} />
              </button>
              <button 
                onClick={() => handleCall(person.name)}
                className="p-2 bg-gray-50 hover:bg-green-50 text-gray-400 hover:text-green-600 rounded-full transition-colors border border-transparent hover:border-green-100"
                title="Call Staff"
              >
                <Phone size={16} />
              </button>
            </div>

          </div>
        ))}
      </div>
      
      <a href="/assign" className="block w-full mt-6 py-3 text-center text-sm text-blue-600 font-bold bg-blue-50/50 hover:bg-blue-50 rounded-xl transition-colors border border-blue-100/50">
        View All Staff
      </a>
    </div>
  );
};

export default AvailableStaff;