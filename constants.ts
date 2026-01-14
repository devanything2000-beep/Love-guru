
import { User, Post, ChatSession, CoachScenario, Fetcher, Log, Plan, Notification, ReferralStat, ReferralTier, SaaSMetrics, FunnelStage } from './types';

export const SYSTEM_PROMPTS = {
  loveCoach: `You are 'Love Pilot', a sophisticated Indian Dating Coach. 
  Language: Hinglish (Natural mix of Hindi and English).
  Context: The user will provide their Mood, Location, Relationship Stage, and a specific Obstacle.
  Task: Provide a specific, psychology-backed solution.
  Structure:
  1. 🧠 **Psychology**: Why is this happening?
  2. 🗣️ **Script**: Exact words to say in Hindi/English.
  3. 🚀 **Action**: Immediate step to take.`,
  
  practiceMode: `Roleplay a dating scenario. You are the date. React realistically.`,

  datePlanner: `You are an expert City Guide & Romantic Planner for India.
  Suggest 3 specific places/itineraries with "Safety Rating" and "Romance Score".`,

  profileRoaster: `Brutal but helpful Tinder/Bumble profile reviewer.
  Give a "Red Flag Score" out of 10 and 3 tips to improve matches.`,

  messageHelper: `You are a smooth conversationalist wingman.
  Generate 3 short, engaging reply options based on the chat context.
  Tones: Cute, Funny, Romantic, or Ice Breaker.
  Keep it Hinglish and casual.`,

  captionGenerator: `Generate 3 engaging Instagram captions for a photo description.
  Include trending hashtags for India.`
};

export const CURRENT_USER: User = {
  id: 'u-me',
  name: 'Rahul Khanna',
  age: 25,
  gender: 'Male',
  city: 'Mumbai',
  bio: 'Software engineer by day, guitarist by night. Looking for someone to share chai with.',
  role: 'user',
  plan: 'Pro',
  avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop',
  photos: [],
  interests: ['Music', 'Travel', 'Chai', 'Coding'],
  isOnline: true,
  lastActive: 'Now',
  referralCode: 'LOVE-RHL-24',
  referralCount: 12,
  
  // --- New Logic Simulation ---
  subscriptionStatus: 'trial', 
  referralsThisMonth: 1, // User has done 1 out of 2 referrals
  premiumUntil: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString(), // 6 Days left in trial
  
  referralEarnings: 6000,
  referralLevel: 'Silver',
};

export const DISCOVER_PROFILES: User[] = [
  {
    id: 'u-1',
    name: 'Priya Sharma',
    age: 24,
    gender: 'Female',
    city: 'Delhi',
    bio: 'Dil se foodie 🍕. Sapiosexual. If you can make me laugh, swipe right!',
    role: 'user',
    plan: 'Free',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
    photos: [
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400',
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400'
    ],
    interests: ['Dancing', 'Street Food', 'Bollywood'],
    matchPercentage: 92,
    isOnline: true,
    lastActive: '5m ago',
    redFlags: ['Takes 3 days to reply', 'Obsessed with ex'],
    greenFlags: ['Loves dogs', 'Independent', 'Good listener'],
    referralsThisMonth: 0
  },
  {
    id: 'u-2',
    name: 'Anjali Verma',
    age: 26,
    gender: 'Female',
    city: 'Bangalore',
    bio: 'Startup founder. Looking for a co-founder for life. 🚀',
    role: 'user',
    plan: 'Pro',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop',
    photos: [],
    interests: ['Tech', 'Yoga', 'Reading'],
    matchPercentage: 85,
    isOnline: false,
    lastActive: '2h ago',
    referralsThisMonth: 0
  },
  {
    id: 'u-3',
    name: 'Zara Khan',
    age: 23,
    gender: 'Female',
    city: 'Mumbai',
    bio: 'Art lover. Coffee addict. Not here for hookups.',
    role: 'user',
    plan: 'Free',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=400&fit=crop',
    photos: [],
    interests: ['Painting', 'Cafes', 'Cats'],
    matchPercentage: 78,
    isOnline: true,
    lastActive: 'Now',
    referralsThisMonth: 0
  }
];

export const NOTIFICATIONS: Notification[] = [
  // Matches
  { id: 'n-1', type: 'match', title: 'It\'s a Match!', message: 'You and Priya matched. Say hi!', timestamp: '2m ago', isRead: false },
  { id: 'n-10', type: 'match', title: 'New Like', message: 'Someone nearby liked your profile.', timestamp: '5m ago', isRead: false },
  
  // Messages
  { id: 'n-2', type: 'message', title: 'New Message', message: 'Anjali sent you a photo.', timestamp: '1h ago', isRead: true },
  { id: 'n-11', type: 'message', title: 'Priya is typing...', message: 'Priya sent a voice note.', timestamp: '10m ago', isRead: false },
  
  // System
  { id: 'n-3', type: 'system', title: 'Welcome to Love Pilot', message: 'Complete your profile to get more matches.', timestamp: '1d ago', isRead: true },
  { id: 'n-12', type: 'system', title: 'Profile Verified', message: 'Your photo verification was successful.', timestamp: '2h ago', isRead: true },
  
  // Boost
  { id: 'n-4', type: 'boost', title: 'Boost Expired', message: 'Your profile boost has ended.', timestamp: '2d ago', isRead: true },
  { id: 'n-13', type: 'boost', title: 'Super Boost Active', message: 'You are top profile in Mumbai for 30m.', timestamp: 'Just now', isRead: false },
];

