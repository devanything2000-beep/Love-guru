import React, { useState, useEffect } from 'react';
import { LayoutDashboard, ShoppingBag, Settings, LogOut, CreditCard, Shield } from 'lucide-react';
import { Dashboard } from './pages/Dashboard';
import { Marketplace } from './pages/Marketplace';
import { RunFetcher } from './pages/RunFetcher';
import { AdminPanel } from './pages/Admin';
import { Billing } from './pages/Billing';
import { MOCK_USER } from './constants';
import { StatusBadge } from './components/UIComponents';
import { Fetcher, User } from './types';

// Sidebar Navigation Component
const NavItem = ({ icon: Icon, label, active, onClick }: any) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
      active 
      ? 'bg-gradient-to-r from-purple-600/50 to-orange-500/50 text-white shadow-lg border border-white/10' 
      : 'text-white/60 hover:bg-white/5 hover:text-white'
    }`}
  >
    <Icon size={20} />
    <span className="font-medium">{label}</span>
  </button>
);

const App = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [selectedFetcher, setSelectedFetcher] = useState<Fetcher | null>(null);
  const [user, setUser] = useState<User>(MOCK_USER);
  const [onlineStatus, setOnlineStatus] = useState<'online' | 'busy' | 'offline'>('online');

  // Simulate Real-time Activity
  useEffect(() => {
    const interval = setInterval(() => {
      const statuses: ('online' | 'busy' | 'offline')[] = ['online', 'online', 'busy', 'online', 'offline'];
      setOnlineStatus(statuses[Math.floor(Math.random() * statuses.length)]);
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
    setSelectedFetcher(null);
  };

  const handleSelectFetcher = (fetcher: Fetcher) => {
    setSelectedFetcher(fetcher);
    setCurrentPage('run');
  };

  const renderContent = () => {
    if (currentPage === 'run' && selectedFetcher) {
      return <RunFetcher fetcher={selectedFetcher} onBack={() => setCurrentPage('marketplace')} />;
    }

    switch (currentPage) {
      case 'dashboard': return <Dashboard onNavigate={handleNavigate} />;
      case 'marketplace': return <Marketplace onSelectFetcher={handleSelectFetcher} />;
      case 'admin': return <AdminPanel />;
      case 'billing': return <Billing />;
      default: return <Dashboard onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-transparent p-4 gap-4 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 hidden md:flex flex-col bg-black/20 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl">
        <div className="flex items-center gap-3 px-2 mb-8 mt-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-purple-600 flex items-center justify-center font-bold text-white">
            F
          </div>
          <span className="text-xl font-bold tracking-tight text-white">FlowFetcher</span>
        </div>

        <nav className="space-y-2 flex-1">
          <NavItem icon={LayoutDashboard} label="Dashboard" active={currentPage === 'dashboard'} onClick={() => handleNavigate('dashboard')} />
          <NavItem icon={ShoppingBag} label="Marketplace" active={currentPage === 'marketplace' || currentPage === 'run'} onClick={() => handleNavigate('marketplace')} />
          <NavItem icon={CreditCard} label="Plans & Billing" active={currentPage === 'billing'} onClick={() => handleNavigate('billing')} />
          {user.role === 'admin' || user.id === 'u-12345' ? ( 
             // Hardcoded ID check for demo purposes to show Admin link
             <NavItem icon={Shield} label="Admin Panel" active={currentPage === 'admin'} onClick={() => handleNavigate('admin')} />
          ) : null}
        </nav>

        {/* User Mini Profile */}
        <div className="mt-auto pt-4 border-t border-white/10">
          <div className="flex items-center gap-3 p-2 rounded-xl bg-white/5 hover:bg-white/10 transition cursor-pointer">
            <div className="relative">
              <img src={user.avatar} alt="User" className="w-10 h-10 rounded-full border border-white/20" />
              <div className="absolute -bottom-1 -right-1">
                <StatusBadge status={onlineStatus} />
              </div>
            </div>
            <div className="overflow-hidden">
              <h4 className="text-sm font-bold truncate">{user.name}</h4>
              <p className="text-xs text-white/50 truncate">ID: {user.flowId}</p>
            </div>
          </div>
          <button className="w-full mt-3 flex items-center justify-center gap-2 text-xs text-white/40 hover:text-white py-2">
            <LogOut size={14} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 rounded-2xl overflow-y-auto overflow-x-hidden relative">
         <div className="max-w-7xl mx-auto h-full p-2 md:p-6">
            {renderContent()}
         </div>
      </main>

      {/* Copy Blueprint Button (Simulated as requested by prompt) */}
      <div className="fixed bottom-6 right-6 z-50">
        <button 
          onClick={() => alert("Project Blueprint Copied to Clipboard! (Simulated)")}
          className="bg-white text-purple-900 font-bold px-6 py-3 rounded-full shadow-2xl flex items-center gap-2 hover:scale-105 transition-transform"
        >
           📋 COPY BLUEPRINT
        </button>
      </div>
    </div>
  );
};

export default App;