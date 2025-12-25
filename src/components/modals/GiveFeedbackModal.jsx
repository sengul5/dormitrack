import React, { useState } from 'react';
import { Star, X, MessageSquare, Send } from 'lucide-react';

const GiveFeedbackModal = ({ isOpen, onClose, itemTitle, onSubmit }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [hoveredStar, setHoveredStar] = useState(0);

  if (!isOpen) return null;

  const handleSubmit = () => {
    onSubmit({ rating, comment });
    // Reset ve Kapat
    setRating(0);
    setComment('');
    onClose();
  };

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-md rounded-[30px] shadow-2xl p-8 animate-in zoom-in-95 border border-gray-100 relative">
        
        <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-gray-50 text-gray-400 rounded-full hover:bg-gray-100 transition-colors"
        >
            <X size={20}/>
        </button>

        <div className="text-center mb-6">
            <div className="w-16 h-16 bg-yellow-50 text-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-yellow-100">
                <Star size={32} fill="currentColor" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800">Rate Service</h3>
            <p className="text-gray-500 text-sm mt-1">
                How was the service for <span className="font-bold text-gray-700">"{itemTitle}"</span>?
            </p>
        </div>

        {/* YILDIZLAR */}
        <div className="flex justify-center gap-2 mb-6">
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    onMouseEnter={() => setHoveredStar(star)}
                    onMouseLeave={() => setHoveredStar(0)}
                    onClick={() => setRating(star)}
                    className="transition-transform hover:scale-110 focus:outline-none"
                >
                    <Star 
                        size={36} 
                        className={`${
                            star <= (hoveredStar || rating) 
                            ? 'text-yellow-400 fill-yellow-400' 
                            : 'text-gray-200 fill-gray-50'
                        } transition-colors duration-200`} 
                    />
                </button>
            ))}
        </div>

        {/* YORUM ALANI */}
        <div className="space-y-4">
            <div className="relative">
                <MessageSquare className="absolute top-4 left-4 text-gray-400" size={20} />
                <textarea 
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Write your feedback here... (Optional)"
                    className="w-full h-32 pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:bg-white transition-all resize-none text-gray-700 placeholder-gray-400"
                ></textarea>
            </div>

            <button 
                onClick={handleSubmit}
                disabled={rating === 0}
                className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-lg ${
                    rating > 0 
                    ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-200 active:scale-95' 
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
            >
                Submit Feedback <Send size={20}/>
            </button>
        </div>

      </div>
    </div>
  );
};

export default GiveFeedbackModal;