
import React, { useState } from 'react';
import { GlassCard, PrimaryButton } from '../components/UIComponents';
import { SOCIAL_POSTS, CURRENT_USER, DISCOVER_PROFILES } from '../constants';
import { 
  Heart, MessageCircle, Share2, Bookmark, CheckCircle, 
  Video, Grid, User as UserIcon, Music, MoreHorizontal, 
  PlusSquare, Home, Menu, BarChart2, TrendingUp, Users, 
  Camera, Image as ImageIcon, Settings, Plus
} from 'lucide-react';

export const SocialHub = () => {
  const [activeTab, setActiveTab] = useState<'home' | 'reels' | 'create' | 'profile' | 'menu'>('reels');

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

  const CreateView = () => (
     <div className="h-full bg-[#0F172A] flex flex-col items-center justify-center p-8">
        <div className="w-full max-w-sm bg-[#1E293B] rounded-3xl p-8 text-center border border-white/10 shadow-2xl">
           <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
              <Camera size={40} className="text-rose-500" />
           </div>
           <h2 className="text-2xl font-bold text-white mb-2">Create New Post</h2>
           <p className="text-white/50 text-sm mb-8">Share your photos or reels with the world.</p>
           <div className="space-y-3">
              <PrimaryButton className="w-full flex items-center justify-center gap-2">
                 <ImageIcon size={18} /> Upload Photo
              </PrimaryButton>
              <PrimaryButton variant="secondary" className="w-full flex items-center justify-center gap-2">
                 <Video size={18} /> Upload Reel
              </PrimaryButton>
           </div>
        </div>
     </div>
  );

  const ProfileView = () => (
     <div className="bg-[#0F172A] min-h-full pb-20 overflow-y-auto">
        {/* Header */}
        <div className="p-4 pt-6">
           <div className="flex justify-between items-start mb-6">
              <div className="w-20 h-20 rounded-full p-[2px] bg-gradient-to-tr from-rose-500 to-orange-500">
                 <img src={CURRENT_USER.avatar} className="w-full h-full rounded-full border-4 border-[#0F172A] object-cover" />
              </div>
              <div className="flex-1 flex justify-around items-center ml-4 mt-2">
                 <div className="text-center">
                    <div className="font-bold text-xl">12</div>
                    <div className="text-xs text-white/50">Posts</div>
                 </div>
                 <div className="text-center">
                    <div className="font-bold text-xl">1.2k</div>
                    <div className="text-xs text-white/50">Followers</div>
                 </div>
                 <div className="text-center">
                    <div className="font-bold text-xl">450</div>
                    <div className="text-xs text-white/50">Following</div>
                 </div>
              </div>
           </div>

           <div>
              <h2 className="font-bold text-lg flex items-center gap-1">
                 {CURRENT_USER.name} <VerifiedBadge size={16} />
              </h2>
              <p className="text-white/80 text-sm mt-1 whitespace-pre-line">{CURRENT_USER.bio}</p>
              <div className="flex gap-2 mt-4">
                 <button className="flex-1 py-2 bg-white/10 rounded-lg text-sm font-bold border border-white/5">Edit Profile</button>
                 <button className="flex-1 py-2 bg-white/10 rounded-lg text-sm font-bold border border-white/5">Share Profile</button>
                 <button className="p-2 bg-white/10 rounded-lg border border-white/5"><Settings size={18}/></button>
              </div>
           </div>
        </div>

        {/* Profile Selection List (Flow Profile List) */}
        <div className="mt-4 border-t border-white/5 pt-4">
           <div className="px-4 text-xs font-bold text-white/50 uppercase tracking-widest mb-3 flex items-center justify-between">
              <span>Switch Accounts</span>
              <span className="text-rose-400">See All</span>
           </div>
           <div className="flex gap-4 overflow-x-auto px-4 pb-2 scrollbar-hide">
              {/* Current */}
              <div className="flex flex-col items-center space-y-2 min-w-[70px]">
                 <div className="w-14 h-14 rounded-full border-2 border-rose-500 p-0.5">
                    <img src={CURRENT_USER.avatar} className="w-full h-full rounded-full object-cover" />
                 </div>
                 <span className="text-[10px] text-white font-bold">You</span>
              </div>
              {/* Others */}
              {DISCOVER_PROFILES.map((p) => (
                 <div key={p.id} className="flex flex-col items-center space-y-2 min-w-[70px] opacity-60 hover:opacity-100 transition">
                    <div className="w-14 h-14 rounded-full bg-white/5 p-0.5">
                       <img src={p.avatar} className="w-full h-full rounded-full object-cover" />
                    </div>
                    <span className="text-[10px] text-white/80 truncate w-16 text-center">{p.name.split(' ')[0]}</span>
                 </div>
              ))}
              <div className="flex flex-col items-center space-y-2 min-w-[70px]">
                 <div className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                    <PlusSquare size={20} className="text-white/50"/>
                 </div>
                 <span className="text-[10px] text-white/60">Add</span>
              </div>
           </div>
        </div>

        {/* Grid Posts */}
        <div className="mt-6 border-t border-white/5">
           <div className="flex justify-around border-b border-white/5">
              <button className="flex-1 py-3 border-b-2 border-white flex items-center justify-center"><Grid size={20}/></button>
              <button className="flex-1 py-3 text-white/40 flex items-center justify-center"><Video size={20}/></button>
              <button className="flex-1 py-3 text-white/40 flex items-center justify-center"><UserIcon size={20}/></button>
           </div>
           <div className="grid grid-cols-3 gap-0.5 mt-0.5">
              {[...SOCIAL_POSTS, ...SOCIAL_POSTS, ...SOCIAL_POSTS].map((post, i) => (
                 <div key={i} className="aspect-square bg-white/5 relative group">
                    <img src={post.image} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 hidden group-hover:flex items-center justify-center text-white font-bold text-sm">
                       {post.likes} <Heart size={12} className="ml-1" fill="white"/>
                    </div>
                 </div>
              ))}
           </div>
        </div>
     </div>
  );

  const DashboardView = () => (
     <div className="bg-[#0F172A] min-h-full p-6 pb-20 overflow-y-auto">
        <h2 className="text-2xl font-bold text-white mb-2">Social Dashboard</h2>
        <p className="text-white/50 text-sm mb-6">Manage your influence across Feed & Reels.</p>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
           <GlassCard className="p-4 flex flex-col items-center text-center">
              <div className="w-10 h-10 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center mb-2">
                 <Users size={20} />
              </div>
              <div className="text-2xl font-bold">12.5k</div>
              <div className="text-xs text-white/60">Total Reach</div>
           </GlassCard>
           <GlassCard className="p-4 flex flex-col items-center text-center">
              <div className="w-10 h-10 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center mb-2">
                 <TrendingUp size={20} />
              </div>
              <div className="text-2xl font-bold">8.4%</div>
              <div className="text-xs text-white/60">Engagement</div>
           </GlassCard>
        </div>

        <h3 className="font-bold text-white/80 mb-3 flex items-center gap-2">
           <Video size={18} className="text-rose-500" /> Reels Performance
        </h3>
        <GlassCard className="mb-6">
           <div className="flex justify-between items-center mb-4 border-b border-white/10 pb-2">
              <span className="text-sm text-white/60">Last 30 Days</span>
              <span className="text-green-400 text-xs font-bold">+24%</span>
           </div>
           <div className="space-y-4">
              <div className="flex justify-between">
                 <span className="text-sm">Plays</span>
                 <span className="font-bold">45,200</span>
              </div>
              <div className="flex justify-between">
                 <span className="text-sm">Saves</span>
                 <span className="font-bold">1,203</span>
              </div>
              <div className="flex justify-between">
                 <span className="text-sm">Shares</span>
                 <span className="font-bold">892</span>
              </div>
           </div>
        </GlassCard>

        <h3 className="font-bold text-white/80 mb-3 flex items-center gap-2">
           <Grid size={18} className="text-blue-500" /> Feed Performance
        </h3>
        <GlassCard>
           <div className="flex justify-between items-center mb-4 border-b border-white/10 pb-2">
              <span className="text-sm text-white/60">Last 30 Days</span>
              <span className="text-yellow-400 text-xs font-bold">-2%</span>
           </div>
           <div className="space-y-4">
              <div className="flex justify-between">
                 <span className="text-sm">Impressions</span>
                 <span className="font-bold">12,100</span>
              </div>
              <div className="flex justify-between">
                 <span className="text-sm">Profile Visits</span>
                 <span className="font-bold">540</span>
              </div>
           </div>
        </GlassCard>
     </div>
  );

  const VerifiedBadge = ({ size, className }: any) => (
    <CheckCircle size={size} className={`text-blue-500 ${className}`} fill="currentColor" stroke="#fff" />
  );

  // --- MAIN LAYOUT ---
  return (
    <div className="h-full flex flex-col animate-fade-in max-w-md mx-auto w-full relative bg-black md:rounded-3xl overflow-hidden shadow-2xl border border-white/5">
      
      {/* Content Area */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden relative bg-[#0F172A] scrollbar-hide">
        {activeTab === 'home' && <FeedView />}
        {activeTab === 'reels' && <ReelsView />}
        {activeTab === 'create' && <CreateView />}
        {activeTab === 'profile' && <ProfileView />}
        {activeTab === 'menu' && <DashboardView />}
      </div>

      {/* Social Bottom Navigation (Fixed at bottom of SocialHub container) */}
      <div className="h-16 bg-black border-t border-white/10 flex justify-around items-center z-50 absolute bottom-0 left-0 right-0">
         <button onClick={() => setActiveTab('home')} className={`p-3 transition ${activeTab === 'home' ? 'text-white scale-110' : 'text-white/50'}`}>
            <Home size={24} strokeWidth={activeTab === 'home' ? 2.5 : 2} />
         </button>
         <button onClick={() => setActiveTab('reels')} className={`p-3 transition ${activeTab === 'reels' ? 'text-white scale-110' : 'text-white/50'}`}>
            <Video size={24} strokeWidth={activeTab === 'reels' ? 2.5 : 2} />
         </button>
         <button onClick={() => setActiveTab('create')} className={`p-3 transition ${activeTab === 'create' ? 'text-white scale-110' : 'text-white/50'}`}>
            <PlusSquare size={24} strokeWidth={activeTab === 'create' ? 2.5 : 2} />
         </button>
         <button onClick={() => setActiveTab('profile')} className={`p-3 transition ${activeTab === 'profile' ? 'text-white scale-110' : 'text-white/50'}`}>
            <UserIcon size={24} strokeWidth={activeTab === 'profile' ? 2.5 : 2} />
         </button>
         <button onClick={() => setActiveTab('menu')} className={`p-3 transition ${activeTab === 'menu' ? 'text-white scale-110' : 'text-white/50'}`}>
            <Menu size={24} strokeWidth={activeTab === 'menu' ? 2.5 : 2} />
         </button>
      </div>
    </div>
  );
};
