import React, { useState } from 'react';
import { FilterState, SortState, Lead } from '@/types';
import Input from '@/components/ui/custom-input';
import Select from '@/components/ui/custom-select';
import Button from '@/components/ui/custom-button';
import Card from '@/components/ui/custom-card';
import Badge from '@/components/ui/custom-badge';
import { ChevronDown, RefreshCcw, Search, X } from 'lucide-react';

interface FiltersProps {
  filters: FilterState;
  sort: SortState;
  onFiltersChange: (filters: FilterState) => void;
  onSortChange: (sort: SortState) => void;
  onRefresh: () => void;
  isRefreshing: boolean;
}

const Filters: React.FC<FiltersProps> = ({
  filters,
  sort,
  onFiltersChange,
  onSortChange,
  onRefresh,
  isRefreshing,
}) => {
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);

  const statusOptions = [
    { value: 'all', label: 'All Statuses' },
    { value: 'new', label: 'New' },
    { value: 'contacted', label: 'Contacted' },
    { value: 'qualified', label: 'Qualified' },
    { value: 'unqualified', label: 'Unqualified' },
    { value: 'converted', label: 'Converted' },
  ];

  const sourceOptions = [
    { value: 'all', label: 'All Sources' },
    { value: 'website', label: 'Website' },
    { value: 'referral', label: 'Referral' },
    { value: 'social_media', label: 'Social Media' },
    { value: 'email_campaign', label: 'Email Campaign' },
    { value: 'webinar', label: 'Webinar' },
    { value: 'conference', label: 'Conference' },
  ];

  const sortOptions = [
    { value: 'score-desc', label: 'Score (High to Low)' },
    { value: 'score-asc', label: 'Score (Low to High)' },
    { value: 'name-asc', label: 'Name (A to Z)' },
    { value: 'name-desc', label: 'Name (Z to A)' },
    { value: 'company-asc', label: 'Company (A to Z)' },
    { value: 'company-desc', label: 'Company (Z to A)' },
  ];

  const handleSortChange = (value: string) => {
    const [field, direction] = value.split('-');
    onSortChange({
      field: field as keyof Lead,
      direction: direction as 'asc' | 'desc',
    });
  };

  const getCurrentSortValue = () => {
    return `${sort.field}-${sort.direction}`;
  };

  const clearFilters = () => {
    onFiltersChange({
      search: '',
      status: 'all',
      source: 'all',
    });
    onSortChange({ field: 'score', direction: 'desc' });
  };

  const hasActiveFilters = filters.search || filters.status !== 'all' || filters.source !== 'all';
  const hasActiveSorting = sort.field !== 'score' || sort.direction !== 'desc';

  return (
    <Card 
      gradient 
      shadow="lg" 
      padding="lg"
      className="border-l-4 border-l-primary/30 space-y-6"
    >
      {/* Header with status indicators */}
      <div className="flex gap-3 max-md:flex-col md:items-center justify-between">
        <div className='flex items-center gap-3'>
          <div className="size-10 bg-orange-100 rounded-lg flex items-center justify-center">
            <Search className="size-5 text-orange-600" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">Filter & Sort</h2>
            <p className="text-xs text-muted-foreground">Find and organize your leads</p>
          </div>
        </div>
        <div className="flex items-center gap-3 max-md:flex-col">
          {(hasActiveFilters || hasActiveSorting) && (
            <Badge variant="default" className="max-md:mr-auto">
              <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
              Active Filters
            </Badge>
          )}
          
          {/* Action Buttons */}
          <div className="grid gap-2 grid-cols-2 max-md:-order-1 max-md:w-full">
            {(hasActiveFilters || hasActiveSorting) ? 
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-muted-foreground hover:text-error hover:bg-error/10 transition-all group max-md:w-full max-md:border max-md:h-10"
              >
                <X className="w-4 h-4 mr-1" />
                Clear
              </Button> : <div></div>
            }
            
            <Button
              variant="outline"
              size="sm"
              onClick={onRefresh}
              disabled={isRefreshing}
              className="relative overflow-hidden group border-primary/30 hover:border-primary/60 hover:bg-primary/5 shadow-sm"
            >
              <RefreshCcw className={`w-4 h-4 mr-2 transition-all duration-500 ${isRefreshing ? 'animate-spin' : 'group-hover:rotate-180'}`}  />
              <span className="font-medium">
                {isRefreshing ? 'Refreshing...' : 'Refresh'}
              </span>
              {isRefreshing && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent animate-shimmer"></div>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Search Bar - Always Visible */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Search</span>
          <div className="flex-1 h-px bg-gradient-to-r from-border to-transparent"></div>
        </div>
        
        <Input
          placeholder="Search leads by name, company, or email..."
          value={filters.search}
          onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
          className="transition-all duration-300 hover:shadow-lg focus:shadow-xl"
        />
      </div>

      {/* Advanced Filters Dropdown */}
      <div className="space-y-3">
        <button
          onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
          className="flex items-center justify-between w-full group"
        >
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Advanced Filters</span>
            <div className="flex-1 h-px bg-gradient-to-r from-border to-transparent"></div>
          </div>
          
          <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-muted/30 hover:bg-muted/50 transition-all">
            <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isAdvancedOpen ? 'rotate-180' : ''}`} />
            <span className="text-xs font-medium">{isAdvancedOpen ? 'Hide' : 'Show'}</span>
          </div>
        </button>

        {/* Advanced Filters Content */}
        <div className={`transition-all duration-300 overflow-hidden ${
          isAdvancedOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="pt-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Status</label>
                <Select
                  options={statusOptions}
                  value={filters.status}
                  onChange={(e) => onFiltersChange({ ...filters, status: e.target.value })}
                  placeholder="Filter by status"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Source</label>
                <Select
                  options={sourceOptions}
                  value={filters.source}
                  onChange={(e) => onFiltersChange({ ...filters, source: e.target.value })}
                  placeholder="Filter by source"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-border/50">
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
          </div>
        </div>
      </div>
    </Card>
  );
};

export default Filters;