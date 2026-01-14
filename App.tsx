
import React, { useState, useEffect } from 'react';
import { Heart, MessageCircle, Globe, Brain, Dumbbell, User as UserIcon, Shield, CreditCard, LogOut, ChevronLeft, ChevronRight, Calendar, Flame, Menu, Bell, Settings as SettingsIcon, Gift, Zap, LayoutDashboard, ShoppingBag, X, Clock } from 'lucide-react';
import { Discover } from './pages/Discover';
import { SocialHub } from './pages/SocialHub';
import { LoveCoach } from './pages/LoveCoach';
import { PracticeMode } from './pages/PracticeMode';
import { Messages } from './pages/Messages';
import { AdminPanel } from './pages/Admin';
import { Billing } from './pages/Billing';
import { DatePlanner } from './pages/DatePlanner';
import { ProfileRoster } from './pages/ProfileRoster';
import { Notifications } from './pages/Notifications';
import { Settings } from './pages/Settings';
import { Referral } from './pages/Referral';
import { ProfileDetail } from './pages/ProfileDetail';
import { Marketplace } from './pages/Marketplace';
import { RunFetcher } from './pages/RunFetcher';
import { Onboarding } from './pages/Onboarding';
import { CURRENT_USER as DEFAULT_USER, CHAT_SESSIONS, NOTIFICATIONS, CURRENT_USER } from './constants';
import { StatusBadge } from './components/UIComponents';
import { ChatSession, User, Fetcher } from './types';

