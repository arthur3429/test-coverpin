import React from 'react';
import { cn } from '@/lib/utils';
import Badge from './custom-badge';

interface StatusBadgeProps {
  status: 'new' | 'contacted' | 'qualified' | 'unqualified' | 'converted' | 'default';
}

const StatusBadge: React.FC<StatusBadgeProps> = ({
  status = 'default',
}) => {
    const getStatusVariant = (status: string) => {
    switch (status) {
      case 'new': return 'default';
      case 'contacted': return 'warning';
      case 'qualified': return 'success';
      case 'unqualified': return 'error';
      case 'converted': return 'success';
      default: return 'default';
    }
  };

  return (
    <Badge 
        variant={getStatusVariant(status)} 
        size="sm"
        className="font-semibold shadow-sm capitalize"
    >
        {status.replace('_', ' ')}
    </Badge>
  );
};

export default StatusBadge;