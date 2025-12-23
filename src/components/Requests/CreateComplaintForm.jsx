import React, { useState } from 'react';
import { 
  VolumeX, ShieldAlert, Trash2, Ban, AlertTriangle, UploadCloud, 
  CheckCircle, ArrowRight 
} from 'lucide-react';

const CreateComplaintForm = () => {
  const [submitted, setSubmitted] = useState(false);
  const [category, setCategory] = useState('');
  const [priority, setPriority] = useState('Low');
  const [desc, setDesc] = useState('');
  const [file, setFile] = useState(null);

  const categories = [
    { id: 'noise', name: 'Noise', icon: VolumeX },
    { id: 'hygiene', name: 'Hygiene', icon: Trash2 },
    { id: 'security', name: 'Security', icon: ShieldAlert },
    { id: 'rule', name: 'Rule Violation', icon: Ban },
    { id: 'other', name: 'Other Issue', icon: AlertTriangle },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
        <div className="bg-white rounded-[30px] p-12 text-center shadow-sm border border-gray-100 h-[600px] flex flex-col items-center justify-center animate-in zoom-in-95">
            <div className="w-24 h-24 bg-red-50 text-red-600 rounded-full flex items-center justify-center mb-6">
                <CheckCircle size={48} />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Complaint Submitted</h2>
            <p className="text-gray-500 max-w-md mx-auto mb-8">
                Your report has been received confidentially. We will investigate the issue shortly.
            </p>
            <div className="flex gap-4">
                <a href="/" className="px-6 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors">Dashboard</a>
                <a href="/my-complaints" className="px-6 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-colors shadow-lg shadow-red-200">Track Status</a>
            </div>
        </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full">
      {/* SOL: KATEGORİ */}
      <div className="lg:col-span-2 bg-white rounded-[30px] p-8 shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold text-gray-800 mb-6">1. What is the issue?</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {categories.map((cat) => (
                <button
                    key={cat.id}
                    onClick={() => setCategory(cat.name)}
                    className={`flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all gap-3 h-40 ${
                        category === cat.name 
                        ? 'border-red-600 bg-red-50 text-red-700 shadow-md transform scale-105' 
                        : 'border-gray-100 bg-white text-gray-500 hover:border-red-200 hover:bg-red-50'
                    }`}
                >
                    <cat.icon size={32} strokeWidth={1.5} />
                    <span className="font-bold text-sm">{cat.name}</span>
                </button>
            ))}
        </div>
        <div className="mt-8">
             <h2 className="text-xl font-bold text-gray-800 mb-4">2. Incident Details</h2>
             <textarea 
                className="w-full h-40 p-4 rounded-2xl bg-gray-50 border border-gray-100 focus:outline-none focus:ring-2 focus:ring-red-100 focus:bg-white transition-all resize-none text-gray-700 font-medium"
                placeholder="Describe what happened, where, and when..."
                onChange={(e) => setDesc(e.target.value)}
             ></textarea>
        </div>
      </div>

      {/* SAĞ: ÖNCELİK VE GÖNDER */}
      <div className="flex flex-col gap-6">
        <div className="bg-white rounded-[30px] p-8 shadow-sm border border-gray-100">
             <h2 className="text-lg font-bold text-gray-800 mb-4">Severity</h2>
             <div className="space-y-3">
                {['Low', 'Medium', 'High', 'Critical'].map((level) => (
                    <button 
                        key={level}
                        onClick={() => setPriority(level)}
                        className={`w-full text-left px-5 py-3 rounded-xl border transition-all font-bold text-sm flex justify-between items-center ${
                            priority === level 
                            ? 'bg-red-50 border-red-200 text-red-600'
                            : 'bg-white border-gray-100 text-gray-500 hover:bg-gray-50'
                        }`}
                    >
                        {level}
                        {priority === level && <div className="w-3 h-3 rounded-full bg-red-500"></div>}
                    </button>
                ))}
             </div>
        </div>

        <div className="bg-white rounded-[30px] p-8 shadow-sm border border-gray-100 flex-1">
             <h2 className="text-lg font-bold text-gray-800 mb-4">Evidence (Optional)</h2>
             <label className="border-2 border-dashed border-gray-200 rounded-2xl h-32 flex flex-col items-center justify-center text-gray-400 cursor-pointer hover:border-red-300 hover:bg-red-50 transition-colors">
                <input type="file" className="hidden" onChange={(e) => setFile(e.target.files[0])} />
                <UploadCloud size={24} className="mb-2"/>
                <span className="text-xs font-bold">{file ? file.name : 'Upload Photo/Video'}</span>
             </label>

             <button onClick={handleSubmit} className="w-full mt-6 bg-red-600 text-white py-4 rounded-xl font-bold text-lg shadow-xl shadow-red-200 hover:bg-red-700 transition-transform active:scale-95 flex items-center justify-center gap-2">
                Submit Report <ArrowRight size={20}/>
             </button>
        </div>
      </div>
    </div>
  );
};
export default CreateComplaintForm;