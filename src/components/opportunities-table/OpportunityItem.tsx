import React from 'react';
import { Opportunity } from '@/types';
import Card from '@/components/ui/custom-card';
import Badge from '@/components/ui/custom-badge';
import Button from '@/components/ui/custom-button';
import { useIsMobile } from '@/hooks/use-mobile';
import { 
  Building, 
  DollarSign, 
  Calendar, 
  TrendingUp, 
  Tag, 
  Edit3, 
  Trash2, 
  Maximize2,
  Hash,
  User,
  Target
} from 'lucide-react';
import { 
  getStageColor, 
  getStageLabel, 
  getPriorityColor, 
  formatCurrency, 
  formatRelativeDate, 
  formatDate 
} from './table-utils';

interface OpportunityItemProps {
  opportunity: Opportunity;
  onOpenDetails?: (opportunity: Opportunity) => void;
  onEdit?: (opportunity: Opportunity) => void;
  onDelete?: (opportunity: Opportunity) => void;
}

const OpportunityItem: React.FC<OpportunityItemProps> = ({
  opportunity,
  onOpenDetails,
  onEdit,
  onDelete,
}) => {
  const isMobile = useIsMobile();

  return (
    <div className="mb-4" style={{ minHeight: isMobile ? '140px' : '160px' }}>
      <Card
        hover
        gradient
        shadow="md"
        padding={isMobile ? "sm" : "md"}
        className="group transition-all duration-300 border-l-4 border-l-primary/30 hover:border-l-primary animate-fade-in transform cursor-pointer h-full"
      >
        {isMobile ? (
          // Mobile Layout - Compact and vertical
          <div className="space-y-3">
            {/* Header Section - Compact */}
            <div className="flex justify-between items-start">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                  <Hash className="h-3 w-3" />
                  <span className="font-mono">{opportunity.id}</span>
                  {opportunity.priority && (
                    <Badge className={`text-xs px-2 py-0.5 ${getPriorityColor(opportunity.priority)}`}>
                      {opportunity.priority}
                    </Badge>
                  )}
                </div>
                <h3 className="text-sm font-semibold text-foreground leading-tight line-clamp-2">
                  {opportunity.name}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <Building className="h-3 w-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground truncate">
                    {opportunity.accountName}
                  </span>
                </div>
              </div>
              
              <div className="text-right ml-2">
                <div className="font-bold text-success text-sm">
                  {formatCurrency(opportunity.amount)}
                </div>
                <Badge className={`text-xs px-2 py-0.5 mt-1 ${getStageColor(opportunity.stage)}`}>
                  {getStageLabel(opportunity.stage)}
                </Badge>
              </div>
            </div>

            {/* Lead Information - Compact */}
            {opportunity.leadData && (
              <div className="flex items-center gap-2 p-2 bg-accent/20 rounded border border-accent/30">
                <User className="h-3 w-3 text-muted-foreground" />
                <div className="min-w-0 flex-1">
                  <span className="text-xs font-medium text-foreground block truncate">
                    {opportunity.leadData.name}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Score: {opportunity.leadData.score}
                  </span>
                </div>
              </div>
            )}

            {/* Key Metrics - Mobile Grid */}
            <div className="grid grid-cols-3 gap-2 text-center py-2 border-t border-border/50">
              <div>
                <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
                  <TrendingUp className="h-3 w-3" />
                </div>
                <div className="text-xs font-medium">
                  {opportunity.probability ? `${opportunity.probability}%` : 'N/A'}
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
                  <Calendar className="h-3 w-3" />
                </div>
                <div className="text-xs font-medium">
                  {formatRelativeDate(opportunity.createdAt)}
                </div>
              </div>
              
              {opportunity.assignee && (
                <div>
                  <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
                    <User className="h-3 w-3" />
                  </div>
                  <div className="text-xs font-medium truncate">
                    {opportunity.assignee}
                  </div>
                </div>
              )}
            </div>

            {/* Actions - Mobile */}
            <div className="flex items-center justify-end gap-1 pt-2 border-t border-border/50">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => onOpenDetails?.(opportunity)}
                className="text-xs px-2 py-1"
              >
                <Maximize2 className="h-3 w-3" />
              </Button>
              <Button 
                variant="secondary" 
                size="sm" 
                onClick={() => onEdit?.(opportunity)}
                className="text-xs px-2 py-1"
              >
                <Edit3 className="h-3 w-3" />
              </Button>
              <Button 
                variant="error" 
                size="sm" 
                onClick={() => onDelete?.(opportunity)}
                className="text-xs px-2 py-1"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </div>
        ) : (
          // Desktop Layout - Original detailed layout
          <div className="space-y-4">
            {/* Header Section */}
            <div className="flex justify-between items-start">
              <div className="flex-1 min-w-0 space-y-2">
                {/* ID and Title */}
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Hash className="h-3 w-3" />
                    <span className="font-mono">{opportunity.id}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-foreground leading-tight">
                    {opportunity.name}
                  </h3>
                </div>
                
                {/* Company */}
                <div className="flex items-center gap-2">
                  <Building className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <span className="text-sm text-muted-foreground truncate font-medium">
                    {opportunity.accountName}
                  </span>
                </div>
              </div>
              
              {/* Priority Badge */}
              {opportunity.priority && (
                <Badge 
                  className={`text-xs font-medium uppercase px-3 py-1 ${getPriorityColor(opportunity.priority)}`}
                >
                  {opportunity.priority} Priority
                </Badge>
              )}
            </div>

            {/* Lead Information */}
            {opportunity.leadData && (
              <div className="flex items-center gap-2 p-3 bg-accent/20 rounded-lg border border-accent/30">
                <User className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <span className="text-sm font-medium text-foreground block truncate">
                    Lead: {opportunity.leadData.name}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Score: {opportunity.leadData.score} • Source: {opportunity.leadData.source.replace('_', ' ')}
                  </span>
                </div>
              </div>
            )}

            {/* Key Metrics Row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Amount */}
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <DollarSign className="h-4 w-4 text-success" />
                  <span className="text-xs font-medium uppercase tracking-wide">Value</span>
                </div>
                <div className="font-bold text-success text-lg">
                  {formatCurrency(opportunity.amount)}
                </div>
              </div>

              {/* Stage */}
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Target className="h-4 w-4" />
                  <span className="text-xs font-medium uppercase tracking-wide">Stage</span>
                </div>
                <Badge className={`text-xs font-medium px-2 py-1 ${getStageColor(opportunity.stage)}`}>
                  {getStageLabel(opportunity.stage)}
                </Badge>
              </div>

              {/* Probability */}
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <TrendingUp className="h-4 w-4" />
                  <span className="text-xs font-medium uppercase tracking-wide">Probability</span>
                </div>
                <div className="font-semibold text-sm">
                  {opportunity.probability ? `${opportunity.probability}%` : 'Not set'}
                </div>
              </div>

              {/* Created Date */}
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span className="text-xs font-medium uppercase tracking-wide">Created</span>
                </div>
                <div className="text-xs text-muted-foreground font-medium">
                  {formatRelativeDate(opportunity.createdAt)}
                </div>
              </div>
            </div>

            {/* Additional Info Row */}
            {(opportunity.assignee || opportunity.expectedCloseDate) && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pt-2 border-t border-border/50">
                {/* Assignee */}
                {opportunity.assignee && (
                  <div className="space-y-1">
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Assignee</span>
                    <div className="text-sm font-medium text-foreground">{opportunity.assignee}</div>
                  </div>
                )}

                {/* Expected Close Date */}
                {opportunity.expectedCloseDate && (
                  <div className="space-y-1">
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Expected Close</span>
                    <div className="text-sm font-medium text-foreground">
                      {formatDate(opportunity.expectedCloseDate)}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Description */}
            {opportunity.description && (
              <div className="pt-2 border-t border-border/50">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide block mb-2">Description</span>
                <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                  {opportunity.description}
                </p>
              </div>
            )}
            
            {/* Tags */}
            {opportunity.tags && opportunity.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {opportunity.tags.slice(0, 4).map((tag, index) => (
                  <Badge key={index} variant="secondary" className="text-xs px-2 py-1 flex items-center gap-1">
                    <Tag className="h-3 w-3" />
                    {tag}
                  </Badge>
                ))}
                {opportunity.tags.length > 4 && (
                  <Badge variant="secondary" className="text-xs px-2 py-1">
                    +{opportunity.tags.length - 4} more
                  </Badge>
                )}
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-end gap-2 pt-3 border-t border-border/50">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => onOpenDetails?.(opportunity)}
                className="text-xs"
              >
                <Maximize2 className="h-4 w-4 mr-1" />
                View
              </Button>
              <Button 
                variant="secondary" 
                size="sm" 
                onClick={() => onEdit?.(opportunity)}
                className="text-xs"
              >
                <Edit3 className="h-4 w-4 mr-1" />
                Edit
              </Button>
              <Button 
                variant="error" 
                size="sm" 
                onClick={() => onDelete?.(opportunity)}
                className="text-xs"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Delete
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export { OpportunityItem };