import React, { useState } from 'react';
import { GlassCard, StatusBadge } from '../components/UIComponents';
import { Search, Phone, Video, Send, ArrowLeft, Image as ImageIcon, MessageCircle } from 'lucide-react';
import { ChatSession } from '../types';

interface MessagesProps {
  sessions: ChatSession[];
}

export const Messages: React.FC<MessagesProps> = ({ sessions }) => {
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [input, setInput] = useState('');

  // Mobile: If activeChatId is set, show Chat View, else show List View.
  // Desktop: Always show both.

  const currentChat = sessions.find(c => c.id === activeChatId);

  return (
    <div className="h-[calc(100vh-8rem)] md:h-[calc(100vh-6rem)] flex gap-4 animate-fade-in relative">
      
      {/* 1. LIST SIDEBAR (Hidden on mobile if chat is active) */}
      <div className={`
         w-full md:w-80 lg:w-96 flex flex-col bg-[#1E293B]/80 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden
         ${activeChatId ? 'hidden md:flex' : 'flex'}
      `}>
         {/* Search Header */}
         <div className="p-4 border-b border-white/5">
            <h2 className="text-xl font-bold font-serif mb-4">Messages</h2>
            <div className="bg-[#0F172A] flex items-center px-4 py-2.5 rounded-xl border border-white/5">
               <Search size={18} className="text-slate-500 mr-2" />
               <input placeholder="Search..." className="bg-transparent w-full text-sm placeholder-slate-500" />
            </div>
         </div>

         {/* List */}
         <div className="flex-1 overflow-y-auto custom-scrollbar">
            {sessions.length === 0 ? (
               <div className="p-8 text-center text-slate-500 text-sm">
                  No matches yet.<br/>Go to Discover and like some profiles! ❤️
               </div>
            ) : (
               sessions.map(session => (
                  <button 
                     key={session.id}
                     onClick={() => setActiveChatId(session.id)}
                     className={`
                        w-full flex items-center gap-3 p-4 border-b border-white/5 transition-colors
                        ${activeChatId === session.id ? 'bg-white/5' : 'hover:bg-white/5'}
                     `}
                  >
                     <div className="relative">
                        <img src={session.userAvatar} className="w-12 h-12 rounded-full object-cover" />
                        <div className="absolute bottom-0 right-0 border-2 border-[#1E293B] rounded-full">
                           <StatusBadge status={session.status} />
                        </div>
                     </div>
                     <div className="flex-1 text-left overflow-hidden">
                        <div className="flex justify-between items-center mb-0.5">
                           <span className="font-semibold text-white truncate">{session.userName}</span>
                           <span className="text-[10px] text-slate-500">12:30 PM</span>
                        </div>
                        <p className={`text-sm truncate ${session.unreadCount > 0 ? 'text-white font-medium' : 'text-slate-400'}`}>
                           {session.lastMessage}
                        </p>
                     </div>
                     {session.unreadCount > 0 && (
                        <div className="w-5 h-5 bg-rose-500 rounded-full flex items-center justify-center text-[10px] font-bold">
                           {session.unreadCount}
                        </div>
                     )}
                  </button>
               ))
            )}
         </div>
      </div>


      {/* 2. CHAT AREA (Hidden on mobile if no chat active) */}
      <div className={`
         flex-1 flex flex-col bg-[#1E293B]/60 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden relative
         ${!activeChatId ? 'hidden md:flex' : 'flex absolute inset-0 md:static z-20'}
      `}>
         
         {currentChat ? (
            <>
               {/* Chat Header */}
               <div className="h-16 flex items-center justify-between px-4 border-b border-white/5 bg-[#1E293B]">
                  <div className="flex items-center gap-3">
                     {/* Back Button (Mobile Only) */}
                     <button onClick={() => setActiveChatId(null)} className="md:hidden p-2 -ml-2 text-slate-400">
                        <ArrowLeft size={20} />
                     </button>
                     
                     <img src={currentChat.userAvatar} className="w-9 h-9 rounded-full" />
                     <div>
                        <h3 className="font-bold text-sm text-white">{currentChat.userName}</h3>
                        <p className="text-xs text-slate-400">{currentChat.status === 'online' ? 'Active Now' : 'Offline'}</p>
                     </div>
                  </div>
                  <div className="flex gap-4 text-slate-400">
                     <Phone size={20} />
                     <Video size={20} />
                  </div>
               </div>

               {/* Messages Body */}
               <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#0F172A]/50">
                  <div className="flex justify-center my-4">
                     <span className="text-[10px] text-slate-500 uppercase tracking-widest bg-white/5 px-3 py-1 rounded-full">Today</span>
                  </div>

                  {/* Incoming */}
                  <div className="flex justify-start gap-2 max-w-[85%]">
                     <img src={currentChat.userAvatar} className="w-6 h-6 rounded-full self-end mb-1" />
                     <div className="bg-[#1E293B] border border-white/5 text-slate-200 p-3 rounded-2xl rounded-bl-none text-sm leading-relaxed shadow-sm">
                        {currentChat.lastMessage || "Hey! I saw you like jazz? There's a cool spot in Bandra playing live tonight."}
                     </div>
                  </div>

                  {/* Outgoing */}
                  <div className="flex justify-end">
                     <div className="bg-rose-600 text-white p-3 rounded-2xl rounded-br-none text-sm leading-relaxed shadow-md max-w-[80%]">
                        Oh really? I'd love to go! What time does it start? 🎷
                     </div>
                  </div>
               </div>

               {/* Input Area */}
               <div className="p-3 bg-[#1E293B] border-t border-white/5 flex items-center gap-2">
                  <button className="p-2 text-slate-400 hover:text-white bg-white/5 rounded-full"><ImageIcon size={20}/></button>
                  <input 
                     className="flex-1 bg-[#0F172A] border border-white/10 rounded-full px-4 py-2.5 text-sm focus:border-rose-500 transition"
                     placeholder="Message..."
                     value={input}
                     onChange={(e) => setInput(e.target.value)}
                  />
                  <button className="p-2.5 bg-rose-600 text-white rounded-full shadow-lg shadow-rose-900/20 active:scale-95 transition">
                     <Send size={18} />
                  </button>
               </div>
            </>
         ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-500">
               <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-4">
                  <MessageCircle size={40} className="opacity-20" />
               </div>
               <p>Select a match to start chatting</p>
            </div>
         )}
      </div>
    </div>
  );
};