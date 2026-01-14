import React, { useState } from 'react';
import { GlassCard, PrimaryButton } from '../components/UIComponents';
import { PRACTICE_SCENARIOS } from '../constants';
import { generatePracticeResponse } from '../services/geminiService';
import { Mic, Send, PlayCircle, Trophy } from 'lucide-react';

export const PracticeMode = () => {
  const [selectedScenario, setSelectedScenario] = useState<any>(null);
  const [chat, setChat] = useState<{role: string, content: string}[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const startScenario = (scenario: any) => {
    setSelectedScenario(scenario);
    setChat([{ role: 'ai', content: `(System: Starting "${scenario.title}". AI is ready. Say hello!)` }]);
  };

  const handleSend = async () => {
    if (!input) return;
    const newHistory = [...chat, { role: 'user', content: input }];
    setChat(newHistory);
    setInput('');
    setLoading(true);

    const reply = await generatePracticeResponse(newHistory, selectedScenario.description);
    setChat([...newHistory, { role: 'ai', content: reply }]);
    setLoading(false);
  };

  if (!selectedScenario) {
    return (
      <div className="animate-fade-in max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-6">Practice Arena 🥊</h1>
        <p className="text-white/60 mb-8">Sharpen your social skills with AI roleplay before the real date.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PRACTICE_SCENARIOS.map(scene => (
            <GlassCard key={scene.id} className="hover:border-purple-500 transition-colors group cursor-pointer" >
               <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-white/5 rounded-lg group-hover:bg-purple-500/20 transition">
                     <Trophy className={scene.difficulty === 'Hard' ? 'text-red-400' : 'text-green-400'} />
                  </div>
                  <span className="text-xs border border-white/20 px-2 py-1 rounded text-white/60">{scene.difficulty}</span>
               </div>
               <h3 className="text-xl font-bold mb-2">{scene.title}</h3>
               <p className="text-sm text-white/60 mb-6">{scene.description}</p>
               <PrimaryButton onClick={() => startScenario(scene)} className="w-full">
                  Start Practice
               </PrimaryButton>
            </GlassCard>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-6rem)] flex flex-col animate-fade-in max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-4">
         <h2 className="text-xl font-bold">{selectedScenario.title}</h2>
         <button onClick={() => setSelectedScenario(null)} className="text-sm text-white/50 hover:text-white">Exit Mode</button>
      </div>

      <GlassCard className="flex-1 flex flex-col overflow-hidden p-0">
         <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {chat.map((msg, i) => (
               <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] px-4 py-2 rounded-xl ${
                     msg.role === 'user' 
                     ? 'bg-purple-600 text-white rounded-tr-none' 
                     : 'bg-white/10 text-white/90 rounded-tl-none'
                  }`}>
                     {msg.content}
                  </div>
               </div>
            ))}
            {loading && <div className="text-white/40 text-sm ml-4">AI is typing...</div>}
         </div>

         <div className="p-4 bg-black/20 border-t border-white/10 flex gap-2">
            <input 
               className="flex-1 bg-transparent border-none focus:ring-0 text-white placeholder-white/30"
               placeholder="Type your response..."
               value={input}
               onChange={(e) => setInput(e.target.value)}
               onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            <button className="text-white/60 hover:text-white"><Mic size={20}/></button>
            <button onClick={handleSend} className="text-purple-400 hover:text-purple-300"><Send size={20}/></button>
         </div>
      </GlassCard>
    </div>
  );
};
