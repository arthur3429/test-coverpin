import { Opportunity } from '@/types';

// Types
export interface BoardState {
  columns: ColumnState[];
  cardsById: Record<string, Opportunity>;
}

export interface ColumnState {
  id: string;
  title: string;
  stageKey?: Opportunity['stage']; // ties to Opportunity.stage when present
  cardIds: string[];
}

// Constants
export const DEFAULT_STAGES: { key: Opportunity['stage']; title: string }[] = [
  { key: 'prospecting', title: 'Prospecting' },
  { key: 'qualification', title: 'Qualification' },
  { key: 'proposal', title: 'Proposal' },
  { key: 'negotiation', title: 'Negotiation' },
  { key: 'closed_won', title: 'Closed Won' },
  { key: 'closed_lost', title: 'Closed Lost' },
];

// Helper functions
export const getStageVariant = (stage: Opportunity['stage']) => {
  switch (stage) {
    case 'prospecting': return 'default' as const;
    case 'qualification': return 'warning' as const;
    case 'proposal': return 'secondary' as const;
    case 'negotiation': return 'warning' as const;
    case 'closed_won': return 'success' as const;
    case 'closed_lost': return 'error' as const;
    default: return 'default' as const;
  }
};

export const formatAmount = (amount?: number) => {
  if (!amount) return 'Not specified';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

export const groupByStage = (opps: Opportunity[]) => {
  return opps.reduce((acc, o) => {
    (acc[o.stage] ||= []).push(o);
    return acc;
  }, {} as Record<Opportunity['stage'], Opportunity[]>);
};