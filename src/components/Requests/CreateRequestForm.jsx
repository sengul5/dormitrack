import React, { useState } from 'react';
import { 
  Wifi, Droplets, Zap, Bed, Thermometer, UploadCloud, 
  CheckCircle, ArrowRight, AlertTriangle 
} from 'lucide-react';

const CreateRequestForm = () => {
  const [submitted, setSubmitted] = useState(false);
  
  // FORM STATE
  const [category, setCategory] = useState('');
  const [priority, setPriority] = useState('Low');
  const [desc, setDesc] = useState('');
  const [file, setFile] = useState(null);

  // KATEGORİ SEÇENEKLERİ
  const categories = [
    { id: 'wifi', name: 'Wifi / Network', icon: Wifi },
    { id: 'plumbing', name: 'Plumbing', icon: Droplets },
    { id: 'electric', name: 'Electrical', icon: Zap },
    { id: 'furniture', name: 'Furniture', icon: Bed },
    { id: 'heating', name: 'Heating / AC', icon: Thermometer },
    { id: 'other', name: 'Other Issue', icon: AlertTriangle },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!category || !desc) {
        alert('Please select a category and enter a description.');
        return;
    }
    // Backend olmadığı için başarılıymış gibi yapıyoruz
    setSubmitted(true);
  };

  if (submitted) {
    return (
        <div className="bg-white rounded-[30px] p-12 text-center shadow-sm border border-gray-100 h-[600px] flex flex-col items-center justify-center animate-in zoom-in-95">
            <div className="w-24 h-24 bg-green-50 text-green-600 rounded-full flex items-center justify-center mb-6">
                <CheckCircle size={48} />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Request Submitted!</h2>
            <p className="text-gray-500 max-w-md mx-auto mb-8">
                Your request has been sent to the facility management team. You can track its status in the "My Requests" tab.
            </p>
            <div className="flex gap-4">
                <a href="/" className="px-6 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors">
                    Go to Dashboard
                </a>
                <a href="/my-requests" className="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200">
                    Track Status
                </a>
            </div>
        </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full">
      
      {/* SOL TARA: KATEGORİ SEÇİMİ */}
      <div className="lg:col-span-2 bg-white rounded-[30px] p-8 shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            1. What is the issue about?
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {categories.map((cat) => (
                <button
                    key={cat.id}
                    onClick={() => setCategory(cat.name)}
                    className={`flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all gap-3 h-40 ${
                        category === cat.name 
                        ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-md transform scale-105' 
                        : 'border-gray-100 bg-white text-gray-500 hover:border-blue-200 hover:bg-gray-50'
                    }`}
                >
                    <cat.icon size={32} strokeWidth={1.5} />
                    <span className="font-bold text-sm">{cat.name}</span>
                    {category === cat.name && <div className="absolute top-3 right-3 text-blue-600"><CheckCircle size={16}/></div>}
                </button>
            ))}
        </div>

        <div className="mt-8">
             <h2 className="text-xl font-bold text-gray-800 mb-4">2. Problem Description</h2>
             <textarea 
                className="w-full h-40 p-4 rounded-2xl bg-gray-50 border border-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:bg-white transition-all resize-none text-gray-700 font-medium"
                placeholder="Please describe the issue in detail. Example: 'The sink in Room 101 is leaking water...'"
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
             ></textarea>
        </div>
      </div>

      {/* SAĞ TARAF: DETAYLAR VE GÖNDER */}
      <div className="flex flex-col gap-6">
        
        {/* ÖNCELİK (PRIORITY) */}
        <div className="bg-white rounded-[30px] p-8 shadow-sm border border-gray-100">
             <h2 className="text-lg font-bold text-gray-800 mb-4">Urgency Level</h2>
             <div className="space-y-3">
                {['Low', 'Medium', 'High'].map((level) => (
                    <button 
                        key={level}
                        onClick={() => setPriority(level)}
                        className={`w-full text-left px-5 py-3 rounded-xl border transition-all font-bold text-sm flex justify-between items-center ${
                            priority === level 
                            ? (level === 'High' ? 'bg-red-50 border-red-200 text-red-600' : level === 'Medium' ? 'bg-yellow-50 border-yellow-200 text-yellow-600' : 'bg-green-50 border-green-200 text-green-600')
                            : 'bg-white border-gray-100 text-gray-500 hover:bg-gray-50'
                        }`}
                    >
                        {level} Priority
                        {priority === level && <div className={`w-3 h-3 rounded-full ${level === 'High' ? 'bg-red-500' : level === 'Medium' ? 'bg-yellow-500' : 'bg-green-500'}`}></div>}
                    </button>
                ))}
             </div>
        </div>

        {/* FOTOĞRAF YÜKLEME */}
        <div className="bg-white rounded-[30px] p-8 shadow-sm border border-gray-100 flex-1">
             <h2 className="text-lg font-bold text-gray-800 mb-4">Add Photo (Optional)</h2>
             <label className="border-2 border-dashed border-gray-200 rounded-2xl h-32 flex flex-col items-center justify-center text-gray-400 cursor-pointer hover:border-blue-300 hover:bg-blue-50 transition-colors">
                <input type="file" className="hidden" onChange={(e) => setFile(e.target.files[0])} />
                <UploadCloud size={24} className="mb-2"/>
                <span className="text-xs font-bold">{file ? file.name : 'Click to upload'}</span>
             </label>

             <button 
                onClick={handleSubmit}
                className="w-full mt-6 bg-blue-600 text-white py-4 rounded-xl font-bold text-lg shadow-xl shadow-blue-200 hover:bg-blue-700 transition-transform active:scale-95 flex items-center justify-center gap-2"
             >
                Submit Request <ArrowRight size={20}/>
             </button>
        </div>

      </div>

    </div>
  );
};

export default CreateRequestForm;