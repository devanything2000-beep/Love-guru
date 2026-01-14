
import React, { useState, useEffect } from 'react';
import { GlassCard, PrimaryButton } from '../components/UIComponents';
import { CURRENT_USER } from '../constants';
import { User, Shield, Globe, Moon, Bell, Brain, Lock, Crown, Clock, Gift, ArrowRight, Zap } from 'lucide-react';

export const Settings = ({ onNavigate }: { onNavigate?: (page: string) => void }) => {
  const [tone, setTone] = useState('Romantic');
  const [lang, setLang] = useState('English');

  // Countdown Logic
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0 });
  const targetDate = CURRENT_USER.premiumUntil;

  useEffect(() => {
     if (!targetDate) return;
     
     const calculate = () => {
        const diff = +new Date(targetDate) - +new Date();
        if (diff > 0) {
           setTimeLeft({
              days: Math.floor(diff / (1000 * 60 * 60 * 24)),
              hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
              minutes: Math.floor((diff / 1000 / 60) % 60),
           });
        } else {
           setTimeLeft({ days: 0, hours: 0, minutes: 0 });
        }
     };

     calculate();
     const timer = setInterval(calculate, 60000); // Update every minute
     return () => clearInterval(timer);
  }, [targetDate]);

  const isTrialActive = timeLeft.days > 0 || timeLeft.hours > 0;

  return (
    <div className="animate-fade-in max-w-2xl mx-auto pb-10">
       <h1 className="text-3xl font-bold text-white mb-8">My Profile</h1>

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

       {/* --- NEW USER BONUS FEATURES SECTION --- */}
       {isTrialActive ? (
          <div>
             <h3 className="text-sm font-bold text-white/50 uppercase tracking-widest mb-3 ml-1">New User Bonus Features</h3>
             <GlassCard className="mb-6 !p-0 overflow-hidden border-indigo-500/30">
                <div className="bg-gradient-to-r from-indigo-900/50 to-purple-900/50 p-5">
                    <div className="flex justify-between items-start mb-6">
                       <div className="flex items-center gap-3">
                          <div className="p-2.5 bg-indigo-500 rounded-xl shadow-lg shadow-indigo-900/30">
                             <Gift size={20} className="text-white" />
                          </div>
                          <div>
                             <h3 className="font-bold text-white text-lg leading-tight">Free Trial Active</h3>
                             <p className="text-xs text-indigo-200/80">Exclusive access for new users</p>
                          </div>
                       </div>
                       <div className="px-3 py-1 bg-green-500/20 text-green-400 text-xs font-bold rounded-full border border-green-500/30 flex items-center gap-1.5 shadow-sm">
                          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> Active
                       </div>
                    </div>
                    
                    {/* Countdown Row */}
                    <div className="bg-[#0F172A]/40 rounded-xl p-4 flex items-center justify-between border border-white/10 backdrop-blur-sm">
                         <div className="flex items-center gap-3">
                             <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-300">
                                <Clock size={20} />
                             </div>
                             <div>
                                <div className="text-[10px] text-white/50 uppercase font-bold tracking-wider">Time Remaining</div>
                                <div className="text-sm font-bold text-white">Premium Fetcher Free Use</div>
                             </div>
                         </div>
                         <div className="text-right">
                             <div className="font-mono text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-rose-400 tracking-tight">
                                {timeLeft.days}d : {timeLeft.hours}h : {timeLeft.minutes}m
                             </div>
                         </div>
                    </div>
                </div>
                
                {/* Bottom Active/Inactive */}
                <div className="bg-[#0F172A]/60 px-5 py-3 border-t border-white/5 flex justify-between items-center text-xs backdrop-blur-md">
                    <div className="flex items-center gap-2">
                       <Zap size={14} className="text-yellow-400" fill="currentColor" />
                       <span className="text-white/60">Status: <span className="text-white font-bold">Bonus Running</span></span>
                    </div>
                    <button className="text-indigo-400 font-bold hover:text-indigo-300 hover:underline">View Features</button>
                </div>
             </GlassCard>
          </div>
       ) : (
          <div className="p-4 rounded-xl bg-gradient-to-r from-rose-900/40 to-orange-900/40 border border-rose-500/30 mb-6 flex items-center justify-between animate-fade-in">
             <div className="flex items-center gap-3">
                <Crown className="text-yellow-400" size={24} />
                <div>
                   <h3 className="text-sm font-bold text-white">Premium Expired</h3>
                   <p className="text-xs text-white/60">Unlock 1 Week Free Extension!</p>
                </div>
             </div>
             {onNavigate && (
               <button 
                  onClick={() => onNavigate('referral')}
                  className="flex items-center gap-1 text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white px-4 py-2 rounded-lg transition"
               >
                  Extend Now <ArrowRight size={12} />
               </button>
             )}
          </div>
       )}

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
