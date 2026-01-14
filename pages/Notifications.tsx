import React, { useState } from 'react';
import { GlassCard } from '../components/UIComponents';
import { NOTIFICATIONS } from '../constants';
import { Heart, MessageCircle, Info, Zap, Trash2, Bell } from 'lucide-react';

export const Notifications = () => {
  const [activeFilter, setActiveFilter] = useState('All');

  const filters = ['All', 'Match', 'Message', 'System', 'Boost'];

  const filteredNotifications = NOTIFICATIONS.filter(n => {
     if (activeFilter === 'All') return true;
     return n.type.toLowerCase() === activeFilter.toLowerCase();
  });

  return (
    <div className="animate-fade-in max-w-2xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white flex items-center gap-2">
          <Bell className="text-rose-500" /> Notifications
        </h1>
        <button className="text-white/60 hover:text-white flex items-center gap-2 text-sm">
           <Trash2 size={16} /> Clear All
        </button>
      </div>

      {/* Categories / Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
         {filters.map(filter => (
            <button
               key={filter}
               onClick={() => setActiveFilter(filter)}
               className={`
                  px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap
                  ${activeFilter === filter 
                     ? 'bg-rose-600 text-white shadow-lg shadow-rose-900/40' 
                     : 'bg-white/5 text-white/60 hover:bg-white/10'}
               `}
            >
               {filter}
            </button>
         ))}
      </div>

      <div className="space-y-4">
        {filteredNotifications.length === 0 ? (
           <div className="text-center py-10 text-white/30">
              No notifications in {activeFilter} category.
           </div>
        ) : (
           filteredNotifications.map(notif => {
             let Icon = Info;
             let color = 'bg-blue-500/20 text-blue-400';
             
             if (notif.type === 'match') { Icon = Heart; color = 'bg-rose-500/20 text-rose-400'; }
             if (notif.type === 'message') { Icon = MessageCircle; color = 'bg-purple-500/20 text-purple-400'; }
             if (notif.type === 'boost') { Icon = Zap; color = 'bg-yellow-500/20 text-yellow-400'; }

             return (
                <GlassCard key={notif.id} className={`flex items-start gap-4 transition-colors ${!notif.isRead ? 'bg-white/10 border-rose-500/30' : ''}`}>
                   <div className={`p-3 rounded-full ${color}`}>
                      <Icon size={20} />
                   </div>
                   <div className="flex-1">
                      <div className="flex justify-between items-start mb-1">
                         <h3 className="font-bold text-sm">{notif.title}</h3>
                         <span className="text-xs text-white/40">{notif.timestamp}</span>
                      </div>
                      <p className="text-sm text-white/70 leading-relaxed">{notif.message}</p>
                      {notif.type === 'match' && (
                         <button className="mt-3 text-xs font-bold text-rose-400 hover:text-rose-300">
                            View Profile
                         </button>
                      )}
                      {notif.type === 'boost' && (
                         <button className="mt-3 text-xs font-bold text-yellow-400 hover:text-yellow-300">
                            Extend Boost
                         </button>
                      )}
                   </div>
                </GlassCard>
             );
           })
        )}
      </div>
    </div>
  );
};
