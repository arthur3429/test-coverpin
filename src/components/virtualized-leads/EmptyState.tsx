import React from 'react';
import Card from '@/components/ui/custom-card';
import { Search } from 'lucide-react';

export const EmptyState: React.FC = () => {
  return (
    <Card 
      gradient 
      shadow="lg" 
      padding="xl" 
      className="text-center animate-fade-in border-dashed border-2 border-muted-foreground/20"
    >
      <div className="space-y-4">
        <div className="mx-auto w-16 h-16 bg-gradient-to-br from-muted to-muted/50 rounded-full flex items-center justify-center">
          <Search className="h-8 w-8 text-muted-foreground" />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-foreground">No leads found</h3>
          <p className="text-muted-foreground max-w-md mx-auto leading-relaxed">
            It looks like there are no leads matching your current filters. Try adjusting your search criteria or refresh the data.
          </p>
        </div>
      </div>
    </Card>
  );
};