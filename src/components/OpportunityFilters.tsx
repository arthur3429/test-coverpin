import React, { useState } from 'react';
import { OpportunityFilterState, OpportunitySortState, Opportunity } from '@/types';
import Input from '@/components/ui/custom-input';
import Select from '@/components/ui/custom-select';
import Button from '@/components/ui/custom-button';
import Card from '@/components/ui/custom-card';
import Badge from '@/components/ui/custom-badge';
import { Search, Filter, ChevronDown, X, RefreshCcw } from 'lucide-react';

interface OpportunityFiltersProps {
  filters: OpportunityFilterState;
  sort: OpportunitySortState;
  onFiltersChange: (filters: OpportunityFilterState) => void;
  onSortChange: (sort: OpportunitySortState) => void;
  onRefresh: () => void;
  isRefreshing: boolean;
  uniqueAssignees: string[];
  isOpen: boolean;
  onToggle: () => void;
}

const OpportunityFilters: React.FC<OpportunityFiltersProps> = ({
  filters,
  sort,
  onFiltersChange,
  onSortChange,
  onRefresh,
  isRefreshing,
  uniqueAssignees,
  isOpen,
  onToggle,
}) => {
  const stageOptions = [
    { value: 'all', label: 'All Stages' },
    { value: 'prospecting', label: 'Prospecting' },
    { value: 'qualification', label: 'Qualification' },
    { value: 'proposal', label: 'Proposal' },
    { value: 'negotiation', label: 'Negotiation' },
    { value: 'closed_won', label: 'Closed Won' },
    { value: 'closed_lost', label: 'Closed Lost' },
  ];

  const priorityOptions = [
    { value: 'all', label: 'All Priorities' },
    { value: 'high', label: 'High Priority' },
    { value: 'medium', label: 'Medium Priority' },
    { value: 'low', label: 'Low Priority' },
  ];

  const sortOptions = [
    { value: 'createdAt-desc', label: 'Created Date (Newest First)' },
    { value: 'createdAt-asc', label: 'Created Date (Oldest First)' },
    { value: 'name-asc', label: 'Name (A to Z)' },
    { value: 'name-desc', label: 'Name (Z to A)' },
    { value: 'accountName-asc', label: 'Account (A to Z)' },
    { value: 'accountName-desc', label: 'Account (Z to A)' },
    { value: 'amount-desc', label: 'Amount (High to Low)' },
    { value: 'amount-asc', label: 'Amount (Low to High)' },
    { value: 'probability-desc', label: 'Probability (High to Low)' },
    { value: 'probability-asc', label: 'Probability (Low to High)' },
    { value: 'expectedCloseDate-asc', label: 'Expected Close (Soonest)' },
    { value: 'expectedCloseDate-desc', label: 'Expected Close (Latest)' },
  ];

  const handleSortChange = (value: string) => {
    const [field, direction] = value.split('-');
    onSortChange({
      field: field as keyof Opportunity,
      direction: direction as 'asc' | 'desc',
    });
  };

  const getCurrentSortValue = () => {
    return `${sort.field}-${sort.direction}`;
  };

  const clearFilters = () => {
    onFiltersChange({
      search: '',
      stage: 'all',
      priority: 'all',
      assignee: 'all',
      amountMin: undefined,
      amountMax: undefined,
    });
    onSortChange({ field: 'createdAt', direction: 'desc' });
  };

  const hasActiveFilters = 
    filters.search || 
    filters.stage !== 'all' || 
    filters.priority !== 'all' ||
    filters.assignee !== 'all' ||
    filters.amountMin != null ||
    filters.amountMax != null;
  
  const hasActiveSorting = sort.field !== 'createdAt' || sort.direction !== 'desc';

  return (
    <div className="relative">
      {/* Filter Toggle Button */}
      <Button
        variant="outline"
        size="md"
        onClick={onToggle}
        className={`flex items-center gap-2 transition-all bg-white duration-200 h-[50px] ${
          isOpen 
            ? 'bg-primary text-primary-foreground shadow-md' 
            : 'border-primary/30 hover:border-primary/60 hover:bg-primary/5'
        }`}
      >
        <Filter className="w-4 h-4" />
        <span className="font-medium">Filters</span>
        {(hasActiveFilters || hasActiveSorting) && (
          <Badge variant="secondary" className="ml-1">
            <span className="w-2 h-2 bg-orange-500 rounded-full mr-1"></span>
            Active
          </Badge>
        )}
        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </Button>

      {/* Dropdown Content */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-40" onClick={onToggle} />
          
          {/* Dropdown Panel */}
          <div className="absolute top-full mt-2 left-0 z-50 w-96 animate-fade-in">
            <Card 
              gradient 
              shadow="lg" 
              padding="lg"
              className="border-l-4 border-l-primary/30 space-y-6"
            >
              {/* Header with Close Button */}
              <div className="flex items-center justify-between flex-wrap">
                <div className='flex items-center gap-3'>
                  <div className="size-10 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Search className="size-5 text-orange-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">Filter & Sort</h2>
                    <p className="text-xs text-muted-foreground">Find and organize opportunities</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onToggle}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                {(hasActiveFilters || hasActiveSorting) && (
                    <div className="w-full flex-1 mt-2">
                        <Badge variant="default">
                        <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
                        Active Filters
                        </Badge>
                    </div>
                  )}
              </div>
                  
              <div className="max-h-[52vh] overflow-auto scrollbar-thin">
                {/* Search Bar */}
                <div className="space-y-3">
                    <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Search</span>
                    <div className="flex-1 h-px bg-gradient-to-r from-border to-transparent"></div>
                    </div>
                    
                    <Input
                    placeholder="Search opportunities by name, account, or description..."
                    value={filters.search}
                    onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
                    className="transition-all duration-300 hover:shadow-lg focus:shadow-xl"
                    />
                </div>

                {/* Advanced Filters */}
                <div className="space-y-4 mt-2">
                    <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Advanced Filters</span>
                    <div className="flex-1 h-px bg-gradient-to-r from-border to-transparent"></div>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Stage</label>
                        <Select
                        options={stageOptions}
                        value={filters.stage}
                        onChange={(e) => onFiltersChange({ ...filters, stage: e.target.value })}
                        placeholder="Filter by stage"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Priority</label>
                        <Select
                        options={priorityOptions}
                        value={filters.priority}
                        onChange={(e) => onFiltersChange({ ...filters, priority: e.target.value })}
                        placeholder="Filter by priority"
                        />
                    </div>

                    {/* Amount Range */}
                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Amount Range</label>
                        <div className="grid grid-cols-2 gap-2">
                        <Input
                            type="number"
                            placeholder="Min amount"
                            value={filters.amountMin || ''}
                            onChange={(e) => onFiltersChange({ 
                            ...filters, 
                            amountMin: e.target.value ? Number(e.target.value) : undefined 
                            })}
                            className="text-sm"
                        />
                        <Input
                            type="number"
                            placeholder="Max amount"
                            value={filters.amountMax || ''}
                            onChange={(e) => onFiltersChange({ 
                            ...filters, 
                            amountMax: e.target.value ? Number(e.target.value) : undefined 
                            })}
                            className="text-sm"
                        />
                        </div>
                    </div>
                    </div>
                </div>

                {/* Sort Options */}
                <div className="pt-4 border-t border-border/50 mb-2">
                    <div className="space-y-2">
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Sort Order</label>
                    <div className="relative">
                        <Select
                        options={sortOptions}
                        value={getCurrentSortValue()}
                        onChange={(e) => handleSortChange(e.target.value)}
                        placeholder="Sort by"
                        />
                    </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between pt-4 border-t border-border/50">
                    {(hasActiveFilters || hasActiveSorting) && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearFilters}
                        className="text-muted-foreground hover:text-error hover:bg-error/10 transition-all group"
                    >
                        <X className="w-4 h-4 mr-1 group-hover:rotate-90 transition-transform" />
                        Clear All
                    </Button>
                    )}
                    
                    <div className={`flex gap-2 ${!(hasActiveFilters || hasActiveSorting) ? 'w-full justify-end' : ''}`}>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={onRefresh}
                        disabled={isRefreshing}
                        className="relative overflow-hidden group border-primary/30 hover:border-primary/60 hover:bg-primary/5 shadow-sm"
                    >
                        <RefreshCcw className={`w-4 h-4 mr-2 transition-all duration-500 ${isRefreshing ? 'animate-spin' : 'group-hover:rotate-180'}`} />
                        <span className="font-medium">
                          {isRefreshing ? 'Refreshing...' : 'Refresh'}
                        </span>
                    </Button>

                    <Button
                        variant="primary"
                        size="sm"
                        onClick={onToggle}
                        className="font-medium"
                    >
                        Apply Filters
                    </Button>
                    </div>
                </div>
              </div>
            </Card>
          </div>
        </>
      )}
    </div>
  );
};

export default OpportunityFilters;