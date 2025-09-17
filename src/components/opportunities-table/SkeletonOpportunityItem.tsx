import React from 'react';

const SkeletonOpportunityItem: React.FC = () => {
  return (
    <div className="mb-4 animate-pulse">
      <div className="p-6 bg-card rounded-lg border border-border/50 space-y-4">
        <div className="flex justify-between items-start">
          <div className="flex-1 space-y-3">
            {/* Title and ID */}
            <div className="space-y-2">
              <div className="h-3 bg-gray-200 rounded w-16"></div>
              <div className="h-5 bg-gray-300 rounded w-48"></div>
            </div>
            
            {/* Company */}
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-32"></div>
            </div>
          </div>
          
          {/* Priority badge placeholder */}
          <div className="h-6 bg-gray-200 rounded-full w-16"></div>
        </div>
        
        {/* Details grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-1">
              <div className="h-3 bg-gray-200 rounded w-12"></div>
              <div className="h-4 bg-gray-300 rounded w-20"></div>
            </div>
          ))}
        </div>
        
        {/* Actions */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-border/50">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-8 bg-gray-200 rounded w-16"></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export { SkeletonOpportunityItem };