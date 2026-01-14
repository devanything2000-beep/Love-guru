
export type UserRole = 'user' | 'admin';
export type PlanType = 'Free' | 'Pro' | 'Premium';
export type OnlineStatus = 'online' | 'offline' | 'busy';
export type ReferralLevel = 'Bronze' | 'Silver' | 'Gold';

// --- DATABASE SCHEMA REPRESENTATION ---

export interface User {
  id: string;
  name: string;
  age: number;
  gender: string;
  city: string;
  bio: string;
  role: UserRole;
  plan: PlanType;
  avatar: string;
  photos: string[];
  interests: string[];
  matchPercentage?: number; 
  isOnline: boolean;
  lastActive: string;
  redFlags?: string[];
  greenFlags?: string[];
  referralCode?: string;
  referralCount?: number;
  referralEarnings?: number;
  referralLevel?: ReferralLevel;
  
  // Monetization & Referral Logic
  subscriptionStatus?: 'active' | 'trial' | 'expired' | 'free';
  referralsThisMonth: number; // Tracks the "Refer 2 people" goal
  premiumUntil?: string; // ISO Date for when premium/trial ends
}

export interface Match {
  userId: string;
  matchedUserId: string;
  compatibilityScore: number;
  matchedAt: string;
}

export interface Notification {
  id: string;
  type: 'match' | 'message' | 'system' | 'boost';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  actionUrl?: string;
}

export interface CoachSessionInput {
  mood: string;
  locationType: string;
  stage: string;
  confidence: string;
  obstacleCategory: string;
  obstacleDetail: string;
  context: {
    locationDetails: string;
    personality: string;
    surroundings: string;
  }
}

// Structured Response from AI
export interface CoachResponse {
  solution: string;
  script: string;
  tone: string;
  bodyLanguage: string;
  bestTime: string;
  keyNote: string;
}

export interface CoachHistoryItem {
  id: string;
  date: string;
  input: CoachSessionInput;
  response: CoachResponse;
}

export interface Post {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  image: string;
  caption: string;
  likes: number;
  comments: number;
  isVerified?: boolean;
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: Date;
  isRead: boolean;
  isAiSuggested?: boolean;
}

export interface ChatSession {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  lastMessage: string;
  unreadCount: number;
  status: OnlineStatus;
}

export interface CoachScenario {
  id: string;
  title: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

export interface Fetcher {
  id: string;
  name: string;
  description: string;
  category: string;
  status: 'active' | 'inactive';
  costPerRun: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

export interface Log {
  id: string;
  fetcherName: string;
  timestamp: string;
  status: 'completed' | 'running' | 'failed';
}

export interface Plan {
  id: string;
  name: string;
  price: number;
  currency: string;
  features: string[];
  recommended?: boolean;
}

export interface AISettings {
  tone: 'Cute' | 'Funny' | 'Romantic' | 'Professional';
  language: 'English' | 'Hindi' | 'Hinglish';
  safetyFilter: boolean;
}

export interface ReferralStat {
  date: string;
  referrals: number;
  revenue: number;
  fraudBlocked: number;
}

export interface ReferralTier {
  name: ReferralLevel;
  minReferrals: number;
  reward: string;
  color: string;
}

export interface SaaSMetrics {
  mrr: number;
  arr: number;
  churnRate: number; // percentage
  cac: number; // Customer Acquisition Cost
  ltv: number; // Lifetime Value
  activeTrials: number;
  conversionRate: number; // Trial to Paid %
}

export interface FunnelStage {
  name: string;
  value: number;
  fill: string;
}
