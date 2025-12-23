import React from 'react';

const FeedbackChart = () => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-full">
      <h3 className="text-lg font-bold text-gray-800 mb-6">Feedback & Rate</h3>
      
      <div className="flex items-center gap-6">
        {/* SOL: Yuvarlak Grafik (SVG ile Çizim) */}
        <div className="relative w-32 h-32 flex-shrink-0">
          <svg className="w-full h-full transform -rotate-90">
            {/* Gri Arka Çember */}
            <circle cx="64" cy="64" r="56" stroke="#f3f4f6" strokeWidth="12" fill="none" />
            {/* Yeşil İlerleme Çemberi (%70) */}
            <circle 
              cx="64" cy="64" r="56" 
              stroke="#22c55e" strokeWidth="12" fill="none" 
              strokeDasharray="351" 
              strokeDashoffset="105" // 351 * (1 - 0.70) ≈ 105
              strokeLinecap="round"
            />
          </svg>
          {/* Ortadaki Yüzde Yazısı */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl font-bold text-gray-700">%70</span>
          </div>
        </div>

        {/* SAĞ: Açıklamalar ve Barlar */}
        <div className="flex-1 space-y-4">
          
          {/* Pozitif */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-gray-500">Positive Feedbacks</span>
              <span className="text-green-600 font-bold">70%</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2">
              <div className="bg-green-500 h-2 rounded-full" style={{ width: '70%' }}></div>
            </div>
          </div>

          {/* Negatif */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-gray-500">Negative Feedbacks</span>
              <span className="text-red-600 font-bold">20%</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2">
              <div className="bg-red-500 h-2 rounded-full" style={{ width: '20%' }}></div>
            </div>
          </div>

          {/* Nötr */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-gray-500">Neutral Feedbacks</span>
              <span className="text-gray-400 font-bold">10%</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2">
              <div className="bg-gray-300 h-2 rounded-full" style={{ width: '10%' }}></div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default FeedbackChart;