import React from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  className?: string;
  pulse?: boolean;
}

const Badge: React.FC<BadgeProps> = ({
  variant = 'default',
  size = 'md',
  children,
  className,
  pulse = false,
}) => {
  const baseStyles = 'inline-flex items-center font-semibold rounded-full transition-all duration-200 border';
  
  const variants = {
    default: 'bg-gradient-to-r from-primary/10 to-primary/5 text-primary border-primary/20 hover:from-primary/15 hover:to-primary/10 hover:border-primary/30',
    success: 'bg-gradient-to-r from-success/10 to-success/5 text-success border-success/20 hover:from-success/15 hover:to-success/10 hover:border-success/30',
    warning: 'bg-gradient-to-r from-warning/10 to-warning/5 text-warning border-warning/20 hover:from-warning/15 hover:to-warning/10 hover:border-warning/30',
    error: 'bg-gradient-to-r from-error/10 to-error/5 text-error border-error/20 hover:from-error/15 hover:to-error/10 hover:border-error/30',
    secondary: 'bg-gradient-to-r from-secondary to-secondary/80 text-secondary-foreground border-secondary/30 hover:from-secondary/90 hover:to-secondary/70',
  };

  const sizes = {
    sm: 'px-2.5 py-1 text-xs',
    md: 'px-3 py-1.5 text-xs',
    lg: 'px-4 py-2 text-sm',
  };

  return (
    <span
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        pulse && 'animate-pulse',
        'shadow-sm',
        className
      )}
    >
      {children}
    </span>
  );
};

export default Badge;