// --- Sidebar Item (Desktop & Mobile Drawer) ---
const NavItem = ({ icon: Icon, label, active, onClick, collapsed, badge }: any) => (
  <button
    onClick={onClick}
    title={collapsed ? label : ''}
    className={`
      w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-200 group
      ${active 
        ? 'bg-gradient-to-r from-rose-600/90 to-pink-600/90 text-white shadow-lg shadow-rose-900/20' 
        : 'text-slate-400 hover:bg-white/5 hover:text-white'}
    `}
  >
    <div className="relative">
      <Icon size={22} className={`transition-transform duration-300 ${active ? 'scale-110' : 'group-hover:scale-110'}`} strokeWidth={active ? 2.5 : 2} />
      {badge && (
        <span className="absolute -top-2 -right-2 bg-rose-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-sm border border-[#0F172A]">
          {badge}
        </span>
      )}
    </div>
    {!collapsed && (
      <span className={`font-medium tracking-wide whitespace-nowrap transition-opacity duration-200 ${active ? 'opacity-100' : 'opacity-90'}`}>
        {label}
      </span>
    )}
    {!collapsed && active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white shadow-glow"></div>}
  </button>
);

// --- Bottom Tab (Mobile) ---
const MobileTab = ({ icon: Icon, label, active, onClick, badge }: any) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center justify-center w-full py-1 relative ${active ? 'text-rose-500' : 'text-slate-400'}`}
  >
    <div className={`p-1.5 rounded-full transition-all ${active ? 'bg-rose-500/10 -translate-y-1' : ''}`}>
      <Icon size={24} strokeWidth={active ? 2.5 : 2} />
      {badge && (
        <span className="absolute top-1 right-[25%] bg-rose-500 text-white text-[9px] font-bold px-1 rounded-full border border-[#0F172A]">
          {badge}
        </span>
      )}
    </div>
    <span className="text-[10px] font-medium mt-0.5">{label}</span>
  </button>
);

export default function App() {
  const [isOnboarded, setIsOnboarded] = useState(false); // Default to false to show Onboarding first for demo
  const [currentUser, setCurrentUser] = useState<User>(DEFAULT_USER);
  
  const [activePage, setActivePage] = useState('discover');
  const [collapsed, setCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [likedProfiles, setLikedProfiles] = useState<Set<string>>(new Set());
  const [viewingProfile, setViewingProfile] = useState<User | null>(null);
  const [selectedFetcher, setSelectedFetcher] = useState<Fetcher | null>(null);

  // Stats for Badges
  const unreadMessages = CHAT_SESSIONS.reduce((acc, curr) => acc + curr.unreadCount, 0);
  const unreadNotifications = NOTIFICATIONS.filter(n => !n.isRead).length;

  // Global Countdown Logic
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0 });
  
  useEffect(() => {
     if (!CURRENT_USER.premiumUntil) return;
     
     const calculate = () => {
        const diff = +new Date(CURRENT_USER.premiumUntil!) - +new Date();
        if (diff > 0) {
           setTimeLeft({
              days: Math.floor(diff / (1000 * 60 * 60 * 24)),
              hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
              minutes: Math.floor((diff / 1000 / 60) % 60),
           });
        } else {
           setTimeLeft({ days: 0, hours: 0, minutes: 0 });
        }
     };
     
     calculate();
     const timer = setInterval(calculate, 60000); // update every minute
     return () => clearInterval(timer);
  }, []);

  const handleToggleLike = (user: User) => {
    setLikedProfiles(prev => {
      const newSet = new Set(prev);
      if (newSet.has(user.id)) {
        newSet.delete(user.id);
      } else {
        newSet.add(user.id);
      }
      return newSet;
    });
  };

  const handleOnboardingComplete = (data: any) => {
     // Merge onboarding data into current user
     setCurrentUser(prev => ({
       ...prev,
       name: data.name,
       age: parseInt(data.age) || 25,
       gender: data.gender,
       city: data.city,
       bio: data.bio,
       interests: data.interests,
       avatar: data.avatar || prev.avatar,
       photos: data.photos
     }));
     setIsOnboarded(true);
  };

  const isLiked = (userId: string) => likedProfiles.has(userId);

  const renderContent = () => {
    if (viewingProfile) {
      return <ProfileDetail user={viewingProfile} onBack={() => setViewingProfile(null)} />;
    }

    if (activePage === 'run-fetcher' && selectedFetcher) {
      return <RunFetcher fetcher={selectedFetcher} onBack={() => setActivePage('marketplace')} />;
    }

    switch (activePage) {
      case 'discover': return <Discover onToggleLike={handleToggleLike} isLiked={isLiked} onViewProfile={setViewingProfile} />;
      case 'social': return <SocialHub />;
      case 'coach': return <LoveCoach initialSection="coach" />;
      case 'practice': return <LoveCoach initialSection="practice" />;
      case 'messages': return <Messages sessions={CHAT_SESSIONS} />;
      case 'marketplace': return <Marketplace onSelectFetcher={(f) => { setSelectedFetcher(f); setActivePage('run-fetcher'); }} />;
      case 'admin': return <AdminPanel />;
      case 'billing': return <Billing />;
      case 'date-planner': return <DatePlanner />;
      case 'roster': return <ProfileRoster />;
      case 'notifications': return <Notifications />;
      case 'settings': return <Settings onNavigate={setActivePage} />;
      case 'referral': return <Referral />;
      default: return <Discover onToggleLike={handleToggleLike} isLiked={isLiked} onViewProfile={setViewingProfile} />;
    }
  };

  // --- SHOW ONBOARDING IF NOT COMPLETE ---
  if (!isOnboarded) {
     return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  // --- MAIN APP UI ---
  return (
    <div className="flex h-screen text-slate-200 overflow-hidden selection:bg-rose-500/30">
      
      {/* --- MOBILE FULL MENU OVERLAY --- */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-[#0F172A] flex flex-col animate-fade-in md:hidden">
           <div className="p-4 flex items-center justify-between border-b border-white/5 bg-[#1E293B]/50">
              <div className="flex items-center gap-2">
                 <Heart className="text-rose-500" fill="currentColor" size={24} />
                 <span className="font-bold text-lg font-serif">Love Pilot</span>
              </div>
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 bg-white/5 rounded-full hover:bg-white/10"
              >
                 <X size={24} className="text-slate-200" />
              </button>
           </div>
           
           <div className="flex-1 overflow-y-auto p-4 space-y-2">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 px-2">Apps</div>
              <NavItem icon={Heart} label="Discover" active={activePage === 'discover'} onClick={() => {setActivePage('discover'); setIsMobileMenuOpen(false);}} />
              <NavItem icon={Globe} label="Social Hub" active={activePage === 'social'} onClick={() => {setActivePage('social'); setIsMobileMenuOpen(false);}} />
              <NavItem icon={MessageCircle} label="Messages" active={activePage === 'messages'} onClick={() => {setActivePage('messages'); setIsMobileMenuOpen(false);}} badge={unreadMessages > 0 ? unreadMessages : null} />
              
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 mt-6 px-2">AI Tools</div>
              <NavItem icon={Brain} label="Love Coach" active={activePage === 'coach'} onClick={() => {setActivePage('coach'); setIsMobileMenuOpen(false);}} />
              <NavItem icon={Dumbbell} label="Practice Mode" active={activePage === 'practice'} onClick={() => {setActivePage('practice'); setIsMobileMenuOpen(false);}} />
              <NavItem icon={Calendar} label="Date Planner" active={activePage === 'date-planner'} onClick={() => {setActivePage('date-planner'); setIsMobileMenuOpen(false);}} />
              <NavItem icon={Flame} label="Profile Roaster" active={activePage === 'roster'} onClick={() => {setActivePage('roster'); setIsMobileMenuOpen(false);}} />

              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 mt-6 px-2">Growth</div>
              <NavItem icon={ShoppingBag} label="Marketplace" active={activePage === 'marketplace'} onClick={() => {setActivePage('marketplace'); setIsMobileMenuOpen(false);}} />
              <NavItem icon={Gift} label="Refer & Earn" active={activePage === 'referral'} onClick={() => {setActivePage('referral'); setIsMobileMenuOpen(false);}} />
              <NavItem icon={CreditCard} label="Billing" active={activePage === 'billing'} onClick={() => {setActivePage('billing'); setIsMobileMenuOpen(false);}} />
              <NavItem icon={SettingsIcon} label="Settings" active={activePage === 'settings'} onClick={() => {setActivePage('settings'); setIsMobileMenuOpen(false);}} />
           </div>
        </div>
      )}

      {/* --- DESKTOP SIDEBAR --- */}
      <div className={`hidden md:flex flex-col border-r border-white/5 bg-[#0F172A]/95 backdrop-blur-xl transition-all duration-300 ${collapsed ? 'w-20' : 'w-72'}`}>
        {/* Brand */}
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-tr from-rose-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg shadow-rose-900/20 shrink-0">
             <Heart fill="white" size={20} className="text-white" />
          </div>
          {!collapsed && (
            <div>
              <h1 className="text-xl font-bold font-serif tracking-tight text-white">Love Pilot</h1>
              <p className="text-[10px] text-rose-400 font-bold tracking-widest uppercase">AI Dating Coach</p>
            </div>
          )}
          <button onClick={() => setCollapsed(!collapsed)} className="ml-auto text-slate-500 hover:text-white transition">
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto px-3 space-y-2 custom-scrollbar">
          <div className={`px-4 py-2 text-xs font-bold text-slate-500 uppercase tracking-wider ${collapsed ? 'hidden' : 'block'}`}>Main</div>
          
          <NavItem icon={Heart} label="Discover" active={activePage === 'discover'} onClick={() => setActivePage('discover')} collapsed={collapsed} />
          <NavItem icon={Globe} label="Social Hub" active={activePage === 'social'} onClick={() => setActivePage('social')} collapsed={collapsed} badge="New" />
          <NavItem icon={MessageCircle} label="Messages" active={activePage === 'messages'} onClick={() => setActivePage('messages')} collapsed={collapsed} badge={unreadMessages > 0 ? unreadMessages : null} />
          
          <div className={`mt-6 px-4 py-2 text-xs font-bold text-slate-500 uppercase tracking-wider ${collapsed ? 'hidden' : 'block'}`}>AI Tools</div>
          <NavItem icon={Brain} label="Love Coach" active={activePage === 'coach'} onClick={() => setActivePage('coach')} collapsed={collapsed} />
          <NavItem icon={Dumbbell} label="Practice Mode" active={activePage === 'practice'} onClick={() => setActivePage('practice')} collapsed={collapsed} />
          <NavItem icon={Calendar} label="Date Planner" active={activePage === 'date-planner'} onClick={() => setActivePage('date-planner')} collapsed={collapsed} />
          <NavItem icon={Flame} label="Profile Roaster" active={activePage === 'roster'} onClick={() => setActivePage('roster')} collapsed={collapsed} />

          <div className={`mt-6 px-4 py-2 text-xs font-bold text-slate-500 uppercase tracking-wider ${collapsed ? 'hidden' : 'block'}`}>Growth</div>
          <NavItem icon={ShoppingBag} label="Marketplace" active={activePage === 'marketplace'} onClick={() => setActivePage('marketplace')} collapsed={collapsed} />
          <NavItem icon={Gift} label="Refer & Earn" active={activePage === 'referral'} onClick={() => setActivePage('referral')} collapsed={collapsed} />
          <NavItem icon={CreditCard} label="Billing" active={activePage === 'billing'} onClick={() => setActivePage('billing')} collapsed={collapsed} />
        </div>

        {/* User Profile Footer */}
        <div className="p-4 border-t border-white/5">
          <div className={`flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 transition cursor-pointer ${collapsed ? 'justify-center' : ''}`} onClick={() => setActivePage('settings')}>
            <div className="relative">
               <img src={currentUser.avatar} alt="User" className="w-10 h-10 rounded-full border-2 border-slate-700" />
               <StatusBadge status="online" />
            </div>
            {!collapsed && (
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-bold text-white truncate">{currentUser.name}</p>
                <p className="text-xs text-rose-400 font-medium truncate">{currentUser.plan} Plan</p>
              </div>
            )}
            {!collapsed && <SettingsIcon size={18} className="text-slate-500" />}
          </div>
        </div>
      </div>

      {/* --- MAIN CONTENT --- */}
      <div className="flex-1 flex flex-col relative w-full max-w-[100vw]">
        
        {/* GLOBAL COUNTDOWN BANNER (Sticky Top) */}
        {timeLeft.days >= 0 && (
            <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-rose-600 text-white text-[10px] md:text-xs font-bold py-1.5 px-4 text-center tracking-wide flex items-center justify-center gap-2 z-40 relative shadow-md">
                <Clock size={12} className="animate-pulse" />
                <span>BONUS: 6 Days Free Premium Fetcher Use Time Remaining: </span>
                <span className="font-mono bg-black/20 px-1.5 rounded border border-white/10">{timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m</span>
            </div>
        )}

        {/* Mobile Header */}
        <div className="md:hidden h-16 bg-[#0F172A]/80 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-4 sticky top-0 z-30">
           <div className="flex items-center gap-2">
             <Heart className="text-rose-500" fill="currentColor" size={24} />
             <span className="font-bold text-lg font-serif">Love Pilot</span>
           </div>
           <div className="flex items-center gap-4">
              <button onClick={() => setActivePage('notifications')} className="relative">
                 <Bell size={22} className="text-slate-400" />
                 {unreadNotifications > 0 && <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-500 rounded-full"></span>}
              </button>
              {/* Menu Icon */}
              <button onClick={() => setIsMobileMenuOpen(true)} className="p-1">
                 <Menu size={26} className="text-white" />
              </button>
           </div>
        </div>

        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-6 lg:p-8 scroll-smooth pb-24 md:pb-6">
          <div className="max-w-7xl mx-auto w-full">
            {renderContent()}
          </div>
        </main>

        {/* --- MOBILE BOTTOM NAV --- */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-[#0F172A]/90 backdrop-blur-xl border-t border-white/10 px-6 py-2 pb-5 z-40 flex justify-between items-center">
           <MobileTab icon={Heart} label="Discover" active={activePage === 'discover'} onClick={() => setActivePage('discover')} />
           <MobileTab icon={Globe} label="Social" active={activePage === 'social'} onClick={() => setActivePage('social')} />
           <MobileTab icon={Brain} label="Coach" active={activePage === 'coach'} onClick={() => setActivePage('coach')} />
           <MobileTab icon={MessageCircle} label="Chats" active={activePage === 'messages'} onClick={() => setActivePage('messages')} badge={unreadMessages || null} />
           <MobileTab icon={Gift} label="Earn" active={activePage === 'referral'} onClick={() => setActivePage('referral')} />
        </div>
      </div>

    </div>
  );
}
