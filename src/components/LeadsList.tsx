import React from 'react';
import { Lead } from '@/types';
import Badge from '@/components/ui/custom-badge';
import Card from '@/components/ui/custom-card';
import { getScoreColor } from './virtualized-leads/leads-utils';
import StatusBadge from './ui/status-badge';
import { Search } from 'lucide-react';

interface LeadsListProps {
  leads: Lead[];
  onLeadClick: (lead: Lead) => void;
  loading: boolean;
}

const LeadsList: React.FC<LeadsListProps> = ({ leads, onLeadClick, loading }) => {

  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 10 }).map((_, index) => (
          <Card key={index} padding="sm" shadow="sm">
            <div className="animate-pulse">
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <div className="h-4 bg-muted rounded mb-2"></div>
                  <div className="h-3 bg-muted rounded w-2/3 mb-2"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-6 w-16 bg-muted rounded-full"></div>
                  <div className="w-8 text-right">
                    <div className="h-4 bg-muted rounded mb-1"></div>
                    <div className="h-3 bg-muted rounded"></div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (leads.length === 0) {
    return (
      <Card className="text-center py-12">
        <div className="text-muted-foreground">
          <Search className="mx-auto h-12 w-12 mb-4 opacity-50"/>
          <h3 className="text-lg font-medium text-foreground mb-2">No leads found</h3>
          <p>Try adjusting your search or filter criteria</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-3 max-h-[600px] overflow-y-auto">
      {leads.map((lead) => (
        <div
          key={lead.id}
          className="cursor-pointer hover:bg-accent/50 transition-colors border-l-4 border-l-primary/20 hover:border-l-primary rounded-lg border border-border bg-card text-card-foreground p-3 shadow-sm"
          onClick={() => onLeadClick(lead)}
        >
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">
                    {lead.name}
                  </p>
                  <p className="text-sm text-muted-foreground truncate">
                    {lead.company}
                  </p>
                  <p className="text-xs text-muted-foreground truncate mt-1">
                    {lead.email}
                  </p>
                </div>
                
                <div className="flex items-center gap-2">
                  
                  <StatusBadge status={lead.status} />
                  
                  <div className="text-right">
                    <div className={`text-sm font-semibold ${getScoreColor(lead.score)}`}>
                      {lead.score}
                    </div>
                    <div className="text-xs text-muted-foreground capitalize">
                      {lead.source.replace('_', ' ')}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LeadsList;