import React, { useState } from 'react';
import { GlassCard } from '../components/UIComponents';
import { SOCIAL_POSTS } from '../constants';
import { Heart, MessageCircle, Share2, Bookmark, CheckCircle, Video, Grid, User as UserIcon, Music, MoreVertical, Play } from 'lucide-react';

export const SocialHub = () => {
  const [activeTab, setActiveTab] = useState<'feed' | 'reels'>('feed');

  return (
    <div className="h-full flex flex-col animate-fade-in max-w-2xl mx-auto w-full relative">
      {/* Social Header (Tabs) */}
      <div className="flex justify-between items-center mb-6 px-2 sticky top-0 z-20 py-2 bg-[#0F172A]/80 backdrop-blur-md">
        <h1 className="text-2xl font-bold font-serif italic text-white">
            {activeTab === 'feed' ? 'Social Hub' : 'Reels'}
        </h1>
        <div className="flex gap-6">
           <button 
             onClick={() => setActiveTab('reels')}
             className={`transition-colors duration-200 ${activeTab === 'reels' ? 'text-rose-500 scale-110' : 'text-white/70 hover:text-white'}`}
           >
             <Video size={24} />
           </button>
           <button 
             onClick={() => setActiveTab('feed')}
             className={`transition-colors duration-200 ${activeTab === 'feed' ? 'text-rose-500 scale-110' : 'text-white/70 hover:text-white'}`}
           >
             <Grid size={24} />
           </button>
           <button className="text-white/70 hover:text-white transition-colors">
             <UserIcon size={24} />
           </button>
        </div>
      </div>

      {activeTab === 'feed' ? (
        <>
          {/* Stories / Highlights Area */}
          <div className="flex gap-4 overflow-x-auto pb-4 mb-4 scrollbar-hide">
             {[1,2,3,4,5].map((s) => (
                <div key={s} className="flex flex-col items-center space-y-1 min-w-[70px]">
                   <div className="w-16 h-16 rounded-full p-[2px] bg-gradient-to-tr from-yellow-400 via-orange-500 to-purple-600">
                      <div className="w-full h-full rounded-full bg-black border-2 border-black overflow-hidden">
                         <img src={`https://i.pravatar.cc/150?img=${s+10}`} className="w-full h-full object-cover" />
                      </div>
                   </div>
                   <span className="text-xs text-white/80">Story {s}</span>
                </div>
             ))}
          </div>

          {/* Feed */}
          <div className="space-y-6 pb-20">
            {SOCIAL_POSTS.map(post => (
              <GlassCard key={post.id} className="p-0 overflow-hidden !bg-black/20 !border-white/10">
                {/* Post Header */}
                <div className="flex items-center justify-between p-3">
                   <div className="flex items-center gap-3">
                      <img src={post.userAvatar} className="w-8 h-8 rounded-full border border-white/20" />
                      <div className="flex flex-col">
                         <span className="text-sm font-bold text-white flex items-center gap-1">
                            {post.userName} {post.isVerified && <CheckCircle size={12} className="text-blue-400" fill="currentColor" />}
                         </span>
                         <span className="text-xs text-white/50">Mumbai, India</span>
                      </div>
                   </div>
                   <button className="text-white/50">•••</button>
                </div>

                {/* Post Image */}
                <div className="w-full aspect-square bg-black">
                   <img src={post.image} className="w-full h-full object-cover" />
                </div>

                {/* Action Buttons */}
                <div className="p-3">
                   <div className="flex justify-between mb-3">
                      <div className="flex gap-4">
                         <Heart size={24} className="cursor-pointer hover:text-red-500 transition" />
                         <MessageCircle size={24} className="cursor-pointer hover:text-blue-400 transition" />
                         <Share2 size={24} className="cursor-pointer hover:text-green-400 transition" />
                      </div>
                      <Bookmark size={24} className="cursor-pointer hover:text-yellow-400 transition" />
                   </div>
                   
                   <p className="font-bold text-sm mb-1">{post.likes.toLocaleString()} likes</p>
                   <p className="text-sm">
                      <span className="font-bold mr-2">{post.userName}</span>
                      <span className="text-white/80">{post.caption}</span>
                   </p>
                   <p className="text-xs text-white/40 mt-2">View all {post.comments} comments</p>
                </div>
              </GlassCard>
            ))}
          </div>
        </>
      ) : (
        /* Reels Mode */
        <div className="h-[calc(100vh-160px)] w-full overflow-y-auto snap-y snap-mandatory no-scrollbar pb-20 rounded-2xl">
           {[...SOCIAL_POSTS, ...SOCIAL_POSTS].map((post, idx) => (
             <div key={`${post.id}-${idx}`} className="w-full h-full snap-start relative bg-black rounded-2xl overflow-hidden mb-1 border-b border-white/10">
                 {/* Mock Video Layer */}
                 <img src={post.image} className="w-full h-full object-cover opacity-90" />
                 
                 {/* Play Button Overlay (Decorative) */}
                 <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 hover:opacity-100 transition-opacity">
                    <Play size={60} fill="white" className="text-white/50" />
                 </div>

                 {/* Gradient Overlay */}
                 <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/90"></div>

                 {/* Right Sidebar Actions */}
                 <div className="absolute bottom-12 right-2 flex flex-col items-center gap-6 z-10 p-2">
                    <div className="flex flex-col items-center gap-1">
                        <div className="p-2 bg-black/40 rounded-full backdrop-blur-sm">
                           <Heart size={28} className="text-white cursor-pointer hover:text-rose-500 transition" />
                        </div>
                        <span className="text-xs font-bold text-white shadow-black drop-shadow-md">{post.likes}</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                        <div className="p-2 bg-black/40 rounded-full backdrop-blur-sm">
                           <MessageCircle size={28} className="text-white cursor-pointer hover:text-blue-400 transition" />
                        </div>
                        <span className="text-xs font-bold text-white shadow-black drop-shadow-md">{post.comments}</span>
                    </div>
                    <div className="p-2 bg-black/40 rounded-full backdrop-blur-sm">
                       <Share2 size={28} className="text-white cursor-pointer hover:text-green-400 transition" />
                    </div>
                    <div className="p-2 bg-black/40 rounded-full backdrop-blur-sm">
                       <MoreVertical size={28} className="text-white cursor-pointer" />
                    </div>
                 </div>

                 {/* Bottom Info Area */}
                 <div className="absolute bottom-0 left-0 right-16 p-4 z-10 bg-gradient-to-t from-black/80 to-transparent pt-10">
                    <div className="flex items-center gap-3 mb-3">
                       <img src={post.userAvatar} className="w-10 h-10 rounded-full border-2 border-white" />
                       <div className="flex flex-col justify-center">
                          <span className="font-bold text-white flex items-center gap-1 text-shadow shadow-black">
                             {post.userName} 
                             {post.isVerified && <CheckCircle size={14} className="text-blue-400" fill="white" />}
                          </span>
                       </div>
                       <button className="text-xs font-bold bg-transparent border border-white/60 text-white px-3 py-1 rounded-full hover:bg-white/10 transition">
                          Follow
                       </button>
                    </div>
                    
                    <p className="text-sm text-white/90 line-clamp-2 mb-3 drop-shadow-md font-medium">
                       {post.caption} <span className="text-blue-400 font-normal">#trending #lovepilot</span>
                    </p>
                    
                    <div className="flex items-center gap-2 text-xs text-white/80 bg-white/10 w-fit px-3 py-1 rounded-full backdrop-blur-sm">
                       <Music size={14} className="animate-spin-slow" />
                       <span className="sliding-text truncate max-w-[150px]">Original Audio - {post.userName} • Viral Hit</span>
                    </div>
                 </div>
             </div>
           ))}
        </div>
      )}
    </div>
  );
};
