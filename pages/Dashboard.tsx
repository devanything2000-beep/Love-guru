import React from 'react';
import { GlassCard, PrimaryButton } from '../components/UIComponents';
import { RECENT_LOGS, FETCHERS } from '../constants';
import { Activity, Zap, CreditCard, ArrowRight } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const data = [
  { name: 'Mon', usage: 12 },
  { name: 'Tue', usage: 19 },
  { name: 'Wed', usage: 3 },
  { name: 'Thu', usage: 25 },
  { name: 'Fri', usage: 15 },
  { name: 'Sat', usage: 20 },
  { name: 'Sun', usage: 32 },
];

export const Dashboard = ({ onNavigate }: { onNavigate: (page: string) => void }) => {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-white/60">Welcome back, your fetchers are ready.</p>
        </div>
        <PrimaryButton onClick={() => onNavigate('marketplace')}>
          + New Fetcher
        </PrimaryButton>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GlassCard className="flex items-center space-x-4">
          <div className="p-3 bg-purple-500/20 rounded-lg text-purple-300">
            <Zap size={24} />
          </div>
          <div>
            <p className="text-sm text-white/60">Active Fetchers</p>
            <h3 className="text-2xl font-bold">{FETCHERS.filter(f => f.status === 'active').length}</h3>
          </div>
        </GlassCard>
        <GlassCard className="flex items-center space-x-4">
          <div className="p-3 bg-orange-500/20 rounded-lg text-orange-300">
            <Activity size={24} />
          </div>
          <div>
            <p className="text-sm text-white/60">Total Runs</p>
            <h3 className="text-2xl font-bold">1,284</h3>
          </div>
        </GlassCard>
        <GlassCard className="flex items-center space-x-4">
          <div className="p-3 bg-green-500/20 rounded-lg text-green-300">
            <CreditCard size={24} />
          </div>
          <div>
            <p className="text-sm text-white/60">Credits Left</p>
            <h3 className="text-2xl font-bold">∞ (Pro)</h3>
          </div>
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Usage Chart */}
        <div className="lg:col-span-2">
          <GlassCard className="h-[400px] flex flex-col">
            <h3 className="text-xl font-bold mb-6">Weekly Usage</h3>
            <div className="flex-1 w-full">
               <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                  <XAxis dataKey="name" stroke="#ffffff60" />
                  <YAxis stroke="#ffffff60" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1a0b2e', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px' }}
                    itemStyle={{ color: '#fff' }}
                    cursor={{fill: 'rgba(255,255,255,0.05)'}}
                  />
                  <Bar dataKey="usage" radius={[4, 4, 0, 0]}>
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill="url(#colorGradient)" />
                    ))}
                  </Bar>
                  <defs>
                    <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#FF8A00" stopOpacity={0.8}/>
                      <stop offset="100%" stopColor="#6C2BD9" stopOpacity={0.8}/>
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-1">
          <GlassCard className="h-[400px] overflow-hidden flex flex-col">
            <h3 className="text-xl font-bold mb-4">Recent Flows</h3>
            <div className="overflow-y-auto space-y-4 pr-2 custom-scrollbar flex-1">
              {RECENT_LOGS.map(log => (
                <div key={log.id} className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition cursor-pointer">
                  <div>
                    <p className="font-semibold text-sm">{log.fetcherName}</p>
                    <p className="text-xs text-white/50">{log.timestamp}</p>
                  </div>
                  <div className={`text-xs px-2 py-1 rounded-full 
                    ${log.status === 'completed' ? 'bg-green-500/20 text-green-300' : 
                      log.status === 'running' ? 'bg-blue-500/20 text-blue-300' : 'bg-red-500/20 text-red-300'}`}>
                    {log.status}
                  </div>
                </div>
              ))}
              <div className="pt-4 flex justify-center">
                 <button className="text-sm text-orange-400 hover:text-orange-300 flex items-center gap-1">
                    View All Logs <ArrowRight size={14} />
                 </button>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};