import React, { useState } from 'react';
import { GlassCard, PrimaryButton } from '../components/UIComponents';
import { FETCHERS } from '../constants';
import { Search, Filter, Cpu, Play } from 'lucide-react';
import { Fetcher } from '../types';

export const Marketplace = ({ onSelectFetcher }: { onSelectFetcher: (fetcher: Fetcher) => void }) => {
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');

  const filteredFetchers = FETCHERS.filter(f => {
    const matchesSearch = f.name.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'All' || f.category === filter;
    return matchesSearch && matchesFilter;
  });

  const categories = ['All', 'SEO', 'Leads', 'Content', 'Automation', 'Coding'];

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Fetcher Marketplace</h1>
          <p className="text-white/60">Discover AI agents to automate your workflow.</p>
        </div>
        
        <div className="flex items-center bg-white/10 rounded-xl p-1 border border-white/10 backdrop-blur-sm">
           <Search className="ml-3 text-white/40" size={20} />
           <input 
              type="text" 
              placeholder="Search fetchers..." 
              className="bg-transparent border-none focus:ring-0 text-white placeholder-white/40 px-3 py-2 w-64"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
           />
        </div>
      </div>

      {/* Categories */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              filter === cat 
              ? 'bg-white text-purple-900' 
              : 'bg-white/5 text-white/60 hover:bg-white/10'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredFetchers.map(fetcher => (
          <GlassCard key={fetcher.id} className="group hover:border-orange-500/50 transition-all duration-300">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl shadow-lg group-hover:scale-110 transition-transform">
                <Cpu size={28} className="text-white" />
              </div>
              <div className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                fetcher.status === 'active' ? 'bg-green-500/20 text-green-300' : 'bg-yellow-500/20 text-yellow-300'
              }`}>
                {fetcher.status}
              </div>
            </div>
            
            <h3 className="text-xl font-bold mb-2">{fetcher.name}</h3>
            <p className="text-white/60 text-sm mb-4 h-10 line-clamp-2">{fetcher.description}</p>
            
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/10">
              <div className="text-xs text-white/40">
                <span className="block">Cost</span>
                <span className="text-white font-bold">{fetcher.costPerRun === 0 ? 'Free' : `₹${fetcher.costPerRun}/run`}</span>
              </div>
              <PrimaryButton onClick={() => onSelectFetcher(fetcher)} className="px-4 py-2 text-sm flex items-center gap-2">
                Launch <Play size={14} fill="currentColor" />
              </PrimaryButton>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
};