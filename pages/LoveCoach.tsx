
import React, { useState, useEffect, useRef } from 'react';
import { GlassCard, PrimaryButton } from '../components/UIComponents';
import { generateLoveCoachResponse, generatePracticeResponse, generateTechniqueGuide, generateVideoCoachResponse, generateSpeechFromText } from '../services/geminiService';
import { PRACTICE_SCENARIOS } from '../constants';
import { CoachSessionInput, CoachResponse, CoachHistoryItem, AvatarConfig } from '../types';
import { 
  Smile, Frown, Zap, Minus, 
  Users, Eye, Lock, 
  User, Heart, Sparkles, 
  AlertTriangle, Shield, Home,
  MessageSquare,
  Volume2, Copy, Share2, History, X, Calendar, Activity,
  Dumbbell, Mic, Send, Bot, PlayCircle, ArrowLeft,
  ChevronDown, ChevronUp, Brain, Globe, Lightbulb, Flame, Power,
  Video, MicOff, PhoneOff, Settings as SettingsIcon, Camera, RefreshCw, Save
} from 'lucide-react';

const TECH_TOOLS = [
  { id: 'tech_psy_tricks', title: "Psychology Tricks (साइकोलॉजी ट्रिक्स)", icon: Sparkles, desc: "Mind hacks to influence behavior." },
  { id: 'tech_psy_comm', title: "Psychological Communication", icon: MessageSquare, desc: "Conversation patterns for deep subconscious connection." },
  { id: 'tech_body_lang', title: "Body Language (बॉडी लैंग्वेज)", icon: Eye, desc: "Read signals and project confidence without words." },
  { id: 'tech_psy_attract', title: "Psychological Attraction", icon: Flame, desc: "Create intense desire and magnetism scientifically." },
  { id: 't1', title: "The Benjamin Franklin Effect", icon: Brain, desc: "Ask for a small favor to build subconscious liking." },
  { id: 't2', title: "Mirroring", icon: Users, desc: "Subtly copy body language to build trust." },
  { id: 't3', title: "Push-Pull Technique", icon: Heart, desc: "Mix compliments with playful teasing to create attraction." },
  { id: 't4', title: "Open-Ended Questions", icon: Mic, desc: "Ask questions that require more than a Yes/No answer." },
];

const AVATAR_OPTIONS = {
  Female: [
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop&crop=faces', // Smiling Front
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&crop=faces', // Intense Front
    'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop&crop=faces', // Warm Front
    'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=400&h=400&fit=crop&crop=faces', // Glasses Front
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=faces', // Serious Front
    'https://images.unsplash.com/photo-1554151228-14d9def656ec?w=400&h=400&fit=crop&crop=faces', // Close-up Front
  ],
  Male: [
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=faces', // Classic Front
    'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop&crop=faces', // Sharp Front
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=faces', // Friendly Front
    'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop&crop=faces', // Professional Front
    'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=400&h=400&fit=crop&crop=faces', // Glasses
    'https://images.unsplash.com/photo-1480455624313-e29b44bbfde1?w=400&h=400&fit=crop&crop=faces', // Serious Front
  ]
};

// --- AUDIO HELPERS ---
const decodeAudioData = async (base64String: string, audioContext: AudioContext) => {
  const binaryString = atob(base64String);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return await audioContext.decodeAudioData(bytes.buffer);
};

