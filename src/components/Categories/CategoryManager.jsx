import React, { useState } from 'react';
import { 
  Wifi, Droplets, Zap, PenTool, Trash2, Plus, X, 
  Volume2, ShieldAlert, AlertTriangle, Layers, Edit2,
  Bed, Key, Thermometer, Hammer, Fan, Lock, Music, Settings, Check
} from 'lucide-react';

// İKON KÜTÜPHANESİ
const ICON_LIBRARY = [
  { id: 'wifi', component: Wifi, label: 'Wifi' },
  { id: 'water', component: Droplets, label: 'Plumbing' },
  { id: 'electric', component: Zap, label: 'Electric' },
  { id: 'repair', component: PenTool, label: 'Repair' },
  { id: 'clean', component: Trash2, label: 'Cleaning' },
  { id: 'sound', component: Volume2, label: 'Noise' },
  { id: 'security', component: ShieldAlert, label: 'Security' },
  { id: 'alert', component: AlertTriangle, label: 'Danger' },
  { id: 'bed', component: Bed, label: 'Furniture' },
  { id: 'key', component: Key, label: 'Keys' },
  { id: 'heat', component: Thermometer, label: 'Heating' },
  { id: 'hammer', component: Hammer, label: 'Fix' },
  { id: 'fan', component: Fan, label: 'Air Cond.' },
  { id: 'lock', component: Lock, label: 'Lock' },
  { id: 'music', component: Music, label: 'Music' },
  { id: 'other', component: Layers, label: 'Other' },
];

