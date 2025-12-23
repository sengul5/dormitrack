import React from 'react';

const NewComplaints = () => {
  // SAHTE VERİ: Şikayetler (Complaints)
  const complaints = [
    { 
      id: 1, 
      photo: 'https://i.pravatar.cc/150?u=30', 
      name: 'Alice Wonderland', 
      room: '404', // ID yerine Oda No veya Kategori gösterebiliriz
      severity: 'High', 
      date: '01.11.2025', 
      desc: 'Yan odadan çok ses geliyor...' 
    },
    { 
      id: 2, 
      photo: 'https://i.pravatar.cc/150?u=31', 
      name: 'Bob Marley', 
      room: '101', 
      severity: 'Critical', 
      date: '02.11.2025', 
      desc: 'Kulaklığım çalındı, kamera...' 
    },
    { 
      id: 3, 
      photo: 'https://i.pravatar.cc/150?u=32', 
      name: 'Charlie Chaplin', 
      room: '202', 
      severity: 'Medium', 
      date: '03.11.2025', 
      desc: 'Mutfak tezgahı çok kirli...' 
    },
  ];

  // STİL: Üstteki tablo ile AYNILAŞTIRILDI (Yumuşak renkler)
  const getSeverityStyle = (severity) => {
    switch(severity) {
      case 'Critical': return 'bg-red-100 text-red-600';
      case 'High': return 'bg-orange-100 text-orange-600';
      case 'Medium': return 'bg-yellow-100 text-yellow-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mt-8">
      
      {/* BAŞLIK ALANI (Üstteki ile aynı hizada ve stilde) */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-gray-800">Recent Complaints</h3>
            <span className="text-gray-400 text-sm font-medium">({complaints.length})</span>
        </div>
      </div>

      {/* TABLO YAPISI (Grid değil, Table yapısı korundu) */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            {/* BAŞLIKLAR: Gri, küçük ve uppercase (New Requests stili) */}
            <tr className="text-gray-400 text-[11px] uppercase font-bold tracking-wider border-b border-gray-50">
              <th className="pb-4 pl-2">Photo</th>
              <th className="pb-4">Name</th>
              <th className="pb-4">Room / ID</th>
              <th className="pb-4">Severity</th>
              <th className="pb-4">Date</th>
              <th className="pb-4">Description</th>
            </tr>
          </thead>
          <tbody className="text-sm text-gray-700">
            {complaints.map((item) => (
              <tr key={item.id} className="group hover:bg-gray-50/50 transition-colors border-b border-gray-50 last:border-0">
                
                {/* 1. PHOTO */}
                <td className="py-4 pl-2">
                  <img 
                    src={item.photo} 
                    alt={item.name} 
                    className="w-10 h-10 rounded-full object-cover border border-gray-100 shadow-sm" 
                  />
                </td>

                {/* 2. NAME */}
                <td className="py-4 font-bold text-gray-800">
                  {item.name}
                </td>

                {/* 3. ROOM/ID (Gri numara stili) */}
                <td className="py-4 text-gray-500 font-medium">
                  {item.room}
                </td>

                {/* 4. SEVERITY (Hap şeklinde yumuşak badge) */}
                <td className="py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${getSeverityStyle(item.severity)}`}>
                    {item.severity}
                  </span>
                </td>

                {/* 5. DATE */}
                <td className="py-4 text-gray-500 text-xs">
                  {item.date}
                </td>

                {/* 6. DESCRIPTION (Truncate - Üç nokta ile kesme) */}
                <td className="py-4 text-gray-400 text-xs max-w-[150px] truncate">
                  {item.desc}
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* BUTTON (Üstteki ile aynı Mavi Buton) */}
      <div className="text-right mt-6">
        <a 
          href="/complaints" 
          className="inline-block bg-blue-600 text-white px-6 py-2.5 rounded-lg text-sm font-bold hover:bg-blue-700 transition shadow-blue-100 shadow-lg"
        >
          See All
        </a>
      </div>

    </div>
  );
};

export default NewComplaints;