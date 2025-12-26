import React, { useState, useEffect } from 'react';
import { X, CheckCircle, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const AssignStaffModal = ({ isOpen, onClose, onAssign, taskTitle }) => {
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [staffList, setStaffList] = useState([]); // State for backend data
  const [loading, setLoading] = useState(false);

  // BACKEND'DEN PERSONEL ÇEK
  useEffect(() => {
    if (isOpen) {
      const fetchStaff = async () => {
        setLoading(true);
        try {
          const res = await fetch('/api/staff'); // Personel API endpoint'iniz
          if (!res.ok) throw new Error('Staff could not be loaded');
          const data = await res.json();
          setStaffList(data);
        } catch (error) {
          toast.error("Failed to load staff list");
        } finally {
          setLoading(false);
        }
      };
      fetchStaff();
    }
  }, [isOpen]);

  const handleConfirm = () => {
    if (selectedStaff) {
      onAssign(selectedStaff);
      // Not: onClose() burada çağrılabilir ama ComplaintsTable'daki 
      // handleAssignStaff içindeki fetch işlemi bittikten sonra kapatmak daha sağlıklıdır.
    }
  };

  if (!isOpen) return null;

  return (
    // fixed ve z-index artırıldı (diğer modalın üstünde kalması için)
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden">
        
        <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <div>
             <h3 className="font-bold text-gray-800 text-lg">Assign Staff</h3>
             <p className="text-xs text-gray-500 truncate max-w-[250px]">Task: {taskTitle}</p>
          </div>
          <button onClick={onClose}><X size={20} className="text-gray-400 hover:text-gray-600"/></button>
        </div>

        <div className="p-4 overflow-y-auto max-h-[400px] space-y-2">
           {loading ? (
             <div className="flex flex-col items-center justify-center py-10 text-gray-400">
                <Loader2 className="animate-spin mb-2" />
                <p className="text-sm">Loading staff members...</p>
             </div>
           ) : staffList.length === 0 ? (
             <p className="text-center py-10 text-gray-500">No staff found.</p>
           ) : (
             staffList.map((staff) => (
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
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                          {staff.name.charAt(0)}
                      </div>
                      <div className="text-left">
                          <p className="font-bold text-gray-700 text-sm">{staff.name}</p>
                          <p className="text-xs text-gray-400">{staff.role}</p>
                      </div>
                  </div>
                  {selectedStaff?.id === staff.id && <CheckCircle className="text-blue-600" size={20} />}
               </button>
             ))
           )}
        </div>

        <div className="p-4 border-t border-gray-100 flex justify-end gap-2 bg-gray-50">
            <button onClick={onClose} className="px-4 py-2 text-gray-500 font-bold text-sm hover:bg-gray-200 rounded-lg">Cancel</button>
            <button 
                onClick={handleConfirm}
                disabled={!selectedStaff || loading}
                className="px-6 py-2 bg-blue-600 text-white font-bold text-sm rounded-lg hover:bg-blue-700 disabled:opacity-50 shadow-lg shadow-blue-200"
            >
                Confirm Assignment
            </button>
        </div>
      </div>
    </div>
  );
};

export default AssignStaffModal;