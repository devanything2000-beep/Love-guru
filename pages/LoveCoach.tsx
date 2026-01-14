
import React, { useState, useEffect } from 'react';
import { GlassCard, PrimaryButton } from '../components/UIComponents';
import { generateLoveCoachResponse, generatePracticeResponse } from '../services/geminiService';
import { PRACTICE_SCENARIOS } from '../constants';
import { CoachSessionInput, CoachResponse, CoachHistoryItem } from '../types';
import { 
  Smile, Frown, Zap, Minus, 
  Users, Eye, Lock, 
  User, Heart, Star, Sparkles, 
  AlertTriangle, Shield, Home,
  MessageSquare,
  Volume2, Copy, Share2, History, X, Calendar, Activity,
  Dumbbell, Trophy, Mic, Send, Bot, PlayCircle, ArrowLeft,
  ChevronDown, ChevronUp, Brain, Globe
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

interface LoveCoachProps {
   initialSection?: 'coach' | 'practice';
}

interface PracticeSession {
   id: string;
   date: string;
   scenarioTitle: string;
   chatLog: {role: string, content: string}[];
}

export const LoveCoach: React.FC<LoveCoachProps> = ({ initialSection = 'coach' }) => {
  const [activeSection, setActiveSection] = useState<'coach' | 'practice'>(initialSection);
  
  // Update active section if prop changes
  useEffect(() => {
     setActiveSection(initialSection);
  }, [initialSection]);

  // --- COACH STATE ---
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CoachResponse | null>(null);
  const [coachHistory, setCoachHistory] = useState<CoachHistoryItem[]>([]);
  const [input, setInput] = useState<CoachSessionInput>({
    mood: '',
    locationType: '',
    stage: '',
    confidence: '',
    obstacleCategory: '',
    obstacleDetail: '',
    context: { locationDetails: '', personality: '', surroundings: '' }
  });

  // --- PRACTICE STATE ---
  const [selectedScenario, setSelectedScenario] = useState<any>(null);
  const [practiceChat, setPracticeChat] = useState<{role: string, content: string}[]>([]);
  const [practiceInput, setPracticeInput] = useState('');
  const [practiceLoading, setPracticeLoading] = useState(false);
  const [practiceHistory, setPracticeHistory] = useState<PracticeSession[]>([]);

  // --- DAILY GUIDE STATE ---
  const [dailyReflection, setDailyReflection] = useState('');
  const [expandedTech, setExpandedTech] = useState<string | null>(null);

  // --- HISTORY DRAWER STATE ---
  const [showHistory, setShowHistory] = useState(false);
  const [historyTab, setHistoryTab] = useState<'coach' | 'practice'>('coach');

  // Validation
  const isValid = input.mood && input.locationType && input.stage;

  // --- COACH HANDLERS ---
  const handleGenerate = async () => {
    if (!isValid) return;
    setLoading(true);
    setResult(null);
    const response = await generateLoveCoachResponse(input);
    
    if (response) {
       setResult(response);
       const newHistoryItem: CoachHistoryItem = {
          id: Date.now().toString(),
          date: new Date().toLocaleDateString(),
          input: { ...input },
          response: response
       };
       setCoachHistory(prev => [newHistoryItem, ...prev]);
       window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    setLoading(false);
  };

  const speakText = (text: string) => {
     if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        const voices = window.speechSynthesis.getVoices();
        const indianVoice = voices.find(v => v.lang.includes('IN')) || voices[0];
        if (indianVoice) utterance.voice = indianVoice;
        window.speechSynthesis.speak(utterance);
     }
  };

  const copyText = (text: string) => {
     navigator.clipboard.writeText(text);
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
     setActiveSection('coach');
     window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // --- PRACTICE HANDLERS ---
  const startPractice = (scenario: any) => {
    setSelectedScenario(scenario);
    setPracticeChat([{ role: 'ai', content: `(System: Starting "${scenario.title}". AI is ready. Say hello!)` }]);
  };

  const handlePracticeSend = async () => {
    if (!practiceInput) return;
    const newHistory = [...practiceChat, { role: 'user', content: practiceInput }];
    setPracticeChat(newHistory);
    setPracticeInput('');
    setPracticeLoading(true);

    const reply = await generatePracticeResponse(newHistory, selectedScenario.description);
    setPracticeChat([...newHistory, { role: 'ai', content: reply }]);
    setPracticeLoading(false);
  };

  const exitPractice = () => {
     // Save practice session if meaningful
     if (practiceChat.length > 2) {
        setPracticeHistory(prev => [{
           id: Date.now().toString(),
           date: new Date().toLocaleDateString(),
           scenarioTitle: selectedScenario.title,
           chatLog: practiceChat
        }, ...prev]);
     }
     setSelectedScenario(null);
     setPracticeChat([]);
  };

  const loadPracticeFromHistory = (session: PracticeSession) => {
     const scenario = PRACTICE_SCENARIOS.find(s => s.title === session.scenarioTitle) || { title: session.scenarioTitle, description: 'Resumed session' };
     setSelectedScenario(scenario);
     setPracticeChat(session.chatLog);
     setShowHistory(false);
     setActiveSection('practice');
  };

  // --- COMPONENTS ---
  const TechAccordionItem = ({ title, icon: Icon, id, children }: any) => (
     <div className="border border-white/10 rounded-xl overflow-hidden mb-2 bg-white/5">
        <button 
           onClick={() => setExpandedTech(expandedTech === id ? null : id)}
           className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition"
        >
           <div className="flex items-center gap-3">
              <Icon size={20} className="text-purple-400" />
              <span className="font-bold text-white text-sm text-left">{title}</span>
           </div>
           {expandedTech === id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
        {expandedTech === id && (
           <div className="p-4 pt-0 text-sm text-white/70 leading-relaxed border-t border-white/5 bg-black/20">
              {children}
           </div>
        )}
     </div>
  );

  return (
    <div className="animate-fade-in max-w-6xl mx-auto w-full relative h-[calc(100vh-6rem)] md:h-auto overflow-hidden md:overflow-visible flex flex-col">
      
      {/* Top Bar */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4 shrink-0">
         <h1 className="text-3xl font-serif font-bold text-white flex items-center gap-2">
            {activeSection === 'coach' ? <Sparkles className="text-rose-500"/> : <Dumbbell className="text-purple-500"/>}
            {activeSection === 'coach' ? 'Love Coach AI' : 'Practice Arena'}
         </h1>
         
         <div className="flex gap-4">
            {/* Section Toggle */}
            <div className="flex bg-white/5 rounded-xl p-1 border border-white/10">
               <button 
                  onClick={() => setActiveSection('coach')}
                  className={`px-4 py-2 rounded-lg text-sm font-bold transition flex items-center gap-2 ${activeSection === 'coach' ? 'bg-rose-600 text-white shadow-lg' : 'text-white/50 hover:text-white'}`}
               >
                  <Sparkles size={16} /> Coach
               </button>
               <button 
                  onClick={() => setActiveSection('practice')}
                  className={`px-4 py-2 rounded-lg text-sm font-bold transition flex items-center gap-2 ${activeSection === 'practice' ? 'bg-purple-600 text-white shadow-lg' : 'text-white/50 hover:text-white'}`}
               >
                  <Dumbbell size={16} /> Practice
               </button>
            </div>

            <button 
               onClick={() => { setShowHistory(true); setHistoryTab(activeSection); }}
               className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl transition border border-white/10"
            >
               <History size={18} /> <span className="text-sm font-bold hidden md:inline">History</span>
            </button>
         </div>
      </div>

      {/* History Drawer */}
      {showHistory && (
         <div className="fixed inset-0 z-50 flex justify-end">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowHistory(false)}></div>
            <div className="relative w-full max-w-sm bg-[#1E293B] h-full shadow-2xl border-l border-white/10 animate-slide-up flex flex-col">
               <div className="p-4 border-b border-white/10 flex flex-col gap-4">
                  <div className="flex justify-between items-center">
                     <h3 className="font-bold text-lg">History</h3>
                     <button onClick={() => setShowHistory(false)}><X size={20} className="text-slate-400 hover:text-white"/></button>
                  </div>
                  {/* Drawer Tabs */}
                  <div className="flex w-full bg-black/20 rounded-lg p-1">
                     <button 
                        onClick={() => setHistoryTab('coach')}
                        className={`flex-1 py-2 text-xs font-bold rounded-md transition ${historyTab === 'coach' ? 'bg-white/10 text-white shadow' : 'text-slate-500'}`}
                     >
                        Strategies
                     </button>
                     <button 
                        onClick={() => setHistoryTab('practice')}
                        className={`flex-1 py-2 text-xs font-bold rounded-md transition ${historyTab === 'practice' ? 'bg-white/10 text-white shadow' : 'text-slate-500'}`}
                     >
                        Roleplays
                     </button>
                  </div>
               </div>

               <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {historyTab === 'coach' ? (
                     coachHistory.length === 0 ? (
                        <div className="text-center text-slate-500 mt-10">No strategy history.</div>
                     ) : (
                        coachHistory.map(item => (
                           <div key={item.id} onClick={() => loadFromHistory(item)} className="p-3 bg-white/5 hover:bg-white/10 rounded-xl cursor-pointer border border-white/5 transition">
                              <div className="flex justify-between mb-1">
                                 <span className="text-xs text-rose-400 font-bold uppercase">{item.input.stage}</span>
                                 <span className="text-[10px] text-slate-500">{item.date}</span>
                              </div>
                              <p className="text-sm text-white font-medium line-clamp-1">{item.response.solution}</p>
                           </div>
                        ))
                     )
                  ) : (
                     practiceHistory.length === 0 ? (
                        <div className="text-center text-slate-500 mt-10">No practice history.</div>
                     ) : (
                        practiceHistory.map(item => (
                           <div key={item.id} onClick={() => loadPracticeFromHistory(item)} className="p-3 bg-white/5 hover:bg-white/10 rounded-xl cursor-pointer border border-white/5 transition">
                              <div className="flex justify-between mb-1">
                                 <span className="text-xs text-purple-400 font-bold uppercase truncate max-w-[150px]">{item.scenarioTitle}</span>
                                 <span className="text-[10px] text-slate-500">{item.date}</span>
                              </div>
                              <p className="text-sm text-white font-medium line-clamp-1 flex items-center gap-1">
                                 <MessageSquare size={12}/> {item.chatLog.length} messages
                              </p>
                           </div>
                        ))
                     )
                  )}
               </div>
            </div>
         </div>
      )}

      {/* --- CONTENT AREA --- */}
      <div className="flex-1 overflow-y-auto scrollbar-hide md:overflow-visible">
         
         {/* VIEW: COACH STRATEGY */}
         {activeSection === 'coach' && (
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start animate-fade-in">
               {/* Results Column */}
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

                        <AdviceCard title="Samadhan (Solution)" icon={Shield} accentColor="border-rose-500/30" onCopy={() => copyText(result.solution)} onSpeak={() => speakText(result.solution)}>
                           {result.solution}
                        </AdviceCard>
                        <AdviceCard title="Bolne ke liye Script" icon={MessageSquare} accentColor="border-purple-500/30" onCopy={() => copyText(result.script)} onSpeak={() => speakText(result.script)} onShare={() => shareText('Script', result.script)}>
                           <div className="bg-black/20 p-3 rounded-lg border-l-2 border-purple-400 italic">"{result.script}"</div>
                        </AdviceCard>
                        <AdviceCard title="Awaaz aur Tone" icon={Volume2} accentColor="border-blue-500/30">{result.tone}</AdviceCard>
                        <AdviceCard title="Body Language" icon={Activity} accentColor="border-green-500/30">{result.bodyLanguage}</AdviceCard>
                        <AdviceCard title="Best Time" icon={Calendar} accentColor="border-teal-500/30">{result.bestTime}</AdviceCard>
                        <AdviceCard title="Khas Baat (Note)" icon={AlertTriangle} accentColor="border-yellow-500/30 bg-yellow-900/10">{result.keyNote}</AdviceCard>

                        <PrimaryButton onClick={() => setResult(null)} variant="outline" className="w-full">Start New Session</PrimaryButton>
                     </div>
                  </div>
               )}

               {/* Form Column */}
               <div className={`xl:col-span-2 space-y-6 ${result ? 'order-2 xl:order-1 opacity-50 pointer-events-none xl:opacity-100 xl:pointer-events-auto' : ''}`}>
                  <div className="text-center xl:text-left mb-6">
                     <h2 className="text-2xl font-bold text-white">Session Details</h2>
                     <p className="text-slate-400 text-sm">Fill in the details below to unlock your strategy.</p>
                  </div>

                  <GlassCard>
                     <SectionHeader icon={Smile} title="How are you feeling?" />
                     <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {[{ id: 'happy', label: 'Happy', icon: Smile }, { id: 'sad', label: 'Sad', icon: Frown }, { id: 'angry', label: 'Angry', icon: Zap }, { id: 'neutral', label: 'Neutral', icon: Minus }].map(opt => (
                           <SelectableCard key={opt.id} selected={input.mood === opt.id} onClick={() => setInput({...input, mood: opt.id})} icon={opt.icon} label={opt.label} />
                        ))}
                     </div>
                  </GlassCard>

                  <GlassCard>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                           <SectionHeader icon={Home} title="Where are you?" />
                           <div className="grid grid-cols-1 gap-2">
                              {[{ id: 'public', label: 'Public Place', sub: 'Mall, College', icon: Users }, { id: 'semi', label: 'Semi-Private', sub: 'Cafe, Park', icon: Eye }, { id: 'private', label: 'Private', sub: 'Home, Car', icon: Lock }].map(opt => (
                                 <button key={opt.id} onClick={() => setInput({...input, locationType: opt.id})} className={`flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${input.locationType === opt.id ? 'bg-rose-500/10 border-rose-500 text-white' : 'bg-white/5 border-transparent text-slate-400 hover:bg-white/10'}`}>
                                    <opt.icon size={20} />
                                    <div><div className="text-sm font-bold">{opt.label}</div><div className="text-[10px] opacity-60">{opt.sub}</div></div>
                                 </button>
                              ))}
                           </div>
                        </div>
                        <div>
                           <SectionHeader icon={Heart} title="Relationship Stage" />
                           <div className="grid grid-cols-1 gap-2">
                              {[{ id: 'stranger', label: 'Stranger', icon: User }, { id: 'talking', label: 'Talking Stage', icon: MessageSquare }, { id: 'dating', label: 'Dating', icon: Heart }, { id: 'breakup', label: 'Breakup', icon: AlertTriangle }].map(opt => (
                                 <button key={opt.id} onClick={() => setInput({...input, stage: opt.id})} className={`flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${input.stage === opt.id ? 'bg-rose-500/10 border-rose-500 text-white' : 'bg-white/5 border-transparent text-slate-400 hover:bg-white/10'}`}>
                                    <opt.icon size={20} /><span className="text-sm font-bold">{opt.label}</span>
                                 </button>
                              ))}
                           </div>
                        </div>
                     </div>
                  </GlassCard>

                  <GlassCard className="border-rose-500/20 bg-rose-900/10">
                     <SectionHeader icon={AlertTriangle} title="Any Obstacles? (Optional)" />
                     <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {[{ cat: 'Family', id: 'strict_parents', label: 'Strict Parents' }, { cat: 'Society', id: 'society_pressure', label: 'Social Pressure' }, { cat: 'Personal', id: 'shyness', label: 'Too Shy' }, { cat: 'Context', id: 'friendzone', label: 'Friendzone' }, { cat: 'Context', id: 'long_distance', label: 'Long Distance' }, { cat: 'Personal', id: 'broke', label: 'Low Budget' }].map(obs => (
                           <button key={obs.id} onClick={() => setInput({...input, obstacleDetail: obs.label})} className={`py-3 px-2 rounded-lg text-xs font-semibold border transition-all ${input.obstacleDetail === obs.label ? 'bg-rose-500 text-white border-rose-500' : 'bg-white/5 border-transparent text-slate-400 hover:bg-white/10'}`}>
                              {obs.label}
                           </button>
                        ))}
                     </div>
                  </GlassCard>

                  <PrimaryButton onClick={handleGenerate} disabled={!isValid || loading} className={`w-full text-lg shadow-xl ${!isValid ? 'opacity-50 grayscale cursor-not-allowed' : 'shadow-rose-900/50'}`}>
                     {loading ? 'Creating Strategy...' : !isValid ? 'Fill Details to Activate' : 'Generate My Strategy ✨'}
                  </PrimaryButton>
               </div>
            </div>
         )}

         {/* VIEW: DAILY PRACTICE */}
         {activeSection === 'practice' && (
            <div className="animate-fade-in h-full flex flex-col">
               {!selectedScenario ? (
                  // Scenario Selection
                  <div className="max-w-4xl mx-auto w-full space-y-12">
                     
                     {/* Header Section */}
                     <div className="text-center">
                        <div className="flex items-center justify-center gap-2 mb-2">
                           <h2 className="text-2xl font-bold text-white">Practice Mode</h2>
                           <div className="flex items-center gap-1 bg-white/10 px-2 py-0.5 rounded-full border border-white/5">
                              <Globe size={12} className="text-orange-400"/>
                              <span className="text-[10px] font-bold text-white/80">Hinglish</span>
                              <ChevronDown size={12} className="text-white/40"/>
                           </div>
                        </div>
                        <p className="text-white/60">Real situations में practice करो और confidence बढ़ाओ! 💪</p>
                     </div>

                     {/* AI Avatar Banner */}
                     <div className="bg-gradient-to-r from-pink-500/10 to-rose-600/10 border border-pink-500/30 rounded-2xl p-6 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 group hover:border-pink-500/50 transition-all">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/20 rounded-full blur-3xl -z-10"></div>
                        <div className="flex items-center gap-4 z-10">
                           <div className="w-16 h-16 rounded-full bg-pink-100 border-4 border-pink-500 flex items-center justify-center text-pink-600">
                              <MessageSquare size={32} strokeWidth={2.5} />
                           </div>
                           <div>
                              <h3 className="text-xl font-bold text-purple-900 dark:text-purple-100 mb-1">AI अवतार प्रैक्टिस</h3>
                              <p className="text-sm text-purple-800/80 dark:text-purple-200/60 max-w-sm">एक AI दोस्त से बात करके रियल-टाइम में सीखें!</p>
                           </div>
                        </div>
                        <PrimaryButton 
                           onClick={() => startPractice(PRACTICE_SCENARIOS[0])} 
                           className="w-full md:w-auto z-10 bg-gradient-to-r from-rose-500 to-pink-600 border-none shadow-lg shadow-pink-900/20"
                        >
                           <PlayCircle size={18} fill="white" /> अभी शुरू करें
                        </PrimaryButton>
                     </div>

                     {/* Scenarios Grid */}
                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {PRACTICE_SCENARIOS.map(scene => (
                           <div key={scene.id} className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:border-purple-500/50 hover:bg-white/[0.07] transition-all group flex flex-col h-full">
                              <div className="flex justify-between items-start mb-4">
                                 <h3 className="text-lg font-bold text-purple-200">{scene.hinglishTitle || scene.title}</h3>
                                 <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase border ${
                                    scene.difficulty === 'Easy' ? 'bg-green-500/10 border-green-500/30 text-green-400' : 
                                    scene.difficulty === 'Medium' ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400' :
                                    'bg-red-500/10 border-red-500/30 text-red-400'
                                 }`}>
                                    {scene.difficulty}
                                 </span>
                              </div>
                              
                              <div className="bg-white/5 rounded-xl p-3 mb-4 text-sm text-white/80 italic border-l-2 border-purple-500/50">
                                 "{scene.hinglishDescription || scene.description}"
                              </div>

                              <div className="flex flex-wrap gap-2 mb-6">
                                 {scene.tags?.map(tag => (
                                    <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-white/50">
                                       {tag}
                                    </span>
                                 ))}
                              </div>

                              <button 
                                 onClick={() => startPractice(scene)}
                                 className="mt-auto w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-sm shadow-lg shadow-purple-900/20 hover:shadow-purple-900/40 hover:scale-[1.02] active:scale-95 transition flex items-center justify-center gap-2"
                              >
                                 <PlayCircle size={16} /> Practice Start करो!
                              </button>
                           </div>
                        ))}
                     </div>

                     {/* Daily Guide & Tech Section */}
                     <div className="pt-8 border-t border-white/10">
                        <div className="flex items-center gap-3 mb-6">
                           <Brain size={28} className="text-rose-500" />
                           <h2 className="text-2xl font-bold text-white">Daily Guide & Tech</h2>
                        </div>
                        <p className="text-white/60 -mt-4 mb-8">रोज़ की बातचीत को सुधारो और साइकोलॉजी की मदद से आगे बढ़ो! 🧠</p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                           {/* Reflection Input */}
                           <GlassCard className="bg-gradient-to-br from-purple-900/20 to-slate-900/50">
                              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                                 <MessageSquare size={18} className="text-purple-400"/> अपनी बातचीत के बारे में बताओ
                              </h3>
                              <p className="text-xs text-white/50 mb-4">यहाँ अपनी पिछली बातचीत के बारे में लिखो। बताओ क्या हुआ, कैसा महसूस हुआ। AI आपको बताएगा कि आगे क्या करना है।</p>
                              
                              <textarea 
                                 value={dailyReflection}
                                 onChange={(e) => setDailyReflection(e.target.value)}
                                 placeholder="जैसे: 'आज मैंने उसे देखा और बस 'हाय' बोला। वो मुस्कुराई लेकिन मैं आगे कुछ बोल नहीं पाया...'"
                                 className="w-full h-32 bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white placeholder-white/30 resize-none focus:ring-1 focus:ring-purple-500 outline-none mb-4"
                              />
                              <PrimaryButton className="w-full text-sm py-3 bg-gradient-to-r from-purple-500/80 to-indigo-500/80 !border-none">
                                 <Sparkles size={16} /> अगला कदम बताओ
                              </PrimaryButton>
                           </GlassCard>

                           {/* Master Techniques Library */}
                           <GlassCard className="bg-gradient-to-br from-pink-900/20 to-slate-900/50">
                              <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
                                 <Copy size={18} className="text-pink-400"/> मास्टर टेक्निक्स लाइब्रेरी
                              </h3>
                              
                              <div className="space-y-1">
                                 <TechAccordionItem title="साइकोलॉजी ट्रिक्स (Psychology Tricks)" icon={Brain} id="t1">
                                    <p>• <strong>The Benjamin Franklin Effect:</strong> उनसे कोई छोटी सी मदद मांगो (जैसे: "क्या तुम्हारे पास पेन है?"). इससे वो आपको subconsciously पसंद करने लगेंगे।</p>
                                    <p className="mt-2">• <strong>Mirroring:</strong> उनकी बॉडी लैंग्वेज को subtly कॉपी करो। इससे trust build होता है।</p>
                                 </TechAccordionItem>
                                 <TechAccordionItem title="साइकोलॉजिकल कम्युनिकेशन (Communication)" icon={Mic} id="t2">
                                    <p>• <strong>Open-ended Questions:</strong> ऐसे सवाल पूछो जिनका जवाब हाँ/ना में न हो। (e.g., "तुम्हें वीकेंड पर क्या करना पसंद है?" vs "क्या वीकेंड अच्छा था?")</p>
                                 </TechAccordionItem>
                                 <TechAccordionItem title="बॉडी लैंग्वेज (Body Language)" icon={Users} id="t3">
                                    <p>• <strong>Eye Contact:</strong> बात करते समय 60-70% टाइम आँखों में देखो।</p>
                                    <p className="mt-2">• <strong>Open Posture:</strong> हाथ मत बांधो (Don't cross arms). रिलैक्स्ड रहो।</p>
                                 </TechAccordionItem>
                                 <TechAccordionItem title="साइकोलॉजिकल अट्रैक्शन (Attraction)" icon={Heart} id="t4">
                                    <p>• <strong>Push-Pull Technique:</strong> पहले कम्पलीमेंट दो, फिर थोड़ा टीज़ करो। (e.g., "तुम बहुत स्मार्ट हो, लेकिन कभी-कभी बच्चों जैसी बातें करती हो।")</p>
                                 </TechAccordionItem>
                              </div>
                           </GlassCard>
                        </div>
                     </div>

                  </div>
               ) : (
                  // Active Practice Chat
                  <div className="max-w-2xl mx-auto w-full flex-1 flex flex-col h-full min-h-[500px]">
                     <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                           <button onClick={exitPractice} className="p-2 hover:bg-white/10 rounded-full"><ArrowLeft size={20}/></button>
                           <div>
                              <h2 className="text-xl font-bold">{selectedScenario.hinglishTitle || selectedScenario.title}</h2>
                              <div className="text-xs text-purple-400 font-bold flex items-center gap-1"><Bot size={12}/> AI Roleplay Active</div>
                           </div>
                        </div>
                        <button onClick={exitPractice} className="text-xs bg-red-500/10 text-red-400 px-3 py-1 rounded-full border border-red-500/20 hover:bg-red-500/20">End Session</button>
                     </div>

                     <GlassCard className="flex-1 flex flex-col overflow-hidden p-0 relative">
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                           {practiceChat.map((msg, i) => (
                              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                 <div className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${msg.role === 'user' ? 'bg-purple-600 text-white rounded-tr-none' : 'bg-white/10 text-white/90 rounded-tl-none border border-white/5'}`}>
                                    {msg.content}
                                 </div>
                              </div>
                           ))}
                           {practiceLoading && <div className="text-white/40 text-xs ml-4 animate-pulse">AI is typing...</div>}
                        </div>

                        <div className="p-3 bg-black/40 border-t border-white/10 flex gap-2">
                           <input 
                              className="flex-1 bg-white/5 border border-white/10 rounded-full px-4 text-sm focus:ring-1 focus:ring-purple-500 outline-none text-white placeholder-white/30"
                              placeholder="Type your response..."
                              value={practiceInput}
                              onChange={(e) => setPracticeInput(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && handlePracticeSend()}
                           />
                           <button className="p-2 text-white/60 hover:text-white bg-white/5 rounded-full"><Mic size={20}/></button>
                           <button onClick={handlePracticeSend} className="p-2 bg-purple-600 text-white rounded-full hover:bg-purple-500 shadow-lg"><Send size={18}/></button>
                        </div>
                     </GlassCard>
                  </div>
               )}
            </div>
         )}
      </div>
    </div>
  );
};
