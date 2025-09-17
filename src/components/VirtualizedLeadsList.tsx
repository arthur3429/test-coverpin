import React, { useMemo, useState } from 'react';
import { Lead } from '@/types';
import Card from '@/components/ui/custom-card';
import { ITEM_HEIGHT, CONTAINER_HEIGHT, ITEMS_PER_PAGE } from './virtualized-leads/leads-utils';
import { LeadItem } from './virtualized-leads/LeadItem';
import { SkeletonItem } from './virtualized-leads/SkeletonItem';
import { EmptyState } from './virtualized-leads/EmptyState';
import { ScrollIndicator } from './virtualized-leads/ScrollIndicator';

interface VirtualizedLeadsListProps {
  leads: Lead[];
  onLeadClick: (lead: Lead) => void;
  loading: boolean;
}

const VirtualizedLeadsList: React.FC<VirtualizedLeadsListProps> = ({ 
  leads, 
  onLeadClick, 
  loading 
}) => {
  const [scrollTop, setScrollTop] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const [scrollTimeout, setScrollTimeout] = useState<NodeJS.Timeout | null>(null);

  // Cleanup timeout on unmount
  React.useEffect(() => {
    return () => {
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
    };
  }, [scrollTimeout]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollTop = e.currentTarget.scrollTop;
    setScrollTop(scrollTop);
    setIsScrolling(true);
    
    // Clear previous timeout
    if (scrollTimeout) {
      clearTimeout(scrollTimeout);
    }
    
    // Set new timeout to stop scrolling state after user stops scrolling
    const timer = setTimeout(() => {
      setIsScrolling(false);
    }, 250); // Otimizado para melhor feedback visual
    
    setScrollTimeout(timer);
  };

  const visibleItems = useMemo(() => {
    if (loading) return [];
    
    const startIndex = Math.floor(scrollTop / ITEM_HEIGHT);
    const endIndex = Math.min(startIndex + ITEMS_PER_PAGE + 2, leads.length);
    
    return leads.slice(Math.max(0, startIndex), endIndex);
  }, [leads, scrollTop, loading]);

  // Calculate skeleton items to show during scrolling
  const scrollSkeletons = useMemo(() => {
    if (!isScrolling || loading || leads.length === 0) return [];
    
    // Check if we're near the end - don't show skeletons if we're at the bottom
    const startIndex = Math.floor(scrollTop / ITEM_HEIGHT);
    const endIndex = Math.min(startIndex + ITEMS_PER_PAGE + 2, leads.length);
    const isNearEnd = endIndex >= leads.length;
    
    if (isNearEnd) return [];
    
    // Show skeletons at the edges of visible content to simulate loading
    const skeletonCount = 3;
    return Array.from({ length: skeletonCount }, (_, index) => ({
      id: `scroll-skeleton-${scrollTop}-${index}`,
      isScrollSkeleton: true
    }));
  }, [isScrolling, loading, scrollTop, leads.length]);

  const startIndex = Math.floor(scrollTop / ITEM_HEIGHT);

  // Check if we can scroll more
  const canScrollMore = useMemo(() => {
    if (loading || leads.length === 0) return false;
    const maxScroll = Math.max(0, (leads.length * ITEM_HEIGHT) - CONTAINER_HEIGHT);
    return scrollTop < maxScroll - 10; // 10px threshold
  }, [scrollTop, leads.length, loading]);

  if (!loading && leads.length === 0) {
    return <EmptyState />;
  }

  return (
    <Card shadow="lg" padding="none" className="overflow-hidden border-l-4 border-l-primary/30">
      <div className="overflow-auto scrollbar-thin animate-fade-in" style={{ height: CONTAINER_HEIGHT }} onScroll={handleScroll}>
        <div style={{height: loading ? CONTAINER_HEIGHT : leads.length * ITEM_HEIGHT, position: 'relative',}}>
          <div style={{transform: `translateY(${loading ? 0 : startIndex * ITEM_HEIGHT}px)`, }}
            className="px-4 py-3">
            {loading ? (
              <>
                {Array.from({ length: ITEMS_PER_PAGE + 2 }).map((_, index) => (
                  <SkeletonItem key={`loading-skeleton-${index}`} />
                ))}
              </>
            ) : (
              <>
                {visibleItems.map((lead) => (
                  <LeadItem
                    key={lead.id}
                    lead={lead}
                    onLeadClick={onLeadClick}
                  />
                ))}
                
                {/* Show scrolling skeletons when user is actively scrolling */}
                {isScrolling && scrollSkeletons.length > 0 && (
                  <div className="space-y-4 transition-all duration-200">
                    {scrollSkeletons.map((item) => (
                      <div key={item.id} className="animate-skeleton-scroll">
                        <SkeletonItem />
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Show scroll indicator only if we can scroll more */}
                {isScrolling && canScrollMore && <ScrollIndicator />}
              </>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default VirtualizedLeadsList;