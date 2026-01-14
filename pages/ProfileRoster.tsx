import React, { useState } from 'react';
import { GlassCard, PrimaryButton } from '../components/UIComponents';
import { generateProfileReview } from '../services/geminiService';
import { Flame, CheckCircle, XCircle } from 'lucide-react';

export const ProfileRoster = () => {
  const [bio, setBio] = useState('');
  const [review, setReview] = useState('');
  const [loading, setLoading] = useState(false);

  const handleReview = async () => {
    if (!bio) return;
    setLoading(true);
    const result = await generateProfileReview(bio);
    setReview(result);
    setLoading(false);
  };

  return (
    <div className="animate-fade-in max-w-2xl mx-auto space-y-6">
      <div className="text-center">
         <h1 className="text-3xl font-bold text-white mb-2">🔥 Profile Roaster</h1>
         <p className="text-white/60">Get honest feedback on your bio. No mercy.</p>
      </div>

      <GlassCard>
         <textarea 
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Paste your Tinder/Bumble Bio here..."
            className="w-full h-32 bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:ring-2 focus:ring-orange-500 outline-none resize-none mb-4"
         />
         <PrimaryButton onClick={handleReview} disabled={loading} className="w-full bg-gradient-to-r from-red-500 to-orange-500">
            {loading ? 'Analyzing...' : 'Roast My Profile'}
         </PrimaryButton>
      </GlassCard>

      {review && (
         <GlassCard className="relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
               <Flame size={100} />
            </div>
            <div className="prose prose-invert prose-sm whitespace-pre-wrap relative z-10">
               {review}
            </div>
         </GlassCard>
      )}
    </div>
  );
};