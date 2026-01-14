import React from 'react';
import { GlassCard, PrimaryButton } from '../components/UIComponents';
import { PLANS } from '../constants';
import { CheckCircle } from 'lucide-react';

export const Billing = () => {
  return (
    <div className="animate-fade-in text-center max-w-5xl mx-auto pt-10">
      <h1 className="text-4xl font-bold mb-4">Choose Your Power</h1>
      <p className="text-white/60 mb-12 text-lg">Scale your automation needs with our flexible plans.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {PLANS.map((plan) => (
          <GlassCard key={plan.id} className={`relative flex flex-col items-center p-8 transition-transform hover:scale-105 ${plan.recommended ? 'border-orange-500 border-2 bg-white/15' : ''}`}>
            {plan.recommended && (
              <div className="absolute -top-4 bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                MOST POPULAR
              </div>
            )}
            <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
            <div className="text-4xl font-bold mb-6">
              {plan.currency}{plan.price}<span className="text-lg text-white/50 font-normal">/mo</span>
            </div>
            
            <ul className="space-y-4 mb-8 w-full text-left">
              {plan.features.map((feat, i) => (
                <li key={i} className="flex items-center gap-3 text-sm text-white/80">
                  <CheckCircle size={16} className="text-green-400 flex-shrink-0" /> {feat}
                </li>
              ))}
            </ul>

            <PrimaryButton className={`w-full mt-auto ${plan.recommended ? 'from-orange-500 to-red-500' : 'bg-white/10 hover:bg-white/20 !bg-none'}`}>
              {plan.price === 0 ? 'Current Plan' : 'Upgrade Now'}
            </PrimaryButton>
          </GlassCard>
        ))}
      </div>
      
      <p className="mt-8 text-white/40 text-sm">Secure payments via Razorpay & Stripe. Cancel anytime.</p>
    </div>
  );
};