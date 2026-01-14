import React, { useState } from 'react';
import { GlassCard, PrimaryButton } from '../components/UIComponents';
import { generateDatePlan } from '../services/geminiService';
import { MapPin, DollarSign, Heart, Coffee, Star } from 'lucide-react';

export const DatePlanner = () => {
  const [city, setCity] = useState('');
  const [vibe, setVibe] = useState('Romantic');
  const [budget, setBudget] = useState('Medium');
  const [plan, setPlan] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePlan = async () => {
    if (!city) return;
    setLoading(true);
    const result = await generateDatePlan(city, vibe, budget);
    setPlan(result);
    setLoading(false);
  };

  return (
    <div className="animate-fade-in max-w-2xl mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white mb-2">💘 Perfect Date Planner</h1>
        <p className="text-white/60">AI will find the best safe & romantic spots for you.</p>
      </div>

      <GlassCard className="space-y-6">
         <div>
            <label className="text-sm text-white/60 block mb-2">City</label>
            <div className="flex items-center bg-white/5 rounded-xl border border-white/10 px-3">
               <MapPin size={18} className="text-white/40" />
               <input 
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Mumbai, Delhi, Jaipur"
                  className="w-full bg-transparent border-none focus:ring-0 text-white p-3"
               />
            </div>
         </div>

         <div className="grid grid-cols-2 gap-4">
            <div>
               <label className="text-sm text-white/60 block mb-2">Vibe</label>
               <div className="grid grid-cols-1 gap-2">
                  {['Romantic', 'Adventure', 'Cozy Cafe', 'Luxury'].map(v => (
                     <button 
                        key={v}
                        onClick={() => setVibe(v)}
                        className={`p-2 rounded text-sm border text-left px-3 ${vibe === v ? 'bg-purple-500 border-purple-500' : 'border-white/10 hover:bg-white/5'}`}
                     >
                        {v}
                     </button>
                  ))}
               </div>
            </div>
            <div>
               <label className="text-sm text-white/60 block mb-2">Budget</label>
               <div className="grid grid-cols-1 gap-2">
                  {['Free / Cheap', 'Medium', 'High End'].map(b => (
                     <button 
                        key={b}
                        onClick={() => setBudget(b)}
                        className={`p-2 rounded text-sm border text-left px-3 ${budget === b ? 'bg-green-500 border-green-500' : 'border-white/10 hover:bg-white/5'}`}
                     >
                        {b}
                     </button>
                  ))}
               </div>
            </div>
         </div>

         <PrimaryButton onClick={handlePlan} disabled={loading} className="w-full">
            {loading ? 'Finding Spots...' : 'Plan My Date'}
         </PrimaryButton>
      </GlassCard>

      {plan && (
         <GlassCard className="border-t-4 border-purple-500">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
               <Star className="text-yellow-400 fill-yellow-400" /> Itinerary
            </h3>
            <div className="prose prose-invert prose-sm whitespace-pre-wrap">
               {plan}
            </div>
         </GlassCard>
      )}
    </div>
  );
};