import React, { useState, useMemo } from 'react';
import { Lead, FilterState, SortState } from '@/types';
import { useLeads } from '@/hooks/useLeads';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import VirtualizedLeadsList from '@/components/VirtualizedLeadsList';
import LeadDetailPanel from '@/components/LeadDetailPanel';
import ConversionModal from '@/components/ConversionModal';
import OpportunitiesKanban from '@/components/opportunities-kanban/OpportunitiesKanban';
import OpportunitiesTable from '@/components/OpportunitiesTable';
import OpportunityDetailModal from '@/components/OpportunityDetailModal';
import OpportunityEditModal from '@/components/OpportunityEditModal';
import { LayoutGrid, Table } from 'lucide-react';
import Filters from '@/components/Filters';
import Card from '@/components/ui/custom-card';

const Index = () => {
  const {
    leads,
    opportunities,
    loading,
    error,
    updateLead,
    updateOpportunity,
    deleteOpportunity,
    convertLeadToOpportunity,
    filterAndSortLeads,
    refetch,
  } = useLeads();

  // Persistent filter and sort state
  const [filters, setFilters] = useLocalStorage<FilterState>('lead-filters', {
    search: '',
    status: 'all',
    source: 'all',
  });

  const [sort, setSort] = useLocalStorage<SortState>('lead-sort', {
    field: 'score',
    direction: 'desc',
  });

  // View preference for opportunities
  const [opportunitiesView, setOpportunitiesView] = useLocalStorage<'kanban' | 'table'>('opportunities-view', 'kanban');

  // UI state
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isDetailPanelOpen, setIsDetailPanelOpen] = useState(false);
  const [isConversionModalOpen, setIsConversionModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'leads' | 'opportunities'>('leads');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [openedOpportunity, setOpenedOpportunity] = useState<any | null>(null);
  const [editingOpportunity, setEditingOpportunity] = useState<any | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<any | null>(null);

  // Filter and sort leads
  const filteredLeads = useMemo(() => {
    return filterAndSortLeads(leads, filters, sort);
  }, [leads, filters, sort, filterAndSortLeads]);

  // Handlers
  const handleLeadClick = (lead: Lead) => {
    setSelectedLead(lead);
    setIsDetailPanelOpen(true);
  };

  const handleCloseDetailPanel = () => {
    setIsDetailPanelOpen(false);
    setSelectedLead(null);
  };

  const handleUpdateLead = async (leadId: string, updates: Partial<Lead>) => {
    await updateLead(leadId, updates);
    // Update the selected lead if it's currently open
    if (selectedLead?.id === leadId) {
      setSelectedLead(prev => prev ? { ...prev, ...updates } : null);
    }
  };

  const handleConvertLead = (lead: Lead) => {
    setSelectedLead(lead);
    setIsConversionModalOpen(true);
  };

  const handleCloseConversionModal = () => {
    setIsConversionModalOpen(false);
  };

  const handleConvertConfirm = async (lead: Lead, opportunityData: any) => {
    await convertLeadToOpportunity(lead, opportunityData);
    setIsConversionModalOpen(false);
    setIsDetailPanelOpen(false);
    setSelectedLead(null);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setIsRefreshing(false);
  };

  // Error state
  if (error && !loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-50 to-gray-100 flex items-center justify-center">
        <div className="max-w-md w-full mx-6">
          <Card className="text-center py-16 border-error/20 bg-gradient-to-b from-error/5 to-background shadow-lg">
            <div className="text-error mb-6">
              <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-foreground mb-3">Failed to load data</h3>
            <p className="text-muted-foreground mb-6 leading-relaxed">{error}</p>
            <button
              onClick={handleRefresh}
              className="bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-all duration-200 font-semibold shadow-md hover:shadow-lg transform hover:scale-105"
            >
              Try Again
            </button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-50 to-gray-100">
      {/* Header */}
      <header className="border-b border-border/60 bg-card/80 backdrop-blur-xl sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex md:items-center justify-between gap-4 max-md:flex-col">
            <div className="space-y-1">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                Mini Seller Console
              </h1>
              <p className="text-muted-foreground font-medium text-sm">Manage leads and opportunities with ease</p>
            </div>
            
            <div className="flex items-center gap-2">
              {/* Tabs */}
              <div className="grid space-x-1 bg-muted/60 p-1.5 rounded-lg w-fit shadow-sm border border-border/50 max-md:w-full grid-cols-2">
                <button
                  onClick={() => setActiveTab('leads')}
                  className={`px-5 py-2.5 text-sm font-semibold rounded-md transition-all duration-200 ${
                    activeTab === 'leads'
                      ? 'bg-orange-500 text-white shadow-md ring-1 ring-border/50 transform'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/40'
                  }`}
                >
                  Leads ({filteredLeads.length})
                </button>
                <button
                  onClick={() => setActiveTab('opportunities')}
                  className={`px-5 py-2.5 text-sm font-semibold rounded-md transition-all duration-200 ${
                    activeTab === 'opportunities'
                      ? 'bg-orange-500 text-white shadow-md ring-1 ring-border/50 transform'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/40'
                  }`}
                >
                  Opportunities ({opportunities.length})
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === 'leads' ? (
          <div className="space-y-8">
            {/* Filters */}
            <div className="animate-fade-in">
              <Filters
                filters={filters}
                sort={sort}
                onFiltersChange={setFilters}
                onSortChange={setSort}
                onRefresh={handleRefresh}
                isRefreshing={isRefreshing}
              />
            </div>

            {/* Leads List */}
            <div className="animate-fade-in">
              <VirtualizedLeadsList
                leads={filteredLeads}
                onLeadClick={handleLeadClick}
                loading={loading}
              />
            </div>
          </div>
        ) : (
            <div className="flex-1 h-full w-full bg-gradient-to-br from-slate-50 to-slate-100 relative rounded-xl border border-border/60 overflow-hidden animate-fade-in">
              <div className="flex flex-col">
                <div className="flex justify-between md:items-center gap-3 bg-white/90 backdrop-blur border-b px-4 py-3 max-md:flex-col">
                  <div className="flex items-center gap-3">
                    <div className="size-10 bg-orange-100 rounded-lg flex items-center justify-center">
                      <LayoutGrid className="size-5 text-orange-600" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-gray-900">Opportunities Kanban</h2>
                      <p className="text-xs text-muted-foreground">Local & virtualized, with per-column pagination</p>
                    </div>
                  </div>
                  <div>
                    <div className="grid items-center gap-2 bg-muted/60 p-1.5 rounded-lg shadow-sm border border-border/50 grid-cols-2">
                      <button
                        onClick={() => setOpportunitiesView('kanban')}
                        className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 flex items-center gap-2 max-md:justify-center ${
                          opportunitiesView === 'kanban'
                            ? 'bg-orange-500 text-white shadow-md'
                            : 'text-muted-foreground hover:text-foreground hover:bg-muted/40'
                        }`}
                      >
                        <LayoutGrid className="w-4 h-4" />
                        Kanban View
                      </button>
                      <button
                        onClick={() => setOpportunitiesView('table')}
                        className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 flex items-center gap-2 max-md:justify-center ${
                          opportunitiesView === 'table'
                            ? 'bg-orange-500 text-white shadow-md'
                            : 'text-muted-foreground hover:text-foreground hover:bg-muted/40'
                        }`}
                      >
                        <Table className="w-4 h-4" />
                        Table View
                      </button>
                    </div>
                  </div>
                </div>  
                <div className="flex items-center gap-2">
                {/* Opportunities Content */}
                {opportunitiesView === 'kanban' ? (
                  <OpportunitiesKanban opportunities={opportunities} />
                ) : (
                  <OpportunitiesTable
                    onOpenDetails={(opp) => setOpenedOpportunity(opp)}
                    onEdit={(opp) => setEditingOpportunity(opp)}
                    onDelete={(opp) => setConfirmDelete(opp)}
                  />
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Side Panel */}
      <LeadDetailPanel
        lead={selectedLead}
        isOpen={isDetailPanelOpen}
        onClose={handleCloseDetailPanel}
        onUpdate={handleUpdateLead}
        onConvert={handleConvertLead}
      />

      {/* Conversion Modal */}
      <ConversionModal
        lead={selectedLead}
        isOpen={isConversionModalOpen}
        onClose={handleCloseConversionModal}
        onConvert={handleConvertConfirm}
      />

      {/* Opportunity Details (shared for Kanban and Table) */}
      <OpportunityDetailModal
        isOpen={!!openedOpportunity}
        opportunity={openedOpportunity}
        onClose={() => setOpenedOpportunity(null)}
      />

      {/* Edit Opportunity (Table) */}
      <OpportunityEditModal
        isOpen={!!editingOpportunity}
        opportunity={editingOpportunity}
        onClose={() => setEditingOpportunity(null)}
        onSave={async (id, updates) => {
          await updateOpportunity(id, updates);
        }}
      />

      {/* Confirm Delete (Table) */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setConfirmDelete(null)} />
          <div className="relative z-10 w-full max-w-sm bg-card border rounded-lg p-6 shadow-xl">
            <h3 className="text-lg font-semibold mb-2">Delete opportunity?</h3>
            <p className="text-sm text-muted-foreground mb-6">This action cannot be undone.</p>
            <div className="flex justify-end gap-3">
              <button className="px-4 py-2 rounded-md hover:bg-muted/60" onClick={() => setConfirmDelete(null)}>Cancel</button>
              <button
                className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700"
                onClick={async () => {
                  const toDelete = confirmDelete;
                  setConfirmDelete(null);
                  if (!toDelete) return;
                  await deleteOpportunity(toDelete.id);
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
