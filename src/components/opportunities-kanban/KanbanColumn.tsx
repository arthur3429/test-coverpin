import React, { useMemo, useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { Opportunity } from '@/types';
import Card from '@/components/ui/custom-card';
import Button from '@/components/ui/custom-button';
import { cn } from '@/lib/utils';
import { ColumnState } from './kanban-utils';
import { DraggableCard } from './DraggableCard';
import { X } from 'lucide-react';

interface KanbanColumnProps {
  column: ColumnState;
  cards: Opportunity[];
  onLoadMore: () => void;
  visibleCount: number;
  onRename: (title: string) => void;
  onDelete: () => void;
  onCardClick?: (card: Opportunity) => void;
  onEditCard?: (card: Opportunity) => void;
  onDeleteCard?: (card: Opportunity) => void;
}

export function KanbanColumn({
  column,
  cards,
  onLoadMore,
  visibleCount,
  onRename,
  onDelete,
  onCardClick,
  onEditCard,
  onDeleteCard,
}: KanbanColumnProps) {
  // Droppable area for entire column body
  const droppable = useDroppable({ id: column.id, data: { type: 'column', columnId: column.id } });

  return (
    <div className="w-[350px] flex-shrink-0">
      <Card className="bg-card/80 border-border/60">
        {/* Column header */}
        <div className="px-4 py-3 flex items-center justify-between border-b border-border/60">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-primary/60" />
            <button
              className="text-left text-sm font-semibold text-foreground hover:text-primary"
              onDoubleClick={() => {
                const title = prompt('Rename column', column.title);
                if (title && title.trim()) onRename(title.trim());
              }}
              title="Double-click to rename"
            >
              {column.title}
            </button>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-xs text-muted-foreground">{cards.length}</div>
            <button
              onClick={onDelete}
              className="text-muted-foreground/70 hover:text-error"
              title="Delete column"
            >
              <X className='w-4 h-4' />
            </button>
          </div>
        </div>

        {/* Cards list */}
        <div 
          ref={droppable.setNodeRef} 
          className={cn('py-3', droppable.isOver && 'bg-accent/30 rounded-b-xl transition-colors')}
        > 
          {cards?.length === 0 ? (
            <Card className="text-center py-8 border-dashed">
              <p className="text-sm text-muted-foreground">No cards</p>
            </Card>
          ) : (
            <div className="overflow-auto scrollbar-thin h-fit max-h-[600px] space-y-4">
              {cards?.map((card) => (
                  <DraggableCard 
                    key={card.id}
                    card={card} 
                    columnId={column.id} 
                    onClick={() => onCardClick?.(card)}
                    onEdit={(c) => onEditCard?.(c)}
                    onDelete={(c) => onDeleteCard?.(c)}
                  />
              ))}
            </div>
          )}

          {cards.length > visibleCount && (
            <div className="pt-2">
              <Button variant="outline" size="sm" className="w-full" onClick={onLoadMore}>
                Load more ({cards.length - visibleCount} more)
              </Button>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
