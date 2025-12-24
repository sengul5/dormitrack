import React, { useState } from 'react';
import { X, User, CheckCircle } from 'lucide-react';

const AssignStaffModal = ({ isOpen, onClose, onAssign, taskTitle }) => {
  if (!isOpen) return null;

  const [selectedStaff, setSelectedStaff] = useState(null);

  // MOCK STAFF DATA
  const staffList = [
    { id: 1, name: 'Carl Max', role: 'Cleaner', status: 'Available' },
    { id: 2, name: 'Beyza Beyaz', role: 'IT Support', status: 'Available' },
    { id: 3, name: 'George Stalge', role: 'Maintenance', status: 'Busy' },
    { id: 4, name: 'Mustafa Dönmez', role: 'Security', status: 'Available' },
  ];

  const handleConfirm = () => {
    if (selectedStaff) {
      onAssign(selectedStaff);
      onClose();
      setSelectedStaff(null);
    }
  };

  return (
    <div className="absolute inset-0 z-[60] flex items-center justify-center bg-black/20 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-gray-100 animate-in zoom-in-95 flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <div>
             <h3 className="font-bold text-gray-800">Assign Staff</h3>
             <p className="text-xs text-gray-500 truncate max-w-[250px]">For: {taskTitle}</p>
          </div>
          <button onClick={onClose}><X size={20} className="text-gray-400 hover:text-gray-600"/></button>
        </div>

        {/* Staff List */}
        <div className="p-4 overflow-y-auto max-h-[300px] space-y-2">
           {staffList.map((staff) => (
             <button
                key={staff.id}
                onClick={() => setSelectedStaff(staff)}
                className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all ${
                    selectedStaff?.id === staff.id 
                    ? 'border-blue-600 bg-blue-50 ring-1 ring-blue-200' 
                    : 'border-gray-100 hover:bg-gray-50 hover:border-gray-200'
                }`}
             >
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-bold">
                        {staff.name.charAt(0)}
                    </div>
                    <div className="text-left">
                        <p className="font-bold text-gray-700 text-sm">{staff.name}</p>
                        <p className="text-xs text-gray-400">{staff.role}</p>
                    </div>
                </div>
                {selectedStaff?.id === staff.id && <CheckCircle className="text-blue-600" size={20} />}
             </button>
           ))}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 flex justify-end gap-2 bg-gray-50">
            <button onClick={onClose} className="px-4 py-2 text-gray-500 font-bold text-sm hover:bg-gray-200 rounded-lg">Cancel</button>
            <button 
                onClick={handleConfirm}
                disabled={!selectedStaff}
                className="px-6 py-2 bg-blue-600 text-white font-bold text-sm rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-200"
            >
                Confirm Assignment
            </button>
        </div>

      </div>
    </div>
  );
};

export default AssignStaffModal;