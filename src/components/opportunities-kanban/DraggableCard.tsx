import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { Opportunity } from '@/types';
import Card from '@/components/ui/custom-card';
import Badge from '@/components/ui/custom-badge';
import { cn } from '@/lib/utils';
import { getStageVariant, formatAmount, formatDate } from './kanban-utils';
import { DollarSign, Calendar, TrendingUp, Building, Hash, User, Edit3, Trash2, Maximize2 } from 'lucide-react';

interface DraggableCardProps {
  card: Opportunity;
  columnId: string;
  onClick?: () => void;
  onEdit?: (opportunity: Opportunity) => void;
  onDelete?: (opportunity: Opportunity) => void;
}

export function DraggableCard({ card, columnId, onClick, onEdit, onDelete }: DraggableCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `card-${card.id}`,
    data: { type: 'card', cardId: card.id, fromColumnId: columnId },
  });

  console.log(card);

  const style = transform ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` } : undefined;

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      {...listeners} 
      {...attributes} 
      className={cn('select-none', isDragging && 'opacity-50')} 
    > 
      <Card
        hover
        gradient
        shadow="md"
        padding="md"
        className="group transition-all duration-300 border-l-4 border-l-primary/30 hover:border-l-primary animate-fade-in transform cursor-pointer"
      >
        <div className="space-y-4">
          {/* Header with ID and Title */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Hash className="h-3 w-3" />
              <span className="font-mono">{card.id}</span>
            </div>
            <h3 className="text-sm font-semibold text-foreground leading-snug line-clamp-2">
              {card.name}
            </h3>
          </div>

          {/* Company */}
          <div className="flex items-center gap-2">
            <Building className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
            <span className="text-sm text-muted-foreground truncate">
              {card.accountName}
            </span>
          </div>

          {/* Lead Info if available */}
          {card.leadData && (
            <div className="flex items-center gap-2 p-2 bg-accent/30 rounded-md">
              <User className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <span className="text-xs font-medium text-foreground block truncate">
                  {card.leadData.name}
                </span>
                <span className="text-xs text-muted-foreground">
                  Score: {card.leadData.score}
                </span>
              </div>
            </div>
          )}

          {/* Amount */}
          <div className="flex items-center gap-2">
            <DollarSign className="h-3.5 w-3.5 text-success flex-shrink-0" />
            <span className="text-sm font-semibold text-success">
              {formatAmount(card.amount)}
            </span>
          </div>

          {/* Badges Row */}
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant={getStageVariant(card.stage)} className='text-xs py-1 px-2 capitalize'>
              {card.stage.replace('_', ' ')}
            </Badge>
            {card.priority && (
              <Badge 
                className='text-xs py-1 px-2 capitalize' 
                variant={card.priority === 'high' ? 'error' : card.priority === 'medium' ? 'warning' : 'secondary'}
              >
                {card.priority}
              </Badge>
            )}
            {typeof card.probability === 'number' && (
              <Badge variant="default" className='text-xs py-1 px-2'>
                {card.probability}%
              </Badge>
            )}
          </div>

          {/* Footer with Dates */}
          <div className="pt-2 space-y-1 border-t border-border/50">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3 flex-shrink-0" />
              <span>Created {formatDate(card.createdAt)}</span>
            </div>
            {card.expectedCloseDate && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <TrendingUp className="h-3 w-3 flex-shrink-0" />
                <span>Close {formatDate(card.expectedCloseDate)}</span>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              className="inline-flex items-center gap-2 text-xs px-2 py-1 rounded-md hover:bg-muted/60"
              onClick={onClick}
              title="View"
            >
              <Maximize2 className="h-4 w-4" /> View
            </button>
            <button
              className="inline-flex items-center gap-2 text-xs px-2 py-1 rounded-md hover:bg-muted/60"
              onClick={() => onEdit?.(card)}
              title="Edit"
            >
              <Edit3 className="h-4 w-4" /> Edit
            </button>
            <button
              className="inline-flex items-center gap-2 text-xs px-2 py-1 rounded-md text-error hover:bg-error/10"
              onClick={() => onDelete?.(card)}
              title="Delete"
            >
              <Trash2 className="h-4 w-4" /> Delete
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
}