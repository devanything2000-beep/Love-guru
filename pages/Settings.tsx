
import React, { useState, useEffect } from 'react';
import { GlassCard, PrimaryButton } from '../components/UIComponents';
import { User, Shield, Globe, Moon, Bell, Brain, Lock, Crown, Clock, Gift, ArrowRight, Zap, Terminal } from 'lucide-react';
import { User as UserType } from '../types';

const TimeBox = ({val, label}: {val: number, label: string}) => (
  <div className="flex flex-col items-center">
     <div className="bg-black/40 rounded-lg p-2 min-w-[44px] border border-white/10 backdrop-blur-sm shadow-inner">
        <span className="font-mono text-xl font-bold text-white tabular-nums tracking-tight">
          {String(val).padStart(2, '0')}
        </span>
     </div>
     <span className="text-[9px] text-white/50 font-bold mt-1.5">{label}</span>
  </div>
);

interface SettingsProps {
   onNavigate?: (page: string) => void;
   currentUser?: UserType;
   onUpdateUser?: (user: UserType) => void;
}

export const Settings: React.FC<SettingsProps> = ({ onNavigate, currentUser, onUpdateUser }) => {
  const [tone, setTone] = useState('Romantic');
  const [lang, setLang] = useState('English');

  // Countdown Logic
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const targetDate = currentUser?.premiumUntil;

  useEffect(() => {
     if (!targetDate) return;
     
     const calculate = () => {
        const diff = +new Date(targetDate) - +new Date();
        if (diff > 0) {
           setTimeLeft({
              days: Math.floor(diff / (1000 * 60 * 60 * 24)),
              hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
              minutes: Math.floor((diff / 1000 / 60) % 60),
              seconds: Math.floor((diff / 1000) % 60),
           });
        } else {
           setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        }
     };

     calculate();
     const timer = setInterval(calculate, 1000); // Update every second
     return () => clearInterval(timer);
  }, [targetDate]);

  const isTrialActive = timeLeft.days > 0 || timeLeft.hours > 0 || timeLeft.minutes > 0 || timeLeft.seconds > 0;

  const toggleRole = () => {
      if (currentUser && onUpdateUser) {
          onUpdateUser({
              ...currentUser,
              role: currentUser.role === 'admin' ? 'user' : 'admin'
          });
      }
  };

  if (!currentUser) return null;

  return (
    <div className="animate-fade-in max-w-2xl mx-auto pb-10">
       <h1 className="text-3xl font-bold text-white mb-8">My Profile</h1>

       {/* Profile Card */}
       <GlassCard className="mb-6 flex items-center gap-6">
          <img src={currentUser.avatar} className="w-20 h-20 rounded-full border-2 border-white/20 object-cover" />
          <div>
             <h2 className="text-xl font-bold flex items-center gap-2">
                 {currentUser.name} 
                 {currentUser.role === 'admin' && <Shield size={16} className="text-red-500 fill-red-500/20" />}
             </h2>
             <p className="text-white/60 text-sm">{currentUser.bio}</p>
             <div className="flex gap-2 mt-2">
                <span className="inline-block bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded text-xs border border-purple-500/30">
                   {currentUser.plan} Plan
                </span>
                <span className="inline-block bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded text-xs border border-blue-500/30 capitalize">
                   Role: {currentUser.role}
                </span>
             </div>
          </div>
       </GlassCard>

       {/* --- NEW USER BONUS FEATURES SECTION --- */}
       {isTrialActive ? (
          <div>
             <h3 className="text-sm font-bold text-white/50 uppercase tracking-widest mb-3 ml-1">New User Bonus</h3>
             <GlassCard className="mb-6 !p-0 overflow-hidden border-indigo-500/50 shadow-lg shadow-indigo-900/20 group">
                <div className="bg-gradient-to-r from-indigo-900 via-purple-900 to-indigo-900 p-6 relative">
                    {/* Background effects */}
                    <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white via-transparent to-transparent pointer-events-none"></div>
                    
                    <div className="relative z-10">
                        <div className="flex justify-between items-start mb-6">
                           <div className="flex items-center gap-4">
                              <div className="p-3 bg-indigo-500 rounded-2xl shadow-lg shadow-indigo-500/40 group-hover:scale-110 transition-transform duration-300">
                                 <Gift size={24} className="text-white" />
                              </div>
                              <div>
                                 <h3 className="font-bold text-white text-xl leading-tight">Premium Unlocked</h3>
                                 <p className="text-xs text-indigo-200/80">Exclusive new user perk</p>
                              </div>
                           </div>
                           <div className="px-3 py-1 bg-green-500/20 text-green-300 text-xs font-bold rounded-full border border-green-500/30 flex items-center gap-1.5 shadow-sm">
                              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> Active
                           </div>
                        </div>
                        
                        {/* Countdown Row */}
                        <div className="bg-white/5 rounded-2xl p-5 border border-white/10 backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-4">
                             <div className="flex items-center gap-4 w-full md:w-auto">
                                 <div className="p-3 bg-orange-500/20 rounded-xl text-orange-400">
                                    <Clock size={24} />
                                 </div>
                                 <div>
                                    <div className="text-[10px] text-orange-400 uppercase font-bold tracking-widest mb-1">Limited Time Offer</div>
                                    <div className="text-sm font-bold text-white leading-tight max-w-[180px]">New User: 6 Days Free Premium Fetcher Use For Limited Time</div>
                                 </div>
                             </div>
                             
                             {/* Digital Clock */}
                             <div className="flex items-center gap-2">
                                 <TimeBox val={timeLeft.days} label="DAYS" />
                                 <span className="text-xl font-bold text-white/20 -mt-4">:</span>
                                 <TimeBox val={timeLeft.hours} label="HRS" />
                                 <span className="text-xl font-bold text-white/20 -mt-4">:</span>
                                 <TimeBox val={timeLeft.minutes} label="MINS" />
                                 <span className="text-xl font-bold text-white/20 -mt-4">:</span>
                                 <TimeBox val={timeLeft.seconds} label="SECS" />
                             </div>
                        </div>
                    </div>
                </div>
                
                {/* Bottom Active/Inactive */}
                <div className="bg-[#0F172A] px-5 py-3 border-t border-white/5 flex justify-between items-center text-xs">
                    <div className="flex items-center gap-2">
                       <Zap size={14} className="text-yellow-400 fill-yellow-400" />
                       <span className="text-white/60">Status: <span className="text-white font-bold">Bonus Running</span></span>
                    </div>
                    <button className="text-indigo-400 font-bold hover:text-indigo-300 flex items-center gap-1 hover:gap-2 transition-all">
                       View Features <ArrowRight size={12}/>
                    </button>
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

          {/* Role Toggling for Demo */}
          <div>
             <h3 className="text-sm font-bold text-white/50 uppercase tracking-widest mb-3 ml-1">Developer Controls</h3>
             <GlassCard className="flex items-center justify-between border-blue-500/30 bg-blue-900/10">
                <div className="flex items-center gap-3">
                    <Terminal size={20} className="text-blue-400" />
                    <div>
                        <span className="font-bold text-white block">Current Role: {currentUser.role === 'admin' ? 'Company Staff (Admin)' : 'Regular User'}</span>
                        <span className="text-xs text-white/50">Toggle to test access to System Architect page.</span>
                    </div>
                </div>
                <button 
                   onClick={toggleRole}
                   className={`px-4 py-2 rounded-lg text-sm font-bold transition ${currentUser.role === 'admin' ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white'}`}
                >
                   Switch to {currentUser.role === 'admin' ? 'User' : 'Admin'}
                </button>
             </GlassCard>
          </div>

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
                      className="bg-white/5 border border-white/10 rounded-lg px-3 py-1 text-sm outline-none focus:ring-1 focus:ring-rose-500 text-white"
                   >
                      <option className="bg-slate-800">Romantic</option>
                      <option className="bg-slate-800">Funny</option>
                      <option className="bg-slate-800">Direct</option>
                      <option className="bg-slate-800">Cute</option>
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
                      className="bg-white/5 border border-white/10 rounded-lg px-3 py-1 text-sm outline-none focus:ring-1 focus:ring-blue-500 text-white"
                   >
                      <option className="bg-slate-800">English</option>
                      <option className="bg-slate-800">Hindi</option>
                      <option className="bg-slate-800">Hinglish</option>
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
