import React from 'react';
import { CheckCircle } from 'lucide-react';

export interface GlassCardProps {
  children?: React.ReactNode;
  className?: string;
  noPadding?: boolean;
  onClick?: () => void;
}

export const GlassCard: React.FC<GlassCardProps> = ({ children, className = '', noPadding = false, onClick }) => (
  <div 
    onClick={onClick}
    className={`
      bg-[#1E293B]/60 backdrop-blur-xl 
      border border-white/10
      shadow-lg
      rounded-2xl
      ${noPadding ? 'p-0' : 'p-5'}
      ${className}
    `}
  >
    {children}
  </div>
);

export interface PrimaryButtonProps {
  children?: React.ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'outline';
}

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({ 
  children, 
  onClick, 
  className = '', 
  disabled = false, 
  variant = 'primary' 
}) => {
  const baseStyles = "relative font-semibold py-3.5 px-6 rounded-xl transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2";
  
  const variants = {
    primary: "bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow-lg shadow-rose-900/20 hover:shadow-rose-900/40",
    secondary: "bg-white/10 text-white hover:bg-white/20 border border-white/5",
    outline: "bg-transparent border border-rose-500 text-rose-400 hover:bg-rose-500/10"
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

export const StatusBadge: React.FC<{ status: 'online' | 'offline' | 'busy' }> = ({ status }) => {
  const colors = {
    online: 'bg-emerald-500',
    offline: 'bg-slate-500',
    busy: 'bg-amber-500'
  };
  
  return (
    <span className="relative flex h-3 w-3">
      {status === 'online' && (
        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${colors[status]}`}></span>
      )}
      <span className={`relative inline-flex rounded-full h-2.5 w-2.5 border-2 border-[#1E293B] ${colors[status]}`}></span>
    </span>
  );
};

export const VerifiedBadge: React.FC<{ size?: number, className?: string }> = ({ size = 20, className = '' }) => (
  <CheckCircle 
    size={size} 
    className={`text-blue-500 ${className}`} 
    fill="currentColor" 
    stroke="#fff" 
  />
);
