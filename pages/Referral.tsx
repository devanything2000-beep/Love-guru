
import React, { useState, useEffect } from 'react';
import { GlassCard, PrimaryButton } from '../components/UIComponents';
import { CURRENT_USER, REFERRAL_TIERS } from '../constants';
import { Trophy, Gift, Copy, CheckCircle, Plus, Save, X, TrendingUp, Clock, Crown, Lock, Share2, Users, DollarSign, Calendar, Zap } from 'lucide-react';

interface ReferralCode {
   id: string;
   code: string;
   usage: number;
   isNew?: boolean;
}

export const Referral = () => {
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);
  const [myCodes, setMyCodes] = useState<ReferralCode[]>([
     { id: '1', code: 'LOVE-RHL-24', usage: 12 },
     { id: '2', code: 'PILOT-X99', usage: 4 },
  ]);
  const [generatedDraft, setGeneratedDraft] = useState<string | null>(null);
  
  // Sort codes: Higher usage first
  const sortedCodes = [...myCodes].sort((a, b) => b.usage - a.usage);

  const handleCopy = (codeId: string, codeText: string) => {
    navigator.clipboard.writeText(codeText);
    setCopiedCodeId(codeId);
    setTimeout(() => setCopiedCodeId(null), 2000);
  };

  const handleGenerateDraft = () => {
     const randomStr = Math.random().toString(36).substring(2, 6).toUpperCase();
     setGeneratedDraft(`LOVE-${randomStr}-NEW`);
  };

  const handleSaveDraft = () => {
     if (generatedDraft) {
        const newCodeObj: ReferralCode = {
           id: Date.now().toString(),
           code: generatedDraft,
           usage: 0,
           isNew: true
        };
        setMyCodes(prev => [newCodeObj, ...prev]);
        setGeneratedDraft(null);
     }
  };

  const handleDismissDraft = () => {
     setGeneratedDraft(null);
  };

  // Logic: 1 Week Free Trial
  const [daysLeft, setDaysLeft] = useState(0);
  useEffect(() => {
     if (CURRENT_USER.premiumUntil) {
        const end = new Date(CURRENT_USER.premiumUntil).getTime();
        const now = new Date().getTime();
        const diff = Math.ceil((end - now) / (1000 * 60 * 60 * 24));
        setDaysLeft(diff > 0 ? diff : 0);
     }
  }, []);

  // Logic: Monthly Referral Mission (2 Referrals = 1 Week Extension)
  const monthlyGoal = 2;
  const currentMonthlyReferrals = CURRENT_USER.referralsThisMonth || 0;
  const missionProgress = Math.min((currentMonthlyReferrals / monthlyGoal) * 100, 100);
  const isMissionComplete = currentMonthlyReferrals >= monthlyGoal;

  return (
    <div className="animate-fade-in max-w-3xl mx-auto pb-10 space-y-6">
       
       <div className="text-center mb-4">
          <h1 className="text-3xl font-bold text-white flex items-center justify-center gap-2">
             <Gift className="text-rose-500" /> Refer & Earn
          </h1>
          <p className="text-white/60 mt-2">Unlock Premium extensions by inviting friends.</p>
       </div>

       {/* --- NEW USER BONUS & COUNTDOWN --- */}
       <div className="p-6 rounded-3xl bg-gradient-to-r from-indigo-900 to-purple-900 border border-indigo-500/30 relative overflow-hidden shadow-2xl">
           <div className="absolute top-0 right-0 p-10 opacity-10"><Clock size={120} /></div>
           <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                 <div className="flex items-center gap-2 mb-2">
                    <span className="bg-yellow-400 text-black text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">New User Bonus</span>
                    <span className={`text-xs font-bold ${daysLeft > 0 ? 'text-green-400' : 'text-red-400'}`}>
                       {daysLeft > 0 ? 'ACTIVE' : 'EXPIRED'}
                    </span>
                 </div>
                 <h2 className="text-3xl font-bold text-white mb-2">
                    {daysLeft} Days Free Trial Left
                 </h2>
                 <p className="text-indigo-200 text-sm max-w-sm">
                    You have full access to Premium features. Don't lose your streak!
                 </p>
              </div>
              <div className="text-center bg-black/20 p-4 rounded-2xl backdrop-blur-md border border-white/10 min-w-[120px]">
                 <div className="text-xs text-white/60 uppercase mb-1">Ends In</div>
                 <div className="text-2xl font-bold font-mono text-white">{daysLeft} Days</div>
              </div>
           </div>
       </div>

       {/* --- MONTHLY MISSION CONTROL --- */}
       <GlassCard className="!bg-gradient-to-br !from-slate-900 !to-slate-800 border-rose-500/20 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-rose-500 to-orange-500"></div>
          
          <div className="flex items-center gap-3 mb-6">
             <div className="p-3 bg-rose-500/20 rounded-full text-rose-400">
                <Zap size={24} fill="currentColor" />
             </div>
             <div>
                <h3 className="text-xl font-bold text-white">Monthly Mission</h3>
                <p className="text-sm text-white/50">Refer 2 new friends this month to extend your plan.</p>
             </div>
          </div>

          <div className="bg-black/30 rounded-2xl p-6 border border-white/5 relative">
             <div className="flex justify-between items-end mb-2">
                <span className="text-sm font-bold text-white">Progress</span>
                <span className="text-sm font-bold text-rose-400">{currentMonthlyReferrals} / {monthlyGoal} Friends</span>
             </div>
             
             {/* Progress Bar */}
             <div className="h-4 bg-slate-700 rounded-full overflow-hidden mb-4">
                <div 
                   className="h-full bg-gradient-to-r from-rose-500 to-orange-500 transition-all duration-1000"
                   style={{ width: `${missionProgress}%` }}
                ></div>
             </div>

             <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-white/60">
                   <Calendar size={14} /> Resets on 1st of next month
                </div>
                {isMissionComplete ? (
                   <button className="px-4 py-2 bg-green-500 text-white font-bold rounded-lg text-xs shadow-lg shadow-green-900/20 flex items-center gap-2 cursor-default">
                      <CheckCircle size={14} /> Reward Claimed (+7 Days)
                   </button>
                ) : (
                   <div className="flex items-center gap-2 text-yellow-400 font-bold text-xs bg-yellow-400/10 px-3 py-1.5 rounded-lg border border-yellow-400/20">
                      <Gift size={14} /> Reward: +7 Days Free Premium
                   </div>
                )}
             </div>
          </div>
       </GlassCard>

       {/* --- CODE MANAGER --- */}
       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Code List */}
          <div className="md:col-span-3">
             <GlassCard>
                <div className="flex justify-between items-center mb-6">
                   <h3 className="font-bold text-lg flex items-center gap-2">
                      <TrendingUp size={20} className="text-rose-500"/> Your Codes
                   </h3>
                   {!generatedDraft && (
                      <button 
                        onClick={handleGenerateDraft} 
                        className="flex items-center gap-2 text-xs font-bold bg-white/10 hover:bg-white/20 border border-white/10 text-white px-4 py-2 rounded-full transition active:scale-95"
                      >
                        <Plus size={14} /> Generate New
                      </button>
                   )}
                </div>

                {/* Draft Zone */}
                {generatedDraft && (
                   <div className="bg-rose-500/10 border border-rose-500/50 rounded-xl p-4 mb-6 animate-slide-up">
                      <div className="text-xs text-rose-300 font-bold mb-3 flex items-center gap-2">
                         <div className="w-2 h-2 bg-rose-500 rounded-full animate-pulse"></div> New Code Generated
                      </div>
                      <div className="flex flex-col md:flex-row items-center gap-4">
                         <div className="flex-1 w-full bg-black/40 p-4 rounded-xl font-mono text-xl font-bold text-white tracking-widest text-center border border-rose-500/30 shadow-inner">
                            {generatedDraft}
                         </div>
                         <div className="flex gap-2 w-full md:w-auto">
                            <button 
                               onClick={handleSaveDraft}
                               className="flex-1 md:flex-none px-6 py-3 bg-green-600 hover:bg-green-500 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition shadow-lg"
                            >
                               <Save size={16} /> Save
                            </button>
                            <button 
                               onClick={handleDismissDraft}
                               className="flex-1 md:flex-none px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition"
                            >
                               <X size={16} /> Dismiss
                            </button>
                         </div>
                      </div>
                   </div>
                )}

                {/* List */}
                <div className="space-y-3">
                   {sortedCodes.map((item, index) => (
                      <div 
                        key={item.id} 
                        className={`
                          flex flex-col md:flex-row items-start md:items-center justify-between p-4 rounded-xl border transition-all gap-4
                          ${index === 0 ? 'bg-gradient-to-r from-emerald-900/30 to-emerald-900/10 border-emerald-500/20' : 'bg-white/5 border-white/5'}
                        `}
                      >
                         <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-xl ${index === 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/5 text-white/40'}`}>
                               {index === 0 ? <TrendingUp size={20} /> : <Share2 size={20} />}
                            </div>
                            <div>
                               <div className="font-mono font-bold text-lg text-white flex items-center gap-2">
                                  {item.code}
                                  {item.isNew && <span className="text-[10px] bg-rose-500 px-2 py-0.5 rounded-full text-white font-sans font-bold">NEW</span>}
                               </div>
                               <div className="text-xs text-white/40 mt-1 flex items-center gap-2">
                                  Used {item.usage} times • Created {new Date().toLocaleDateString()}
                               </div>
                            </div>
                         </div>
                         
                         <button 
                            onClick={() => handleCopy(item.id, item.code)}
                            className={`
                               w-full md:w-auto py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition font-medium text-sm
                               ${copiedCodeId === item.id 
                                  ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                                  : 'bg-black/20 hover:bg-black/40 text-white/70 hover:text-white border border-white/5'}
                            `}
                         >
                            {copiedCodeId === item.id ? <><CheckCircle size={16} /> Copied</> : <><Copy size={16} /> Copy Code</>}
                         </button>
                      </div>
                   ))}
                </div>
             </GlassCard>
          </div>
       </div>

    </div>
  );
};
