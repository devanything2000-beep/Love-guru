import { Fetcher, PaymentPlan, User, FlowLog } from './types';

export const SYSTEM_PROMPTS = {
  fetcherLogic: `You are an AI fetcher agent. Take user input, process it in structured steps, return JSON output with status, result and next action.`,
  dashboard: `Create a user dashboard with active AI fetchers, real-time status indicators like WhatsApp, usage stats and recent activity.`,
};

export const MOCK_USER: User = {
  id: 'u-12345',
  name: 'Rahul Sharma',
  email: 'rahul@example.com',
  role: 'user', // Change to 'admin' to test admin panel
  plan: 'Pro',
  avatar: 'https://picsum.photos/200',
  isOnline: true,
  lastActive: 'Now',
  flowId: 'FLOW-8821'
};

export const FETCHERS: Fetcher[] = [
  {
    id: 'f-1',
    name: 'SEO Audit Master',
    description: 'Deep dive analysis of website SEO performance with actionable steps.',
    category: 'SEO',
    icon: 'Search',
    status: 'active',
    costPerRun: 50,
    popularity: 98
  },
  {
    id: 'f-2',
    name: 'LinkedIn Lead Gen',
    description: 'Finds professionals based on niche and location automatically.',
    category: 'Leads',
    icon: 'Users',
    status: 'active',
    costPerRun: 120,
    popularity: 85
  },
  {
    id: 'f-3',
    name: 'Content Repurposer',
    description: 'Turn YouTube videos into Blog posts and Tweets instantly.',
    category: 'Content',
    icon: 'FileText',
    status: 'beta',
    costPerRun: 30,
    popularity: 92
  },
  {
    id: 'f-4',
    name: 'Code Reviewer Pro',
    description: 'Analyzes GitHub PRs and suggests security fixes.',
    category: 'Coding',
    icon: 'Code',
    status: 'maintenance',
    costPerRun: 0,
    popularity: 45
  }
];

export const PLANS: PaymentPlan[] = [
  {
    id: 'p-free',
    name: 'Free',
    price: 0,
    currency: '₹',
    features: ['3 Fetcher Runs/day', 'Standard Speed', 'Community Support']
  },
  {
    id: 'p-pro',
    name: 'Pro',
    price: 499,
    currency: '₹',
    features: ['Unlimited Runs', 'Priority Processing', 'New Beta Fetchers', 'Email Support'],
    recommended: true
  },
  {
    id: 'p-agency',
    name: 'Agency',
    price: 1999,
    currency: '₹',
    features: ['API Access', 'Team Seats (5)', 'White-label Reports', 'Dedicated Manager']
  }
];

export const RECENT_LOGS: FlowLog[] = [
  { id: 'l-1', fetcherName: 'SEO Audit Master', status: 'completed', timestamp: '2 mins ago', resultSummary: 'Score: 85/100' },
  { id: 'l-2', fetcherName: 'Content Repurposer', status: 'running', timestamp: 'Running...', resultSummary: 'Processing...' },
  { id: 'l-3', fetcherName: 'LinkedIn Lead Gen', status: 'failed', timestamp: '1 hour ago', resultSummary: 'API Timeout' },
  { id: 'l-4', fetcherName: 'SEO Audit Master', status: 'completed', timestamp: '5 hours ago', resultSummary: 'Score: 92/100' },
];