const SelectableCard = ({ selected, onClick, icon: Icon, label, subLabel }: any) => (
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

const SectionHeader = ({ icon: Icon, title, className = "" }: any) => (
  <div className={`flex items-center gap-2 mb-4 ${className}`}>
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
  const [activeSection, setActiveSection] = useState<'coach' | 'practice' | 'video'>(initialSection);
  
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
    detailedLocation: { country: '', state: '', district: '', city: '', pincode: '' },
    advancedContext: { userPersonality: '', partnerPersonality: '', timing: '', company: '', atmosphere: '' },
    context: { locationDetails: '', personality: '', surroundings: '' }
  });

  const [expandDetails, setExpandDetails] = useState(false);
  const [dailyReflection, setDailyReflection] = useState('');
  
  // --- TECH TOOLS ---
  const [selectedTechId, setSelectedTechId] = useState<string | null>(null);
  const [techContext, setTechContext] = useState('');
  const [techResult, setTechResult] = useState<{id: string, text: string} | null>(null);
  const [techLoading, setTechLoading] = useState(false);
  const [enabledTechs, setEnabledTechs] = useState<Set<string>>(new Set(TECH_TOOLS.map(t => t.id)));

  // --- PRACTICE STATE ---
  const [selectedScenario, setSelectedScenario] = useState<any>(null);
  const [practiceChat, setPracticeChat] = useState<{role: string, content: string}[]>([]);
  const [practiceInput, setPracticeInput] = useState('');
  const [practiceLoading, setPracticeLoading] = useState(false);
  const [practiceHistory, setPracticeHistory] = useState<PracticeSession[]>([]);
  // Practice Avatar Config (New)
  const [practiceAvatarConfig, setPracticeAvatarConfig] = useState<AvatarConfig>({
      gender: 'Female',
      age: '24',
      style: 'Casual',
      personality: 'Date',
      voiceType: 'Soft',
      language: 'Hinglish',
      viewMode: 'Upper',
      avatarId: AVATAR_OPTIONS['Female'][0]
  });
  const [practiceStatus, setPracticeStatus] = useState<'idle'|'speaking'|'listening'|'thinking'>('idle');

  // --- VIDEO CALL STATE ---
  const [avatarConfig, setAvatarConfig] = useState<AvatarConfig>({
      gender: 'Female',
      age: '25',
      style: 'Casual',
      personality: 'Best Friend',
      voiceType: 'Soft',
      language: 'Hinglish',
      viewMode: 'Upper',
      avatarId: AVATAR_OPTIONS['Female'][0]
  });
  const [isVideoActive, setIsVideoActive] = useState(false);
  const [videoInput, setVideoInput] = useState('');
  const [videoStatus, setVideoStatus] = useState<'listening' | 'speaking' | 'idle' | 'thinking'>('idle');
  const [currentEmotion, setCurrentEmotion] = useState<'happy' | 'serious' | 'thinking' | 'surprised' | 'empathetic' | 'flirty' | 'romantic' | 'confident'>('happy');
  const [videoHistory, setVideoHistory] = useState<{role: string, text: string}[]>([]);
  
  const [isListening, setIsListening] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const practiceChatRef = useRef<HTMLDivElement>(null);
  
  const recognitionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  // --- HISTORY DRAWER STATE ---
  const [showHistory, setShowHistory] = useState(false);
  const [historyTab, setHistoryTab] = useState<'coach' | 'practice'>('coach');

  const isValid = input.mood && input.locationType && input.stage;

  // Auto scroll chat
  useEffect(() => {
    if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
    if (practiceChatRef.current) {
        practiceChatRef.current.scrollTop = practiceChatRef.current.scrollHeight;
    }
  }, [videoHistory, practiceChat]);

  // --- AUDIO LOGIC (SHARED) ---
  const playAudio = async (text: string, gender: 'Male'|'Female', setStatus: (s: any) => void) => {
      setStatus('speaking');
      
      // 1. Try Gemini Natural TTS first
      const audioBase64 = await generateSpeechFromText(text, gender);
      
      if (audioBase64) {
          try {
              if (!audioContextRef.current) {
                  audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
              }
              const audioCtx = audioContextRef.current;
              const buffer = await decodeAudioData(audioBase64, audioCtx);
              const source = audioCtx.createBufferSource();
              source.buffer = buffer;
              source.connect(audioCtx.destination);
              source.onended = () => setStatus('idle');
              source.start();
              return;
          } catch (e) {
              console.error("Audio playback error:", e);
          }
      }

      // 2. Fallback to Browser TTS
      if ('speechSynthesis' in window) {
          window.speechSynthesis.cancel();
          const utterance = new SpeechSynthesisUtterance(text);
          const voices = window.speechSynthesis.getVoices();
          let preferredVoice;
          if (gender === 'Female') {
               preferredVoice = voices.find(v => v.name.includes('Google') && v.name.includes('Female')) || voices.find(v => v.lang.includes('IN'));
          } else {
               preferredVoice = voices.find(v => v.name.includes('Google') && v.name.includes('Male')) || voices.find(v => v.lang.includes('IN'));
          }
          if (preferredVoice) utterance.voice = preferredVoice;
          utterance.onstart = () => setStatus('speaking');
          utterance.onend = () => setStatus('idle');
          window.speechSynthesis.speak(utterance);
      } else {
          setStatus('idle');
      }
  };

  const startListening = (onResult: (text: string) => void, setStatus: (s: any) => void) => {
      if (isListening) {
          recognitionRef.current?.stop();
          setIsListening(false);
          setStatus('idle');
          return;
      }

      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
          recognitionRef.current = new SpeechRecognition();
          recognitionRef.current.continuous = false;
          recognitionRef.current.lang = 'en-IN'; // Default Hinglish friendly
          recognitionRef.current.onstart = () => { setIsListening(true); setStatus('listening'); };
          recognitionRef.current.onresult = (event: any) => {
              const transcript = event.results[0][0].transcript;
              onResult(transcript);
          };
          recognitionRef.current.onerror = () => { setIsListening(false); setStatus('idle'); };
          recognitionRef.current.onend = () => { setIsListening(false); };
          recognitionRef.current.start();
      } else {
          alert("Voice input not supported.");
      }
  };

  // --- COACH HANDLERS ---
  const handleGenerate = async () => {
    if (!isValid) return;
    setLoading(true);
    setResult(null);

    const activeTechniqueTitles = TECH_TOOLS
        .filter(t => enabledTechs.has(t.id))
        .map(t => t.title)
        .join(', ');

    const enhancedInput = {
        ...input,
        context: {
            ...input.context,
            surroundings: `${input.context.surroundings} \n\n[User's Daily Reflection/Problem: ${dailyReflection}] \n\n[Active Master Techniques to Apply: ${activeTechniqueTitles}]`
        }
    };

    const response = await generateLoveCoachResponse(enhancedInput);
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

  const handleTechGenerate = async (techName: string) => {
    if (!techContext) return;
    setTechLoading(true);
    const res = await generateTechniqueGuide(techName, techContext);
    setTechResult({ id: selectedTechId || '', text: res });
    setTechLoading(false);
  };

  const toggleTech = (id: string, e: React.MouseEvent) => {
      e.stopPropagation();
      setEnabledTechs(prev => {
          const newSet = new Set(prev);
          if (newSet.has(id)) newSet.delete(id);
          else newSet.add(id);
          return newSet;
      });
  };

  const copyText = (text: string) => navigator.clipboard.writeText(text);
  const shareText = async (title: string, text: string) => {
     if (navigator.share) await navigator.share({ title: 'Love Pilot Advice', text: `${title}: ${text}` });
     else copyText(`${title}: ${text}`);
  };

  const loadFromHistory = (item: CoachHistoryItem) => {
     setInput(item.input);
     setResult(item.response);
     setShowHistory(false);
     setActiveSection('coach');
     window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // --- PRACTICE MODE LOGIC ---
  const startPractice = (scenario: any) => {
    setSelectedScenario(scenario);
    const startMsg = `(System: Starting "${scenario.title}". AI is ready. Say hello!)`;
    setPracticeChat([{ role: 'system', content: startMsg }]);
    // Start with a spoken greeting if desired, or wait for user
    setTimeout(() => {
        const greeting = `Hi! I'm ready for our roleplay. ${scenario.title}. Let's start!`;
        playAudio(greeting, practiceAvatarConfig.gender, setPracticeStatus);
        setPracticeChat(prev => [...prev, {role: 'ai', content: greeting}]);
    }, 1000);
  };

  const handlePracticeSend = async () => {
    if (!practiceInput) return;
    const newHistory = [...practiceChat, { role: 'user', content: practiceInput }];
    setPracticeChat(newHistory);
    setPracticeInput('');
    setPracticeLoading(true);
    setPracticeStatus('thinking');

    // Stop listening if active
    if (isListening && recognitionRef.current) {
        recognitionRef.current.stop();
        setIsListening(false);
    }

    const reply = await generatePracticeResponse(newHistory, selectedScenario.description);
    setPracticeChat([...newHistory, { role: 'ai', content: reply }]);
    setPracticeLoading(false);
    
    // Auto Speak Reply
    playAudio(reply, practiceAvatarConfig.gender, setPracticeStatus);
  };

  const handlePracticeMic = () => {
      startListening((text) => {
          setPracticeInput(text);
          // Optional: Auto send after voice
          // handlePracticeSend(); // Use simple typing for now to let user confirm
      }, setPracticeStatus);
  };

  const exitPractice = () => {
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
     setPracticeStatus('idle');
  };

  const loadPracticeFromHistory = (session: PracticeSession) => {
     const scenario = PRACTICE_SCENARIOS.find(s => s.title === session.scenarioTitle) || { title: session.scenarioTitle, description: 'Resumed session' };
     setSelectedScenario(scenario);
     setPracticeChat(session.chatLog);
     setShowHistory(false);
     setActiveSection('practice');
  };

  // --- VIDEO CALL LOGIC ---
  const startVideoCall = () => {
      setIsVideoActive(true);
      setVideoHistory([]);
      setVideoStatus('idle');
      const greeting = `Hi! I'm your ${avatarConfig.personality} coach. Tell me what's on your mind?`;
      setTimeout(() => {
          playAudio(greeting, avatarConfig.gender, setVideoStatus);
          setVideoHistory([{role: 'ai', text: greeting}]);
      }, 1000);
  };

  const handleSaveVideoSession = (history: any[]) => {
      if (history.length > 0) {
          const content = history.map(m => `${m.role?.toUpperCase() || 'AI'}: ${m.text || m.content}`).join('\n');
          const blob = new Blob([content], { type: 'text/plain' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `LovePilot-Session-${new Date().toLocaleDateString()}.txt`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
      }
  };

  const handleVideoSend = async () => {
      if (!videoInput.trim() && !isListening) return;
      
      const userText = videoInput;
      setVideoInput('');
      
      if (isListening && recognitionRef.current) {
          recognitionRef.current.stop();
          setIsListening(false);
      }

      setVideoHistory(prev => [...prev, {role: 'user', text: userText}]);
      setVideoStatus('thinking');
      setCurrentEmotion('thinking');

      const response = await generateVideoCoachResponse(userText, avatarConfig, videoHistory);
      
      if (response) {
          setVideoHistory(prev => [...prev, {role: 'ai', text: response.text}]);
          setCurrentEmotion(response.emotion as any);
          playAudio(response.text, avatarConfig.gender, setVideoStatus);
      } else {
          setVideoStatus('idle');
          playAudio("Sorry, I lost connection for a second. Can you repeat that?", avatarConfig.gender, setVideoStatus);
      }
  };

  const toggleVideoMic = () => {
      startListening((text) => {
          // Direct send for video mode
          setVideoHistory(prev => [...prev, {role: 'user', text: text}]);
          setVideoStatus('thinking');
          setCurrentEmotion('thinking');
          generateVideoCoachResponse(text, avatarConfig, videoHistory).then(response => {
              if (response) {
                  setVideoHistory(prev => [...prev, {role: 'ai', text: response.text}]);
                  setCurrentEmotion(response.emotion as any);
                  playAudio(response.text, avatarConfig.gender, setVideoStatus);
              }
          });
      }, setVideoStatus);
  };

  const getAvatarImage = (config: AvatarConfig, emotion = 'happy') => {
      if (config.avatarId) return config.avatarId;
      // ... existing logic fallback ...
      return AVATAR_OPTIONS[config.gender][0];
  };

  // TechItem component helper
  const TechItem = ({ title, icon: Icon, id, description }: any) => {
      const isSelected = selectedTechId === id;
      const isEnabled = enabledTechs.has(id);
      const hasResult = techResult?.id === id;
      return (
         <div className={`border rounded-xl overflow-hidden mb-3 transition-all ${isSelected ? 'bg-white/10 border-purple-500 shadow-lg' : 'bg-white/5 border-white/10'}`}>
            <div className="flex items-center justify-between p-4">
               <div className="flex items-center gap-3 flex-1">
                  <div className={`p-2 rounded-lg ${isSelected ? 'bg-purple-500 text-white' : 'bg-white/5 text-purple-400'}`}>
                     <Icon size={20} />
                  </div>
                  <div>
                     <span className={`font-bold text-sm block ${isEnabled ? 'text-white' : 'text-white/40'}`}>{title}</span>
                     {!isSelected && <span className="text-[10px] text-white/50 line-clamp-1">{description}</span>}
                  </div>
               </div>
               <div className="flex items-center gap-2">
                   <button onClick={(e) => toggleTech(id, e)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition-all mr-2 ${isEnabled ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-slate-700/50 text-slate-500 border-white/5'}`}><Power size={12} strokeWidth={3} />{isEnabled ? 'ON' : 'OFF'}</button>
                   <button onClick={() => { if (isSelected) { setSelectedTechId(null); setTechResult(null); setTechContext(''); } else { setSelectedTechId(id); setTechContext(''); } }} className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all flex items-center gap-1 ${isSelected ? 'bg-rose-500 border-rose-500 text-white hover:bg-rose-600' : 'bg-white/5 border-white/20 text-white/60 hover:text-white hover:border-white/50'}`}>{isSelected ? <X size={14}/> : <ChevronDown size={14}/>}</button>
               </div>
            </div>
            {isSelected && (
               <div className="p-4 pt-0 border-t border-white/10 bg-black/20 animate-fade-in">
                  <p className="text-sm text-white/70 mb-4 mt-4 italic">"{description}"</p>
                  {!hasResult ? (
                     <div className="space-y-3">
                         <h4 className="text-xs font-bold text-white/60 uppercase">Apply this technique specificially</h4>
                         <input value={techContext} onChange={(e) => setTechContext(e.target.value)} placeholder="Where do you want to use this? (e.g., On a first date)" className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-purple-500 outline-none" />
                         <PrimaryButton onClick={() => handleTechGenerate(title)} disabled={!techContext || techLoading} className="w-full py-2 text-sm bg-purple-600 hover:bg-purple-500">{techLoading ? 'Generating Guide...' : 'Get Steps'}</PrimaryButton>
                     </div>
                  ) : (
                     <div className="mt-2 bg-purple-900/20 border border-purple-500/30 rounded-lg p-3">
                         <h4 className="text-xs font-bold text-purple-300 mb-2 flex items-center gap-2"><Sparkles size={12}/> AI Guide</h4>
                         <p className="text-sm text-white leading-relaxed whitespace-pre-wrap">{techResult.text}</p>
                         <button onClick={() => setTechResult(null)} className="mt-3 text-xs text-white/40 hover:text-white underline">Try another context</button>
                     </div>
                  )}
               </div>
            )}
         </div>
      );
  };

  return (
    <div className="animate-fade-in max-w-6xl mx-auto w-full relative h-[calc(100vh-6rem)] md:h-auto overflow-hidden md:overflow-visible flex flex-col">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4 shrink-0">
         <h1 className="text-3xl font-serif font-bold text-white flex items-center gap-2">
            {activeSection === 'coach' && <Sparkles className="text-rose-500"/>}
            {activeSection === 'practice' && <Dumbbell className="text-purple-500"/>}
            {activeSection === 'video' && <Video className="text-blue-500"/>}
            {activeSection === 'coach' ? 'Love Coach AI' : activeSection === 'practice' ? 'Practice Arena' : 'AI Voice Assistant'}
         </h1>
         <div className="flex gap-4">
            <div className="flex bg-white/5 rounded-xl p-1 border border-white/10">
               <button onClick={() => setActiveSection('coach')} className={`px-4 py-2 rounded-lg text-sm font-bold transition flex items-center gap-2 ${activeSection === 'coach' ? 'bg-rose-600 text-white shadow-lg' : 'text-white/50 hover:text-white'}`}><Sparkles size={16} /> Coach</button>
               <button onClick={() => setActiveSection('practice')} className={`px-4 py-2 rounded-lg text-sm font-bold transition flex items-center gap-2 ${activeSection === 'practice' ? 'bg-purple-600 text-white shadow-lg' : 'text-white/50 hover:text-white'}`}><Dumbbell size={16} /> Practice</button>
               <button onClick={() => setActiveSection('video')} className={`px-4 py-2 rounded-lg text-sm font-bold transition flex items-center gap-2 ${activeSection === 'video' ? 'bg-blue-600 text-white shadow-lg' : 'text-white/50 hover:text-white'}`}><Video size={16} /> Voice Call</button>
            </div>
            <button onClick={() => { setShowHistory(true); setHistoryTab(activeSection === 'video' ? 'coach' : activeSection as any); }} className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl transition border border-white/10"><History size={18} /> <span className="text-sm font-bold hidden md:inline">History</span></button>
         </div>
      </div>

      {showHistory && (
         <div className="fixed inset-0 z-50 flex justify-end">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowHistory(false)}></div>
            <div className="relative w-full max-w-sm bg-[#1E293B] h-full shadow-2xl border-l border-white/10 animate-slide-up flex flex-col">
               <div className="p-4 border-b border-white/10 flex flex-col gap-4">
                  <div className="flex justify-between items-center"><h3 className="font-bold text-lg">History</h3><button onClick={() => setShowHistory(false)}><X size={20} className="text-slate-400 hover:text-white"/></button></div>
                  <div className="flex w-full bg-black/20 rounded-lg p-1">
                     <button onClick={() => setHistoryTab('coach')} className={`flex-1 py-2 text-xs font-bold rounded-md transition ${historyTab === 'coach' ? 'bg-white/10 text-white shadow' : 'text-slate-500'}`}>Strategies</button>
                     <button onClick={() => setHistoryTab('practice')} className={`flex-1 py-2 text-xs font-bold rounded-md transition ${historyTab === 'practice' ? 'bg-white/10 text-white shadow' : 'text-slate-500'}`}>Roleplays</button>
                  </div>
               </div>
               <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {historyTab === 'coach' ? (
                     coachHistory.length === 0 ? <div className="text-center text-slate-500 mt-10">No strategy history.</div> : coachHistory.map(item => (<div key={item.id} onClick={() => loadFromHistory(item)} className="p-3 bg-white/5 hover:bg-white/10 rounded-xl cursor-pointer border border-white/5 transition"><div className="flex justify-between mb-1"><span className="text-xs text-rose-400 font-bold uppercase">{item.input.stage}</span><span className="text-[10px] text-slate-500">{item.date}</span></div><p className="text-sm text-white font-medium line-clamp-1">{item.response.solution}</p></div>))
                  ) : (
                     practiceHistory.length === 0 ? <div className="text-center text-slate-500 mt-10">No practice history.</div> : practiceHistory.map(item => (<div key={item.id} onClick={() => loadPracticeFromHistory(item)} className="p-3 bg-white/5 hover:bg-white/10 rounded-xl cursor-pointer border border-white/5 transition"><div className="flex justify-between mb-1"><span className="text-xs text-purple-400 font-bold uppercase truncate max-w-[150px]">{item.scenarioTitle}</span><span className="text-[10px] text-slate-500">{item.date}</span></div><p className="text-sm text-white font-medium line-clamp-1 flex items-center gap-1"><MessageSquare size={12}/> {item.chatLog.length} messages</p></div>))
                  )}
               </div>
            </div>
         </div>
      )}

      <div className="flex-1 overflow-y-auto scrollbar-hide md:overflow-visible pb-20">
         
         {activeSection === 'coach' && (
            <div className="animate-fade-in">
                {result ? (
                   <div className="max-w-3xl mx-auto space-y-4 animate-slide-up pb-20">
                      <div className="flex items-center gap-4 mb-6 sticky top-0 bg-[#0F172A]/90 backdrop-blur-md p-4 rounded-xl border-b border-white/5 z-20">
                         <button onClick={() => setResult(null)} className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition"><ArrowLeft size={24} /></button>
                         <div><h2 className="text-xl font-bold text-white flex items-center gap-2"><Sparkles className="text-rose-500" size={20} /> Your Personal Strategy</h2><p className="text-xs text-white/50">Generated specially for you</p></div>
                      </div>
                      <AdviceCard title="Samadhan (Solution)" icon={Shield} accentColor="border-rose-500/30" onCopy={() => copyText(result.solution)} onSpeak={() => playAudio(result.solution, practiceAvatarConfig.gender, setPracticeStatus)}>{result.solution}</AdviceCard>
                      <AdviceCard title="Bolne ke liye Script" icon={MessageSquare} accentColor="border-purple-500/30" onCopy={() => copyText(result.script)} onSpeak={() => playAudio(result.script, practiceAvatarConfig.gender, setPracticeStatus)} onShare={() => shareText('Script', result.script)}><div className="bg-black/20 p-3 rounded-lg border-l-2 border-purple-400 italic">"{result.script}"</div></AdviceCard>
                      <AdviceCard title="Awaaz aur Tone" icon={Volume2} accentColor="border-blue-500/30">{result.tone}</AdviceCard>
                      <AdviceCard title="Body Language" icon={Activity} accentColor="border-green-500/30">{result.bodyLanguage}</AdviceCard>
                      <AdviceCard title="Best Time" icon={Calendar} accentColor="border-teal-500/30">{result.bestTime}</AdviceCard>
                      <AdviceCard title="Khas Baat (Note)" icon={AlertTriangle} accentColor="border-yellow-500/30 bg-yellow-900/10">{result.keyNote}</AdviceCard>
                      <div className="pt-6"><PrimaryButton onClick={() => setResult(null)} variant="outline" className="w-full">Start New Session</PrimaryButton></div>
                   </div>
                ) : (
                   <div className="space-y-12">
                      <div className="max-w-4xl mx-auto space-y-6">
                         <div className="text-center xl:text-left mb-6"><h2 className="text-2xl font-bold text-white">Session Details</h2><p className="text-slate-400 text-sm">Step 1: Fill in the details below.</p></div>
                         <GlassCard><SectionHeader icon={Smile} title="How are you feeling?" /><div className="grid grid-cols-2 md:grid-cols-4 gap-3">{[{ id: 'happy', label: 'Happy', icon: Smile }, { id: 'sad', label: 'Sad', icon: Frown }, { id: 'angry', label: 'Angry', icon: Zap }, { id: 'neutral', label: 'Neutral', icon: Minus }].map(opt => (<SelectableCard key={opt.id} selected={input.mood === opt.id} onClick={() => setInput({...input, mood: opt.id})} icon={opt.icon} label={opt.label} />))}</div></GlassCard>
                         <GlassCard>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                               <div><SectionHeader icon={Home} title="Where are you?" /><div className="grid grid-cols-1 gap-2">{[{ id: 'public', label: 'Public Place', sub: 'Mall, College', icon: Users }, { id: 'semi', label: 'Semi-Private', sub: 'Cafe, Park', icon: Eye }, { id: 'private', label: 'Private', sub: 'Home, Car', icon: Lock }].map(opt => (<button key={opt.id} onClick={() => setInput({...input, locationType: opt.id})} className={`flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${input.locationType === opt.id ? 'bg-rose-500/10 border-rose-500 text-white' : 'bg-white/5 border-transparent text-slate-400 hover:bg-white/10'}`}><opt.icon size={20} /><div><div className="text-sm font-bold">{opt.label}</div><div className="text-[10px] opacity-60">{opt.sub}</div></div></button>))}</div></div>
                               <div><SectionHeader icon={Heart} title="Relationship Stage" /><div className="grid grid-cols-1 gap-2">{[{ id: 'stranger', label: 'Stranger', icon: User }, { id: 'talking', label: 'Talking Stage', icon: MessageSquare }, { id: 'dating', label: 'Dating', icon: Heart }, { id: 'breakup', label: 'Breakup', icon: AlertTriangle }].map(opt => (<button key={opt.id} onClick={() => setInput({...input, stage: opt.id})} className={`flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${input.stage === opt.id ? 'bg-rose-500/10 border-rose-500 text-white' : 'bg-white/5 border-transparent text-slate-400 hover:bg-white/10'}`}><opt.icon size={20} /><span className="text-sm font-bold">{opt.label}</span></button>))}</div></div>
                            </div>
                         </GlassCard>
                         <GlassCard><SectionHeader icon={Dumbbell} title="कॉन्फिडेंस लेवल? 💪" /><div className="grid grid-cols-3 gap-3">{[{ id: 'High', label: 'हाई', color: 'bg-green-500' }, { id: 'Medium', label: 'मीडियम', color: 'bg-yellow-500' }, { id: 'Low', label: 'लो', color: 'bg-red-500' }].map(opt => (<button key={opt.id} onClick={() => setInput({...input, confidence: opt.id})} className={`flex items-center justify-center gap-2 p-3 rounded-xl border transition-all ${input.confidence === opt.id ? 'bg-white/10 border-white text-white' : 'bg-white/5 border-transparent text-slate-400 hover:bg-white/10'}`}><div className={`w-2 h-2 rounded-full ${opt.color}`}></div><span className="text-sm font-bold">{opt.label}</span></button>))}</div></GlassCard>
                         <div className="rounded-2xl border border-white/10 overflow-hidden transition-all bg-[#0F172A]"><button onClick={() => setExpandDetails(!expandDetails)} className="w-full flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 transition"><div className="flex items-center gap-2 text-rose-400 font-bold"><ChevronDown size={18} className={`transition-transform duration-300 ${expandDetails ? 'rotate-180' : ''}`} /> और ज़्यादा जानकारी दो (बेहतर सलाह के लिए)</div></button>{expandDetails && (<div className="p-4 space-y-6 animate-slide-up"><div><h4 className="text-sm font-bold text-white mb-3">लोकेशन की पूरी जानकारी</h4><div className="grid grid-cols-2 md:grid-cols-3 gap-3"><input placeholder="देश (Country)" value={input.detailedLocation?.country} onChange={e => setInput({...input, detailedLocation: {...input.detailedLocation!, country: e.target.value}})} className="bg-white/5 border border-white/10 rounded-lg p-2 text-xs text-white" /><input placeholder="राज्य (State)" value={input.detailedLocation?.state} onChange={e => setInput({...input, detailedLocation: {...input.detailedLocation!, state: e.target.value}})} className="bg-white/5 border border-white/10 rounded-lg p-2 text-xs text-white" /><input placeholder="ज़िला (District)" value={input.detailedLocation?.district} onChange={e => setInput({...input, detailedLocation: {...input.detailedLocation!, district: e.target.value}})} className="bg-white/5 border border-white/10 rounded-lg p-2 text-xs text-white" /></div></div></div>)}</div>
                      </div>
                      <div className="border-t border-white/10 pt-4"></div>
                      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8"><GlassCard className="bg-gradient-to-br from-indigo-900/20 to-slate-900/50"><h3 className="font-bold text-lg mb-4 flex items-center gap-2"><Lightbulb size={18} className="text-yellow-400"/> Describe Problems / Questions</h3><p className="text-xs text-white/50 mb-4">Briefly describe your situation. This will be automatically used to personalize your strategy.</p><textarea value={dailyReflection} onChange={(e) => setDailyReflection(e.target.value)} placeholder="e.g., I'm feeling nervous about meeting her friends..." className="w-full h-40 bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white placeholder-white/30 resize-none focus:ring-1 focus:ring-purple-500 outline-none mb-4"/></GlassCard><GlassCard className="bg-gradient-to-br from-pink-900/20 to-slate-900/50"><h3 className="font-bold text-lg mb-6 flex items-center gap-2"><Copy size={18} className="text-pink-400"/> Master Techniques Library</h3><p className="text-xs text-white/50 mb-4">Toggle ON/OFF to include in your strategy. Default is ALL ON.</p><div className="space-y-1">{TECH_TOOLS.map(tech => (<TechItem key={tech.id} title={tech.title} icon={tech.icon} id={tech.id} description={tech.desc} />))}</div></GlassCard></div>
                   </div>
                )}
                {!result && (
                   <div className="max-w-4xl mx-auto mt-12 pb-12"><div className={`p-1 rounded-2xl ${isValid ? 'bg-gradient-to-r from-rose-500 to-purple-600' : 'bg-white/10'}`}><PrimaryButton onClick={handleGenerate} disabled={!isValid || loading} className={`w-full text-lg shadow-xl py-6 ${!isValid ? 'opacity-50 grayscale cursor-not-allowed bg-[#0F172A]' : 'bg-[#0F172A] hover:bg-[#1E293B] !shadow-none'}`}><span className="flex flex-col items-center"><span className="font-bold text-xl">{loading ? 'Creating Strategy...' : !isValid ? 'Complete Steps Above to Activate' : 'Fill Details & Activate'}</span>{!isValid && <span className="text-xs text-white/40 font-normal mt-1">Please fill mood, location & stage details first</span>}</span></PrimaryButton></div></div>
                )}
            </div>
         )}

         {activeSection === 'practice' && (
            <div className="animate-fade-in h-full flex flex-col">
               {!selectedScenario ? (
                  <div className="max-w-4xl mx-auto w-full space-y-8">
                     <div className="text-center">
                        <div className="flex items-center justify-center gap-2 mb-2"><h2 className="text-2xl font-bold text-white">Practice Arena</h2></div>
                        <p className="text-white/60">Choose a scenario and your AI partner for voice roleplay.</p>
                     </div>

                     {/* Partner Selection (Top) */}
                     <GlassCard className="relative overflow-hidden border-purple-500/30">
                        <div className="flex items-center justify-between mb-4">
                           <h3 className="font-bold text-white flex items-center gap-2"><User size={18} className="text-purple-400"/> Choose Practice Partner</h3>
                           <div className="flex gap-2">
                              {['Female', 'Male'].map(g => (
                                 <button 
                                    key={g} 
                                    onClick={() => setPracticeAvatarConfig({...practiceAvatarConfig, gender: g as any, avatarId: AVATAR_OPTIONS[g as 'Female'|'Male'][0]})} 
                                    className={`px-3 py-1 rounded-full text-xs font-bold transition ${practiceAvatarConfig.gender === g ? 'bg-purple-600 text-white' : 'bg-white/10 text-slate-400 hover:text-white'}`}
                                 >
                                    {g}
                                 </button>
                              ))}
                           </div>
                        </div>
                        <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
                           {AVATAR_OPTIONS[practiceAvatarConfig.gender].map((src, idx) => (
                              <button 
                                 key={idx} 
                                 onClick={() => setPracticeAvatarConfig({...practiceAvatarConfig, avatarId: src})}
                                 className={`relative w-16 h-16 rounded-full overflow-hidden flex-shrink-0 border-2 transition-all ${practiceAvatarConfig.avatarId === src ? 'border-purple-500 scale-110 shadow-lg' : 'border-transparent opacity-70'}`}
                              >
                                 <img src={src} className="w-full h-full object-cover" />
                              </button>
                           ))}
                        </div>
                     </GlassCard>

                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {PRACTICE_SCENARIOS.map(scene => (
                           <div key={scene.id} className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:border-purple-500/50 hover:bg-white/[0.07] transition-all group flex flex-col h-full cursor-pointer" onClick={() => startPractice(scene)}>
                              <div className="flex justify-between items-start mb-4">
                                 <h3 className="text-lg font-bold text-purple-200">{scene.hinglishTitle || scene.title}</h3>
                                 <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase border ${scene.difficulty === 'Easy' ? 'bg-green-500/10 border-green-500/30 text-green-400' : scene.difficulty === 'Medium' ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400' : 'bg-red-500/10 border-red-500/30 text-red-400'}`}>{scene.difficulty}</span>
                              </div>
                              <div className="bg-white/5 rounded-xl p-3 mb-4 text-sm text-white/80 italic border-l-2 border-purple-500/50">"{scene.hinglishDescription || scene.description}"</div>
                              <div className="flex flex-wrap gap-2 mb-6">{scene.tags?.map(tag => (<span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-white/50">{tag}</span>))}</div>
                              <div className="mt-auto w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-sm shadow-lg shadow-purple-900/20 hover:shadow-purple-900/40 transition flex items-center justify-center gap-2"><Mic size={16} /> Start Roleplay</div>
                           </div>
                        ))}
                     </div>
                  </div>
               ) : (
                  <div className="flex-1 flex flex-col max-w-lg mx-auto w-full h-full relative gap-4">
                     
                     {/* SPLIT SCREEN - TOP: AVATAR (45%) */}
                     <div className="h-[45%] bg-black rounded-3xl overflow-hidden relative shadow-2xl border border-white/10 flex-shrink-0 group">
                        <div className="absolute top-4 left-4 right-4 z-20 flex justify-between items-start">
                           <div className="px-3 py-1 bg-black/40 backdrop-blur-md border border-white/10 rounded-full flex items-center gap-2">
                              <span className="text-[10px] font-bold text-white uppercase tracking-wider">{selectedScenario.title}</span>
                           </div>
                           <button onClick={exitPractice} className="p-2 bg-red-500/80 hover:bg-red-600 text-white rounded-full shadow-lg backdrop-blur-sm transition"><X size={16} /></button>
                        </div>

                        <img src={getAvatarImage(practiceAvatarConfig)} className="w-full h-full object-cover transition-all duration-500" alt="Practice Avatar"/>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20"></div>
                        
                        {practiceStatus === 'speaking' && (
                           <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-1">
                              <div className="w-1 h-3 bg-white/80 rounded-full animate-[bounce_1s_infinite]"></div>
                              <div className="w-1 h-5 bg-white/80 rounded-full animate-[bounce_1.2s_infinite]"></div>
                              <div className="w-1 h-3 bg-white/80 rounded-full animate-[bounce_0.8s_infinite]"></div>
                           </div>
                        )}
                        {practiceStatus === 'thinking' && (
                           <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-xs font-bold text-white/70 animate-pulse bg-black/40 px-3 py-1 rounded-full">
                              Thinking...
                           </div>
                        )}
                     </div>

                     {/* SPLIT SCREEN - BOTTOM: CHAT & VOICE INPUT (55%) */}
                     <div className="flex-1 flex flex-col bg-[#1E293B] rounded-3xl border border-white/10 overflow-hidden relative">
                        {/* Transcript Header */}
                        <div className="px-4 py-2 border-b border-white/5 bg-black/20 flex justify-between items-center">
                           <h3 className="text-xs font-bold text-white/60 uppercase tracking-widest flex items-center gap-2">
                              <MessageSquare size={12}/> Live Transcript
                           </h3>
                           <button onClick={() => handleSaveVideoSession(practiceChat)} className="text-xs flex items-center gap-1 text-purple-400 hover:text-white transition">
                              <Save size={12}/> Save History
                           </button>
                        </div>

                        {/* Scrollable History */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar" ref={practiceChatRef}>
                           {practiceChat.map((msg, i) => (
                              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                 <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${msg.role === 'user' ? 'bg-purple-600 text-white rounded-tr-none' : 'bg-white/10 text-white/90 rounded-tl-none border border-white/5'}`}>
                                    {msg.content}
                                 </div>
                              </div>
                           ))}
                        </div>

                        {/* Voice/Text Controls */}
                        <div className="p-3 bg-black/40 border-t border-white/5 flex items-center gap-2">
                           <button onClick={handlePracticeMic} className={`p-3 rounded-xl transition-all ${isListening ? 'bg-red-500 text-white animate-pulse shadow-lg shadow-red-900/50' : 'bg-white/5 text-white/60 hover:bg-white/10'}`}>{isListening ? <MicOff size={20} /> : <Mic size={20} />}</button>
                           <input value={practiceInput} onChange={(e) => setPracticeInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handlePracticeSend()} placeholder={isListening ? "Listening..." : "Type or speak..."} className="flex-1 bg-black/20 border border-white/5 rounded-xl px-4 py-3 text-sm text-white focus:border-purple-500 outline-none" />
                           <button onClick={handlePracticeSend} className="p-3 bg-purple-600 hover:bg-purple-500 text-white rounded-xl shadow-lg transition" disabled={!practiceInput && !isListening}><Send size={20} /></button>
                        </div>
                     </div>
                  </div>
               )}
            </div>
         )}
         
         {activeSection === 'video' && (
             <div className="animate-fade-in h-full flex flex-col">
                 {!isVideoActive ? (
                     <div className="max-w-2xl mx-auto w-full">
                         <div className="text-center mb-6"><h2 className="text-2xl font-bold text-white mb-2">Create Your AI Video Assistant</h2><p className="text-white/50">Customize appearance and personality for a realistic practice experience.</p></div>
                         <div className="flex justify-center mb-8"><div className="relative group"><div className="w-48 h-64 rounded-2xl overflow-hidden border-2 border-white/10 shadow-2xl relative bg-black/20"><img src={avatarConfig.avatarId} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" alt="Preview"/><div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent flex flex-col justify-end p-4"><div className="text-white font-bold text-lg">{avatarConfig.personality} Assistant</div><div className="text-xs text-blue-300 font-medium uppercase tracking-wider mb-1">{avatarConfig.style} • {avatarConfig.age} Yrs</div></div></div><div className="absolute -z-10 top-2 -right-2 w-48 h-64 rounded-2xl border border-white/5 bg-white/5"></div><div className="absolute -z-20 top-4 -right-4 w-48 h-64 rounded-2xl border border-white/5 bg-white/5 opacity-50"></div></div></div>
                         <GlassCard className="space-y-6">
                             <div className="grid grid-cols-2 gap-6"><div><label className="text-xs font-bold text-white/60 ml-1 uppercase mb-2 block">Assistant Gender</label><div className="grid grid-cols-2 gap-2">{['Female', 'Male'].map(g => (<button key={g} onClick={() => setAvatarConfig({...avatarConfig, gender: g as any, avatarId: AVATAR_OPTIONS[g as 'Female'|'Male'][0]})} className={`p-3 rounded-xl border text-sm font-bold ${avatarConfig.gender === g ? 'bg-blue-600 border-blue-500 text-white' : 'bg-white/5 border-white/10 text-white/60'}`}>{g}</button>))}</div></div><div><label className="text-xs font-bold text-white/60 ml-1 uppercase mb-2 block">Approx Age ({avatarConfig.age})</label><input type="range" min="18" max="50" step="1" value={avatarConfig.age} onChange={(e) => setAvatarConfig({...avatarConfig, age: e.target.value})} className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-blue-500" /><div className="flex justify-between text-[10px] text-white/40 mt-1"><span>18</span><span>35</span><span>50</span></div></div></div>
                             <div><label className="text-xs font-bold text-white/60 ml-1 uppercase mb-2 block">Choose Avatar</label><div className="grid grid-cols-3 md:grid-cols-6 gap-3">{AVATAR_OPTIONS[avatarConfig.gender].map((src, idx) => (<button key={idx} onClick={() => setAvatarConfig({...avatarConfig, avatarId: src})} className={`relative rounded-full overflow-hidden aspect-square border-2 transition-all hover:scale-105 ${avatarConfig.avatarId === src ? 'border-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.6)] scale-105' : 'border-transparent opacity-70 hover:opacity-100'}`}><img src={src} className="w-full h-full object-cover" alt={`Avatar ${idx + 1}`} />{avatarConfig.avatarId === src && (<div className="absolute inset-0 bg-blue-500/20"></div>)}</button>))}</div></div>
                             <div><label className="text-xs font-bold text-white/60 ml-1 uppercase mb-2 block">Personality Style</label><div className="grid grid-cols-2 md:grid-cols-4 gap-2">{['Therapist', 'Best Friend', 'Strict Coach', 'Romantic Partner'].map(p => (<button key={p} onClick={() => setAvatarConfig({...avatarConfig, personality: p as any})} className={`p-2 rounded-lg border text-xs font-bold transition-all ${avatarConfig.personality === p ? 'bg-purple-600 border-purple-500 text-white shadow-lg' : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'}`}>{p}</button>))}</div></div>
                             <div className="grid grid-cols-3 gap-4"><div><label className="text-xs font-bold text-white/60 ml-1 uppercase mb-2 block">Voice Tone</label><select value={avatarConfig.voiceType} onChange={(e) => setAvatarConfig({...avatarConfig, voiceType: e.target.value as any})} className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-blue-500 text-xs md:text-sm"><option>Soft</option><option>Deep</option><option>Energetic</option></select></div><div><label className="text-xs font-bold text-white/60 ml-1 uppercase mb-2 block">Language</label><select value={avatarConfig.language} onChange={(e) => setAvatarConfig({...avatarConfig, language: e.target.value as any})} className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-blue-500 text-xs md:text-sm"><option>Hinglish</option><option>Hindi</option><option>English</option></select></div><div><label className="text-xs font-bold text-white/60 ml-1 uppercase mb-2 block">Body View</label><select value={avatarConfig.viewMode} onChange={(e) => setAvatarConfig({...avatarConfig, viewMode: e.target.value as any})} className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-blue-500 text-xs md:text-sm"><option value="Face">Face Only</option><option value="Upper">Upper Body</option><option value="Full">Full Body</option></select></div></div>
                             <div className="pt-4"><PrimaryButton onClick={startVideoCall} className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 shadow-blue-900/40"><Video size={20} /> Start Video Session</PrimaryButton></div>
                         </GlassCard>
                     </div>
                 ) : (
                     <div className="flex-1 flex flex-col max-w-lg mx-auto w-full h-full relative gap-4">
                         
                         {/* TOP HALF: VIDEO (45%) */}
                         <div className="h-[45%] bg-black rounded-3xl overflow-hidden relative shadow-2xl border border-white/10 flex-shrink-0">
                             <div className="absolute top-4 left-4 right-4 z-20 flex justify-between items-start">
                                 <div className="px-3 py-1 bg-black/40 backdrop-blur-md border border-white/10 rounded-full flex items-center gap-2">
                                     <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                                     <span className="text-[10px] font-bold text-white">Live</span>
                                 </div>
                                 <button onClick={() => setIsVideoActive(false)} className="p-2 bg-red-500/80 hover:bg-red-600 text-white rounded-full shadow-lg backdrop-blur-sm transition"><PhoneOff size={16} /></button>
                             </div>

                             <img src={getAvatarImage(avatarConfig)} className="w-full h-full object-cover transition-all duration-500" alt="AI Avatar"/>
                             <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20"></div>
                             
                             {videoStatus === 'speaking' && (
                                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-1">
                                    <div className="w-1 h-3 bg-white/80 rounded-full animate-[bounce_1s_infinite]"></div>
                                    <div className="w-1 h-5 bg-white/80 rounded-full animate-[bounce_1.2s_infinite]"></div>
                                    <div className="w-1 h-3 bg-white/80 rounded-full animate-[bounce_0.8s_infinite]"></div>
                                </div>
                             )}
                         </div>

                         {/* BOTTOM HALF: TRANSCRIPT & CONTROLS (55% via flex-1) */}
                         <div className="flex-1 flex flex-col bg-[#1E293B] rounded-3xl border border-white/10 overflow-hidden relative">
                             {/* Transcript Header */}
                             <div className="px-4 py-2 border-b border-white/5 bg-black/20 flex justify-between items-center">
                                 <h3 className="text-xs font-bold text-white/60 uppercase tracking-widest flex items-center gap-2">
                                     <MessageSquare size={12}/> Live Transcript
                                 </h3>
                                 <button onClick={() => handleSaveVideoSession(videoHistory)} className="text-xs flex items-center gap-1 text-blue-400 hover:text-white transition">
                                     <Save size={12}/> Save Chat
                                 </button>
                             </div>

                             {/* Scrollable History */}
                             <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar" ref={chatContainerRef}>
                                 {videoHistory.map((msg, i) => (
                                     <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                         <div className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm ${msg.role === 'user' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-white/10 text-white/90 rounded-tl-none border border-white/5'}`}>
                                             {msg.text}
                                         </div>
                                     </div>
                                 ))}
                                 {videoStatus === 'thinking' && (
                                     <div className="flex justify-start">
                                         <div className="bg-white/5 rounded-2xl px-4 py-2 text-xs text-white/50 animate-pulse">
                                             Thinking...
                                         </div>
                                     </div>
                                 )}
                             </div>

                             {/* Controls Bar */}
                             <div className="p-3 bg-black/40 border-t border-white/5 flex items-center gap-2">
                                 <button onClick={toggleVideoMic} className={`p-3 rounded-xl transition-all ${isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-white/5 text-white/60 hover:bg-white/10'}`}>{isListening ? <MicOff size={20} /> : <Mic size={20} />}</button>
                                 <input value={videoInput} onChange={(e) => setVideoInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleVideoSend()} placeholder={isListening ? "Listening..." : "Type or speak..."} className="flex-1 bg-black/20 border border-white/5 rounded-xl px-4 py-3 text-sm text-white focus:border-blue-500 outline-none" />
                                 <button onClick={handleVideoSend} className="p-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl shadow-lg transition" disabled={!videoInput && !isListening}><Send size={20} /></button>
                             </div>
                         </div>
                     </div>
                 )}
             </div>
         )}
      </div>
    </div>
  );
};
