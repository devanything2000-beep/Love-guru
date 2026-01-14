import React from 'react';
import { GlassCard } from '../components/UIComponents';
import { SOCIAL_POSTS } from '../constants';
import { Heart, MessageCircle, Share2, Bookmark, CheckCircle, Video, Grid, User as UserIcon } from 'lucide-react';

export const SocialHub = () => {
  return (
    <div className="h-full flex flex-col animate-fade-in max-w-2xl mx-auto w-full">
      {/* Social Header (Tabs) */}
      <div className="flex justify-between items-center mb-6 px-2">
        <h1 className="text-2xl font-bold font-serif italic text-white">Social Hub</h1>
        <div className="flex gap-4">
           <Video className="text-white/70 hover:text-white cursor-pointer" />
           <Grid className="text-white/70 hover:text-white cursor-pointer" />
           <UserIcon className="text-white/70 hover:text-white cursor-pointer" />
        </div>
      </div>

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
    </div>
  );
};