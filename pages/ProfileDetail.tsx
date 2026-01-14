import React from 'react';
import { GlassCard, PrimaryButton, VerifiedBadge } from '../components/UIComponents';
import { User } from '../types';
import { ArrowLeft, MapPin, Heart, Shield, X, Check } from 'lucide-react';

interface ProfileDetailProps {
  user: User;
  onBack: () => void;
}

export const ProfileDetail: React.FC<ProfileDetailProps> = ({ user, onBack }) => {
  return (
    <div className="animate-fade-in max-w-3xl mx-auto pb-10">
      {/* Header / Nav */}
      <div className="flex items-center gap-4 mb-6">
         <button onClick={onBack} className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition">
            <ArrowLeft size={24} />
         </button>
         <h2 className="text-xl font-bold">Profile Details</h2>
      </div>

      {/* Hero */}
      <div className="relative h-96 w-full rounded-3xl overflow-hidden mb-6 shadow-2xl">
         <img src={user.avatar} className="w-full h-full object-cover" />
         <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-transparent to-transparent"></div>
         <div className="absolute bottom-6 left-6 right-6">
            <div className="flex justify-between items-end">
               <div>
                  <h1 className="text-4xl font-bold text-white flex items-center gap-2 mb-2">
                     {user.name}, {user.age}
                     {/* Assume verified logic here based on ID or prop */}
                     <VerifiedBadge size={28} />
                  </h1>
                  <div className="flex items-center text-slate-300 text-lg">
                     <MapPin size={18} className="mr-2 text-rose-500" /> {user.city}
                  </div>
               </div>
               <div className="bg-black/40 backdrop-blur-md px-4 py-2 rounded-xl border border-rose-500/50 text-center">
                  <div className="text-xs text-rose-300 font-bold uppercase tracking-wider">Match</div>
                  <div className="text-2xl font-bold text-white">{user.matchPercentage || 85}%</div>
               </div>
            </div>
         </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         
         {/* Main Info */}
         <div className="md:col-span-2 space-y-6">
            <GlassCard>
               <h3 className="text-sm font-bold text-white/50 uppercase tracking-widest mb-3">About</h3>
               <p className="text-lg leading-relaxed text-slate-200">"{user.bio}"</p>
            </GlassCard>

            <GlassCard>
               <h3 className="text-sm font-bold text-white/50 uppercase tracking-widest mb-4">Interests</h3>
               <div className="flex flex-wrap gap-2">
                  {user.interests.map(tag => (
                     <span key={tag} className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm">
                        {tag}
                     </span>
                  ))}
               </div>
            </GlassCard>

            <GlassCard>
               <h3 className="text-sm font-bold text-white/50 uppercase tracking-widest mb-4">AI Compatibility Analysis</h3>
               <div className="grid grid-cols-2 gap-4">
                  <div className="bg-green-500/10 border border-green-500/20 p-4 rounded-xl">
                     <div className="flex items-center gap-2 text-green-400 font-bold mb-2">
                        <Check size={18} /> Green Flags
                     </div>
                     <ul className="text-sm space-y-1 text-slate-300">
                        {user.greenFlags?.map((flag, i) => <li key={i}>• {flag}</li>) || <li>• Great communication</li>}
                     </ul>
                  </div>
                  <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl">
                     <div className="flex items-center gap-2 text-red-400 font-bold mb-2">
                        <X size={18} /> Red Flags
                     </div>
                     <ul className="text-sm space-y-1 text-slate-300">
                        {user.redFlags?.map((flag, i) => <li key={i}>• {flag}</li>) || <li>• None detected</li>}
                     </ul>
                  </div>
               </div>
            </GlassCard>
         </div>

         {/* Sidebar / Gallery Preview */}
         <div className="md:col-span-1 space-y-6">
            <GlassCard className="p-0 overflow-hidden">
               <div className="p-4 border-b border-white/5 font-bold">Photos</div>
               <div className="grid grid-cols-2 gap-1 p-1">
                  {user.photos?.map((photo, i) => (
                     <img key={i} src={photo} className="w-full aspect-square object-cover rounded-lg" />
                  ))}
                  <div className="bg-white/5 aspect-square rounded-lg flex items-center justify-center text-white/20 text-xs">
                     +2 More
                  </div>
               </div>
            </GlassCard>

            <div className="flex gap-4">
               <button className="flex-1 py-4 bg-white/5 rounded-2xl flex items-center justify-center text-slate-400 hover:text-white transition">
                  <X size={32} />
               </button>
               <button className="flex-1 py-4 bg-rose-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-rose-900/40 hover:scale-105 transition">
                  <Heart size={32} fill="white" />
               </button>
            </div>
         </div>

      </div>
    </div>
  );
};
