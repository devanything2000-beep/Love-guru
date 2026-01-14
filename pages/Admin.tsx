
import React, { useState } from 'react';
import { GlassCard } from '../components/UIComponents';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { Users, DollarSign, Server, AlertTriangle, Gift, ShieldAlert, TrendingUp, UserCheck, Activity, Target, Zap, ArrowUpRight } from 'lucide-react';
import { REFERRAL_STATS, SAAS_METRICS, FUNNEL_DATA } from '../constants';

const revData = [
  { name: 'Jan', revenue: 4000 },
  { name: 'Feb', revenue: 3000 },
  { name: 'Mar', revenue: 5000 },
  { name: 'Apr', revenue: 7500 },
  { name: 'May', revenue: 9000 },
  { name: 'Jun', revenue: 12000 },
];

export const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState<'system' | 'growth'>('growth');

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      
      {/* Header & Tabs */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
           <h1 className="text-3xl font-bold text-white flex items-center gap-2">
             <span className="bg-gradient-to-r from-red-600 to-orange-600 text-xs px-2 py-1 rounded shadow-lg">SUPER ADMIN</span>
             {activeTab === 'system' ? 'System Overview' : 'Growth & Revenue Engine'}
           </h1>
           <p className="text-white/50 text-sm mt-1">
              {activeTab === 'system' ? 'Monitoring server load & user growth.' : 'Managing unit economics: CAC, LTV & Monetization.'}
           </p>
        </div>
        
        <div className="flex bg-white/5 rounded-xl p-1 border border-white/10">
           <button 
              onClick={() => setActiveTab('growth')}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition flex items-center gap-2 ${activeTab === 'growth' ? 'bg-emerald-600 text-white shadow-lg' : 'text-white/50 hover:text-white'}`}
           >
              <TrendingUp size={16} /> Growth Engine
           </button>
           <button 
              onClick={() => setActiveTab('system')}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition flex items-center gap-2 ${activeTab === 'system' ? 'bg-white/20 text-white' : 'text-white/50 hover:text-white'}`}
           >
              <Activity size={16} /> System
           </button>
        </div>
      </div>

      {activeTab === 'system' ? (
        // --- SYSTEM VIEW ---
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { label: 'Total Revenue', val: '₹4.2L', icon: DollarSign, color: 'text-green-400' },
              { label: 'Active Users', val: '1,203', icon: Users, color: 'text-blue-400' },
              { label: 'Server Load', val: '24%', icon: Server, color: 'text-orange-400' },
              { label: 'Errors (24h)', val: '2', icon: AlertTriangle, color: 'text-red-400' },
            ].map((stat, i) => (
              <GlassCard key={i} className="p-4 flex items-center justify-between">
                 <div>
                   <p className="text-xs text-white/50 uppercase font-bold">{stat.label}</p>
                   <h3 className="text-2xl font-bold mt-1">{stat.val}</h3>
                 </div>
                 <stat.icon className={`${stat.color} opacity-80`} size={28} />
              </GlassCard>
            ))}
          </div>

          <GlassCard className="h-[350px]">
            <h3 className="text-lg font-bold mb-4">Revenue Growth (6 Months)</h3>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revData}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#ffffff40" />
                <YAxis stroke="#ffffff40" />
                <Tooltip contentStyle={{backgroundColor: '#000', borderRadius: '8px', border: '1px solid #333'}} />
                <Area type="monotone" dataKey="revenue" stroke="#10B981" fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </GlassCard>
        </>
      ) : (
        // --- GROWTH & REVENUE ENGINE (NEW) ---
        <>
           {/* Unit Economics Row */}
           <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <GlassCard className="p-4 relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition"><DollarSign size={60} /></div>
                 <p className="text-xs text-white/50 uppercase font-bold">Monthly Recurring (MRR)</p>
                 <h3 className="text-3xl font-bold mt-1">₹{(SAAS_METRICS.mrr / 1000).toFixed(1)}k</h3>
                 <p className="text-xs text-green-400 mt-2 flex items-center gap-1"><ArrowUpRight size={12}/> +12% vs last mo</p>
              </GlassCard>
              
              <GlassCard className="p-4 relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition"><Target size={60} /></div>
                 <p className="text-xs text-white/50 uppercase font-bold">CAC (Cost per User)</p>
                 <h3 className="text-3xl font-bold mt-1">₹{SAAS_METRICS.cac}</h3>
                 <p className="text-xs text-white/40 mt-2">Target: &lt; ₹150</p>
              </GlassCard>

              <GlassCard className="p-4 relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition"><Gift size={60} /></div>
                 <p className="text-xs text-white/50 uppercase font-bold">LTV (Lifetime Value)</p>
                 <h3 className="text-3xl font-bold mt-1 text-emerald-400">₹{SAAS_METRICS.ltv}</h3>
                 <p className="text-xs text-white/40 mt-2">LTV:CAC Ratio = <span className="text-white font-bold">{(SAAS_METRICS.ltv / SAAS_METRICS.cac).toFixed(1)}x</span></p>
              </GlassCard>

              <GlassCard className="p-4 relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition"><Zap size={60} /></div>
                 <p className="text-xs text-white/50 uppercase font-bold">Churn Rate</p>
                 <h3 className="text-3xl font-bold mt-1 text-rose-400">{SAAS_METRICS.churnRate}%</h3>
                 <p className="text-xs text-white/40 mt-2">Industry Avg: 5%</p>
              </GlassCard>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
             {/* Conversion Funnel */}
             <GlassCard className="lg:col-span-2 h-[400px]">
                <h3 className="text-lg font-bold mb-1 flex items-center gap-2">
                   <TrendingUp size={18} className="text-blue-400"/> Acquisition Funnel
                </h3>
                <p className="text-xs text-white/50 mb-6">Referral Traffic → Paid Conversion</p>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={FUNNEL_DATA} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <XAxis type="number" stroke="#ffffff40" hide />
                    <YAxis dataKey="name" type="category" stroke="#ffffff80" width={100} tick={{fontSize: 12}} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1a0b2e', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px' }}
                      itemStyle={{ color: '#fff' }}
                      cursor={{fill: 'rgba(255,255,255,0.05)'}}
                    />
                    <Bar dataKey="value" barSize={30} radius={[0, 4, 4, 0]}>
                       {FUNNEL_DATA.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                       ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
             </GlassCard>

             {/* Forecast / Active Trials */}
             <GlassCard className="h-[400px] flex flex-col justify-center items-center text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-blue-900/20 to-purple-900/20 pointer-events-none"></div>
                <div className="relative z-10">
                   <div className="w-32 h-32 rounded-full border-8 border-white/5 flex items-center justify-center mb-6 mx-auto relative">
                      <div className="absolute inset-0 border-8 border-t-emerald-500 border-r-emerald-500 border-b-transparent border-l-transparent rounded-full rotate-45"></div>
                      <div className="text-3xl font-bold">{SAAS_METRICS.conversionRate}%</div>
                   </div>
                   <h3 className="text-xl font-bold mb-2">Trial Conversion Rate</h3>
                   <p className="text-white/60 text-sm mb-6 px-8">
                      {SAAS_METRICS.activeTrials} users currently in trial.
                      Projected <span className="text-green-400 font-bold">+{Math.floor(SAAS_METRICS.activeTrials * (SAAS_METRICS.conversionRate/100))}</span> new paid users next month.
                   </p>
                   <button className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-full text-sm font-bold transition">
                      View Trial Users
                   </button>
                </div>
             </GlassCard>
          </div>

          {/* Leaderboard Table (Existing) */}
          <GlassCard className="h-[350px] overflow-hidden flex flex-col">
             <h3 className="text-lg font-bold mb-4">Top Referrers (Acquisition Source)</h3>
             <div className="overflow-y-auto custom-scrollbar flex-1">
                <table className="w-full text-left">
                   <thead className="sticky top-0 bg-[#1E293B] z-10">
                      <tr className="text-white/40 text-xs uppercase border-b border-white/10">
                         <th className="p-3">User</th>
                         <th className="p-3">Invites</th>
                         <th className="p-3">Revenue Generated</th>
                         <th className="p-3 text-right">LTV Contribution</th>
                      </tr>
                   </thead>
                   <tbody className="text-sm">
                      {[
                         { name: 'Priya S.', invites: 145, rev: '₹12k', ltv: 'High' },
                         { name: 'Rahul K.', invites: 98, rev: '₹8k', ltv: 'Medium' },
                         { name: 'Bot_99', invites: 500, rev: '₹0', ltv: 'Zero (Fraud)' },
                         { name: 'Anjali V.', invites: 45, rev: '₹4k', ltv: 'Medium' },
                      ].map((u, i) => (
                         <tr key={i} className="border-b border-white/5 hover:bg-white/5">
                            <td className="p-3 font-bold">{u.name}</td>
                            <td className="p-3">{u.invites}</td>
                            <td className="p-3 text-green-400">{u.rev}</td>
                            <td className="p-3 text-right">
                               <span className={`px-2 py-1 rounded text-xs ${u.ltv.includes('High') ? 'bg-green-500/20 text-green-400' : u.ltv.includes('Fraud') ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                                  {u.ltv}
                               </span>
                            </td>
                         </tr>
                      ))}
                   </tbody>
                </table>
             </div>
          </GlassCard>
        </>
      )}
    </div>
  );
};
