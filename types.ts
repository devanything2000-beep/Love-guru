export type UserRole = 'user' | 'admin';
export type PlanType = 'Free' | 'Pro' | 'Premium';
export type OnlineStatus = 'online' | 'offline' | 'busy';

// --- DATABASE SCHEMA REPRESENTATION ---
/*
  Table: users
    - id, name, phone, plan, coins_balance

  Table: coaching_logs
    - id, user_id, mood, situation, stage, obstacle, detailed_context, ai_advice, created_at

  Table: date_plans
    - id, user_id, city, vibe, budget, ai_itinerary

  Table: profile_reviews
    - id, user_id, bio_text, score, feedback
*/

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
}

export interface CoachSessionInput {
  mood: string;
  locationType: string;
  stage: string;
  confidence: string;
  obstacleCategory: string; // 'Couple', 'Family', 'Society'
  obstacleDetail: string;
  context: {
    locationDetails: string;
    personality: string;
    surroundings: string;
  }
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