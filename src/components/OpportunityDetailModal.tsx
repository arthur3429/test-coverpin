import React from 'react';
import { Opportunity } from '@/types';
import Card from '@/components/ui/custom-card';
import Badge from '@/components/ui/custom-badge';
import Button from '@/components/ui/custom-button';
import { 
  X, 
  DollarSign, 
  Calendar, 
  TrendingUp, 
  Target, 
  Building, 
  User, 
  Mail, 
  Star,
  Clock,
  Tag,
  FileText,
  ArrowRight
} from 'lucide-react';

interface OpportunityDetailModalProps {
  opportunity: Opportunity | null;
  isOpen: boolean;
  onClose: () => void;
}

const stageVariant = (stage: Opportunity['stage']) => {
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

const formatAmount = (amount?: number) => {
  if (amount == null) return 'Not specified';
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
};

export default function OpportunityDetailModal({ opportunity, isOpen, onClose }: OpportunityDetailModalProps) {
  if (!isOpen || !opportunity) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose} />
      <Card className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto z-10 animate-in zoom-in-95 fade-in duration-200" shadow="xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Target className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Opportunity Details</h2>
              <p className="text-sm text-muted-foreground">ID: #{opportunity.id}</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="rounded-lg p-2 text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Main Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Building className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-muted-foreground">Opportunity</span>
                </div>
                <div className="text-lg font-semibold">{opportunity.name}</div>
                <div className="text-sm text-muted-foreground">{opportunity.accountName}</div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-muted-foreground">Value</span>
                </div>
                <div className="text-2xl font-bold text-success">{formatAmount(opportunity.amount)}</div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-muted-foreground">Created</span>
                </div>
                <div className="text-sm">{new Date(opportunity.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}</div>
              </div>

              {opportunity.expectedCloseDate && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-muted-foreground">Expected Close</span>
                  </div>
                  <div className="text-sm">{new Date(opportunity.expectedCloseDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}</div>
                </div>
              )}
            </div>
          </div>

          {/* Status & Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center justify-between p-3 bg-accent/50 rounded-lg">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Stage</span>
              </div>
              <Badge variant={stageVariant(opportunity.stage)} size="sm">
                {opportunity.stage.replace('_', ' ').toUpperCase()}
              </Badge>
            </div>

            {typeof opportunity.probability === 'number' && (
              <div className="flex items-center justify-between p-3 bg-accent/50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Probability</span>
                </div>
                <span className="text-sm font-semibold">{opportunity.probability}%</span>
              </div>
            )}

            {opportunity.priority && (
              <div className="flex items-center justify-between p-3 bg-accent/50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Priority</span>
                </div>
                <Badge 
                  variant={opportunity.priority === 'high' ? 'error' : opportunity.priority === 'medium' ? 'warning' : 'secondary'} 
                  size="sm"
                >
                  {opportunity.priority.toUpperCase()}
                </Badge>
              </div>
            )}
          </div>

          {/* Tags */}
          {opportunity.tags && opportunity.tags.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Tag className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground">Tags</span>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                {opportunity.tags.map(tag => (
                  <Badge key={tag} size="sm" variant="secondary" className="capitalize">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Description */}
          {opportunity.description && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground">Description</span>
              </div>
              <div className="p-4 bg-accent/30 rounded-lg">
                <p className="text-sm leading-relaxed">{opportunity.description}</p>
              </div>
            </div>
          )}

          {/* Lead Information */}
          {opportunity.leadData && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground">Lead Information</span>
              </div>
              <Card className="p-4 bg-gradient-to-r from-primary/5 to-secondary/5 border-l-4 border-l-primary">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-semibold">{opportunity.leadData.name}</h4>
                    <p className="text-sm text-muted-foreground">{opportunity.leadData.company}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="success" size="sm">
                      Score: {opportunity.leadData.score}
                    </Badge>
                    <Badge 
                      variant={opportunity.leadData.status === 'qualified' ? 'success' : 'secondary'} 
                      size="sm"
                    >
                      {opportunity.leadData.status.toUpperCase()}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Mail className="h-3 w-3" />
                    <span>{opportunity.leadData.email}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <ArrowRight className="h-3 w-3" />
                    <span className="capitalize">{opportunity.leadData.source}</span>
                  </div>
                </div>
              </Card>
            </div>
          )}

        </div>
      </Card>
    </div>
  );
}
