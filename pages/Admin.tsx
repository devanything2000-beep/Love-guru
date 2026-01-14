import React from 'react';
import { GlassCard } from '../components/UIComponents';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, DollarSign, Server, AlertTriangle } from 'lucide-react';

const revData = [
  { name: 'Jan', revenue: 4000 },
  { name: 'Feb', revenue: 3000 },
  { name: 'Mar', revenue: 5000 },
  { name: 'Apr', revenue: 7500 },
  { name: 'May', revenue: 9000 },
  { name: 'Jun', revenue: 12000 },
];

export const AdminPanel = () => {
  return (
    <div className="space-y-8 animate-fade-in pb-10">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white flex items-center gap-2">
          <span className="bg-red-500 text-xs px-2 py-1 rounded">SUPER ADMIN</span>
          System Overview
        </h1>
        <div className="text-sm text-white/50">Last synced: Just now</div>
      </div>

      {/* Admin KPI */}
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

      {/* Revenue Chart */}
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

      {/* User Table (Simplified) */}
      <GlassCard>
        <h3 className="text-lg font-bold mb-4">Recent Registrations</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-white/40 text-sm border-b border-white/10">
                <th className="p-3">User</th>
                <th className="p-3">Plan</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {[
                { name: 'Amit Verma', plan: 'Pro', status: 'Active' },
                { name: 'Sarah Jenkins', plan: 'Agency', status: 'Active' },
                { name: 'Rohan Das', plan: 'Free', status: 'Blocked' },
              ].map((u, i) => (
                <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition">
                  <td className="p-3 font-medium">{u.name}</td>
                  <td className="p-3"><span className="bg-white/10 px-2 py-1 rounded text-xs">{u.plan}</span></td>
                  <td className="p-3">
                    <span className={`w-2 h-2 inline-block rounded-full mr-2 ${u.status === 'Active' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                    {u.status}
                  </td>
                  <td className="p-3 text-right">
                    <button className="text-white/40 hover:text-white">Manage</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
};