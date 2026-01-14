
import React, { useState, useRef } from 'react';
import { GlassCard, PrimaryButton } from '../components/UIComponents';
import { User, MapPin, Camera, Heart, ChevronRight, ChevronLeft, Sparkles, Upload, Check } from 'lucide-react';

interface OnboardingProps {
  onComplete: (data: any) => void;
}

const INTEREST_TAGS = [
  'Travel', 'Music', 'Foodie', 'Fitness', 'Art', 'Gaming', 
  'Tech', 'Movies', 'Reading', 'Dancing', 'Photography', 'Pets'
];

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: 'Male',
    city: '',
    bio: '',
    interests: [] as string[],
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop', // Default for demo
    photos: [] as string[]
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleInterest = (tag: string) => {
    setFormData(prev => {
      const exists = prev.interests.includes(tag);
      if (exists) return { ...prev, interests: prev.interests.filter(t => t !== tag) };
      if (prev.interests.length >= 5) return prev; // Max 5
      return { ...prev, interests: [...prev.interests, tag] };
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const url = URL.createObjectURL(e.target.files[0]);
      updateField('avatar', url);
    }
  };

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  const handleSubmit = () => {
    // Add some default photos if none added for the demo feel
    const finalData = {
      ...formData,
      photos: formData.photos.length > 0 ? formData.photos : [
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
        'https://images.unsplash.com/photo-1511988617509-a57c8a288659?w=400'
      ]
    };
    onComplete(finalData);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden bg-black">
      {/* Background Ambience */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-rose-600/20 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/20 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="w-full max-w-md relative z-10">
        
        {/* Progress Bar */}
        <div className="flex gap-2 mb-8">
          {[1, 2, 3].map(i => (
            <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-500 ${step >= i ? 'bg-rose-500' : 'bg-white/10'}`}></div>
          ))}
        </div>

        <GlassCard className="animate-slide-up min-h-[500px] flex flex-col">
          
          {/* STEP 1: BASICS */}
          {step === 1 && (
            <div className="flex-1 flex flex-col">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4 text-rose-500">
                  <User size={32} />
                </div>
                <h2 className="text-2xl font-bold text-white">Let's introduce you</h2>
                <p className="text-white/50 text-sm">Tell us who you are to find your perfect match.</p>
              </div>

              <div className="space-y-4 flex-1">
                <div>
                  <label className="text-xs font-bold text-white/60 ml-1 uppercase">Name</label>
                  <input 
                    type="text" 
                    value={formData.name}
                    onChange={(e) => updateField('name', e.target.value)}
                    placeholder="Rahul Khanna"
                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-rose-500 transition outline-none mt-1"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-white/60 ml-1 uppercase">Age</label>
                    <input 
                      type="number" 
                      value={formData.age}
                      onChange={(e) => updateField('age', e.target.value)}
                      placeholder="25"
                      className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-rose-500 transition outline-none mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-white/60 ml-1 uppercase">Gender</label>
                    <select 
                      value={formData.gender}
                      onChange={(e) => updateField('gender', e.target.value)}
                      className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-rose-500 transition outline-none mt-1 appearance-none"
                    >
                      <option>Male</option>
                      <option>Female</option>
                      <option>Non-binary</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-white/60 ml-1 uppercase">City</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3.5 text-white/40" size={18} />
                    <input 
                      type="text" 
                      value={formData.city}
                      onChange={(e) => updateField('city', e.target.value)}
                      placeholder="Mumbai, India"
                      className="w-full bg-black/20 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white focus:border-rose-500 transition outline-none mt-1"
                    />
                  </div>
                </div>
              </div>

              <PrimaryButton onClick={nextStep} disabled={!formData.name || !formData.age} className="w-full mt-6">
                Continue <ChevronRight size={18} />
              </PrimaryButton>
            </div>
          )}

          {/* STEP 2: PHOTOS */}
          {step === 2 && (
            <div className="flex-1 flex flex-col">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-white">Look your best</h2>
                <p className="text-white/50 text-sm">Upload a profile picture that stands out.</p>
              </div>

              <div className="flex-1 flex flex-col items-center justify-center space-y-6">
                <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                   <div className="w-40 h-40 rounded-full border-2 border-dashed border-white/20 flex items-center justify-center overflow-hidden bg-black/20 hover:border-rose-500 transition">
                      {formData.avatar ? (
                        <img src={formData.avatar} className="w-full h-full object-cover" />
                      ) : (
                        <div className="text-center text-white/40">
                          <Camera size={32} className="mx-auto mb-2" />
                          <span className="text-xs">Tap to Upload</span>
                        </div>
                      )}
                   </div>
                   <div className="absolute bottom-2 right-2 p-2 bg-rose-500 rounded-full text-white shadow-lg">
                      <Upload size={16} />
                   </div>
                   <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" accept="image/*" />
                </div>
                <p className="text-xs text-white/40 max-w-[200px] text-center">
                  Tip: Clear lighting and a genuine smile get 3x more matches.
                </p>
              </div>

              <div className="flex gap-4 mt-6">
                <button onClick={prevStep} className="p-3 rounded-xl bg-white/5 hover:bg-white/10 text-white transition">
                  <ChevronLeft size={24} />
                </button>
                <PrimaryButton onClick={nextStep} className="flex-1">
                  Next Step <ChevronRight size={18} />
                </PrimaryButton>
              </div>
            </div>
          )}

          {/* STEP 3: VIBE & INTERESTS */}
          {step === 3 && (
            <div className="flex-1 flex flex-col">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-white">What's your vibe?</h2>
                <p className="text-white/50 text-sm">Help us find people who match your energy.</p>
              </div>

              <div className="flex-1 space-y-6">
                <div>
                   <label className="text-xs font-bold text-white/60 ml-1 uppercase">Bio</label>
                   <textarea 
                     value={formData.bio}
                     onChange={(e) => updateField('bio', e.target.value)}
                     placeholder="I love chai, long drives, and coding at 2 AM..."
                     className="w-full h-24 bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-rose-500 transition outline-none mt-1 resize-none"
                   />
                </div>

                <div>
                   <label className="text-xs font-bold text-white/60 ml-1 uppercase block mb-2">Interests (Pick up to 5)</label>
                   <div className="flex flex-wrap gap-2">
                      {INTEREST_TAGS.map(tag => (
                        <button
                          key={tag}
                          onClick={() => toggleInterest(tag)}
                          className={`
                            px-3 py-1.5 rounded-full text-xs font-bold border transition-all
                            ${formData.interests.includes(tag) 
                              ? 'bg-rose-500 border-rose-500 text-white shadow-lg shadow-rose-900/30' 
                              : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'}
                          `}
                        >
                           {tag}
                        </button>
                      ))}
                   </div>
                </div>
              </div>

              <div className="flex gap-4 mt-6">
                <button onClick={prevStep} className="p-3 rounded-xl bg-white/5 hover:bg-white/10 text-white transition">
                  <ChevronLeft size={24} />
                </button>
                <PrimaryButton onClick={handleSubmit} className="flex-1">
                  Complete Profile <Sparkles size={18} />
                </PrimaryButton>
              </div>
            </div>
          )}

        </GlassCard>
      </div>
    </div>
  );
};
