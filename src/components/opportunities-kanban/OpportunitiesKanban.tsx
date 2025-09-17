import React, { useEffect, useState } from 'react';
import { Opportunity } from '@/types';
import Button from '@/components/ui/custom-button';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { DndContext, DragEndEvent, DragOverlay, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import OpportunityDetailModal from '@/components/OpportunityDetailModal';
import OpportunityEditModal from '@/components/OpportunityEditModal';
import { BoardState, DEFAULT_STAGES, groupByStage } from './kanban-utils';
import { KanbanColumn } from './KanbanColumn';
import { DraggableCard } from './DraggableCard';

// Types
interface OpportunitiesKanbanProps {
  opportunities: Opportunity[];
}

export default function OpportunitiesKanban({ opportunities }: OpportunitiesKanbanProps) {
  const [board, setBoard] = useLocalStorage<BoardState>('opps-kanban-v1', {
    columns: [],
    cardsById: {},
  });

  // per-column visible counts for pagination
  const [visibleByColumn, setVisibleByColumn] = useState<Record<string, number>>({});

  // Initialize board when empty or when new opportunities arrive
  useEffect(() => {
    setBoard(prev => {
      let next = { ...prev } as BoardState;

      // Seed default columns if empty
      if (!next.columns || next.columns.length === 0) {
        const grouped = groupByStage(opportunities);
        const columns = DEFAULT_STAGES.map(s => ({
          id: `col-${s.key}`,
          title: s.title,
          stageKey: s.key,
          cardIds: grouped[s.key]?.map(o => o.id) ?? [],
        }));
        const cardsById: Record<string, Opportunity> = Object.fromEntries(
          opportunities.map(o => [o.id, o])
        );
        next = { columns, cardsById };
      } else {
        // Reconcile: add missing cards and move by stage if stage columns exist
        const cardsById = { ...next.cardsById };
        for (const o of opportunities) {
          cardsById[o.id] = o; // upsert
        }

        // Ensure all card ids exist in some column; also realign by stage for stage-mapped columns
        const allIds = new Set(opportunities.map(o => o.id));
        const stageToCol = Object.fromEntries(next.columns.filter(c => c.stageKey).map(c => [c.stageKey!, c.id]));

        // remove card ids that no longer exist
        for (const col of next.columns) {
          col.cardIds = col.cardIds.filter(id => allIds.has(id));
        }

        // place cards by stage if not present
        for (const o of opportunities) {
          const inSome = next.columns.some(c => c.cardIds.includes(o.id));
          if (!inSome) {
            const destColId = stageToCol[o.stage];
            if (destColId) {
              const col = next.columns.find(c => c.id === destColId)!;
              col.cardIds.unshift(o.id);
            }
          }
        }

        next = { ...next, cardsById };
      }

      return next;
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(opportunities)]);

  // Initialize pagination defaults
  useEffect(() => {
    setVisibleByColumn(prev => {
      const base: Record<string, number> = { ...prev };
      for (const col of board.columns) {
        if (!base[col.id]) base[col.id] = 20; // default page size
      }
      return base;
    });
  }, [board.columns]);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const getCardsForColumn = (col: any) => col.cardIds.map((id: string) => board.cardsById[id]).filter(Boolean);

  const handleLoadMore = (colId: string) => {
    setVisibleByColumn(prev => ({ ...prev, [colId]: (prev[colId] ?? 20) + 20 }));
  };

  const [activeCard, setActiveCard] = useState<Opportunity | null>(null);
  const [openedCard, setOpenedCard] = useState<Opportunity | null>(null);
  const [editingCard, setEditingCard] = useState<Opportunity | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Opportunity | null>(null);

  const onDragStart = (evt: any) => {
    const data = evt?.active?.data?.current;
    if (data?.type === 'card') {
      const card = board.cardsById[data.cardId];
      setActiveCard(card);
    }
  };

  const onDragEnd = (event: DragEndEvent) => {
    setActiveCard(null);
    const { active, over } = event;
    const data = active.data.current as any;
    if (!over || !data || data.type !== 'card') return;

    const fromColumnId = data.fromColumnId as string;
    const toColumnId = (over.data.current as any)?.columnId || over.id as string;
    if (!toColumnId || fromColumnId === toColumnId) return;

    setBoard(prev => {
      const next: BoardState = {
        columns: prev.columns.map(c => ({ ...c })),
        cardsById: { ...prev.cardsById },
      };

      const from = next.columns.find(c => c.id === fromColumnId);
      const to = next.columns.find(c => c.id === toColumnId);
      if (!from || !to) return prev;

      // remove from source
      from.cardIds = from.cardIds.filter((id) => id !== data.cardId);
      // place on top of destination
      to.cardIds = [data.cardId, ...to.cardIds];

      // If destination has stageKey, update the card.stage
      const card = next.cardsById[data.cardId];
      if (to.stageKey && card) {
        next.cardsById[data.cardId] = { ...card, stage: to.stageKey } as Opportunity;
      }

      return next;
    });
  };

  // Header styling inspired by KanbanBoard header
  return (
    <>
      {/* Scrollable columns area */}
      <DndContext sensors={sensors} onDragEnd={onDragEnd} onDragStart={onDragStart}>
        <div className="relative flex items-start gap-4 overflow-y-hidden overflow-x-auto p-4 h-[calc(100vh-220px)] w-full" id="opps-kanban-container">
          {board.columns.map((col) => (
            <KanbanColumn
              key={col.id}
              column={col}
              cards={getCardsForColumn(col)}
              onLoadMore={() => handleLoadMore(col.id)}
              visibleCount={visibleByColumn[col.id] ?? 20}
              onCardClick={(card) => setOpenedCard(card)}
              onEditCard={(card) => setEditingCard(card)}
              onDeleteCard={(card) => setConfirmDelete(card)}
              onRename={(title) => {
                setBoard(prev => ({
                  ...prev,
                  columns: prev.columns.map(c => c.id === col.id ? { ...c, title } : c)
                }));
              }}
              onDelete={() => {
                setBoard(prev => ({
                  cardsById: { ...prev.cardsById },
                  columns: prev.columns.filter(c => c.id !== col.id)
                }));
              }}
            />
          ))}

          {/* Add column stub at end as well */}
          <div className="w-[320px] flex-shrink-0">
            <Button variant="outline" className="w-full border-dashed" onClick={() => {
              const title = prompt('Column title');
              if (!title) return;
              const id = `col-custom-${Date.now()}`;
              setBoard(prev => ({
                ...prev,
                columns: [...prev.columns, { id, title, cardIds: [] }],
              }));
            }}>+ Add Column</Button>
          </div>
        </div>

        <DragOverlay>
          {activeCard ? (
            <div className="w-[300px]">
              <DraggableCard card={activeCard} columnId={''} />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      <OpportunityDetailModal
        isOpen={!!openedCard}
        opportunity={openedCard}
        onClose={() => setOpenedCard(null)}
      />

      {/* Edit Opportunity */}
      <OpportunityEditModal
        isOpen={!!editingCard}
        opportunity={editingCard}
        onClose={() => setEditingCard(null)}
        // Note: Kanban manages its own local board.cardsById; persist changes here too
        onSave={async (id, updates) => {
          setBoard(prev => {
            const next = { ...prev, cardsById: { ...prev.cardsById } };
            if (next.cardsById[id]) {
              next.cardsById[id] = { ...next.cardsById[id], ...updates } as Opportunity;
            }
            return next;
          });
          // Also mirror into localStorage opportunities array to stay in sync with table view
          const raw = localStorage.getItem('opportunities');
          if (raw) {
            try {
              const arr: Opportunity[] = JSON.parse(raw);
              const next = arr.map(o => (o.id === id ? { ...o, ...updates } : o));
              localStorage.setItem('opportunities', JSON.stringify(next));
            } catch {}
          }
        }}
      />

      {/* Confirm Delete */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setConfirmDelete(null)} />
          <div className="relative z-10 w-full max-w-sm bg-card border rounded-lg p-6 shadow-xl">
            <h3 className="text-lg font-semibold mb-2">Delete opportunity?</h3>
            <p className="text-sm text-muted-foreground mb-6">This action cannot be undone.</p>
            <div className="flex justify-end gap-3">
              <Button variant="ghost" onClick={() => setConfirmDelete(null)}>Cancel</Button>
              <Button
                variant="error"
                onClick={() => {
                  const toDelete = confirmDelete;
                  setConfirmDelete(null);
                  if (!toDelete) return;
                  setBoard(prev => {
                    const next: BoardState = {
                      columns: prev.columns.map(c => ({ ...c, cardIds: c.cardIds.filter(id => id !== toDelete.id) })),
                      cardsById: { ...prev.cardsById },
                    };
                    delete next.cardsById[toDelete.id];
                    return next;
                  });
                  // Mirror to localStorage opportunities so table stays in sync
                  const raw = localStorage.getItem('opportunities');
                  if (raw) {
                    try {
                      const arr: Opportunity[] = JSON.parse(raw);
                      const next = arr.filter(o => o.id !== toDelete.id);
                      localStorage.setItem('opportunities', JSON.stringify(next));
                    } catch {}
                  }
                }}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