const CategoryManager = () => {
  const [activeTab, setActiveTab] = useState('requests'); 
  const [showModal, setShowModal] = useState(false);
  
  // DÜZENLEME STATE'LERİ
  const [editingId, setEditingId] = useState(null); // Düzenlenen ID (null ise yeni ekleme)
  const [catName, setCatName] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('other');

  // VERİLER
  const [reqCategories, setReqCategories] = useState([
    { id: 1, name: 'Wifi & Internet', iconId: 'wifi', count: 12 },
    { id: 2, name: 'Plumbing', iconId: 'water', count: 5 },
    { id: 3, name: 'Electrical', iconId: 'electric', count: 3 },
    { id: 4, name: 'Furniture', iconId: 'bed', count: 8 },
  ]);

  const [compCategories, setCompCategories] = useState([
    { id: 101, name: 'Noise Disturbance', iconId: 'sound', count: 4 },
    { id: 102, name: 'Theft / Lost Item', iconId: 'security', count: 2 },
    { id: 103, name: 'Hygiene Issue', iconId: 'clean', count: 6 },
  ]);

  const currentList = activeTab === 'requests' ? reqCategories : compCategories;
  const setCurrentList = activeTab === 'requests' ? setReqCategories : setCompCategories;

  // --- ACTIONS ---

  const handleDelete = (id) => {
    if(window.confirm('Delete this category? Users will no longer be able to select it.')) {
        setCurrentList(currentList.filter(c => c.id !== id));
    }
  };

  // MODAL AÇ (Yeni Ekleme Modu)
  const openAddModal = () => {
    setEditingId(null); // Yeni ekleme modu
    setCatName('');
    setSelectedIcon('other');
    setShowModal(true);
  };

  // MODAL AÇ (Düzenleme Modu)
  const openEditModal = (item) => {
    setEditingId(item.id); // Düzenleme modu
    setCatName(item.name);
    setSelectedIcon(item.iconId);
    setShowModal(true);
  };

  // KAYDET / GÜNCELLE
  const handleSave = () => {
    if(!catName) return;

    if (editingId) {
        // GÜNCELLEME (Edit)
        setCurrentList(currentList.map(item => 
            item.id === editingId 
            ? { ...item, name: catName, iconId: selectedIcon } 
            : item
        ));
    } else {
        // YENİ EKLEME (Create)
        const newItem = {
            id: Date.now(),
            name: catName,
            iconId: selectedIcon,
            count: 0,
        };
        setCurrentList([...currentList, newItem]);
    }

    setShowModal(false);
    setCatName('');
    setEditingId(null);
    setSelectedIcon('other');
  };

  const getIconComponent = (id) => {
    const item = ICON_LIBRARY.find(i => i.id === id);
    const Icon = item ? item.component : Layers;
    return <Icon size={20} />;
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col h-full relative">
      
      {/* HEADER */}
      <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <Settings className="text-gray-400" size={24}/>
                System Categories
            </h2>
            <p className="text-sm text-gray-400">Define options available for student requests.</p>
        </div>
        
        <div className="flex bg-gray-50 p-1 rounded-xl border border-gray-100">
            <button 
                onClick={() => setActiveTab('requests')}
                className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${
                    activeTab === 'requests' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'
                }`}
            >
                Request Types
            </button>
            <button 
                onClick={() => setActiveTab('complaints')}
                className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${
                    activeTab === 'complaints' ? 'bg-white text-red-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'
                }`}
            >
                Complaint Types
            </button>
        </div>
      </div>

      {/* CONTENT GRID */}
      <div className="p-8 flex-1 overflow-y-auto bg-gray-50/30">
        <div className="flex justify-end mb-6">
            <button 
                onClick={openAddModal}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-white font-bold text-sm shadow-md transition-all active:scale-95 ${
                    activeTab === 'requests' ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-200' : 'bg-red-600 hover:bg-red-700 shadow-red-200'
                }`}
            >
                <Plus size={16} /> Define New Category
            </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {currentList.map((item) => (
                <div key={item.id} className="group bg-white border border-gray-100 hover:border-gray-300 p-5 rounded-2xl shadow-sm hover:shadow-md transition-all relative">
                    <div className="flex items-start justify-between">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors mb-4 ${
                            activeTab === 'requests' ? 'bg-blue-50 text-blue-600 group-hover:bg-blue-100' : 'bg-red-50 text-red-600 group-hover:bg-red-100'
                        }`}>
                            {getIconComponent(item.iconId)}
                        </div>
                        {/* EDIT & DELETE BUTONLARI */}
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                                onClick={() => openEditModal(item)}
                                className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                title="Edit"
                            >
                                <Edit2 size={16} />
                            </button>
                            <button 
                                onClick={() => handleDelete(item.id)}
                                className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Delete"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </div>
                    <h3 className="font-bold text-gray-700 text-sm">{item.name}</h3>
                    <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-50">
                        <span className="text-xs font-medium text-gray-400">{item.count} Active Items</span>
                        <span className="w-2 h-2 rounded-full bg-green-500"></span>
                    </div>
                </div>
            ))}
        </div>
      </div>

      {/* --- MODAL --- */}
      {showModal && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm p-4">
            <div className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-lg border border-gray-100 animate-in zoom-in-95 flex flex-col max-h-[90vh]">
                
                <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-50">
                    <div>
                        <h3 className="font-bold text-lg text-gray-800">
                            {editingId ? 'Edit Category' : 'New Configuration'}
                        </h3>
                        <p className="text-xs text-gray-400">
                            {editingId ? 'Update existing category details.' : 'Define a new category for users.'}
                        </p>
                    </div>
                    <button onClick={() => setShowModal(false)}><X size={20} className="text-gray-400 hover:text-gray-600"/></button>
                </div>
                
                <div className="overflow-y-auto custom-scrollbar pr-2">
                    <div className="mb-6">
                        <label className="text-xs font-bold text-gray-400 uppercase mb-2 block">Display Name</label>
                        <input 
                            type="text" 
                            placeholder="e.g. Broken Furniture" 
                            className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium"
                            value={catName}
                            onChange={(e) => setCatName(e.target.value)}
                        />
                    </div>

                    <div className="mb-2">
                        <label className="text-xs font-bold text-gray-400 uppercase mb-3 block">Assign System Icon</label>
                        
                        {/* İKON IZGARASI: Grid-cols-5 ile zorladık ve butonları kare yaptık */}
                        <div className="grid grid-cols-5 gap-3">
                            {ICON_LIBRARY.map((icon) => (
                                <button
                                    key={icon.id}
                                    onClick={() => setSelectedIcon(icon.id)}
                                    // Flex yerine direkt grid-cell mantığı ve net renkler
                                    className={`aspect-square rounded-xl flex items-center justify-center transition-all border-2 ${
                                        selectedIcon === icon.id 
                                        ? 'bg-blue-600 text-white border-blue-600 shadow-md scale-105' // SEÇİLİNCE
                                        : 'bg-white text-gray-400 border-gray-100 hover:border-blue-200 hover:bg-gray-50' // SEÇİLMEYİNCE
                                    }`}
                                >
                                    <icon.component size={24} />
                                    {/* Seçili ise ufak bir tik işareti ekleyelim ki belli olsun */}
                                    {selectedIcon === icon.id && (
                                        <div className="absolute top-1 right-1 bg-white text-blue-600 rounded-full p-0.5">
                                            <Check size={8} strokeWidth={4} />
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="pt-6 mt-auto flex gap-3">
                    <button onClick={() => setShowModal(false)} className="flex-1 py-3 text-gray-500 font-bold hover:bg-gray-50 rounded-xl transition-colors text-sm">Cancel</button>
                    <button 
                        onClick={handleSave}
                        className={`flex-1 py-3 rounded-xl font-bold text-white transition-colors text-sm shadow-lg ${
                             activeTab === 'requests' ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-200' : 'bg-red-600 hover:bg-red-700 shadow-red-200'
                        }`}
                    >
                        {editingId ? 'Update Category' : 'Save Category'}
                    </button>
                </div>

            </div>
        </div>
      )}

    </div>
  );
};

export default CategoryManager;