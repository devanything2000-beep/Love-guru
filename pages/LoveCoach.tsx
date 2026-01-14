
import React, { useState } from 'react';
import { GlassCard, PrimaryButton } from '../components/UIComponents';
import { generateLoveCoachResponse } from '../services/geminiService';
import { CoachSessionInput, CoachResponse, CoachHistoryItem } from '../types';
import { 
  Smile, Frown, Zap, Minus, 
  Users, Eye, Lock, 
  User, Heart, Star, Sparkles, 
  AlertTriangle, Shield, Home,
  ChevronDown, ChevronUp, ArrowRight, MessageSquare,
  Volume2, Copy, Share2, Menu, X, Calendar, Activity
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

// --- Output Card Component ---
const AdviceCard = ({ title, icon: Icon, children, accentColor, onCopy, onSpeak, onShare }: any) => (
  <div className={`rounded-xl border ${accentColor} bg-white/5 mb-4 overflow-hidden animate-slide-up`}>
     <div className={`px-4 py-3 flex items-center justify-between border-b ${accentColor.replace('border-', 'border-opacity-30 border-')}`}>
        <div className="flex items-center gap-2">
           <Icon size={18} className={accentColor.includes('rose') ? 'text-rose-400' : accentColor.includes('blue') ? 'text-blue-400' : accentColor.includes('green') ? 'text-emerald-400' : 'text-yellow-400'} />
           <span className="font-bold text-sm text-white">{title}</span>
        </div>
        <div className="flex gap-2">
           {onSpeak && <button onClick={onSpeak} className="p-1.5 hover:bg-white/10 rounded-full text-white/60 hover:text-white transition"><Volume2 size={14}/></button>}
           {onCopy && <button onClick={onCopy} className="p-1.5 hover:bg-white/10 rounded-full text-white/60 hover:text-white transition"><Copy size={14}/></button>}
           {onShare && <button onClick={onShare} className="p-1.5 hover:bg-white/10 rounded-full text-white/60 hover:text-white transition"><Share2 size={14}/></button>}
        </div>
     </div>
     <div className="p-4 text-sm text-slate-200 leading-relaxed whitespace-pre-wrap">
        {children}
     </div>
  </div>
);

export const LoveCoach = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CoachResponse | null>(null);
  
  // History State
  const [history, setHistory] = useState<CoachHistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [historyFilter, setHistoryFilter] = useState('All');

  // Input State
  const [input, setInput] = useState<CoachSessionInput>({
    mood: '',
    locationType: '',
    stage: '',
    confidence: '',
    obstacleCategory: '',
    obstacleDetail: '',
    context: { locationDetails: '', personality: '', surroundings: '' }
  });

  // Validation
  const isValid = input.mood && input.locationType && input.stage;

  const handleGenerate = async () => {
    if (!isValid) return;
    setLoading(true);
    setResult(null);
    const response = await generateLoveCoachResponse(input);
    
    if (response) {
       setResult(response);
       // Add to History
       const newHistoryItem: CoachHistoryItem = {
          id: Date.now().toString(),
          date: new Date().toLocaleDateString(),
          input: { ...input },
          response: response
       };
       setHistory(prev => [newHistoryItem, ...prev]);
       window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to top to see result
    }
    setLoading(false);
  };

  const speakText = (text: string) => {
     if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        // Try to find a Hindi or Indian English voice, fallback to default
        const voices = window.speechSynthesis.getVoices();
        const indianVoice = voices.find(v => v.lang.includes('IN')) || voices[0];
        if (indianVoice) utterance.voice = indianVoice;
        window.speechSynthesis.speak(utterance);
     }
  };

  const copyText = (text: string) => {
     navigator.clipboard.writeText(text);
     // In a real app, show toast
  };

  const shareText = async (title: string, text: string) => {
     if (navigator.share) {
        try {
           await navigator.share({ title: 'Love Pilot Advice', text: `${title}: ${text}` });
        } catch (err) {}
     } else {
        copyText(`${title}: ${text}`);
     }
  };

  const loadFromHistory = (item: CoachHistoryItem) => {
     setInput(item.input);
     setResult(item.response);
     setShowHistory(false);
     window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Filter History
  const filteredHistory = history.filter(item => {
     if (historyFilter === 'All') return true;
     return item.input.stage === historyFilter || item.input.mood === historyFilter;
  });

  return (
    <div className="animate-fade-in max-w-6xl mx-auto w-full relative">
      
      {/* Top Bar with History Toggle */}
      <div className="flex justify-between items-center mb-6">
         <h1 className="text-3xl font-serif font-bold text-white">Love Coach AI</h1>
         <button 
            onClick={() => setShowHistory(true)}
            className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl transition border border-white/10"
         >
            <Menu size={18} /> <span className="text-sm font-bold">History</span>
         </button>
      </div>

      {/* History Drawer */}
      {showHistory && (
         <div className="fixed inset-0 z-50 flex justify-end">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowHistory(false)}></div>
            <div className="relative w-full max-w-sm bg-[#1E293B] h-full shadow-2xl border-l border-white/10 animate-slide-up flex flex-col">
               <div className="p-4 border-b border-white/10 flex justify-between items-center">
                  <h3 className="font-bold text-lg">Strategy History</h3>
                  <button onClick={() => setShowHistory(false)}><X size={20} className="text-slate-400 hover:text-white"/></button>
               </div>
               
               {/* Filters */}
               <div className="p-4 border-b border-white/10 overflow-x-auto whitespace-nowrap scrollbar-hide">
                  {['All', 'happy', 'sad', 'stranger', 'dating', 'breakup'].map(f => (
                     <button 
                        key={f} 
                        onClick={() => setHistoryFilter(f)}
                        className={`px-3 py-1 rounded-full text-xs font-bold mr-2 border capitalize ${historyFilter === f ? 'bg-rose-500 border-rose-500 text-white' : 'border-white/20 text-slate-400'}`}
                     >
                        {f}
                     </button>
                  ))}
               </div>

               <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {filteredHistory.length === 0 ? (
                     <div className="text-center text-slate-500 mt-10">No history found.</div>
                  ) : (
                     filteredHistory.map(item => (
                        <div key={item.id} onClick={() => loadFromHistory(item)} className="p-3 bg-white/5 hover:bg-white/10 rounded-xl cursor-pointer border border-white/5 transition">
                           <div className="flex justify-between mb-1">
                              <span className="text-xs text-rose-400 font-bold uppercase">{item.input.stage}</span>
                              <span className="text-[10px] text-slate-500">{item.date}</span>
                           </div>
                           <p className="text-sm text-white font-medium line-clamp-1">{item.response.solution}</p>
                           <div className="flex gap-2 mt-2">
                              {item.input.mood && <span className="text-[10px] bg-black/20 px-2 py-0.5 rounded text-slate-400">{item.input.mood}</span>}
                              {item.input.locationType && <span className="text-[10px] bg-black/20 px-2 py-0.5 rounded text-slate-400 capitalize">{item.input.locationType}</span>}
                           </div>
                        </div>
                     ))
                  )}
               </div>
            </div>
         </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
        
        {/* Results Column (Shows first on mobile if result exists) */}
        {result && (
           <div className="xl:col-span-1 xl:col-start-3 xl:row-start-1 order-1 xl:order-2 mb-8 xl:mb-0">
              <div className="sticky top-6 space-y-4">
                 <div className="bg-gradient-to-r from-rose-600 to-pink-600 p-4 rounded-xl shadow-lg flex items-center gap-3">
                    <Sparkles className="text-white fill-white" size={24} />
                    <div>
                       <h3 className="font-bold text-white">Your Personal Strategy</h3>
                       <p className="text-xs text-white/80">AI Coach Generated</p>
                    </div>
                 </div>

                 {/* 1. Solution */}
                 <AdviceCard 
                     title="Samadhan (Solution)" 
                     icon={Shield} 
                     accentColor="border-rose-500/30"
                     onCopy={() => copyText(result.solution)}
                     onSpeak={() => speakText(result.solution)}
                 >
                    {result.solution}
                 </AdviceCard>

                 {/* 2. Script */}
                 <AdviceCard 
                     title="Bolne ke liye Script" 
                     icon={MessageSquare} 
                     accentColor="border-purple-500/30"
                     onCopy={() => copyText(result.script)}
                     onSpeak={() => speakText(result.script)}
                     onShare={() => shareText('Script', result.script)}
                 >
                    <div className="bg-black/20 p-3 rounded-lg border-l-2 border-purple-400 italic">
                       "{result.script}"
                    </div>
                 </AdviceCard>

                 {/* 3. Tone */}
                 <AdviceCard title="Awaaz aur Tone" icon={Volume2} accentColor="border-blue-500/30">
                    {result.tone}
                 </AdviceCard>

                 {/* 4. Body Language */}
                 <AdviceCard title="Body Language Tips" icon={Activity} accentColor="border-green-500/30">
                    {result.bodyLanguage}
                 </AdviceCard>

                 {/* 5. Best Time */}
                 <AdviceCard title="Baat karne ke liye accha din" icon={Calendar} accentColor="border-teal-500/30">
                    {result.bestTime}
                 </AdviceCard>

                 {/* 6. Key Note */}
                 <AdviceCard title="Khas Baat (Note)" icon={AlertTriangle} accentColor="border-yellow-500/30 bg-yellow-900/10">
                    {result.keyNote}
                 </AdviceCard>

                 <PrimaryButton onClick={() => setResult(null)} variant="outline" className="w-full">
                    Start New Session
                 </PrimaryButton>
              </div>
           </div>
        )}

        {/* Form Column */}
        <div className={`xl:col-span-2 space-y-6 ${result ? 'order-2 xl:order-1 opacity-50 pointer-events-none xl:opacity-100 xl:pointer-events-auto' : ''}`}>
          
          <div className="text-center xl:text-left mb-6">
             <h2 className="text-2xl font-bold text-white">Session Details</h2>
             <p className="text-slate-400 text-sm">Fill in the details below to unlock your strategy.</p>
          </div>

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

          <PrimaryButton 
            onClick={handleGenerate} 
            disabled={!isValid || loading} 
            className={`w-full text-lg shadow-xl ${!isValid ? 'opacity-50 grayscale cursor-not-allowed' : 'shadow-rose-900/50'}`}
          >
             {loading ? 'Creating Strategy...' : !isValid ? 'Fill Details to Activate' : 'Generate My Strategy ✨'}
          </PrimaryButton>
        </div>

      </div>
    </div>
  );
};
