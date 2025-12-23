import React from 'react';
import { Users, UserCheck, Briefcase } from 'lucide-react';

const StatsRow = () => {
  const stats = [
    { 
      label: 'Total Students', 
      value: '842', 
      icon: Users, 
      color: 'bg-blue-100 text-blue-600' 
    },
    { 
      label: 'Total Manager', 
      value: '14', 
      icon: UserCheck, 
      color: 'bg-red-100 text-red-600' 
    },
    { 
      label: 'Total Staff', 
      value: '62', 
      icon: Briefcase, 
      color: 'bg-yellow-100 text-yellow-600' 
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      {/* İstatistik Kartları */}
      {stats.map((stat, index) => (
        <div key={index} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className={`p-3 rounded-full ${stat.color}`}>
            <stat.icon size={24} />
          </div>
          <div>
            <p className="text-gray-500 text-sm font-medium">{stat.label}</p>
            <h3 className="text-2xl font-bold text-gray-800">{stat.value}</h3>
          </div>
        </div>
      ))}

      {/* Sağdaki Özel Tarih Kartı (Tasarımda var) */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center items-center text-center">
        <p className="text-gray-500 text-sm font-semibold">2025 - 2026</p>
        <p className="text-gray-800 font-bold">Fall Academic Term</p>
      </div>
    </div>
  );
};

export default StatsRow;