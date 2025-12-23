import React, { useState } from 'react';
import { User, Trash2, Plus, X, Filter } from 'lucide-react';

const PersonalList = () => {
  // 1. STATE: Personel verilerini burada tutuyoruz (Backend gelince burası API olacak)
  const [staff, setStaff] = useState([
    { id: 1, name: 'Carl Max', role: 'Cleaner', status: 'active' },
    { id: 2, name: 'Necder Zorluer', role: 'Cleaner', status: 'active' },
    { id: 3, name: 'Necip Uysal', role: 'Cleaner', status: 'busy' },
    { id: 4, name: 'Ayhan Kunterci', role: 'Cleaner', status: 'active' },
    { id: 5, name: 'Beyza Beyaz', role: 'IT&Network', status: 'offline' },
    { id: 6, name: 'Mustafa Dönmez', role: 'Security', status: 'active' },
  ]);

  const [isAdding, setIsAdding] = useState(false);
  const [newPerson, setNewPerson] = useState({ name: '', role: 'Cleaner' });
  const [filterRole, setFilterRole] = useState('All'); // Filtreleme için

  // FONKSİYON 1: Personel Silme
  const handleDelete = (id) => {
    // Gerçek hayatta burada backend'e "DELETE" isteği atılır
    if(window.confirm('Bu personeli silmek istediğine emin misin?')) {
        setStaff(staff.filter(person => person.id !== id));
    }
  };

  // FONKSİYON 2: Yeni Personel Ekleme
  const handleAdd = () => {
    if (!newPerson.name) return;
    
    // Yeni bir obje oluşturup listeye ekliyoruz
    const newItem = {
        id: Date.now(), // Rastgele benzersiz ID
        name: newPerson.name,
        role: newPerson.role,
        status: 'active'
    };
    
    setStaff([newItem, ...staff]); // Listeyi güncelle
    setIsAdding(false); // Formu kapat
    setNewPerson({ name: '', role: 'Cleaner' }); // Formu temizle
  };

  // Listeyi Filtrele
  const filteredStaff = filterRole === 'All' 
    ? staff 
    : staff.filter(person => person.role === filterRole);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 h-full flex flex-col">
      
      {/* ÜST BAŞLIK ve BUTONLAR */}
      <div className="p-5 border-b border-gray-100 space-y-3">
        <div className="flex justify-between items-center">
            <h3 className="font-bold text-gray-800">Staff List ({staff.length})</h3>
            <button 
                onClick={() => setIsAdding(!isAdding)}
                className={`p-2 rounded-lg transition-colors ${isAdding ? 'bg-red-100 text-red-600' : 'bg-blue-600 text-white'}`}
            >
                {isAdding ? <X size={18} /> : <Plus size={18} />}
            </button>
        </div>

        {/* Filtreleme Butonları (Opsiyonel ama şık durur) */}
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
            {['All', 'Cleaner', 'Security', 'IT&Network'].map(role => (
                <button 
                    key={role}
                    onClick={() => setFilterRole(role)}
                    className={`text-xs px-3 py-1 rounded-full border whitespace-nowrap ${
                        filterRole === role 
                        ? 'bg-blue-50 border-blue-200 text-blue-700 font-bold' 
                        : 'border-gray-100 text-gray-500 hover:bg-gray-50'
                    }`}
                >
                    {role}
                </button>
            ))}
        </div>
      </div>

      {/* EKLEME FORMU (Sadece butona basınca açılır) */}
      {isAdding && (
        <div className="p-4 bg-blue-50/50 border-b border-blue-100 animate-in slide-in-from-top-2">
            <div className="space-y-3">
                <input 
                    type="text" 
                    placeholder="Name & Surname" 
                    className="w-full p-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                    value={newPerson.name}
                    onChange={(e) => setNewPerson({...newPerson, name: e.target.value})}
                />
                <div className="flex gap-2">
                    <select 
                        className="flex-1 p-2 text-sm border border-gray-200 rounded-lg"
                        value={newPerson.role}
                        onChange={(e) => setNewPerson({...newPerson, role: e.target.value})}
                    >
                        <option>Cleaner</option>
                        <option>Security</option>
                        <option>IT&Network</option>
                        <option>Maintenance</option>
                    </select>
                    <button onClick={handleAdd} className="bg-blue-600 text-white px-4 rounded-lg text-sm font-bold">Add</button>
                </div>
            </div>
        </div>
      )}
      
      {/* LİSTE ALANI */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
        {filteredStaff.map((person) => (
          <div key={person.id} className="group flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-all border border-transparent hover:border-gray-100">
            
            <div className="flex items-center gap-3">
               <div className={`p-2 rounded-full ${person.status === 'active' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                  <User size={16} />
               </div>
               <div>
                   <p className="font-semibold text-gray-800 text-sm">{person.name}</p>
                   <p className="text-[10px] uppercase font-bold text-gray-400">{person.role}</p>
               </div>
            </div>

            {/* Silme Butonu (Sadece üzerine gelince görünür) */}
            <button 
                onClick={() => handleDelete(person.id)}
                className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-2"
                title="Remove Staff"
            >
                <Trash2 size={16} />
            </button>
          </div>
        ))}

        {filteredStaff.length === 0 && (
            <div className="text-center text-gray-400 text-sm py-10">
                No staff found.
            </div>
        )}
      </div>
    </div>
  );
};

export default PersonalList;