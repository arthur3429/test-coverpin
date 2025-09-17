// Constants for virtualization
export const OPPORTUNITY_ITEM_HEIGHT = 160; // Desktop height
export const OPPORTUNITY_ITEM_HEIGHT_MOBILE = 140; // Mobile height - more compact
export const OPPORTUNITY_CONTAINER_HEIGHT = 600;
export const OPPORTUNITIES_PER_PAGE = Math.ceil(OPPORTUNITY_CONTAINER_HEIGHT / OPPORTUNITY_ITEM_HEIGHT);

// Utility functions for opportunities
export const getStageColor = (stage: string) => {
  const colors = {
    prospecting: 'bg-blue-100 text-blue-800 border-blue-200',
    qualification: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    proposal: 'bg-purple-100 text-purple-800 border-purple-200',
    negotiation: 'bg-orange-100 text-orange-800 border-orange-200',
    closed_won: 'bg-green-100 text-green-800 border-green-200',
    closed_lost: 'bg-red-100 text-red-800 border-red-200',
  };
  return colors[stage as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-200';
};

export const getStageLabel = (stage: string) => {
  const stageMap = {
    prospecting: 'Prospecting',
    qualification: 'Qualification',
    proposal: 'Proposal',
    negotiation: 'Negotiation',
    closed_won: 'Closed Won',
    closed_lost: 'Closed Lost',
  } as const;
  return stageMap[stage as keyof typeof stageMap] || stage;
};

export const getPriorityColor = (priority?: string) => {
  const colors = {
    high: 'bg-red-100 text-red-800 border-red-200',
    medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    low: 'bg-green-100 text-green-800 border-green-200',
  };
  return colors[priority as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-200';
};

export const formatCurrency = (amount?: number) => {
  if (amount == null) return 'Not specified';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

export const formatRelativeDate = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  
  if (diffInDays === 0) return 'Today';
  if (diffInDays === 1) return '1 day ago';
  if (diffInDays < 7) return `${diffInDays} days ago`;
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
  if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`;
  return `${Math.floor(diffInDays / 365)} years ago`;
};

export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};