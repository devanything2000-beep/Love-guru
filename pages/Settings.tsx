
import React, { useState } from 'react';
import { GlassCard, PrimaryButton } from '../components/UIComponents';
import { CURRENT_USER } from '../constants';
import { User, Shield, Globe, Moon, Bell, Brain, Lock } from 'lucide-react';

export const Settings = () => {
  const [tone, setTone] = useState('Romantic');
  const [lang, setLang] = useState('English');

  return (
    <div className="animate-fade-in max-w-2xl mx-auto pb-10">
       <h1 className="text-3xl font-bold text-white mb-8">Settings</h1>

       {/* Profile Card */}
       <GlassCard className="mb-6 flex items-center gap-6">
          <img src={CURRENT_USER.avatar} className="w-20 h-20 rounded-full border-2 border-white/20" />
          <div>
             <h2 className="text-xl font-bold">{CURRENT_USER.name}</h2>
             <p className="text-white/60 text-sm">{CURRENT_USER.bio}</p>
             <div className="flex gap-2 mt-2">
                <span className="inline-block bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded text-xs border border-purple-500/30">
                   {CURRENT_USER.plan} Plan
                </span>
             </div>
          </div>
       </GlassCard>

       <div className="space-y-6">

          {/* AI Customization */}
          <div>
             <h3 className="text-sm font-bold text-white/50 uppercase tracking-widest mb-3 ml-1">AI Preferences</h3>
             <GlassCard className="space-y-4">
                <div className="flex items-center justify-between">
                   <div className="flex items-center gap-3">
                      <Brain size={20} className="text-rose-400" />
                      <span>Love Coach Tone</span>
                   </div>
                   <select 
                      value={tone}
                      onChange={(e) => setTone(e.target.value)}
                      className="bg-white/5 border border-white/10 rounded-lg px-3 py-1 text-sm outline-none focus:ring-1 focus:ring-rose-500"
                   >
                      <option>Romantic</option>
                      <option>Funny</option>
                      <option>Direct</option>
                      <option>Cute</option>
                   </select>
                </div>
                <div className="flex items-center justify-between">
                   <div className="flex items-center gap-3">
                      <Globe size={20} className="text-blue-400" />
                      <span>Language</span>
                   </div>
                   <select 
                      value={lang}
                      onChange={(e) => setLang(e.target.value)}
                      className="bg-white/5 border border-white/10 rounded-lg px-3 py-1 text-sm outline-none focus:ring-1 focus:ring-blue-500"
                   >
                      <option>English</option>
                      <option>Hindi</option>
                      <option>Hinglish</option>
                   </select>
                </div>
             </GlassCard>
          </div>

          {/* Privacy & Safety */}
          <div>
             <h3 className="text-sm font-bold text-white/50 uppercase tracking-widest mb-3 ml-1">Privacy & Safety</h3>
             <GlassCard className="space-y-4">
                <div className="flex items-center justify-between">
                   <div className="flex items-center gap-3">
                      <Lock size={20} className="text-slate-400" />
                      <span>Incognito Mode</span>
                   </div>
                   <div className="w-10 h-6 bg-slate-700 rounded-full flex items-center px-1 cursor-pointer">
                      <div className="w-4 h-4 bg-white/50 rounded-full"></div>
                   </div>
                </div>
                <div className="flex items-center justify-between">
                   <div className="flex items-center gap-3">
                      <Shield size={20} className="text-slate-400" />
                      <span>Block List</span>
                   </div>
                   <button className="text-sm text-white/60 hover:text-white">Manage</button>
                </div>
             </GlassCard>
          </div>

          {/* App Settings */}
          <div>
             <h3 className="text-sm font-bold text-white/50 uppercase tracking-widest mb-3 ml-1">App Settings</h3>
             <GlassCard className="space-y-4">
                <div className="flex items-center justify-between">
                   <div className="flex items-center gap-3">
                      <Bell size={20} className="text-slate-400" />
                      <span>Notifications</span>
                   </div>
                   <div className="w-10 h-6 bg-rose-600 rounded-full flex items-center justify-end px-1 cursor-pointer">
                      <div className="w-4 h-4 bg-white rounded-full"></div>
                   </div>
                </div>
                <div className="flex items-center justify-between">
                   <div className="flex items-center gap-3">
                      <Moon size={20} className="text-slate-400" />
                      <span>Dark Mode</span>
                   </div>
                   <div className="w-10 h-6 bg-rose-600 rounded-full flex items-center justify-end px-1 cursor-pointer">
                      <div className="w-4 h-4 bg-white rounded-full"></div>
                   </div>
                </div>
             </GlassCard>
          </div>

       </div>
       
       <div className="mt-8">
          <PrimaryButton variant="outline" className="w-full text-red-400 border-red-500/50 hover:bg-red-500/10">
             Log Out
          </PrimaryButton>
       </div>
    </div>
  );
};
