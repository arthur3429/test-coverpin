export interface Lead {
  id: string;
  name: string;
  company: string;
  email: string;
  source: 'website' | 'referral' | 'social_media' | 'email_campaign' | 'webinar' | 'conference';
  score: number;
  status: 'new' | 'contacted' | 'qualified' | 'unqualified' | 'converted';
}

export interface Opportunity {
  id: string;
  name: string;
  stage: 'prospecting' | 'qualification' | 'proposal' | 'negotiation' | 'closed_won' | 'closed_lost';
  amount?: number;
  accountName: string;
  createdAt: string;
  leadId: string;
  // Kanban extras
  probability?: number; // 0-100
  expectedCloseDate?: string; // ISO date
  priority?: 'low' | 'medium' | 'high';
  description?: string;
  assignee?: string;
  tags?: string[];
  leadData?: Lead;
}

export interface FilterState {
  search: string;
  status: string;
  source: string;
}

export interface SortState {
  field: keyof Lead;
  direction: 'asc' | 'desc';
}

export interface OpportunityFilterState {
  search: string;
  stage: string;
  priority: string;
  assignee: string;
  amountMin?: number;
  amountMax?: number;
}

export interface OpportunitySortState {
  field: keyof Opportunity;
  direction: 'asc' | 'desc';
}