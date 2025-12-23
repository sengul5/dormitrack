import React from 'react';

const UrgentRequests = () => {
  const urgents = [
    { name: 'John Walker', category: 'Wifi/Network', level: 'High', room: '101' },
    { name: 'Mustafa Genç', category: 'Plumbing', level: 'High', room: '204' },
    { name: 'Niran Öz', category: 'Light Broken', level: 'High', room: '305' },
    { name: 'Şeyma Yangın', category: 'Cleaning', level: 'Medium', room: '102' },
    { name: 'Kerem Yıldız', category: 'Furniture', level: 'Medium', room: '401' },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 h-full flex flex-col overflow-hidden">
      {/* Başlık Alanı */}
      <div className="bg-red-50 p-4 border-b border-red-100 flex justify-between items-center">
        <h3 className="text-red-600 font-bold text-sm uppercase tracking-wide flex items-center gap-2">
          🚨 Urgent Requests
        </h3>
        <span className="bg-white text-red-600 text-xs font-bold px-2 py-1 rounded-md shadow-sm">
          {urgents.length} Pending
        </span>
      </div>
      
      {/* Liste Alanı */}
      <div className="flex-1 overflow-y-auto p-0">
        {urgents.map((item, index) => (
          <div key={index} className="p-4 border-b border-gray-50 hover:bg-red-50/30 transition-colors flex justify-between items-center group">
            <div>
              <div className="flex items-center gap-2 mb-1">
                 <span className="font-bold text-gray-800 text-sm">{item.name}</span>
                 <span className="text-xs text-gray-400 font-medium">Room {item.room}</span>
              </div>
              <div className="text-xs text-gray-500">
                {item.category}
              </div>
            </div>
            
            <div className="flex flex-col items-end">
               <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded text-white ${item.level === 'High' ? 'bg-red-500 shadow-red-200 shadow-sm' : 'bg-yellow-400'}`}>
                  {item.level}
               </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UrgentRequests;