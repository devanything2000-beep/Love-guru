import React from 'react';

export interface GlassCardProps {
  children?: React.ReactNode;
  className?: string;
}

export const GlassCard: React.FC<GlassCardProps> = ({ children, className = '' }) => (
  <div className={`bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-xl ${className}`}>
    {children}
  </div>
);

export interface PrimaryButtonProps {
  children?: React.ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({ children, onClick, className = '', disabled = false }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`
      bg-gradient-to-r from-orange-500 to-purple-600 
      text-white font-bold py-3 px-6 rounded-xl 
      transform transition-all duration-200 
      shadow-[0_10px_20px_rgba(0,0,0,0.2)]
      hover:-translate-y-1 hover:shadow-[0_15px_25px_rgba(0,0,0,0.3)]
      active:translate-y-0 active:shadow-[0_5px_10px_rgba(0,0,0,0.2)]
      disabled:opacity-50 disabled:cursor-not-allowed
      ${className}
    `}
  >
    {children}
  </button>
);

export const StatusBadge: React.FC<{ status: 'online' | 'offline' | 'busy' }> = ({ status }) => {
  const colors = {
    online: 'bg-green-500',
    offline: 'bg-red-500',
    busy: 'bg-yellow-500'
  };
  
  return (
    <span className="relative flex h-3 w-3">
      <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${colors[status]}`}></span>
      <span className={`relative inline-flex rounded-full h-3 w-3 ${colors[status]}`}></span>
    </span>
  );
};