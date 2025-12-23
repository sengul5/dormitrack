import React from 'react';

const NewRequests = () => {
  // SAHTE VERİ (Backend bağlanınca burası değişecek)
  const requests = [
    { id: 1, name: 'Ömer Faruk Sağdıç', studentId: '22000304', priority: 'High', date: '01.11.2025', desc: 'Klima su akıtıyor...', avatar: 'https://i.pravatar.cc/150?u=1' },
    { id: 2, name: 'Abiju Ouwealla', studentId: '238172912', priority: 'Medium', date: '01.11.2025', desc: 'İnternet çok yavaş...', avatar: 'https://i.pravatar.cc/150?u=2' },
    { id: 3, name: 'Donald Trump', studentId: '22000304', priority: 'Low', date: '01.11.2025', desc: 'Lamba yanmıyor...', avatar: 'https://i.pravatar.cc/150?u=3' },
  ];

  // Renk ayarlayıcı fonksiyon
  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'High': return 'bg-red-100 text-red-600';
      case 'Medium': return 'bg-yellow-100 text-yellow-600';
      case 'Low': return 'bg-green-100 text-green-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-gray-800">New Requests <span className="text-gray-400 text-sm font-normal">(16)</span></h3>
        
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-separate border-spacing-y-4">
          <thead>
            <tr className="text-gray-400 text-xs uppercase">
              <th className="pb-2 pl-2">Photo</th>
              <th className="pb-2">Name</th>
              <th className="pb-2">ID Number</th>
              <th className="pb-2">Priority</th>
              <th className="pb-2">Date</th>
              <th className="pb-2">Description</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((req) => (
              <tr key={req.id} className="bg-white hover:bg-gray-50 transition-colors">
                <td className="p-2">
                  <img src={req.avatar} alt={req.name} className="w-10 h-10 rounded-full bg-gray-200 object-cover" />
                </td>
                <td className="p-2 font-medium text-gray-700 text-sm">
                  {req.name}
                </td>
                <td className="p-2 text-gray-500 text-sm">{req.studentId}</td>
                <td className="p-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${getPriorityColor(req.priority)}`}>
                    {req.priority}
                  </span>
                </td>
                <td className="p-2 text-gray-500 text-xs">{req.date}</td>
                <td className="p-2 text-gray-400 text-xs truncate max-w-[150px]">{req.desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>


<div className="text-right mt-4">
  {/* button yerine a etiketi kullandık ve href verdik */}
  <a 
    href="/requests" 
    className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
  >
    See All
  </a>
</div>
    </div>
  );
};

export default NewRequests;