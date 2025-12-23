import React, { useState } from 'react';
import { User, Trash2, Plus, X, Edit, CheckCircle, XCircle, Clock, Save, Camera } from 'lucide-react';

const StaffManager = () => {
  // SAHTE VERİ (Fotoğraflar Eklendi)
  const [staff, setStaff] = useState([
    { id: 1, name: 'Carl Max', role: 'Cleaner', phone: '+90 533 111 2233', status: 'active', img: 'https://i.pravatar.cc/150?u=60' },
    { id: 2, name: 'Necder Zorluer', role: 'Cleaner', phone: '+90 533 222 3344', status: 'busy', img: 'https://i.pravatar.cc/150?u=61' },
    { id: 3, name: 'Beyza Beyaz', role: 'IT&Network', phone: '+90 533 444 5566', status: 'active', img: 'https://i.pravatar.cc/150?u=62' },
    { id: 4, name: 'Mustafa Dönmez', role: 'Security', phone: '+90 533 555 6677', status: 'offline', img: 'https://i.pravatar.cc/150?u=63' },
    { id: 5, name: 'George Stalge', role: 'Maintenance', phone: '+90 533 666 7788', status: 'active', img: 'https://i.pravatar.cc/150?u=64' },
  ]);

  const [isAdding, setIsAdding] = useState(false);
  const [newPerson, setNewPerson] = useState({ name: '', role: 'Cleaner', phone: '' });
  const [editingPerson, setEditingPerson] = useState(null);

  // SİLME
  const handleDelete = (id) => {
    if(window.confirm('Are you sure you want to remove this staff member?')) {
        setStaff(staff.filter(person => person.id !== id));
    }
  };

  // MODAL AÇ
  const openEditModal = (person) => {
    setEditingPerson({ ...person });
  };

  // GÜNCELLE
  const handleUpdate = () => {
    setStaff(staff.map(person => (person.id === editingPerson.id ? editingPerson : person)));
    setEditingPerson(null);
  };

  // YENİ EKLEME (Rastgele Avatar Atar)
  const handleAdd = () => {
    if (!newPerson.name) return;
    const newItem = {
        id: Date.now(),
        name: newPerson.name,
        role: newPerson.role,
        phone: newPerson.phone || 'N/A',
        status: 'offline',
        img: `https://i.pravatar.cc/150?u=${Date.now()}` // Rastgele Avatar
    };
    setStaff([newItem, ...staff]);
    setIsAdding(false);
    setNewPerson({ name: '', role: 'Cleaner', phone: '' });
  };

  const getStatusBadge = (status) => {
    switch(status) {
        case 'active': return <span className="flex items-center gap-1 bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-bold"><CheckCircle size={12}/> Active</span>;
        case 'busy': return <span className="flex items-center gap-1 bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-bold"><XCircle size={12}/> Busy</span>;
        case 'offline': return <span className="flex items-center gap-1 bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs font-bold"><Clock size={12}/> Offline</span>;
        default: return null;
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col h-full relative">
      
      {/* BAŞLIK */}
      <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/30">
        <div>
            <h2 className="text-xl font-bold text-gray-800">Staff Management</h2>
            <p className="text-sm text-gray-500">Manage your team members.</p>
        </div>
        <button onClick={() => setIsAdding(!isAdding)} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium shadow-blue-200 shadow-lg transition-colors">
            {isAdding ? <X size={18} /> : <Plus size={18} />} {isAdding ? 'Cancel' : 'Add New Staff'}
        </button>
      </div>

      {/* EKLEME FORMU */}
      {isAdding && (
        <div className="p-6 bg-blue-50 border-b border-blue-100 animate-in slide-in-from-top-2">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input type="text" placeholder="Full Name" className="p-3 rounded-xl border border-blue-200 outline-none focus:ring-2 focus:ring-blue-500" value={newPerson.name} onChange={(e) => setNewPerson({...newPerson, name: e.target.value})} />
                <input type="text" placeholder="Phone" className="p-3 rounded-xl border border-blue-200 outline-none focus:ring-2 focus:ring-blue-500" value={newPerson.phone} onChange={(e) => setNewPerson({...newPerson, phone: e.target.value})} />
                <div className="flex gap-2">
                    <select className="flex-1 p-3 rounded-xl border border-blue-200 bg-white" value={newPerson.role} onChange={(e) => setNewPerson({...newPerson, role: e.target.value})}>
                        <option>Cleaner</option><option>Security</option><option>IT&Network</option><option>Maintenance</option>
                    </select>
                    <button onClick={handleAdd} className="bg-green-600 text-white px-6 rounded-xl font-bold">Save</button>
                </div>
            </div>
        </div>
      )}

      {/* LİSTE */}
      <div className="flex-1 overflow-auto p-6">
        <table className="w-full text-left border-collapse">
            <thead>
                <tr className="text-gray-400 text-xs uppercase font-bold border-b border-gray-100">
                    <th className="pb-3 pl-2">Member</th>
                    <th className="pb-3">Role</th>
                    <th className="pb-3">Contact</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3 text-right pr-2">Actions</th>
                </tr>
            </thead>
            <tbody className="text-sm text-gray-700">
                {staff.map((person) => (
                    <tr key={person.id} className="group hover:bg-blue-50/50 transition-colors border-b border-gray-50 last:border-0">
                        <td className="py-3 pl-2 font-semibold flex items-center gap-3">
                            {/* FOTOĞRAF ALANI */}
                            <img src={person.img} alt={person.name} className="w-10 h-10 rounded-full object-cover border border-gray-200 shadow-sm" />
                            {person.name}
                        </td>
                        <td className="py-3"><span className="bg-white border border-gray-200 px-2 py-1 rounded text-xs font-semibold text-gray-600">{person.role}</span></td>
                        <td className="py-3 text-gray-500 font-mono text-xs">{person.phone}</td>
                        <td className="py-3">{getStatusBadge(person.status)}</td>
                        <td className="py-3 text-right pr-2">
                            <div className="flex items-center justify-end gap-2 opacity-100">
                                <button onClick={() => openEditModal(person)} className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg"><Edit size={16} /></button>
                                <button onClick={() => handleDelete(person.id)} className="p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg"><Trash2 size={16} /></button>
                            </div>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
      </div>

      {/* EDIT MODAL */}
      {editingPerson && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm rounded-2xl">
            <div className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-md animate-in zoom-in-95">
                <div className="flex justify-between items-center mb-6"><h3 className="font-bold">Edit Staff</h3><button onClick={() => setEditingPerson(null)}><X size={20}/></button></div>
                <div className="space-y-4">
                    <div className="flex justify-center mb-4">
                        <img src={editingPerson.img} className="w-20 h-20 rounded-full border-4 border-blue-50" />
                    </div>
                    <div><label className="text-xs font-bold text-gray-500">Name</label><input type="text" className="w-full mt-1 p-3 border rounded-xl" value={editingPerson.name} onChange={(e) => setEditingPerson({...editingPerson, name: e.target.value})} /></div>
                    <div><label className="text-xs font-bold text-gray-500">Role</label><select className="w-full mt-1 p-3 border rounded-xl bg-white" value={editingPerson.role} onChange={(e) => setEditingPerson({...editingPerson, role: e.target.value})}><option>Cleaner</option><option>Security</option><option>IT&Network</option><option>Maintenance</option></select></div>
                    <div><label className="text-xs font-bold text-gray-500">Phone</label><input type="text" className="w-full mt-1 p-3 border rounded-xl" value={editingPerson.phone} onChange={(e) => setEditingPerson({...editingPerson, phone: e.target.value})} /></div>
                </div>
                <div className="mt-6 flex gap-3"><button onClick={() => setEditingPerson(null)} className="flex-1 py-3 font-bold text-gray-500">Cancel</button><button onClick={handleUpdate} className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-xl">Save</button></div>
            </div>
        </div>
      )}
    </div>
  );
};

export default StaffManager;