import { useState, useEffect, useCallback, useMemo } from 'react';
import { Opportunity, OpportunityFilterState, OpportunitySortState } from '@/types';
import { useLocalStorage } from './useLocalStorage';

export const useOpportunities = () => {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);

  // Filter and sort state with localStorage persistence
  const [filters, setFilters] = useLocalStorage<OpportunityFilterState>('opportunity-filters', {
    search: '',
    stage: 'all',
    priority: 'all',
    assignee: 'all',
    amountMin: undefined,
    amountMax: undefined,
  });

  const [sort, setSort] = useLocalStorage<OpportunitySortState>('opportunity-sort', {
    field: 'createdAt',
    direction: 'desc',
  });

  // Load opportunities from localStorage
  const loadOpportunities = useCallback(() => {
    try {
      setLoading(true);
      setError(null);
      
      // Simulate network delay for UX consistency
      setTimeout(() => {
        const savedOpportunities = localStorage.getItem('opportunities');
        if (savedOpportunities) {
          try {
            const parsed = JSON.parse(savedOpportunities);
            setOpportunities(parsed);
          } catch {
            setOpportunities([]);
          }
        } else {
          setOpportunities([]);
        }
        setLoading(false);
      }, 500);
    } catch (err) {
      setError('Failed to load opportunities');
      setLoading(false);
    }
  }, []);

  // Load data on mount and set up listener for changes
  useEffect(() => {
    loadOpportunities();
    
    // Listen for localStorage changes to keep data in sync
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'opportunities') {
        loadOpportunities();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Custom event listener for same-page updates
    const handleOpportunityUpdate = () => {
      loadOpportunities();
    };
    
    window.addEventListener('opportunitiesUpdated', handleOpportunityUpdate);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('opportunitiesUpdated', handleOpportunityUpdate);
    };
  }, [loadOpportunities]);

  // Update opportunity
  const updateOpportunity = useCallback(async (id: string, updates: Partial<Opportunity>) => {
    const original = [...opportunities];
    setUpdating(true);
    try {
      // Optimistic update
      const next = opportunities.map((o) => (o.id === id ? { ...o, ...updates } : o));
      setOpportunities(next);
      
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 600));
      
      // Persist to localStorage
      localStorage.setItem('opportunities', JSON.stringify(next));
      
      // Dispatch custom event to notify other components
      window.dispatchEvent(new CustomEvent('opportunitiesUpdated'));
    } catch (err) {
      // Rollback on failure
      setOpportunities(original);
      setError('Failed to update opportunity');
      throw err;
    } finally {
      setUpdating(false);
    }
  }, [opportunities]);

  // Delete opportunity
  const deleteOpportunity = useCallback(async (id: string) => {
    const original = [...opportunities];
    setUpdating(true);
    try {
      // Optimistic delete
      const next = opportunities.filter((o) => o.id !== id);
      setOpportunities(next);
      
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      // Persist to localStorage
      localStorage.setItem('opportunities', JSON.stringify(next));
      
      // Dispatch custom event to notify other components
      window.dispatchEvent(new CustomEvent('opportunitiesUpdated'));
    } catch (err) {
      // Rollback on failure
      setOpportunities(original);
      setError('Failed to delete opportunity');
      throw err;
    } finally {
      setUpdating(false);
    }
  }, [opportunities]);

  // Filter and sort opportunities
  const filterAndSortOpportunities = useCallback((
    opportunities: Opportunity[],
    filters: OpportunityFilterState,
    sort: OpportunitySortState
  ) => {
    let filtered = [...opportunities];

    // Apply search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(
        opportunity =>
          opportunity.name.toLowerCase().includes(searchTerm) ||
          opportunity.accountName.toLowerCase().includes(searchTerm) ||
          opportunity.description?.toLowerCase().includes(searchTerm) ||
          opportunity.assignee?.toLowerCase().includes(searchTerm)
      );
    }

    // Apply stage filter
    if (filters.stage && filters.stage !== 'all') {
      filtered = filtered.filter(opportunity => opportunity.stage === filters.stage);
    }

    // Apply priority filter
    if (filters.priority && filters.priority !== 'all') {
      filtered = filtered.filter(opportunity => opportunity.priority === filters.priority);
    }

    // Apply assignee filter
    if (filters.assignee && filters.assignee !== 'all') {
      filtered = filtered.filter(opportunity => opportunity.assignee === filters.assignee);
    }

    // Apply amount range filters
    if (filters.amountMin != null) {
      filtered = filtered.filter(opportunity => 
        opportunity.amount != null && opportunity.amount >= filters.amountMin!
      );
    }
    if (filters.amountMax != null) {
      filtered = filtered.filter(opportunity => 
        opportunity.amount != null && opportunity.amount <= filters.amountMax!
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      const aVal = a[sort.field];
      const bVal = b[sort.field];
      
      // Handle null/undefined values
      if (aVal == null && bVal == null) return 0;
      if (aVal == null) return sort.direction === 'asc' ? -1 : 1;
      if (bVal == null) return sort.direction === 'asc' ? 1 : -1;
      
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sort.direction === 'asc' ? aVal - bVal : bVal - aVal;
      }
      
      if (aVal instanceof Date && bVal instanceof Date) {
        return sort.direction === 'asc' ? aVal.getTime() - bVal.getTime() : bVal.getTime() - aVal.getTime();
      }
      
      const aStr = String(aVal).toLowerCase();
      const bStr = String(bVal).toLowerCase();
      
      if (sort.direction === 'asc') {
        return aStr < bStr ? -1 : aStr > bStr ? 1 : 0;
      } else {
        return aStr > bStr ? -1 : aStr < bStr ? 1 : 0;
      }
    });

    return filtered;
  }, []);

  // Get unique values for filter options
  const getUniqueAssignees = useMemo(() => {
    const assignees = opportunities
      .map(opp => opp.assignee)
      .filter((assignee): assignee is string => Boolean(assignee))
      .filter((value, index, array) => array.indexOf(value) === index)
      .sort();
    
    return assignees;
  }, [opportunities]);

  // Memoized filtered and sorted opportunities
  const filteredOpportunities = useMemo(() => {
    return filterAndSortOpportunities(opportunities, filters, sort);
  }, [opportunities, filters, sort, filterAndSortOpportunities]);

  return {
    opportunities: filteredOpportunities,
    allOpportunities: opportunities,
    loading,
    error,
    updating,
    filters,
    sort,
    uniqueAssignees: getUniqueAssignees,
    setFilters,
    setSort,
    updateOpportunity,
    deleteOpportunity,
    refetch: loadOpportunities,
  };
};