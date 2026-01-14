import { User, Post, ChatSession, CoachScenario, Fetcher, Log, Plan } from './types';

export const SYSTEM_PROMPTS = {
  loveCoach: `You are 'Love Pilot', a sophisticated Indian Dating Coach. 
  Language: Hinglish (Natural mix of Hindi and English).
  Context: The user will provide their Mood, Location, Relationship Stage, and a specific Obstacle (e.g., Family Pressure, Society fear).
  Task: Provide a specific, psychology-backed solution.
  Structure:
  1. 🧠 **Psychology**: Why is this happening?
  2. 🗣️ **Script**: Exact words to say in Hindi/English.
  3. 🚀 **Action**: Immediate step to take.
  Keep it encouraging but realistic.`,
  
  practiceMode: `Roleplay a dating scenario. You are the date (girl/boy based on context). 
  React realistically. If user is charming, respond well. If creepy, block/ignore.`,

  datePlanner: `You are an expert City Guide & Romantic Planner for India.
  User will give City, Vibe, and Budget.
  Suggest 3 specific places/itineraries.
  Include "Safety Rating" and "Romance Score" for each.`,

  profileRoaster: `You are a brutal but helpful Tinder/Bumble profile reviewer.
  Analyze the bio/interests.
  Give a "Red Flag Score" out of 10.
  Give 3 tips to improve matches.`
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
  lastActive: 'Now'
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
    photos: ['https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400'],
    interests: ['Dancing', 'Street Food', 'Bollywood'],
    matchPercentage: 92,
    isOnline: true,
    lastActive: '5m ago'
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
    lastActive: '2h ago'
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
    lastActive: 'Now'
  }
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
  { id: 'f-1', name: 'SEO Wizard', description: 'Optimizes your content for search engines to boost visibility.', category: 'SEO', status: 'active', costPerRun: 5 },
  { id: 'f-2', name: 'Lead Gen Pro', description: 'Finds verified email addresses from LinkedIn profiles.', category: 'Leads', status: 'active', costPerRun: 10 },
  { id: 'f-3', name: 'Code Reviewer', description: 'Automatically checks your PRs for common bugs and style issues.', category: 'Coding', status: 'inactive', costPerRun: 0 },
  { id: 'f-4', name: 'Content Spinner', description: 'Rewrites articles to make them unique while retaining meaning.', category: 'Content', status: 'active', costPerRun: 2 },
  { id: 'f-5', name: 'Social Scheduler', description: 'Auto-posts content to Twitter and LinkedIn at optimal times.', category: 'Automation', status: 'active', costPerRun: 4 },
];

export const RECENT_LOGS: Log[] = [
  { id: 'l-1', fetcherName: 'SEO Wizard', timestamp: '2 mins ago', status: 'completed' },
  { id: 'l-2', fetcherName: 'Lead Gen Pro', timestamp: '1 hour ago', status: 'failed' },
  { id: 'l-3', fetcherName: 'Content Spinner', timestamp: '5 hours ago', status: 'completed' },
  { id: 'l-4', fetcherName: 'Social Scheduler', timestamp: 'Yesterday', status: 'completed' },
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