import { useState, useEffect, useCallback } from 'react';
import { Lead, FilterState, SortState, Opportunity } from '@/types';

export const useLeads = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);
  const [converting, setConverting] = useState(false);

  // Load leads from JSON file
  const loadLeads = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Simulate network latency
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const response = await fetch('/leads-data.json');
      if (!response.ok) {
        throw new Error('Failed to load leads data');
      }
      
      const data = await response.json();
      setLeads(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  // Load data on mount
  useEffect(() => {
    loadLeads();
    
    // Load opportunities from localStorage
    const savedOpportunities = localStorage.getItem('opportunities');
    if (savedOpportunities) {
      try {
        setOpportunities(JSON.parse(savedOpportunities));
      } catch {
        // Invalid JSON, ignore
      }
    }
  }, [loadLeads]);

  const updateLead = useCallback(async (id: string, updates: Partial<Lead>) => {
    const originalLeads = [...leads];
    setUpdating(true);
    try {
      // Optimistic update
      setLeads(prev => prev.map(lead => 
        lead.id === id ? { ...lead, ...updates } : lead
      ));

      // Simulate API call with potential failure
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          // Simulate 10% failure rate
          if (Math.random() < 0.1) {
            reject(new Error('Network error occurred'));
          } else {
            resolve(undefined);
          }
        }, 800);
      });
    } catch (err) {
      // Rollback on failure
      setLeads(originalLeads);
      setError(err instanceof Error ? err.message : 'Failed to update lead');
      throw err;
    } finally {
      setUpdating(false);
    }
  }, [leads]);

  const convertLeadToOpportunity = useCallback(async (lead: Lead, opportunityData: Omit<Opportunity, 'id'>) => {
    const originalLeads = [...leads];
    const originalOpportunities = [...opportunities];
    setConverting(true);
    try {
      // Optimistic update
      const newOpportunity: Opportunity = {
        ...opportunityData,
        id: `opp-${Date.now()}`,
        createdAt: new Date().toISOString(),
        leadId: lead.id,
      } as Opportunity;
      
      setOpportunities(prev => [...prev, newOpportunity]);
      setLeads(prev => prev.filter(l => l.id !== lead.id));

      // Simulate API call with potential failure
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          // Simulate 5% failure rate
          if (Math.random() < 0.05) {
            reject(new Error('Conversion failed - please try again'));
          } else {
            resolve(undefined);
          }
        }, 1200);
      });
      
      // Save to localStorage on success
      localStorage.setItem('opportunities', JSON.stringify([...opportunities, newOpportunity]));
      
      // Dispatch custom event to notify other components
      window.dispatchEvent(new CustomEvent('opportunitiesUpdated'));
    } catch (err) {
      // Rollback on failure
      setLeads(originalLeads);
      setOpportunities(originalOpportunities);
      setError(err instanceof Error ? err.message : 'Failed to convert lead');
      throw err;
    } finally {
      setConverting(false);
    }
  }, [leads, opportunities]);

  const updateOpportunity = useCallback(
    async (id: string, updates: Partial<Opportunity>) => {
      const original = [...opportunities];
      try {
        // Optimistic update
        const next = opportunities.map((o) => (o.id === id ? { ...o, ...updates } : o));
        setOpportunities(next);
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 600));
        // Persist
        localStorage.setItem('opportunities', JSON.stringify(next));
        // Dispatch custom event to notify other components
        window.dispatchEvent(new CustomEvent('opportunitiesUpdated'));
      } catch (err) {
        // Rollback
        setOpportunities(original);
        setError(err instanceof Error ? err.message : 'Failed to update opportunity');
        throw err;
      }
    },
    [opportunities]
  );

  const deleteOpportunity = useCallback(
    async (id: string) => {
      const original = [...opportunities];
      try {
        // Optimistic delete
        const next = opportunities.filter((o) => o.id !== id);
        setOpportunities(next);
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 500));
        // Persist
        localStorage.setItem('opportunities', JSON.stringify(next));
        // Dispatch custom event to notify other components
        window.dispatchEvent(new CustomEvent('opportunitiesUpdated'));
      } catch (err) {
        setOpportunities(original);
        setError(err instanceof Error ? err.message : 'Failed to delete opportunity');
        throw err;
      }
    },
    [opportunities]
  );

  // Filter and sort leads
  const filterAndSortLeads = useCallback((
    leads: Lead[],
    filters: FilterState,
    sort: SortState
  ) => {
    let filtered = [...leads];

    // Apply search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(
        lead =>
          lead.name.toLowerCase().includes(searchTerm) ||
          lead.company.toLowerCase().includes(searchTerm)
      );
    }

    // Apply status filter
    if (filters.status && filters.status !== 'all') {
      filtered = filtered.filter(lead => lead.status === filters.status);
    }

    // Apply source filter
    if (filters.source && filters.source !== 'all') {
      filtered = filtered.filter(lead => lead.source === filters.source);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      const aVal = a[sort.field];
      const bVal = b[sort.field];
      
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sort.direction === 'asc' ? aVal - bVal : bVal - aVal;
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

  return {
    leads,
    opportunities,
    loading,
    error,
    updating,
    converting,
    updateLead,
    updateOpportunity,
    deleteOpportunity,
    convertLeadToOpportunity,
    filterAndSortLeads,
    refetch: loadLeads,
  };
};