export const APP_NAME = 'FinTrack 360';

export const MODULE_LIST = [
  { id: 'auth', name: 'Authentication', description: 'JWT login, registration & profile management', status: 'Architecture Ready' },
  { id: 'dashboard', name: 'Dashboard Overview', description: 'Real-time financial status & metrics', status: 'Architecture Ready' },
  { id: 'transactions', name: 'Transactions Management', description: 'Income & expense tracking with filtering', status: 'Architecture Ready' },
  { id: 'categories', name: 'Categories Manager', description: 'Custom income & expense classification', status: 'Architecture Ready' },
  { id: 'budgets', name: 'Budgets & Limits', description: 'Monthly spending caps & alerts', status: 'Architecture Ready' },
  { id: 'analytics', name: 'Financial Analytics', description: 'Interactive charts & cash flow trends', status: 'Architecture Ready' },
  { id: 'recurring', name: 'Recurring Bills', description: 'Subscriptions & scheduled payments', status: 'Architecture Ready' },
  { id: 'savings', name: 'Savings Goals', description: 'Target goals & milestone tracking', status: 'Architecture Ready' },
  { id: 'profile', name: 'User Profile & Settings', description: 'Currency & account preferences', status: 'Architecture Ready' },
];

export const NAV_LINKS = [
  { path: '/', label: 'Overview', icon: 'LayoutDashboard' },
  { path: '/transactions', label: 'Transactions', icon: 'Receipt' },
  { path: '/categories', label: 'Categories', icon: 'Tags' },
  { path: '/budgets', label: 'Budgets', icon: 'PieChart' },
  { path: '/analytics', label: 'Analytics', icon: 'TrendingUp' },
  { path: '/recurring', label: 'Recurring', icon: 'Repeat' },
  { path: '/savings', label: 'Savings Goals', icon: 'Target' },
  { path: '/profile', label: 'Settings', icon: 'Settings' },
];
