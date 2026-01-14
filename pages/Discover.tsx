
import React, { useState } from 'react';
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
  const [profiles] = useState(DISCOVER_PROFILES);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showDetails, setShowDetails] = useState(false);
  
  // Swipe & Animation State
  const [drag, setDrag] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [exitVector, setExitVector] = useState<{ x: number, y: number } | null>(null);
  const [slideDirection, setSlideDirection] = useState<'left' | 'right' | null>(null);

  const currentProfile = profiles[currentIndex];
  const liked = isLiked(currentProfile?.id);

  const goToNextProfile = () => {
    setShowDetails(false);
    setExitVector(null);
    setDrag({ x: 0, y: 0 });
    
    if (currentIndex < profiles.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setCurrentIndex(0); // Loop to start
    }
  };

  const goToPrevProfile = () => {
    setShowDetails(false);
    setExitVector(null);
    setDrag({ x: 0, y: 0 });

    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    } else {
      setCurrentIndex(profiles.length - 1); // Loop to end
    }
  };

  const handleNext = () => {
    // Left Swipe -> Go Next
    // Animation: Current exits Left, New comes from Right
    setSlideDirection('right'); 
    setExitVector({ x: -window.innerWidth, y: 0 }); // Current card flies Left
    setTimeout(goToNextProfile, 300);
  };

  const handlePrev = () => {
    // Right Swipe -> Go Previous
    // Animation: Current exits Right, New comes from Left
    setSlideDirection('left');
    setExitVector({ x: window.innerWidth, y: 0 }); // Current card flies Right
    setTimeout(goToPrevProfile, 300);
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
    
    // Lock Vertical Swipe: y is always 0
    setDrag({ 
        x: clientX - dragStart.x, 
        y: 0 
    });
  };

  const handlePointerUp = () => {
    if (!isDragging || showDetails || exitVector) return;
    setIsDragging(false);

    const threshold = 80; // slightly more sensitive
    
    if (drag.x > threshold) {
        // Dragged Right -> Go Previous
        handlePrev(); 
    } else if (drag.x < -threshold) {
        // Dragged Left -> Go Next
        handleNext();
    } else {
        setDrag({ x: 0, y: 0 });
    }
  };

  const getCardStyle = () => {
    // 1. Exit Animation (Flying out)
    if (exitVector) {
        return {
            transform: `translate(${exitVector.x}px, ${exitVector.y}px) rotate(${exitVector.x * 0.05}deg)`,
            transition: 'transform 0.3s ease-out, opacity 0.3s ease-out',
            opacity: 0.5
        };
    }
    // 2. Dragging (Follow finger)
    if (isDragging) {
        return {
            transform: `translate(${drag.x}px, ${drag.y}px) rotate(${drag.x * 0.05}deg)`,
            transition: 'none',
            cursor: 'grabbing'
        };
    }
    // 3. Entry Animation (Sliding in)
    // Applied via CSS animation below if slideDirection is set
    if (slideDirection) {
        return {
            animation: `${slideDirection === 'right' ? 'slideInRight' : 'slideInLeft'} 0.4s ease-out forwards`
        };
    }
    
    // 4. Resting State
    return {
        transform: 'translate(0, 0) rotate(0deg)',
        transition: 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        cursor: 'pointer'
    };
  };

  if (!currentProfile) return <div className="text-center text-white p-10">Searching...</div>;

  return (
    <div className="h-full flex flex-col items-center justify-center max-w-md mx-auto w-full relative pb-4 overflow-hidden select-none">
      
      {/* Styles for Animations */}
      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%) rotate(5deg); opacity: 0; }
          to { transform: translateX(0) rotate(0); opacity: 1; }
        }
        @keyframes slideInLeft {
          from { transform: translateX(-100%) rotate(-5deg); opacity: 0; }
          to { transform: translateX(0) rotate(0); opacity: 1; }
        }
      `}</style>

      {!showDetails && (
        <div className="w-full flex justify-between items-center mb-4 px-2">
          <h2 className="text-2xl font-serif font-bold text-white">Discover</h2>
          <div className="flex items-center gap-1 text-rose-400 bg-rose-500/10 px-3 py-1 rounded-full text-xs font-bold">
             <Sparkles size={12} /> Boost Active
          </div>
        </div>
      )}
      
      <div className="relative w-full aspect-[3/4] md:aspect-[3/4.5] max-h-[75vh] group perspective-1000">
        
        {/* Previous Button (Left) - Triggers Prev logic */}
        <button 
          onClick={(e) => { e.stopPropagation(); handlePrev(); }} 
          className="absolute -left-4 md:-left-12 top-1/2 transform -translate-y-1/2 z-30 p-3 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 active:scale-95 transition shadow-lg border border-white/5"
        >
            <ChevronLeft size={32} />
        </button>

        {/* Next Button (Right) - Triggers Next logic */}
        <button 
          onClick={(e) => { e.stopPropagation(); handleNext(); }} 
          className="absolute -right-4 md:-right-12 top-1/2 transform -translate-y-1/2 z-30 p-3 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 active:scale-95 transition shadow-lg border border-white/5"
        >
            <ChevronRight size={32} />
        </button>

        {!showDetails && <div className="absolute top-4 left-4 right-4 bottom-0 bg-white/5 rounded-3xl z-0 transform translate-y-2 scale-95 border border-white/5"></div>}
        
        <div 
          key={currentProfile.id} // Key ensures re-render and animation on profile change
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
          </div>
        </div>
      </div>

      {/* --- BOTTOM ACTION BAR --- */}
      <div className="flex items-center justify-between w-full px-8 mt-6 z-20 relative">
         
         {/* Placeholder Left (Balance) */}
         <div className="w-12"></div>

         {/* Center: Heart Button */}
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

         {/* Right: 3-Dot Button */}
         <div className="w-12 flex justify-end">
            <button 
               onClick={(e) => { e.stopPropagation(); onViewProfile(currentProfile); }}
               className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 flex items-center justify-center text-white transition active:scale-95"
            >
               <MoreHorizontal size={24} />
            </button>
         </div>
      </div>
    </div>
  );
};
