import React from 'react';
import { Table, FileX } from 'lucide-react';
import Card from '@/components/ui/custom-card';

const EmptyOpportunityState: React.FC = () => {
  return (
    <Card className="text-center py-16 mx-auto" padding="lg">
      <div className="space-y-6">
        <div className="w-20 h-20 bg-gradient-to-br from-orange-100 to-orange-50 rounded-full flex items-center justify-center mx-auto shadow-lg">
          <Table className="w-10 h-10 text-orange-600" />
        </div>
        
        <div className="space-y-3">
          <h3 className="text-2xl font-bold text-foreground">No opportunities found</h3>
          <p className="text-muted-foreground text-lg max-w-md mx-auto leading-relaxed">
            Convert some leads to opportunities or adjust your filters to see results here.
          </p>
        </div>
        
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <FileX className="w-4 h-4" />
          <span>Try different filter criteria or create new opportunities</span>
        </div>
      </div>
    </Card>
  );
};

export { EmptyOpportunityState };