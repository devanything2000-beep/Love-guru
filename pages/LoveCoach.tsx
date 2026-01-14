import React, { useState } from 'react';
import { GlassCard, PrimaryButton } from '../components/UIComponents';
import { generateLoveCoachResponse } from '../services/geminiService';
import { CoachSessionInput } from '../types';
import { 
  Smile, Frown, Zap, Minus, 
  Users, Eye, Lock, 
  User, Heart, Star, Sparkles, 
  AlertTriangle, Shield, Home,
  ChevronDown, ChevronUp, ArrowRight, MessageSquare
} from 'lucide-react';

const SelectableCard = ({ selected, onClick, icon: Icon, label, subLabel, colorClass }: any) => (
  <button 
    onClick={onClick}
    className={`
      w-full relative group
      flex flex-col items-center justify-center text-center gap-3 p-4 rounded-2xl border transition-all duration-200
      ${selected 
        ? 'bg-rose-600 border-rose-500 shadow-lg shadow-rose-900/30 text-white transform scale-[1.02]' 
        : 'bg-[#1E293B] border-white/5 text-slate-400 hover:border-rose-500/50 hover:bg-[#253045]'}
    `}
  >
    {Icon && <Icon size={28} className={selected ? 'text-white' : 'text-slate-500 group-hover:text-rose-400 transition-colors'} />}
    <div>
      <div className={`text-sm font-bold ${selected ? 'text-white' : 'text-slate-200'}`}>{label}</div>
      {subLabel && <div className={`text-[10px] mt-1 ${selected ? 'text-white/80' : 'text-slate-500'}`}>{subLabel}</div>}
    </div>
    {selected && <div className="absolute top-2 right-2 w-2 h-2 bg-white rounded-full shadow-glow"></div>}
  </button>
);

const SectionHeader = ({ icon: Icon, title }: any) => (
  <div className="flex items-center gap-2 mb-4">
    <div className="p-1.5 bg-rose-500/10 rounded-lg text-rose-500">
      <Icon size={18} />
    </div>
    <span className="font-bold text-white tracking-wide text-sm uppercase">{title}</span>
  </div>
);

