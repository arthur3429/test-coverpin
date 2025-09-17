import React from 'react';
import { Lead } from '@/types';
import Card from '@/components/ui/custom-card';
import StatusBadge from '@/components/ui/status-badge';
import { useIsMobile } from '@/hooks/use-mobile';
import { getScoreColor, ITEM_HEIGHT } from './leads-utils';
import { ChevronRight } from 'lucide-react';

interface LeadItemProps {
  lead: Lead;
  onLeadClick: (lead: Lead) => void;
}

export const LeadItem: React.FC<LeadItemProps> = ({ lead, onLeadClick }) => {
  const isMobile = useIsMobile();
  
  return (
    <div 
      onClick={() => onLeadClick(lead)}
      style={{ minHeight: `${ITEM_HEIGHT - 16}px` }}
    >
      <Card 
        hover 
        gradient 
        shadow="md" 
        padding={isMobile ? "sm" : "md"}
        className="group cursor-pointer transition-all duration-300 mb-4 border-l-4 border-l-primary/30 hover:border-l-primary animate-fade-in transform hover:scale-[1.01]"
      >
        {isMobile ? (
          // Mobile layout - stacked vertically with compact spacing
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              {/* Avatar */}
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="text-xs font-semibold text-primary">
                  {lead.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </span>
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-foreground truncate group-hover:text-primary transition-colors">
                  {lead.name}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {lead.company}
                </p>
              </div>
              
              {/* Score and Arrow on the right */}
              <div className="flex items-center gap-2">
                <div className={`text-base font-bold ${getScoreColor(lead.score)} group-hover:scale-110 transition-transform`}>
                  {lead.score}
                </div>
                <div className="text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all">
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </div>
            
            {/* Bottom row with email, status, and source */}
            <div className="flex items-center justify-between pt-1 border-t border-border/50">
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground truncate">
                  {lead.email}
                </p>
              </div>
              
              <div className="flex items-center gap-2 ml-2">
                <StatusBadge status={lead.status} />
                <div className="text-xs text-muted-foreground capitalize">
                  {lead.source.replace('_', ' ')}
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Desktop layout - horizontal layout
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-4">
                {/* Avatar placeholder */}
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <span className="text-xs font-semibold text-primary">
                    {lead.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </span>
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-foreground truncate group-hover:text-primary transition-colors">
                    {lead.name}
                  </p>
                  <p className="text-sm text-muted-foreground truncate font-medium">
                    {lead.company}
                  </p>
                  <p className="text-xs text-muted-foreground truncate mt-1">
                    {lead.email}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 ml-4">
              <StatusBadge status={lead.status} />
              
              <div className="text-right">
                <div className={`text-lg font-bold ${getScoreColor(lead.score)} group-hover:scale-110 transition-transform`}>
                  {lead.score}
                </div>
                <div className="text-xs text-muted-foreground capitalize font-medium">
                  {lead.source.replace('_', ' ')}
                </div>
              </div>
              
              {/* Arrow indicator */}
              <div className="text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all">
                <ChevronRight className="w-5 h-5" />
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};