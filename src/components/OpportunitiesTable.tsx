import React, { useMemo, useState } from 'react';
import { Opportunity } from '@/types';
import Card from '@/components/ui/custom-card';
import { useOpportunities } from '@/hooks/useOpportunities';
import { useIsMobile } from '@/hooks/use-mobile';
import OpportunityFilters from '@/components/OpportunityFilters';
import { OPPORTUNITY_ITEM_HEIGHT, OPPORTUNITY_ITEM_HEIGHT_MOBILE, OPPORTUNITY_CONTAINER_HEIGHT, OPPORTUNITIES_PER_PAGE } from './opportunities-table/table-utils';
import { OpportunityItem } from './opportunities-table/OpportunityItem';
import { SkeletonOpportunityItem } from './opportunities-table/SkeletonOpportunityItem';
import { EmptyOpportunityState } from './opportunities-table/EmptyOpportunityState';
import { ScrollIndicator } from './opportunities-table/ScrollIndicator';

interface OpportunitiesTableProps {
  opportunities?: Opportunity[]; // Optional since we now use our own filtered data
  onOpenDetails?: (opportunity: Opportunity) => void;
  onEdit?: (opportunity: Opportunity) => void;
  onDelete?: (opportunity: Opportunity) => void;
}

const OpportunitiesTable: React.FC<OpportunitiesTableProps> = ({
  opportunities: externalOpportunities,
  onOpenDetails,
  onEdit,
  onDelete,
}) => {
  const {
    opportunities: filteredOpportunities,
    loading,
    filters,
    sort,
    uniqueAssignees,
    setFilters,
    setSort,
    refetch,
    deleteOpportunity,
  } = useOpportunities();

  const isMobile = useIsMobile();

  const [scrollTop, setScrollTop] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const [scrollTimeout, setScrollTimeout] = useState<NodeJS.Timeout | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Use filtered opportunities from the hook instead of external ones
  const displayOpportunities = filteredOpportunities;

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
    }, 250);
    
    setScrollTimeout(timer);
  };

  const visibleOpportunities = useMemo(() => {
    if (loading) return [];
    
    const itemHeight = isMobile ? OPPORTUNITY_ITEM_HEIGHT_MOBILE : OPPORTUNITY_ITEM_HEIGHT;
    
    // If we have few items, show all to avoid virtualization bugs
    if (displayOpportunities.length <= OPPORTUNITIES_PER_PAGE) {
      return displayOpportunities;
    }
    
    const startIndex = Math.floor(scrollTop / itemHeight);
    const endIndex = Math.min(startIndex + OPPORTUNITIES_PER_PAGE + 2, displayOpportunities.length);
    
    return displayOpportunities.slice(Math.max(0, startIndex), endIndex);
  }, [displayOpportunities, scrollTop, loading, isMobile]);

  // Calculate skeleton items to show during scrolling
  const scrollSkeletons = useMemo(() => {
    const itemHeight = isMobile ? OPPORTUNITY_ITEM_HEIGHT_MOBILE : OPPORTUNITY_ITEM_HEIGHT;
    
    // Don't show scroll skeletons if we have few items or are loading
    if (!isScrolling || loading || displayOpportunities.length === 0 || displayOpportunities.length <= OPPORTUNITIES_PER_PAGE) {
      return [];
    }
    
    // Check if we're near the end - don't show skeletons if we're at the bottom
    const startIndex = Math.floor(scrollTop / itemHeight);
    const endIndex = Math.min(startIndex + OPPORTUNITIES_PER_PAGE + 2, displayOpportunities.length);
    const isNearEnd = endIndex >= displayOpportunities.length;
    
    if (isNearEnd) return [];
    
    // Show skeletons at the edges of visible content to simulate loading
    const skeletonCount = 2;
    return Array.from({ length: skeletonCount }, (_, index) => ({
      id: `scroll-skeleton-${scrollTop}-${index}`,
      isScrollSkeleton: true
    }));
  }, [isScrolling, loading, scrollTop, displayOpportunities.length, isMobile]);

  // Only calculate startIndex for virtualization if we have enough items
  const startIndex = displayOpportunities.length > OPPORTUNITIES_PER_PAGE ? 
    Math.floor(scrollTop / (isMobile ? OPPORTUNITY_ITEM_HEIGHT_MOBILE : OPPORTUNITY_ITEM_HEIGHT)) : 0;

  // Check if we can scroll more
  const canScrollMore = useMemo(() => {
    const itemHeight = isMobile ? OPPORTUNITY_ITEM_HEIGHT_MOBILE : OPPORTUNITY_ITEM_HEIGHT;
    
    if (loading || displayOpportunities.length === 0 || displayOpportunities.length <= OPPORTUNITIES_PER_PAGE) {
      return false;
    }
    const maxScroll = Math.max(0, (displayOpportunities.length * itemHeight) - OPPORTUNITY_CONTAINER_HEIGHT);
    return scrollTop < maxScroll - 10; // 10px threshold
  }, [scrollTop, displayOpportunities.length, loading, isMobile]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setIsRefreshing(false);
  };

  if (!loading && displayOpportunities.length === 0) {
    return (
      <div className={`space-y-4 w-full h-[calc(100vh-220px)] ${isMobile ? 'p-2' : 'p-4'}`}>
        <OpportunityFilters
          filters={filters}
          sort={sort}
          onFiltersChange={setFilters}
          onSortChange={setSort}
          onRefresh={handleRefresh}
          isRefreshing={isRefreshing}
          uniqueAssignees={uniqueAssignees}
          isOpen={isFilterOpen}
          onToggle={() => setIsFilterOpen(!isFilterOpen)}
        />
        
        <EmptyOpportunityState />
      </div>
    );
  }

  return (
    <div className={`space-y-4 w-full h-[calc(100vh-220px)] ${isMobile ? 'p-2' : 'p-4'}`}>
      <OpportunityFilters
        filters={filters}
        sort={sort}
        onFiltersChange={setFilters}
        onSortChange={setSort}
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
        uniqueAssignees={uniqueAssignees}
        isOpen={isFilterOpen}
        onToggle={() => setIsFilterOpen(!isFilterOpen)}
      />

      {/* Virtualized List */}
      <Card 
        shadow="lg" 
        padding="none" 
        className={`overflow-hidden ${!isMobile ? 'md:border-l-4 md:border-l-primary/30' : ''} h-[calc(100%-64px)] ${isMobile ? 'max-md:p-0 shadow-sm' : ''}`}
      >
        <div 
          className="overflow-auto scrollbar-thin animate-fade-in pb-12" 
          style={{ 
            height: OPPORTUNITY_CONTAINER_HEIGHT,
            // For small lists, allow natural height
            minHeight: displayOpportunities.length <= OPPORTUNITIES_PER_PAGE ? 'auto' : OPPORTUNITY_CONTAINER_HEIGHT
          }} 
          onScroll={handleScroll}
        >
          <div 
            style={{
              height: loading ? OPPORTUNITY_CONTAINER_HEIGHT : 
                     displayOpportunities.length <= OPPORTUNITIES_PER_PAGE ? 'auto' :
                     displayOpportunities.length * (isMobile ? OPPORTUNITY_ITEM_HEIGHT_MOBILE : OPPORTUNITY_ITEM_HEIGHT), 
              position: 'relative',
              minHeight: displayOpportunities.length <= OPPORTUNITIES_PER_PAGE ? 'auto' : undefined
            }}
          >
            <div 
              style={{
                transform: displayOpportunities.length <= OPPORTUNITIES_PER_PAGE ? 'none' :
                          `translateY(${loading ? 0 : startIndex * (isMobile ? OPPORTUNITY_ITEM_HEIGHT_MOBILE : OPPORTUNITY_ITEM_HEIGHT)}px)`,
              }}
              className={isMobile ? 'px-2 py-2' : 'px-4 py-3'}
            >
              {loading ? (
                <>
                  {Array.from({ length: OPPORTUNITIES_PER_PAGE + 2 }).map((_, index) => (
                    <SkeletonOpportunityItem key={`loading-skeleton-${index}`} />
                  ))}
                </>
              ) : (
                <>
                  {visibleOpportunities.map((opportunity) => (
                    <OpportunityItem
                      key={opportunity.id}
                      opportunity={opportunity}
                      onOpenDetails={onOpenDetails}
                      onEdit={onEdit}
                      onDelete={onDelete}
                    />
                  ))}
                  
                  {/* Show scrolling skeletons when user is actively scrolling */}
                  {isScrolling && scrollSkeletons.length > 0 && (
                    <div className="space-y-4 transition-all duration-200">
                      {scrollSkeletons.map((item) => (
                        <div key={item.id} className="animate-skeleton-scroll">
                          <SkeletonOpportunityItem />
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {/* Show scroll indicator only if we can scroll more */}
                  {isScrolling && canScrollMore && (
                    <ScrollIndicator />
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default OpportunitiesTable;