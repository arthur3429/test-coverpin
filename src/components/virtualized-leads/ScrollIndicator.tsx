import React from 'react';

export const ScrollIndicator: React.FC = () => {
  return (
    <div className="flex items-center justify-center py-3 opacity-60 animate-fade-in">
      <div className="flex items-center gap-3 text-muted-foreground bg-card/50 backdrop-blur-sm px-4 py-2 rounded-full border border-border/40">
        <div className="w-3 h-3 border-2 border-primary/40 border-t-primary rounded-full animate-spin"></div>
        <span className="text-xs font-semibold tracking-wide">Virtualizing content...</span>
      </div>
    </div>
  );
};