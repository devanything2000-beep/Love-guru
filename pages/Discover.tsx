import React, { useState, useRef } from 'react';
import { DISCOVER_PROFILES } from '../constants';
import { Heart, MapPin, Sparkles, ChevronRight, ChevronLeft, MoreHorizontal } from 'lucide-react';
import { User } from '../types';
import { VerifiedBadge } from '../components/UIComponents';

interface DiscoverProps {
  onToggleLike: (user: User) => void;
  isLiked: (userId: string) => boolean;
  onViewProfile: (user: User) => void;
}

export const Discover: React.FC<DiscoverProps> = ({ onToggleLike, isLiked, onViewProfile }) => {
  const [profiles, setProfiles] = useState(DISCOVER_PROFILES);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showDetails, setShowDetails] = useState(false);
  
  // Swipe State
  const [drag, setDrag] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [exitVector, setExitVector] = useState<{ x: number, y: number } | null>(null);

  const currentProfile = profiles[currentIndex];
  const liked = isLiked(currentProfile?.id);

  const goToNextProfile = () => {
    setShowDetails(false);
    setExitVector(null);
    setDrag({ x: 0, y: 0 });
    
    if (currentIndex < profiles.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setCurrentIndex(0); // Loop
    }
  };

  const handleNext = () => {
    setExitVector({ x: -window.innerWidth, y: 0 });
    setTimeout(goToNextProfile, 300);
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    } else {
      setCurrentIndex(profiles.length - 1);
    }
  };

  const handleCardClick = () => {
    if (!isDragging && Math.abs(drag.x) < 5 && Math.abs(drag.y) < 5) {
        onToggleLike(currentProfile);
    }
  };

  // --- TOUCH / MOUSE EVENTS ---
  const handlePointerDown = (e: React.TouchEvent | React.MouseEvent) => {
    if (showDetails || exitVector) return;
    setIsDragging(true);
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
    setDragStart({ x: clientX, y: clientY });
  };

  const handlePointerMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isDragging || showDetails || exitVector) return;
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
    
    setDrag({ 
        x: clientX - dragStart.x, 
        y: clientY - dragStart.y 
    });
  };

  const handlePointerUp = () => {
    if (!isDragging || showDetails || exitVector) return;
    setIsDragging(false);

    const threshold = 100;
    if (Math.abs(drag.x) > threshold || Math.abs(drag.y) > threshold) {
        const multiplier = 4;
        setExitVector({ x: drag.x * multiplier, y: drag.y * multiplier });
        setTimeout(goToNextProfile, 300);
    } else {
        setDrag({ x: 0, y: 0 });
    }
  };

  const getCardStyle = () => {
    if (exitVector) {
        return {
            transform: `translate(${exitVector.x}px, ${exitVector.y}px) rotate(${exitVector.x * 0.1}deg)`,
            transition: 'transform 0.3s ease-out, opacity 0.3s ease-out',
            opacity: 0
        };
    }
    if (isDragging) {
        return {
            transform: `translate(${drag.x}px, ${drag.y}px) rotate(${drag.x * 0.05}deg)`,
            transition: 'none',
            cursor: 'grabbing'
        };
    }
    return {
        transform: 'translate(0, 0) rotate(0deg)',
        transition: 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        cursor: 'pointer'
    };
  };

  if (!currentProfile) return <div className="text-center text-white p-10">Searching...</div>;

  return (
    <div className="h-full flex flex-col items-center justify-center max-w-md mx-auto w-full relative pb-4 overflow-hidden select-none">
      
      {!showDetails && (
        <div className="w-full flex justify-between items-center mb-4 px-2">
          <h2 className="text-2xl font-serif font-bold text-white">Discover</h2>
          <div className="flex items-center gap-1 text-rose-400 bg-rose-500/10 px-3 py-1 rounded-full text-xs font-bold">
             <Sparkles size={12} /> Boost Active
          </div>
        </div>
      )}
      
      <div className="relative w-full aspect-[3/4] md:aspect-[3/4.5] max-h-[75vh] group">
        
        <button onClick={(e) => { e.stopPropagation(); handlePrev(); }} className="absolute left-[-50px] top-1/2 hidden md:block text-white/20 hover:text-white transition">
            <ChevronLeft size={40} />
        </button>

        <button 
          onClick={(e) => { e.stopPropagation(); handleNext(); }} 
          className="absolute -right-4 md:-right-12 top-1/2 transform -translate-y-1/2 z-30 p-3 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 active:scale-95 transition shadow-lg"
        >
            <ChevronRight size={32} />
        </button>

        {!showDetails && <div className="absolute top-4 left-4 right-4 bottom-0 bg-white/5 rounded-3xl z-0 transform translate-y-2 scale-95 border border-white/5"></div>}
        
        <div 
          onClick={handleCardClick}
          onMouseDown={handlePointerDown}
          onMouseMove={handlePointerMove}
          onMouseUp={handlePointerUp}
          onMouseLeave={handlePointerUp}
          onTouchStart={handlePointerDown}
          onTouchMove={handlePointerMove}
          onTouchEnd={handlePointerUp}
          style={!showDetails ? getCardStyle() : {}}
          className={`
            absolute inset-0 bg-[#1E293B] rounded-3xl overflow-hidden shadow-2xl shadow-black/50 border border-white/10 z-10 flex flex-col 
            ${!showDetails ? '' : 'cursor-default'}
          `}
        >
          {!showDetails && (
            <div className={`absolute inset-0 z-20 flex items-center justify-center pointer-events-none transition-opacity duration-300 ${liked ? 'opacity-100' : 'opacity-0'}`}>
                <div className="bg-rose-500/20 p-8 rounded-full backdrop-blur-sm animate-fade-in scale-125">
                    <Heart size={100} fill="#F43F5E" className="text-rose-500 drop-shadow-[0_0_15px_rgba(244,63,94,0.8)]" />
                </div>
            </div>
          )}

          <div className="relative flex-1 pointer-events-none">
            <img 
            src={currentProfile.avatar} 
            alt={currentProfile.name} 
            className="w-full h-full object-cover"
            draggable={false}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1E293B] via-transparent to-transparent opacity-90"></div>
            
            <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="flex items-end justify-between mb-2">
                <div>
                    <h2 className="text-3xl font-bold text-white flex items-center gap-2 drop-shadow-md">
                        {currentProfile.name}, {currentProfile.age}
                        {currentProfile.verified && <VerifiedBadge size={24} />}
                    </h2>
                    <div className="flex items-center text-slate-300 text-sm mt-1">
                        <MapPin size={14} className="mr-1 text-rose-500" /> {currentProfile.city}
                    </div>
                </div>
                <div className="w-12 h-12 rounded-full border-2 border-rose-500 flex items-center justify-center bg-black/40 backdrop-blur-sm text-white font-bold text-sm">
                    {currentProfile.matchPercentage}%
                </div>
                </div>
            </div>
          </div>

          <div className="p-5 pt-0 bg-[#1E293B] pointer-events-auto">
            <p className="text-slate-300 text-sm leading-relaxed line-clamp-2 mb-4 pointer-events-none">
                "{currentProfile.bio}"
            </p>
            <div className="flex flex-wrap gap-2 pointer-events-none">
                {currentProfile.interests.slice(0, 3).map(tag => (
                <span key={tag} className="bg-white/5 border border-white/10 px-3 py-1 rounded-full text-xs text-slate-300">
                    {tag}
                </span>
                ))}
            </div>
            
            <div className="flex items-center justify-between mt-4">
               <div className="text-[10px] text-white/30 uppercase tracking-widest pointer-events-none">
                  Tap to Like • Slide to Next
               </div>
               <button 
                  onClick={(e) => { e.stopPropagation(); onViewProfile(currentProfile); }}
                  className="p-2 text-white/50 hover:text-white bg-white/5 rounded-full"
               >
                  <MoreHorizontal size={20} />
               </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center gap-8 mt-6 w-full px-8 z-20">
        <button 
          onClick={(e) => {
             e.stopPropagation();
             onToggleLike(currentProfile);
          }}
          className={`
            w-20 h-20 rounded-full flex items-center justify-center text-white shadow-xl active:scale-95 transition transform hover:-translate-y-1
            ${liked 
              ? 'bg-rose-500 shadow-rose-900/40' 
              : 'bg-gradient-to-br from-rose-500 to-pink-600 shadow-rose-900/40'
            }
          `}
        >
          <Heart size={36} fill={liked ? "white" : "transparent"} />
        </button>
      </div>
    </div>
  );
};
