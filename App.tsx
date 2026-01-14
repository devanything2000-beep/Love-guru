import React, { useState } from 'react';
import { Heart, MessageCircle, Globe, Brain, Dumbbell, User, Shield, CreditCard, LogOut, ChevronLeft, ChevronRight, Map, Flame, Calendar, Menu } from 'lucide-react';
import { Discover } from './pages/Discover';
import { SocialHub } from './pages/SocialHub';
import { LoveCoach } from './pages/LoveCoach';
import { PracticeMode } from './pages/PracticeMode';
import { Messages } from './pages/Messages';
import { AdminPanel } from './pages/Admin';
import { Billing } from './pages/Billing';
import { DatePlanner } from './pages/DatePlanner';
import { ProfileRoster } from './pages/ProfileRoster';
import { CURRENT_USER, CHAT_SESSIONS } from './constants';
import { StatusBadge } from './components/UIComponents';
import { ChatSession, User as UserType } from './types';

// --- Sidebar Item (Desktop) ---
const NavItem = ({ icon: Icon, label, active, onClick, collapsed }: any) => (
  <button
    onClick={onClick}
    title={collapsed ? label : ''}
    className={`
      w-full flex items-center gap-3 py-3 rounded-xl transition-all duration-200 group
      ${active 
        ? 'bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow-lg' 
        : 'text-slate-400 hover:bg-white/5 hover:text-white'
      } 
      ${collapsed ? 'justify-center px-2' : 'px-4'}
    `}
  >
    <Icon size={22} className={`flex-shrink-0 transition-transform group-hover:scale-110 ${active ? 'text-white' : 'text-slate-400 group-hover:text-white'}`} />
    {!collapsed && <span className="font-medium whitespace-nowrap overflow-hidden text-sm">{label}</span>}
  </button>
);