export const LoveCoach = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  const [expandContext, setExpandContext] = useState(false);
  const [input, setInput] = useState<CoachSessionInput>({
    mood: 'neutral',
    locationType: '',
    stage: '',
    confidence: '',
    obstacleCategory: '',
    obstacleDetail: '',
    context: { locationDetails: '', personality: '', surroundings: '' }
  });

  const handleGenerate = async () => {
    setLoading(true);
    const response = await generateLoveCoachResponse(input);
    setResult(response);
    setLoading(false);
    // Auto scroll to bottom on mobile
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  };

  return (
    <div className="animate-fade-in max-w-6xl mx-auto w-full">
      
      {/* Hero Section */}
      <div className="text-center mb-8 py-4">
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-white mb-2">Love Coach AI</h1>
        <p className="text-slate-400 max-w-md mx-auto">Tell me your situation. I'll give you the exact words and psychology to win them over.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
        
        {/* Form Column */}
        <div className="xl:col-span-2 space-y-6">
          
          {/* 1. Mood & Vibe */}
          <GlassCard>
            <SectionHeader icon={Smile} title="How are you feeling?" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { id: 'happy', label: 'Happy', icon: Smile },
                { id: 'sad', label: 'Sad', icon: Frown },
                { id: 'angry', label: 'Angry', icon: Zap },
                { id: 'neutral', label: 'Neutral', icon: Minus },
              ].map(opt => (
                <SelectableCard 
                  key={opt.id}
                  selected={input.mood === opt.id}
                  onClick={() => setInput({...input, mood: opt.id})}
                  icon={opt.icon}
                  label={opt.label}
                />
              ))}
            </div>
          </GlassCard>

          {/* 2. Situation Context */}
          <GlassCard>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div>
                  <SectionHeader icon={Home} title="Where are you?" />
                  <div className="grid grid-cols-1 gap-2">
                    {[
                      { id: 'public', label: 'Public Place', sub: 'Mall, College, Party', icon: Users },
                      { id: 'semi', label: 'Semi-Private', sub: 'Cafe, Restaurant, Park', icon: Eye },
                      { id: 'private', label: 'Private', sub: 'Home, Car, Alone', icon: Lock },
                    ].map(opt => (
                      <button 
                        key={opt.id}
                        onClick={() => setInput({...input, locationType: opt.id})}
                        className={`
                           flex items-center gap-3 p-3 rounded-xl border transition-all text-left
                           ${input.locationType === opt.id 
                             ? 'bg-rose-500/10 border-rose-500 text-white' 
                             : 'bg-white/5 border-transparent text-slate-400 hover:bg-white/10'}
                        `}
                      >
                         <opt.icon size={20} />
                         <div>
                            <div className="text-sm font-bold">{opt.label}</div>
                            <div className="text-[10px] opacity-60">{opt.sub}</div>
                         </div>
                      </button>
                    ))}
                  </div>
               </div>

               <div>
                  <SectionHeader icon={Heart} title="Relationship Stage" />
                  <div className="grid grid-cols-1 gap-2">
                    {[
                      { id: 'stranger', label: 'Just Met / Stranger', icon: User },
                      { id: 'talking', label: 'Talking Stage', icon: MessageSquare },
                      { id: 'dating', label: 'Dating / Relationship', icon: Heart },
                      { id: 'breakup', label: 'Complicated / Breakup', icon: AlertTriangle },
                    ].map(opt => (
                      <button 
                        key={opt.id}
                        onClick={() => setInput({...input, stage: opt.id})}
                        className={`
                           flex items-center gap-3 p-3 rounded-xl border transition-all text-left
                           ${input.stage === opt.id 
                             ? 'bg-rose-500/10 border-rose-500 text-white' 
                             : 'bg-white/5 border-transparent text-slate-400 hover:bg-white/10'}
                        `}
                      >
                         <opt.icon size={20} />
                         <span className="text-sm font-bold">{opt.label}</span>
                      </button>
                    ))}
                  </div>
               </div>
            </div>
          </GlassCard>

          {/* 3. Obstacles */}
          <GlassCard className="border-rose-500/20 bg-rose-900/10">
            <SectionHeader icon={AlertTriangle} title="Any Obstacles? (Optional)" />
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
               {[
                  { cat: 'Family', id: 'strict_parents', label: 'Strict Parents' },
                  { cat: 'Society', id: 'society_pressure', label: 'Social Pressure' },
                  { cat: 'Personal', id: 'shyness', label: 'Too Shy' },
                  { cat: 'Context', id: 'friendzone', label: 'Friendzone' },
                  { cat: 'Context', id: 'long_distance', label: 'Long Distance' },
                  { cat: 'Personal', id: 'broke', label: 'Low Budget' },
               ].map(obs => (
                  <button
                     key={obs.id}
                     onClick={() => setInput({...input, obstacleDetail: obs.label})}
                     className={`
                        py-3 px-2 rounded-lg text-xs font-semibold border transition-all
                        ${input.obstacleDetail === obs.label
                           ? 'bg-rose-500 text-white border-rose-500'
                           : 'bg-white/5 border-transparent text-slate-400 hover:bg-white/10'}
                     `}
                  >
                     {obs.label}
                  </button>
               ))}
            </div>
          </GlassCard>

          <PrimaryButton onClick={handleGenerate} disabled={loading} className="w-full text-lg shadow-xl shadow-rose-900/50">
             {loading ? 'Creating Strategy...' : 'Generate My Strategy ✨'}
          </PrimaryButton>
        </div>

        {/* Results Column */}
        <div className="xl:col-span-1">
          {result ? (
            <div className="animate-slide-up sticky top-6">
              <div className="bg-gradient-to-b from-[#1E293B] to-[#0F172A] border border-emerald-500/30 rounded-2xl p-6 shadow-2xl">
                 <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
                    <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                       <Sparkles size={20} />
                    </div>
                    <div>
                       <h3 className="font-bold text-white">Coach's Plan</h3>
                       <p className="text-xs text-emerald-400">AI Analysis Complete</p>
                    </div>
                 </div>
                 
                 <div className="prose prose-invert prose-sm max-w-none text-slate-300 leading-relaxed whitespace-pre-wrap">
                    {result}
                 </div>

                 <div className="mt-6 pt-4 border-t border-white/10 flex flex-col gap-2">
                    <PrimaryButton variant="secondary" className="w-full text-sm">Save to Library</PrimaryButton>
                    <PrimaryButton variant="outline" className="w-full text-sm">Practice Audio</PrimaryButton>
                 </div>
              </div>
            </div>
          ) : (
             <div className="hidden xl:flex h-96 border-2 border-dashed border-white/10 rounded-2xl flex-col items-center justify-center text-center p-8">
                <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-4">
                   <Heart size={40} className="text-white/10" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Ready to Coach</h3>
                <p className="text-slate-500 text-sm">Fill out the details on the left, and I'll generate a custom psychology-backed script for you.</p>
             </div>
          )}
        </div>

      </div>
    </div>
  );
};