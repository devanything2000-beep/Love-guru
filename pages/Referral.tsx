
import React, { useState } from 'react';
import { GlassCard } from '../components/UIComponents';
import { Trophy, Gift, Copy, CheckCircle, Plus, Save, X, TrendingUp, Lock, Share2, Trash2, Rocket, Zap, Crown } from 'lucide-react';

interface ReferralCode {
   id: string;
   code: string;
   usage: number;
   isNew?: boolean;
}

export const Referral = () => {
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);
  const [myCodes, setMyCodes] = useState<ReferralCode[]>([
     { id: '1', code: 'LOVE-RHL-24', usage: 2 },
     { id: '2', code: 'PILOT-X99', usage: 0 },
  ]);
  const [generatedDraft, setGeneratedDraft] = useState<string | null>(null);
  
  // Calculate total referrals from active codes for demo purposes
  const totalReferrals = myCodes.reduce((acc, curr) => acc + curr.usage, 0);
  
  // --- REWARD LOGIC ---
  const milestones = [
    { target: 3, reward: '1 Week Premium Fetcher Free', icon: Zap },
    { target: 10, reward: '1 Month Premium Fetcher Free', icon: Crown },
  ];

  // Determine current status
  const nextMilestone = milestones.find(m => totalReferrals < m.target) || milestones[milestones.length - 1];
  const isCompleted = totalReferrals >= milestones[milestones.length - 1].target;
  
  // Progress Bar Calculation (Scale to max target 10 for visual)
  const maxTarget = 10;
  const progressPercent = Math.min((totalReferrals / maxTarget) * 100, 100);

  const handleCopy = (codeId: string, codeText: string) => {
    navigator.clipboard.writeText(codeText);
    setCopiedCodeId(codeId);
    setTimeout(() => setCopiedCodeId(null), 2000);
  };

  const handleGenerateDraft = () => {
     const randomStr = Math.random().toString(36).substring(2, 6).toUpperCase();
     setGeneratedDraft(`LOVE-${randomStr}`);
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

  const handleDeleteCode = (id: string) => {
      // confirm delete in a real app
      setMyCodes(prev => prev.filter(code => code.id !== id));
  };

  return (
    <div className="animate-fade-in max-w-3xl mx-auto pb-10 space-y-8">
       
       <div className="text-center">
          <h1 className="text-3xl font-bold text-white flex items-center justify-center gap-2">
             <Gift className="text-rose-500" /> Unlock Premium Fetchers
          </h1>
          <p className="text-white/60 mt-2">Invite friends to use Love Pilot and earn free access to paid AI tools.</p>
       </div>

       {/* --- REWARD TRACKER --- */}
       <GlassCard className="!bg-gradient-to-br !from-slate-900 !to-slate-800 border-rose-500/20 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-rose-500 to-purple-600"></div>
          
          <div className="flex justify-between items-start mb-8">
             <div className="flex items-center gap-4">
                <div className="p-4 bg-gradient-to-br from-rose-500 to-pink-600 rounded-2xl text-white shadow-xl shadow-rose-900/20">
                   <Rocket size={32} fill="currentColor" />
                </div>
                <div>
                   <h3 className="text-2xl font-bold text-white">
                      {isCompleted ? 'All Rewards Unlocked!' : `Next: ${nextMilestone.reward}`}
                   </h3>
                   <p className="text-sm text-rose-300 font-bold mt-1">
                      {isCompleted ? 'You are a Super Referrer' : `${nextMilestone.target - totalReferrals} more referrals needed`}
                   </p>
                </div>
             </div>
             <div className="text-right">
                <div className="text-4xl font-bold text-white">{totalReferrals}</div>
                <div className="text-xs text-white/50 uppercase tracking-wider">Total Referrals</div>
             </div>
          </div>

          <div className="bg-black/30 rounded-2xl p-6 border border-white/5 relative">
             <div className="flex justify-between items-end mb-2">
                <span className="text-xs font-bold text-white uppercase tracking-wider">Progress</span>
                <span className="text-xs font-bold text-white/60">{Math.floor(progressPercent)}%</span>
             </div>
             
             {/* Progress Bar */}
             <div className="h-4 bg-slate-700 rounded-full overflow-hidden mb-8 relative">
                <div 
                   className="h-full bg-gradient-to-r from-rose-500 via-purple-500 to-blue-500 transition-all duration-1000"
                   style={{ width: `${progressPercent}%` }}
                ></div>
                {/* Milestone Markers on Bar */}
                <div className="absolute top-0 bottom-0 left-[30%] w-0.5 bg-white/20"></div>
                <div className="absolute top-0 bottom-0 right-0 w-0.5 bg-white/20"></div>
             </div>

             {/* Milestones Visual */}
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Milestone 1 */}
                <div className={`p-4 rounded-xl border flex items-center gap-4 transition-all ${totalReferrals >= 3 ? 'bg-green-500/10 border-green-500/40' : 'bg-white/5 border-white/5 opacity-60'}`}>
                   <div className={`p-2 rounded-full ${totalReferrals >= 3 ? 'bg-green-500 text-white' : 'bg-white/10 text-white/30'}`}>
                      {totalReferrals >= 3 ? <CheckCircle size={20} /> : <Lock size={20} />}
                   </div>
                   <div>
                      <div className="text-sm font-bold text-white flex items-center gap-2">
                         3 Users <Zap size={14} className="text-yellow-400" fill="currentColor"/>
                      </div>
                      <div className="text-xs text-white/60">1 Week Premium Fetcher Free</div>
                   </div>
                </div>

                {/* Milestone 2 */}
                <div className={`p-4 rounded-xl border flex items-center gap-4 transition-all ${totalReferrals >= 10 ? 'bg-purple-500/10 border-purple-500/40' : 'bg-white/5 border-white/5 opacity-60'}`}>
                   <div className={`p-2 rounded-full ${totalReferrals >= 10 ? 'bg-purple-500 text-white' : 'bg-white/10 text-white/30'}`}>
                      {totalReferrals >= 10 ? <CheckCircle size={20} /> : <Lock size={20} />}
                   </div>
                   <div>
                      <div className="text-sm font-bold text-white flex items-center gap-2">
                         10 Users <Crown size={14} className="text-yellow-400" fill="currentColor"/>
                      </div>
                      <div className="text-xs text-white/60">1 Month Premium Fetcher Free</div>
                   </div>
                </div>
             </div>
          </div>
       </GlassCard>

       {/* --- CODE MANAGER --- */}
       <GlassCard>
          <div className="flex justify-between items-center mb-6">
             <h3 className="font-bold text-lg flex items-center gap-2">
                <Share2 size={20} className="text-blue-400"/> Your Referral Codes
             </h3>
             {!generatedDraft && (
                <button 
                  onClick={handleGenerateDraft} 
                  className="flex items-center gap-2 text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white px-4 py-2 rounded-full transition shadow-lg shadow-rose-900/20 active:scale-95"
                >
                  <Plus size={14} /> Create New Code
                </button>
             )}
          </div>

          {generatedDraft && (
             <div className="bg-rose-500/10 border border-rose-500/30 rounded-xl p-4 mb-6 animate-slide-up">
                <div className="flex flex-col md:flex-row items-center gap-4">
                   <div className="flex-1 w-full text-center md:text-left">
                      <div className="text-xs text-rose-300 font-bold mb-1">New Code Draft</div>
                      <div className="font-mono text-xl font-bold text-white tracking-widest">{generatedDraft}</div>
                   </div>
                   <div className="flex gap-2 w-full md:w-auto">
                      <button 
                         onClick={handleSaveDraft}
                         className="flex-1 md:flex-none px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg text-sm font-bold flex items-center justify-center gap-2"
                      >
                         <Save size={16} /> Save
                      </button>
                      <button 
                         onClick={() => setGeneratedDraft(null)}
                         className="flex-1 md:flex-none px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm font-bold flex items-center justify-center gap-2"
                      >
                         <X size={16} /> Cancel
                      </button>
                   </div>
                </div>
             </div>
          )}

          <div className="space-y-3">
             {myCodes.length === 0 ? (
                <div className="text-center py-8 text-white/30 text-sm">You haven't created any codes yet.</div>
             ) : (
                myCodes.map((item) => (
                   <div 
                     key={item.id} 
                     className="flex flex-col md:flex-row items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition gap-4"
                   >
                      <div className="flex items-center gap-4 w-full md:w-auto">
                         <div className="p-2.5 bg-black/30 rounded-lg text-white/50">
                            <TrendingUp size={18} />
                         </div>
                         <div>
                            <div className="font-mono font-bold text-white flex items-center gap-2">
                               {item.code}
                               {item.isNew && <span className="text-[9px] bg-rose-500 px-1.5 py-0.5 rounded text-white font-sans font-bold">NEW</span>}
                            </div>
                            <div className="text-xs text-white/40">
                               {item.usage} users registered
                            </div>
                         </div>
                      </div>
                      
                      <div className="flex items-center gap-2 w-full md:w-auto">
                         <button 
                            onClick={() => handleCopy(item.id, item.code)}
                            className={`
                               flex-1 md:flex-none py-2 px-4 rounded-lg flex items-center justify-center gap-2 text-xs font-bold transition
                               ${copiedCodeId === item.id 
                                  ? 'bg-green-500/20 text-green-400' 
                                  : 'bg-white/10 hover:bg-white/20 text-white'}
                            `}
                         >
                            {copiedCodeId === item.id ? <CheckCircle size={14} /> : <Copy size={14} />}
                            {copiedCodeId === item.id ? 'Copied' : 'Copy'}
                         </button>
                         <button 
                            onClick={() => handleDeleteCode(item.id)}
                            className="p-2 bg-white/5 hover:bg-red-500/20 text-white/40 hover:text-red-400 rounded-lg transition"
                            title="Remove Code"
                         >
                            <Trash2 size={16} />
                         </button>
                      </div>
                   </div>
                ))
             )}
          </div>
       </GlassCard>
    </div>
  );
};