export const SOCIAL_POSTS: Post[] = [
  {
    id: 'p-1',
    userId: 'u-1',
    userName: 'Priya Sharma',
    userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
    image: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=600',
    caption: 'Exploring the old streets of Delhi! #VibeHai #Weekend',
    likes: 1240,
    comments: 45,
    isVerified: true
  },
  {
    id: 'p-2',
    userId: 'u-5',
    userName: 'Rohan Das',
    userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100',
    image: 'https://images.unsplash.com/photo-1511988617509-a57c8a288659?w=600',
    caption: 'Gym session done 💪. Focus on yourself.',
    likes: 856,
    comments: 20
  }
];

export const CHAT_SESSIONS: ChatSession[] = [
  {
    id: 'c-1',
    userId: 'u-1',
    userName: 'Priya Sharma',
    userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
    lastMessage: 'Haha, that is so funny! 😂',
    unreadCount: 2,
    status: 'online'
  },
  {
    id: 'c-2',
    userId: 'u-2',
    userName: 'Anjali Verma',
    userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100',
    lastMessage: 'Are we meeting tomorrow?',
    unreadCount: 0,
    status: 'offline'
  }
];

export const PRACTICE_SCENARIOS: CoachScenario[] = [
  {
    id: 's-1',
    title: 'First Date Conversation',
    description: 'Practice how to start a conversation without being awkward.',
    difficulty: 'Easy'
  },
  {
    id: 's-2',
    title: 'Approaching a Crush',
    description: 'Learn how to approach someone you like at a party.',
    difficulty: 'Medium'
  },
  {
    id: 's-3',
    title: 'Conflict Resolution',
    description: 'Your partner is angry. Try to calm the situation.',
    difficulty: 'Hard'
  }
];

export const FETCHERS: Fetcher[] = [
  { id: 'f-1', name: 'SEO Wizard', description: 'Optimizes content.', category: 'SEO', status: 'active', costPerRun: 5 },
  { id: 'f-2', name: 'Lead Gen Pro', description: 'Finds emails.', category: 'Leads', status: 'active', costPerRun: 10 },
];

export const RECENT_LOGS: Log[] = [
  { id: 'l-1', fetcherName: 'Message Helper', timestamp: '2 mins ago', status: 'completed' },
  { id: 'l-2', fetcherName: 'Profile Analysis', timestamp: '1 hour ago', status: 'completed' },
];

export const PLANS: Plan[] = [
  {
      id: 'p-free',
      name: 'Free',
      price: 0,
      currency: '₹',
      features: ['5 Matches/day', 'Basic Support', 'Ad supported'],
      recommended: false
  },
  {
      id: 'p-pro',
      name: 'Pro',
      price: 499,
      currency: '₹',
      features: ['Unlimited Matches', 'See who likes you', 'No Ads', 'Love Coach Access'],
      recommended: true
  },
  {
      id: 'p-premium',
      name: 'Premium',
      price: 999,
      currency: '₹',
      features: ['Priority Likes', 'Profile Boost', 'Read Receipts', 'Advanced Coaching'],
      recommended: false
  }
];

export const REFERRAL_STATS: ReferralStat[] = [
   { date: 'Mon', referrals: 45, revenue: 1200, fraudBlocked: 2 },
   { date: 'Tue', referrals: 62, revenue: 1800, fraudBlocked: 5 },
   { date: 'Wed', referrals: 58, revenue: 1650, fraudBlocked: 3 },
   { date: 'Thu', referrals: 89, revenue: 2400, fraudBlocked: 8 },
   { date: 'Fri', referrals: 102, revenue: 3100, fraudBlocked: 12 },
   { date: 'Sat', referrals: 130, revenue: 4500, fraudBlocked: 6 },
   { date: 'Sun', referrals: 145, revenue: 5200, fraudBlocked: 4 },
];

export const REFERRAL_TIERS: ReferralTier[] = [
   { name: 'Bronze', minReferrals: 0, reward: '1 Week Premium', color: 'from-orange-700 to-orange-500' },
   { name: 'Silver', minReferrals: 10, reward: '1 Month Premium + 5 Boosts', color: 'from-slate-400 to-slate-200' },
   { name: 'Gold', minReferrals: 30, reward: 'Lifetime Premium + VIP', color: 'from-yellow-500 to-yellow-200' },
];

export const SAAS_METRICS: SaaSMetrics = {
   mrr: 425000,
   arr: 5100000,
   churnRate: 4.2,
   cac: 120, // Rupees per user
   ltv: 850, // Rupees per user
   activeTrials: 1240,
   conversionRate: 18.5 // %
};

export const FUNNEL_DATA: FunnelStage[] = [
   { name: 'Referral Clicks', value: 5000, fill: '#8884d8' },
   { name: 'Signups', value: 2500, fill: '#83a6ed' },
   { name: 'Trial Started', value: 1240, fill: '#8dd1e1' },
   { name: 'Converted to Paid', value: 230, fill: '#82ca9d' },
];
