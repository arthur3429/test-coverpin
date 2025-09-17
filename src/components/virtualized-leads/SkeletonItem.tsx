import React from 'react';
import Card from '@/components/ui/custom-card';
import { Skeleton } from '@/components/ui/skeleton';

export const SkeletonItem: React.FC = () => (
  <Card 
    padding="md" 
    shadow="sm" 
    gradient 
    className="mb-4 animate-pulse"
  >
    <div className="flex items-center gap-4">
      {/* Avatar skeleton with shimmer */}
      <div className="relative">
        <Skeleton className="h-10 w-10 rounded-full bg-gradient-to-r from-muted via-muted/50 to-muted animate-shimmer" />
      </div>
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-32 bg-gradient-to-r from-muted via-muted/50 to-muted animate-shimmer" />
        <Skeleton className="h-3 w-24 bg-gradient-to-r from-muted via-muted/50 to-muted animate-shimmer" />
        <Skeleton className="h-3 w-40 bg-gradient-to-r from-muted via-muted/50 to-muted animate-shimmer" />
      </div>
      <div className="flex items-center gap-3">
        <Skeleton className="h-6 w-20 rounded-full bg-gradient-to-r from-muted via-muted/50 to-muted animate-shimmer" />
        <div className="w-10 text-right space-y-1">
          <Skeleton className="h-5 w-8 bg-gradient-to-r from-muted via-muted/50 to-muted animate-shimmer" />
          <Skeleton className="h-3 w-6 bg-gradient-to-r from-muted via-muted/50 to-muted animate-shimmer" />
        </div>
        <Skeleton className="h-4 w-4 bg-gradient-to-r from-muted via-muted/50 to-muted animate-shimmer" />
      </div>
    </div>
  </Card>
);