
import React, { useState } from 'react';
import { GlassCard, PrimaryButton, VerifiedBadge } from '../components/UIComponents';
import { SOCIAL_POSTS, CURRENT_USER, DISCOVER_PROFILES } from '../constants';
import { 
  Heart, MessageCircle, Share2, Bookmark, CheckCircle, 
  Video, Grid, User as UserIcon, Music, MoreHorizontal, 
  PlusSquare, Home, Menu, BarChart2, TrendingUp, Users, 
  Camera, Image as ImageIcon, Settings, Plus, Loader2, Check
} from 'lucide-react';

export const SocialHub = () => {
  const [activeTab, setActiveTab] = useState<'home' | 'reels' | 'create' | 'profile' | 'menu'>('reels');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  // --- SUB-COMPONENTS ---

  const FeedView = () => (
    <div className="bg-[#0F172A] min-h-full pb-20">
      {/* Stories */}
      <div className="flex gap-4 overflow-x-auto px-4 py-4 border-b border-white/5 scrollbar-hide">
         <div className="flex flex-col items-center space-y-2 min-w-[70px]">
            <div className="w-16 h-16 rounded-full p-[2px] border-2 border-white/20 border-dashed flex items-center justify-center">
               <div className="w-full h-full rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition cursor-pointer">
                  <Plus size={24} className="text-white"/>
               </div>
            </div>
            <div className="flex items-center gap-1 text-[10px] font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full">
               <Plus size={8} strokeWidth={4} /> Add Story
            </div>
         </div>
         {[1,2,3,4,5].map((s) => (
            <div key={s} className="flex flex-col items-center space-y-2 min-w-[70px]">
               <div className="w-16 h-16 rounded-full p-[2px] bg-gradient-to-tr from-rose-500 via-orange-500 to-purple-600">
                  <div className="w-full h-full rounded-full bg-black border-2 border-black overflow-hidden relative cursor-pointer">
                     <img src={`https://i.pravatar.cc/150?img=${s+15}`} className="w-full h-full object-cover" />
                  </div>
               </div>
               <span className="text-[10px] text-white/80 font-medium">User {s}</span>
            </div>
         ))}
      </div>

      {/* Posts */}
      <div className="space-y-4 mt-2">
        {SOCIAL_POSTS.map(post => (
          <div key={post.id} className="bg-[#1E293B] border-y border-white/5 pb-4">
            <div className="flex items-center justify-between p-3">
               <div className="flex items-center gap-3">
                  <img src={post.userAvatar} className="w-8 h-8 rounded-full border border-white/10" />
                  <div className="flex flex-col">
                     <span className="text-sm font-bold text-white flex items-center gap-1">
                        {post.userName} {post.isVerified && <CheckCircle size={12} className="text-blue-400" fill="currentColor" />}
                     </span>
                     <span className="text-xs text-white/40">Mumbai, India</span>
                  </div>
               </div>
               <button className="text-white/50"><MoreHorizontal size={20} /></button>
            </div>
            <div className="w-full aspect-square bg-black relative">
               <img src={post.image} className="w-full h-full object-cover" />
            </div>
            <div className="px-3 pt-3">
               <div className="flex justify-between mb-3">
                  <div className="flex gap-5">
                     <Heart size={26} className="cursor-pointer hover:text-rose-500 transition" />
                     <MessageCircle size={26} className="cursor-pointer hover:text-blue-400 transition" />
                     <Share2 size={26} className="cursor-pointer hover:text-green-400 transition" />
                  </div>
                  <Bookmark size={26} className="cursor-pointer hover:text-yellow-400 transition" />
               </div>
               <p className="font-bold text-sm mb-1">{post.likes.toLocaleString()} likes</p>
               <p className="text-sm">
                  <span className="font-bold mr-2">{post.userName}</span>
                  <span className="text-white/80">{post.caption}</span>
               </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const ReelsView = () => (
    <div className="h-full w-full overflow-y-auto snap-y snap-mandatory scrollbar-hide bg-black">
       {[...SOCIAL_POSTS, ...SOCIAL_POSTS].map((post, idx) => (
         <div key={`${post.id}-${idx}`} className="w-full h-full snap-start relative bg-[#121212] overflow-hidden">
             <img src={post.image} className="w-full h-full object-cover opacity-90" />
             <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-10"></div>
             
             {/* Right Actions */}
             <div className="absolute bottom-20 right-2 z-20 flex flex-col items-center gap-6 p-2">
                <div className="flex flex-col items-center gap-1 group cursor-pointer">
                    <Heart size={30} strokeWidth={1.5} className="text-white drop-shadow-lg" />
                    <span className="text-xs font-medium text-white drop-shadow-md">{post.likes}</span>
                </div>
                <div className="flex flex-col items-center gap-1 group cursor-pointer">
                    <MessageCircle size={30} strokeWidth={1.5} className="text-white drop-shadow-lg" />
                    <span className="text-xs font-medium text-white drop-shadow-md">{post.comments}</span>
                </div>
                <div className="flex flex-col items-center gap-1 group cursor-pointer">
                    <Share2 size={30} strokeWidth={1.5} className="text-white drop-shadow-lg" />
                    <span className="text-xs font-medium text-white drop-shadow-md">Share</span>
                </div>
                <button className="mt-2"><MoreHorizontal size={26} className="text-white drop-shadow-lg" /></button>
                <div className="mt-4 w-9 h-9 rounded-lg border-2 border-white/80 overflow-hidden relative shadow-lg">
                   <img src={post.userAvatar} className="w-full h-full object-cover animate-spin-slow" />
                </div>
             </div>

             {/* Bottom Info */}
             <div className="absolute bottom-0 left-0 right-16 p-4 z-20 pb-24 pl-4">
                <div className="flex items-center gap-3 mb-3">
                   <div className="w-9 h-9 rounded-full border border-white overflow-hidden p-0.5">
                      <img src={post.userAvatar} className="w-full h-full rounded-full object-cover" />
                   </div>
                   <span className="font-bold text-white text-sm flex items-center gap-1 drop-shadow-md">
                      {post.userName} <VerifiedBadge size={14} className="text-blue-400 bg-white rounded-full" />
                   </span>
                   <button className="text-xs font-bold bg-transparent border border-white/80 text-white px-3 py-1 rounded-lg backdrop-blur-sm">Follow</button>
                </div>
                <p className="text-sm text-white/95 leading-snug mb-3 line-clamp-2 drop-shadow-md pr-4">{post.caption}</p>
                <div className="flex items-center gap-2 text-xs text-white bg-white/10 w-fit px-3 py-1.5 rounded-full backdrop-blur-md mb-2">
                   <Music size={14} />
                   <span className="inline-block">Original Audio • {post.userName}</span>
                </div>
             </div>
         </div>
       ))}
    </div>
  );

  const handleUpload = () => {
      setIsUploading(true);
      setTimeout(() => {
          setIsUploading(false);
          setUploadSuccess(true);
          setTimeout(() => setUploadSuccess(false), 2000);
      }, 2000);
  };

  const CreateView = () => (
     <div className="h-full bg-[#0F172A] flex flex-col items-center justify-center p-8">
        <div className="w-full max-w-sm bg-[#1E293B] rounded-3xl p-8 text-center border border-white/10 shadow-2xl relative">
           
           {isUploading ? (
              <div className="flex flex-col items-center py-10">
                 <Loader2 size={48} className="text-rose-500 animate-spin mb-4" />
                 <p className="text-white font-bold">Posting to Love Pilot...</p>
              </div>
           ) : uploadSuccess ? (
              <div className="flex flex-col items-center py-10">
                 <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mb-4 text-white shadow-lg shadow-green-900/40 animate-bounce">
                    <Check size={32} strokeWidth={4} />
                 </div>
                 <p className="text-white font-bold text-lg">Posted Successfully!</p>
              </div>
           ) : (
              <div className="flex flex-col items-center">
                 <div className="w-20 h-20 bg-white/5 rounded-2xl flex items-center justify-center mb-6 border border-dashed border-white/20">
                    <ImageIcon size={32} className="text-white/40" />
                 </div>
                 <h3 className="text-xl font-bold text-white mb-2">Create New Post</h3>
                 <p className="text-white/50 text-sm mb-6">Share your moments with the community.</p>
                 
                 <PrimaryButton onClick={handleUpload} className="w-full">
                    Select from Gallery
                 </PrimaryButton>
                 <button className="mt-4 text-sm text-white/40 hover:text-white">Use Camera</button>
              </div>
           )}
        </div>
     </div>
  );

  const ProfileView = () => (
      <div className="bg-[#0F172A] min-h-full pb-20 p-4">
         <GlassCard className="mb-6 flex items-center gap-4">
            <img src={CURRENT_USER.avatar} className="w-20 h-20 rounded-full border-2 border-rose-500 p-1" />
            <div>
               <h2 className="text-xl font-bold text-white">{CURRENT_USER.name}</h2>
               <p className="text-white/60 text-sm">{CURRENT_USER.bio}</p>
               <div className="flex gap-4 mt-4 text-center">
                  <div>
                     <span className="block font-bold text-white">124</span>
                     <span className="text-[10px] text-white/40 uppercase">Posts</span>
                  </div>
                  <div>
                     <span className="block font-bold text-white">4.2k</span>
                     <span className="text-[10px] text-white/40 uppercase">Followers</span>
                  </div>
                  <div>
                     <span className="block font-bold text-white">350</span>
                     <span className="text-[10px] text-white/40 uppercase">Following</span>
                  </div>
               </div>
            </div>
         </GlassCard>

         <div className="grid grid-cols-3 gap-1">
            {[1,2,3,4,5,6,7,8,9].map(i => (
               <div key={i} className="aspect-square bg-white/5 relative group cursor-pointer">
                  <img src={`https://images.unsplash.com/photo-${1500000000000 + i}?w=300&h=300&fit=crop`} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 hidden group-hover:flex items-center justify-center gap-2 text-white font-bold">
                     <Heart size={16} fill="white" /> 1.2k
                  </div>
               </div>
            ))}
         </div>
      </div>
  );

  return (
    <div className="h-[calc(100vh-6rem)] md:h-[calc(100vh-4rem)] flex flex-col relative animate-fade-in bg-[#0F172A] overflow-hidden rounded-2xl border border-white/5">
      
      {/* Top Nav (Mobile/Desktop consistent for Social Hub) */}
      <div className="h-16 bg-[#0F172A]/90 backdrop-blur-xl border-b border-white/10 flex justify-between items-center px-4 z-20 shrink-0">
         <h2 className="text-xl font-serif font-bold text-white flex items-center gap-2">
            Social Hub <span className="text-[10px] bg-rose-500 text-white px-1.5 rounded font-sans">LIVE</span>
         </h2>
         <div className="flex gap-4">
            <button className="text-white/80 hover:text-white"><PlusSquare size={24} /></button>
            <button className="text-white/80 hover:text-white"><MessageCircle size={24} /></button>
         </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto scrollbar-hide relative">
         {activeTab === 'home' && <FeedView />}
         {activeTab === 'reels' && <ReelsView />}
         {activeTab === 'create' && <CreateView />}
         {activeTab === 'profile' && <ProfileView />}
      </div>

      {/* Bottom Tab Bar */}
      <div className="h-16 bg-[#0F172A] border-t border-white/10 flex justify-around items-center px-2 shrink-0 z-20">
         <button onClick={() => setActiveTab('home')} className={`p-2 rounded-xl transition ${activeTab === 'home' ? 'text-rose-500 bg-rose-500/10' : 'text-white/40 hover:text-white'}`}>
            <Home size={24} strokeWidth={activeTab === 'home' ? 3 : 2} />
         </button>
         <button onClick={() => setActiveTab('reels')} className={`p-2 rounded-xl transition ${activeTab === 'reels' ? 'text-rose-500 bg-rose-500/10' : 'text-white/40 hover:text-white'}`}>
            <Video size={24} strokeWidth={activeTab === 'reels' ? 3 : 2} />
         </button>
         <button onClick={() => setActiveTab('create')} className={`p-2 rounded-xl transition ${activeTab === 'create' ? 'text-rose-500 bg-rose-500/10' : 'text-white/40 hover:text-white'}`}>
            <PlusSquare size={24} strokeWidth={activeTab === 'create' ? 3 : 2} />
         </button>
         <button onClick={() => setActiveTab('profile')} className={`p-2 rounded-xl transition ${activeTab === 'profile' ? 'text-rose-500 bg-rose-500/10' : 'text-white/40 hover:text-white'}`}>
            <UserIcon size={24} strokeWidth={activeTab === 'profile' ? 3 : 2} />
         </button>
      </div>
    </div>
  );
};
