export type UserRole = 'user' | 'admin' | 'super_admin';
export type PlanType = 'Free' | 'Pro' | 'Agency';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  plan: PlanType;
  avatar: string;
  isOnline: boolean;
  lastActive: string;
  flowId: string;
}

export interface Fetcher {
  id: string;
  name: string;
  description: string;
  category: 'SEO' | 'Content' | 'Leads' | 'Automation' | 'Coding';
  icon: string;
  status: 'active' | 'maintenance' | 'beta';
  costPerRun: number;
  popularity: number;
}

export interface FlowLog {
  id: string;
  fetcherName: string;
  status: 'completed' | 'running' | 'failed';
  timestamp: string;
  resultSummary: string;
}

export interface PaymentPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  features: string[];
  recommended?: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'ai';
  content: string;
  timestamp: Date;
}