import React, { useState } from 'react';
import { GlassCard, PrimaryButton } from '../components/UIComponents';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend } from 'recharts';
import { Users, DollarSign, Server, AlertTriangle, Gift, ShieldAlert, TrendingUp, UserCheck, Activity, Target, Zap, ArrowUpRight, Database, Table, Cpu, Settings, PlayCircle, StopCircle, Plus, Shield } from 'lucide-react';
import { REFERRAL_STATS, SAAS_METRICS, FUNNEL_DATA, FETCHERS, REVENUE_COMPARISON_DATA } from '../constants';
import { Fetcher } from '../types';

export const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState<'schema' | 'fetchers' | 'analytics'>('analytics');
  const [localFetchers, setLocalFetchers] = useState<Fetcher[]>(FETCHERS);

  const toggleFetcherStatus = (id: string) => {
      setLocalFetchers(prev => prev.map(f => f.id === id ? { ...f, status: f.status === 'active' ? 'inactive' : 'active' } : f));
  };

  const addFetcher = () => {
      const newFetcher: Fetcher = {
          id: `f-${Date.now()}`,
          name: 'New Agent',
          description: 'Automated task handler.',
          category: 'Automation',
          status: 'inactive',
          costPerRun: 5
      };
      setLocalFetchers(prev => [...prev, newFetcher]);
  };

  // --- SUB-VIEWS ---

  const SchemaView = () => (
      <div className="space-y-6 animate-fade-in">
          <div className="flex items-center justify-between">
             <h3 className="text-xl font-bold flex items-center gap-2"><Database size={20} className="text-blue-400"/> Database Architect</h3>
             <div className="flex gap-2">
               <span className="text-xs bg-green-500/20 text-green-400 px-3 py-1.5 rounded-full border border-green-500/30 font-bold flex items-center gap-1">
                 <Zap size={12}/> Optimization: Active
               </span>
               <button className="text-sm bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg border border-white/10">Export Schema</button>
             </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
             {/* Users Table */}
             <GlassCard className="relative overflow-hidden group">
                <div className="flex items-center gap-2 mb-4 text-emerald-400 font-bold border-b border-white/10 pb-2">
                   <Table size={18}/> Users Collection
                </div>
                <div className="absolute top-4 right-4 text-[10px] bg-emerald-500/10 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/20">
                   Partitioned: Yearly
                </div>
                
                <div className="space-y-2 text-sm font-mono text-white/70">
                   <div className="flex justify-between p-2 bg-white/5 rounded hover:bg-white/10 transition"><span>id</span> <span className="text-white/40">UUID (PK)</span></div>
                   <div className="flex justify-between p-2 bg-white/5 rounded hover:bg-white/10 transition"><span>email</span> <span className="text-white/40">VARCHAR(255)</span></div>
                   <div className="flex justify-between p-2 bg-white/5 rounded hover:bg-white/10 transition"><span>plan_type</span> <span className="text-white/40">ENUM('free','pro')</span></div>
                   <div className="flex justify-between p-2 bg-white/5 rounded hover:bg-white/10 transition"><span>created_at</span> <span className="text-white/40">TIMESTAMP (IDX)</span></div>
                </div>
                <div className="mt-4 text-xs text-white/40 flex items-center gap-2 bg-black/20 p-2 rounded">
                   <Database size={12} className="text-emerald-500"/> 
                   <span>Shards: <span className="text-white">user_2024</span>, <span className="text-white">user_2025</span></span>
                </div>
             </GlassCard>

             {/* Logs Table */}
             <GlassCard className="relative overflow-hidden group">
                <div className="flex items-center gap-2 mb-4 text-orange-400 font-bold border-b border-white/10 pb-2">
                   <Table size={18}/> Logs Collection
                </div>
                 <div className="absolute top-4 right-4 text-[10px] bg-orange-500/10 text-orange-300 px-2 py-0.5 rounded border border-orange-500/20">
                   Retention: 2 Years
                </div>
                <div className="space-y-2 text-sm font-mono text-white/70">
                   <div className="flex justify-between p-2 bg-white/5 rounded hover:bg-white/10 transition"><span>id</span> <span className="text-white/40">UUID (PK)</span></div>
                   <div className="flex justify-between p-2 bg-white/5 rounded hover:bg-white/10 transition"><span>fetcher_id</span> <span className="text-white/40">UUID (FK)</span></div>
                   <div className="flex justify-between p-2 bg-white/5 rounded hover:bg-white/10 transition"><span>input_payload</span> <span className="text-white/40">JSONB</span></div>
                   <div className="flex justify-between p-2 bg-white/5 rounded hover:bg-white/10 transition"><span>timestamp</span> <span className="text-white/40">DATETIME (IDX)</span></div>
                </div>
                 <div className="mt-4 text-xs text-white/40 flex items-center gap-2 bg-black/20 p-2 rounded">
                   <Server size={12} className="text-orange-500"/> 
                   <span>Storage: <span className="text-white">Hot (2025)</span>, <span className="text-white/50">Cold (2024)</span></span>
                </div>
             </GlassCard>

             {/* Relations Visual (Mock) */}
             <GlassCard className="lg:col-span-2 h-48 flex items-center justify-center bg-black/20 border-dashed relative">
                <div className="absolute top-3 left-3 text-xs font-bold text-white/30 uppercase tracking-widest">Topology</div>
                <div className="flex items-center gap-8 opacity-70">
                   <div className="flex flex-col items-center gap-2">
                      <div className="w-12 h-12 bg-emerald-900/40 border border-emerald-500 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                         <Users size={20} className="text-emerald-400"/>
                      </div>
                      <span className="text-[10px] font-mono text-emerald-400">Users (Primary)</span>
                   </div>
                   <div className="h-0.5 w-16 bg-white/20 relative">
                      <div className="absolute -top-1 left-1/2 -translate-x-1/2 text-[8px] text-white/40">1:N</div>
                   </div>
                   <div className="flex flex-col items-center gap-2">
                      <div className="w-12 h-12 bg-blue-900/40 border border-blue-500 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.2)]">
                         <Cpu size={20} className="text-blue-400"/>
                      </div>
                      <span className="text-[10px] font-mono text-blue-400">Sessions</span>
                   </div>
                   <div className="h-0.5 w-16 bg-white/20 relative">
                      <div className="absolute -top-1 left-1/2 -translate-x-1/2 text-[8px] text-white/40">1:N</div>
                   </div>
                   <div className="flex flex-col items-center gap-2">
                      <div className="w-12 h-12 bg-orange-900/40 border border-orange-500 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(249,115,22,0.2)]">
                         <Activity size={20} className="text-orange-400"/>
                      </div>
                      <span className="text-[10px] font-mono text-orange-400">Logs</span>
                   </div>
                </div>
             </GlassCard>
          </div>
      </div>
  );

  const FetcherView = () => (
      <div className="space-y-6 animate-fade-in">
          <div className="flex items-center justify-between">
             <h3 className="text-xl font-bold flex items-center gap-2"><Cpu size={20} className="text-purple-400"/> Fetcher Registry</h3>
             <PrimaryButton onClick={addFetcher} className="px-4 py-2 text-sm flex items-center gap-2">
                 <Plus size={16}/> Deploy New Agent
             </PrimaryButton>
          </div>

          <div className="grid grid-cols-1 gap-4">
              {localFetchers.map(f => (
                  <GlassCard key={f.id} className="flex flex-col md:flex-row items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                          <div className={`p-3 rounded-xl ${f.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-slate-700/50 text-slate-500'}`}>
                              <Cpu size={24}/>
                          </div>
                          <div>
                              <h4 className="font-bold text-lg">{f.name}</h4>
                              <p className="text-sm text-white/50">{f.description}</p>
                              <div className="flex gap-2 mt-1">
                                  <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded text-white/60">{f.category}</span>
                                  <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded text-white/60">₹{f.costPerRun}/run</span>
                              </div>
                          </div>
                      </div>

                      <div className="flex items-center gap-3">
                          <button className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-white/50 hover:text-white transition">
                              <Settings size={20}/>
                          </button>
                          <button 
                              onClick={() => toggleFetcherStatus(f.id)}
                              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition ${f.status === 'active' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-green-500/20 text-green-400 border border-green-500/30'}`}
                          >
                              {f.status === 'active' ? <><StopCircle size={16}/> Deactivate</> : <><PlayCircle size={16}/> Activate</>}
                          </button>
                      </div>
                  </GlassCard>
              ))}
          </div>
      </div>
  );

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      
      {/* Header & Tabs */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
           <h1 className="text-3xl font-bold text-white flex items-center gap-2">
             <span className="bg-gradient-to-r from-red-600 to-orange-600 text-xs px-2 py-1 rounded shadow-lg flex items-center gap-1"><Shield size={10}/> SYSTEM ARCHITECT</span>
           </h1>
           <p className="text-white/50 text-sm mt-1">
              Data Schema, AI Agents, and 2-Year Growth Analytics.
           </p>
        </div>
        
        <div className="flex bg-white/5 rounded-xl p-1 border border-white/10">
           <button 
              onClick={() => setActiveTab('analytics')}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition flex items-center gap-2 ${activeTab === 'analytics' ? 'bg-emerald-600 text-white shadow-lg' : 'text-white/50 hover:text-white'}`}
           >
              <TrendingUp size={16} /> Data
           </button>
           <button 
              onClick={() => setActiveTab('fetchers')}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition flex items-center gap-2 ${activeTab === 'fetchers' ? 'bg-purple-600 text-white shadow-lg' : 'text-white/50 hover:text-white'}`}
           >
              <Cpu size={16} /> Fetchers
           </button>
           <button 
              onClick={() => setActiveTab('schema')}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition flex items-center gap-2 ${activeTab === 'schema' ? 'bg-blue-600 text-white shadow-lg' : 'text-white/50 hover:text-white'}`}
           >
              <Database size={16} /> Schema
           </button>
        </div>
      </div>

      {activeTab === 'schema' && <SchemaView />}
      {activeTab === 'fetchers' && <FetcherView />}
      
      {activeTab === 'analytics' && (
        // --- GROWTH & REVENUE ENGINE ---
        <div className="animate-fade-in space-y-8">
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
             {/* 2-YEAR REVENUE COMPARISON */}
             <GlassCard className="lg:col-span-2 h-[400px]">
                <h3 className="text-lg font-bold mb-1 flex items-center gap-2">
                   <TrendingUp size={18} className="text-emerald-400"/> Revenue Growth (2024 vs 2025)
                </h3>
                <p className="text-xs text-white/50 mb-6">Year-over-Year Comparison</p>
                <ResponsiveContainer width="100%" height="90%">
                  <AreaChart data={REVENUE_COMPARISON_DATA}>
                    <defs>
                      <linearGradient id="color2025" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="color2024" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="month" stroke="#ffffff40" />
                    <YAxis stroke="#ffffff40" />
                    <Tooltip contentStyle={{backgroundColor: '#000', borderRadius: '8px', border: '1px solid #333'}} />
                    <Legend />
                    <Area type="monotone" dataKey="year2025" name="Current Year (2025)" stroke="#10B981" fillOpacity={1} fill="url(#color2025)" />
                    <Area type="monotone" dataKey="year2024" name="Previous Year (2024)" stroke="#6366f1" fillOpacity={1} fill="url(#color2024)" />
                  </AreaChart>
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
        </div>
      )}
    </div>
  );
};