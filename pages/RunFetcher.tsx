import React, { useState, useRef, useEffect } from 'react';
import { GlassCard, PrimaryButton } from '../components/UIComponents';
import { Fetcher, ChatMessage } from '../types';
import { ArrowLeft, Send, Download, Save, Loader2, Bot } from 'lucide-react';
import { generateFetcherResponse } from '../services/geminiService';

export const RunFetcher = ({ fetcher, onBack }: { fetcher: Fetcher, onBack: () => void }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', role: 'ai', content: `Hello! I am **${fetcher.name}**. \n${fetcher.description}\n\nHow can I help you today?`, timestamp: new Date() }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', content: input, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const result = await generateFetcherResponse(
        'gemini-3-flash-preview', 
        userMsg.content, 
        `You are the ${fetcher.name}. ${fetcher.description}. Keep responses professional and structured.`
      );
      
      const aiMsg: ChatMessage = { 
        id: (Date.now() + 1).toString(), 
        role: 'ai', 
        content: result.text || "I processed that but couldn't generate text.", 
        timestamp: new Date() 
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      setMessages(prev => [...prev, { id: 'err', role: 'ai', content: "Error connecting to AI service.", timestamp: new Date() }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-4 mb-4">
        <button onClick={onBack} className="p-2 hover:bg-white/10 rounded-full transition">
          <ArrowLeft size={24} />
        </button>
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            {fetcher.name}
            <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded border border-purple-500/30">Running</span>
          </h2>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex gap-6 overflow-hidden">
        
        {/* Chat Window */}
        <GlassCard className="flex-1 flex flex-col p-0 overflow-hidden">
          <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-2xl p-4 ${
                  msg.role === 'user' 
                  ? 'bg-purple-600 text-white rounded-tr-none' 
                  : 'bg-white/10 text-white/90 rounded-tl-none border border-white/5'
                }`}>
                  {msg.role === 'ai' && <div className="flex items-center gap-2 mb-2 text-orange-400 text-sm font-bold"><Bot size={16}/> {fetcher.name}</div>}
                  <div className="whitespace-pre-wrap leading-relaxed">{msg.content}</div>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                 <div className="bg-white/5 rounded-2xl p-4 flex items-center gap-2">
                    <Loader2 className="animate-spin text-orange-500" size={20} />
                    <span className="text-sm text-white/50">Processing...</span>
                 </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 bg-black/20 backdrop-blur-md border-t border-white/10">
            <div className="flex gap-4">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Describe your task..."
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 focus:ring-2 focus:ring-purple-500 outline-none transition"
              />
              <PrimaryButton onClick={handleSend} disabled={loading} className="px-6">
                <Send size={20} />
              </PrimaryButton>
            </div>
          </div>
        </GlassCard>

        {/* Sidebar Tools (Desktop) */}
        <div className="w-80 hidden lg:flex flex-col gap-4">
          <GlassCard className="flex-1">
             <h3 className="font-bold mb-4 text-white/80 border-b border-white/10 pb-2">Session Info</h3>
             <div className="space-y-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-white/40">Status</span>
                  <span className="text-green-400">Online</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/40">Latency</span>
                  <span className="text-white">120ms</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/40">Cost</span>
                  <span className="text-white">₹{fetcher.costPerRun}</span>
                </div>
             </div>
          </GlassCard>
          
          <GlassCard>
            <h3 className="font-bold mb-4 text-white/80">Actions</h3>
            <div className="space-y-2">
              <button className="w-full py-3 bg-white/5 hover:bg-white/10 rounded-lg flex items-center justify-center gap-2 transition">
                <Download size={18} /> Export JSON
              </button>
              <button className="w-full py-3 bg-white/5 hover:bg-white/10 rounded-lg flex items-center justify-center gap-2 transition">
                <Save size={18} /> Save as Workflow
              </button>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};