// --- Bottom Tab Item (Mobile) ---
const MobileTab = ({ icon: Icon, label, active, onClick }: any) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center justify-center w-full py-2 transition-colors ${active ? 'text-rose-500' : 'text-slate-500'}`}
  >
    <div className={`p-1.5 rounded-xl mb-1 transition-all ${active ? 'bg-rose-500/10' : 'bg-transparent'}`}>
      <Icon size={24} strokeWidth={active ? 2.5 : 2} />
    </div>
    <span className="text-[10px] font-medium">{label}</span>
  </button>
);

const App = () => {
  const [currentPage, setCurrentPage] = useState('discover');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // --- Global State for Chats/Matches ---
  const [myChats, setMyChats] = useState<ChatSession[]>(CHAT_SESSIONS);

  // Check if a user is already liked/matched
  const isUserLiked = (userId: string) => myChats.some(chat => chat.userId === userId);

  // Toggle Like Logic (Add/Remove from Messages)
  const handleToggleLike = (profile: UserType) => {
    setMyChats(prev => {
      const exists = prev.find(c => c.userId === profile.id);
      if (exists) {
        // Dislike: Remove from chats
        return prev.filter(c => c.userId !== profile.id);
      } else {
        // Like: Add to chats
        const newSession: ChatSession = {
          id: `new-${profile.id}-${Date.now()}`,
          userId: profile.id,
          userName: profile.name,
          userAvatar: profile.avatar,
          lastMessage: "You matched! Say hello 👋",
          unreadCount: 1, // Mark as new match
          status: profile.isOnline ? 'online' : 'offline'
        };
        return [newSession, ...prev];
      }
    });
  };

  // Define Page Content
  const renderContent = () => {
    switch (currentPage) {
      case 'discover': 
        return <Discover onToggleLike={handleToggleLike} isLiked={isUserLiked} />;
      case 'messages': 
        return <Messages sessions={myChats} />;
      case 'social': return <SocialHub />;
      case 'coach': return <LoveCoach />;
      case 'practice': return <PracticeMode />;
      case 'dateplanner': return <DatePlanner />;
      case 'roster': return <ProfileRoster />;
      case 'admin': return <AdminPanel />;
      case 'billing': return <Billing />;
      case 'profile': return <div className="p-8 text-center text-white/50">Profile Settings (Coming Soon)</div>;
      default: return <Discover onToggleLike={handleToggleLike} isLiked={isUserLiked} />;
    }
  };

  return (
    <div className="flex h-screen bg-[#0F172A] text-white overflow-hidden">
      
      {/* 1. DESKTOP SIDEBAR */}
      <aside 
        className={`
          hidden md:flex flex-col 
          ${isSidebarCollapsed ? 'w-20' : 'w-72'} 
          bg-[#1E293B] border-r border-white/5 
          transition-all duration-300 ease-in-out z-20
        `}
      >
        {/* Brand Header */}
        <div className={`h-20 flex items-center ${isSidebarCollapsed ? 'justify-center' : 'justify-between px-6'} border-b border-white/5`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center text-white shadow-lg shadow-rose-900/20">
              <Heart fill="white" size={20} />
            </div>
            {!isSidebarCollapsed && (
              <span className="text-lg font-bold font-serif tracking-wide">Love Pilot</span>
            )}
          </div>
          <button 
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="hidden md:flex text-slate-500 hover:text-white transition"
          >
            {isSidebarCollapsed ? <ChevronRight size={18}/> : <ChevronLeft size={18}/>}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto custom-scrollbar py-6 px-3 space-y-1">
          <NavItem collapsed={isSidebarCollapsed} icon={Heart} label="Discover" active={currentPage === 'discover'} onClick={() => setCurrentPage('discover')} />
          <NavItem collapsed={isSidebarCollapsed} icon={MessageCircle} label="Messages" active={currentPage === 'messages'} onClick={() => setCurrentPage('messages')} />
          <NavItem collapsed={isSidebarCollapsed} icon={Globe} label="Social Hub" active={currentPage === 'social'} onClick={() => setCurrentPage('social')} />
          
          <div className={`my-4 border-t border-white/5 mx-2 ${isSidebarCollapsed ? 'hidden' : 'block'}`} />
          {!isSidebarCollapsed && <div className="px-4 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">AI Suite</div>}
          
          <NavItem collapsed={isSidebarCollapsed} icon={Brain} label="Love Coach" active={currentPage === 'coach'} onClick={() => setCurrentPage('coach')} />
          <NavItem collapsed={isSidebarCollapsed} icon={Calendar} label="Date Planner" active={currentPage === 'dateplanner'} onClick={() => setCurrentPage('dateplanner')} />
          <NavItem collapsed={isSidebarCollapsed} icon={Flame} label="Profile Roaster" active={currentPage === 'roster'} onClick={() => setCurrentPage('roster')} />
          <NavItem collapsed={isSidebarCollapsed} icon={Dumbbell} label="Practice Mode" active={currentPage === 'practice'} onClick={() => setCurrentPage('practice')} />

          <div className={`my-4 border-t border-white/5 mx-2 ${isSidebarCollapsed ? 'hidden' : 'block'}`} />
          
          <NavItem collapsed={isSidebarCollapsed} icon={CreditCard} label="Premium Plans" active={currentPage === 'billing'} onClick={() => setCurrentPage('billing')} />
          <NavItem collapsed={isSidebarCollapsed} icon={User} label="My Profile" active={currentPage === 'profile'} onClick={() => setCurrentPage('profile')} />
          {CURRENT_USER.role === 'user' && ( 
             <NavItem collapsed={isSidebarCollapsed} icon={Shield} label="Admin" active={currentPage === 'admin'} onClick={() => setCurrentPage('admin')} />
          )}
        </nav>

        {/* User Footer */}
        <div className="p-4 border-t border-white/5">
          <div className={`flex items-center gap-3 ${isSidebarCollapsed ? 'justify-center' : ''}`}>
             <img src={CURRENT_USER.avatar} className="w-9 h-9 rounded-full object-cover border-2 border-white/10" />
             {!isSidebarCollapsed && (
               <div className="flex-1 overflow-hidden">
                 <h4 className="text-sm font-semibold truncate">{CURRENT_USER.name}</h4>
                 <div className="flex items-center gap-1">
                   <StatusBadge status="online" />
                   <span className="text-xs text-slate-400">Online</span>
                 </div>
               </div>
             )}
          </div>
        </div>
      </aside>


      {/* 2. MAIN CONTENT AREA (Responsive) */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative bg-[#0F172A]">
        
        {/* Mobile Header */}
        <div className="md:hidden h-16 bg-[#1E293B]/80 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-4 z-30 sticky top-0">
          <div className="flex items-center gap-2">
            <Heart className="text-rose-500 fill-rose-500" size={24} />
            <span className="text-lg font-bold font-serif">Love Pilot</span>
          </div>
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-white">
            <Menu size={24} />
          </button>
        </div>

        {/* Mobile Drawer Menu (Overlay) */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute inset-0 z-50 bg-[#0F172A]/95 backdrop-blur-xl p-6 animate-fade-in flex flex-col">
            <div className="flex justify-between items-center mb-8">
              <span className="text-xl font-bold">Menu</span>
              <button onClick={() => setMobileMenuOpen(false)}><LogOut className="rotate-180" size={24}/></button>
            </div>
            <div className="grid grid-cols-2 gap-4">
               <button onClick={() => { setCurrentPage('dateplanner'); setMobileMenuOpen(false); }} className="p-4 bg-white/5 rounded-xl flex flex-col items-center gap-2">
                  <Calendar size={28} className="text-rose-400" /> <span className="text-sm">Dates</span>
               </button>
               <button onClick={() => { setCurrentPage('roster'); setMobileMenuOpen(false); }} className="p-4 bg-white/5 rounded-xl flex flex-col items-center gap-2">
                  <Flame size={28} className="text-orange-400" /> <span className="text-sm">Roaster</span>
               </button>
               <button onClick={() => { setCurrentPage('practice'); setMobileMenuOpen(false); }} className="p-4 bg-white/5 rounded-xl flex flex-col items-center gap-2">
                  <Dumbbell size={28} className="text-blue-400" /> <span className="text-sm">Practice</span>
               </button>
               <button onClick={() => { setCurrentPage('billing'); setMobileMenuOpen(false); }} className="p-4 bg-white/5 rounded-xl flex flex-col items-center gap-2">
                  <CreditCard size={28} className="text-green-400" /> <span className="text-sm">Plans</span>
               </button>
            </div>
            <div className="mt-auto">
               <button className="w-full py-4 bg-white/10 rounded-xl font-bold">Log Out</button>
            </div>
          </div>
        )}

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto no-scrollbar scroll-smooth pb-24 md:pb-0">
          <div className="w-full max-w-7xl mx-auto p-4 md:p-8 min-h-full">
            {renderContent()}
          </div>
        </div>

        {/* 3. MOBILE BOTTOM NAVIGATION (Fixed) */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 h-[80px] bg-[#1E293B] border-t border-white/5 flex items-start pt-2 px-2 z-40 pb-safe shadow-[0_-5px_20px_rgba(0,0,0,0.3)]">
           <MobileTab icon={Heart} label="Discover" active={currentPage === 'discover'} onClick={() => setCurrentPage('discover')} />
           <MobileTab icon={MessageCircle} label="Chats" active={currentPage === 'messages'} onClick={() => setCurrentPage('messages')} />
           <MobileTab icon={Brain} label="Coach" active={currentPage === 'coach'} onClick={() => setCurrentPage('coach')} />
           <MobileTab icon={Globe} label="Social" active={currentPage === 'social'} onClick={() => setCurrentPage('social')} />
        </div>

      </main>
    </div>
  );
};

export default App;