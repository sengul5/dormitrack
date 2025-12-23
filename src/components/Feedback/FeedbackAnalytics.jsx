import React from 'react';
import { Star, TrendingUp, ThumbsUp, ThumbsDown, MessageCircle, User, Activity } from 'lucide-react';

const FeedbackAnalytics = () => {
  // SAHTE VERİLER (ANALİZ İÇİN)
  const stats = {
    avgRating: 4.8,
    totalReviews: 124,
    helpfulRate: 92, // %92 memnuniyet
  };

  // KATEGORİ BAZLI PUANLAR
  const categories = [
    { name: 'Wifi & Internet', score: 2.4, count: 45, color: 'bg-red-500' }, // Düşük puan
    { name: 'Cleaning Services', score: 4.9, count: 30, color: 'bg-green-500' }, // Yüksek puan
    { name: 'Technical Repairs', score: 4.2, count: 28, color: 'bg-blue-500' },
    { name: 'Security', score: 4.7, count: 21, color: 'bg-purple-500' },
  ];

  // SON YORUMLAR
  const reviews = [
    { id: 1, name: 'Alice Wonderland', date: '2 hours ago', rating: 5, comment: 'Technical team was very fast! The AC is working perfectly now.', category: 'Repair' },
    { id: 2, name: 'John Wick', date: '5 hours ago', rating: 1, comment: 'Internet is still very slow in Room 305. I cannot study.', category: 'Wifi' },
    { id: 3, name: 'Bruce Wayne', date: '1 day ago', rating: 5, comment: 'Security staff is very polite and helpful. Thanks!', category: 'Security' },
  ];

  return (
    <div className="space-y-8">
      
      {/* --- 1. ÜST İSTATİSTİK KARTLARI --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* AVG RATING */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
            <div>
                <p className="text-gray-500 text-xs font-bold uppercase tracking-wide">Average Satisfaction</p>
                <h3 className="text-4xl font-bold text-gray-800 mt-2">{stats.avgRating}</h3>
                <div className="flex text-yellow-400 mt-2">
                    {[...Array(5)].map((_, i) => (
                        <Star key={i} size={16} fill={i < Math.floor(stats.avgRating) ? "currentColor" : "none"} className={i < Math.floor(stats.avgRating) ? "" : "text-gray-300"} />
                    ))}
                </div>
            </div>
            <div className="w-16 h-16 bg-yellow-50 rounded-full flex items-center justify-center text-yellow-500">
                <Star size={32} fill="currentColor" />
            </div>
        </div>

        {/* HELPFUL RATE */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
            <div>
                <p className="text-gray-500 text-xs font-bold uppercase tracking-wide">Resolution Effectiveness</p>
                <h3 className="text-4xl font-bold text-gray-800 mt-2">{stats.helpfulRate}%</h3>
                <p className="text-sm text-green-600 font-bold mt-2 flex items-center gap-1">
                    <TrendingUp size={16}/> +4.2% this week
                </p>
            </div>
            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center text-green-600">
                <ThumbsUp size={32} />
            </div>
        </div>

        {/* TOTAL FEEDBACK */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
            <div>
                <p className="text-gray-500 text-xs font-bold uppercase tracking-wide">Total Feedbacks</p>
                <h3 className="text-4xl font-bold text-gray-800 mt-2">{stats.totalReviews}</h3>
                <p className="text-sm text-gray-400 mt-2">Last 30 days</p>
            </div>
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
                <MessageCircle size={32} />
            </div>
        </div>
      </div>

      {/* --- 2. ORTA BÖLÜM (KATEGORİLER & DETAYLAR) --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* SOL: KATEGORİ BAZLI PERFORMANS */}
        <div className="bg-white p-8 rounded-[30px] border border-gray-100 shadow-sm">
            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <Activity className="text-blue-600"/> Category Performance
            </h3>
            <div className="space-y-6">
                {categories.map((cat) => (
                    <div key={cat.name}>
                        <div className="flex justify-between items-end mb-2">
                            <span className="font-bold text-gray-700 text-sm">{cat.name}</span>
                            <div className="text-right">
                                <span className={`font-bold text-lg ${cat.score < 3 ? 'text-red-500' : 'text-gray-800'}`}>{cat.score}</span>
                                <span className="text-gray-400 text-xs ml-1">/ 5.0</span>
                            </div>
                        </div>
                        {/* Progress Bar Background */}
                        <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                            {/* Progress Bar Fill */}
                            <div 
                                className={`h-full rounded-full ${cat.color}`} 
                                style={{ width: `${(cat.score / 5) * 100}%` }}
                            ></div>
                        </div>
                        <p className="text-xs text-gray-400 mt-1 text-right">{cat.count} reviews</p>
                    </div>
                ))}
            </div>
            
            <div className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-100 flex gap-4">
                <div className="text-2xl">💡</div>
                <div>
                    <h4 className="font-bold text-blue-800 text-sm">AI Insight</h4>
                    <p className="text-xs text-blue-700 mt-1">
                        Students are consistently complaining about <strong>Wifi Speed</strong>. Consider upgrading the bandwidth in Block A.
                    </p>
                </div>
            </div>
        </div>

        {/* SAĞ: SON GELEN YORUMLAR */}
        <div className="bg-white p-8 rounded-[30px] border border-gray-100 shadow-sm flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    <MessageCircle className="text-purple-600"/> Recent Comments
                </h3>
                <button className="text-sm font-bold text-purple-600 hover:underline">View All</button>
            </div>
            
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-4 max-h-[400px]">
                {reviews.map((review) => (
                    <div key={review.id} className="p-4 rounded-2xl bg-gray-50 border border-gray-100 hover:bg-white hover:shadow-md transition-all">
                        <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                                    <User size={16} className="text-gray-500"/>
                                </div>
                                <div>
                                    <h5 className="font-bold text-gray-800 text-sm">{review.name}</h5>
                                    <span className="text-[10px] text-gray-400 uppercase font-bold bg-white px-2 py-0.5 rounded border border-gray-100">{review.category}</span>
                                </div>
                            </div>
                            <span className="text-xs text-gray-400">{review.date}</span>
                        </div>
                        
                        <p className="text-sm text-gray-600 leading-relaxed mb-3">
                            "{review.comment}"
                        </p>

                        <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} size={12} fill={i < review.rating ? "#FBBF24" : "none"} className={i < review.rating ? "text-yellow-400" : "text-gray-300"} />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>

      </div>

    </div>
  );
};

export default FeedbackAnalytics;