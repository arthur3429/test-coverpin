import React from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';

interface ScrollIndicatorProps {
  scrollDirection?: 'up' | 'down';
}

const ScrollIndicator: React.FC<ScrollIndicatorProps> = ({ scrollDirection = 'down' }) => {
  return (
    <div className="flex items-center justify-center py-4">
      <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm animate-pulse">
        {scrollDirection === 'up' ? (
          <ArrowUp className="w-4 h-4 animate-bounce" />
        ) : (
          <ArrowDown className="w-4 h-4 animate-bounce" />
        )}
        <span className="font-medium">
          {scrollDirection === 'up' ? 'Scroll up for more' : 'Scroll down for more'}
        </span>
      </div>
    </div>
  );
};

export { ScrollIndicator };