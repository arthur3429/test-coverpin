import React from 'react';
import { cn } from '@/lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  hover?: boolean;
  gradient?: boolean;
  border?: boolean;
}

const Card: React.FC<CardProps> = ({
  children,
  className,
  padding = 'md',
  shadow = 'md',
  hover = false,
  gradient = false,
  border = true,
}) => {
  const paddingStyles = {
    none: '',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
    xl: 'p-8',
  };

  const shadowStyles = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow-md hover:shadow-lg',
    lg: 'shadow-lg hover:shadow-xl',
    xl: 'shadow-xl hover:shadow-2xl',
  };

  return (
    <div
      className={cn(
        'rounded-xl text-card-foreground transition-all duration-200',
        gradient
          ? 'bg-gradient-to-br from-card to-card/80'
          : 'bg-card',
        border && 'border border-border/60',
        paddingStyles[padding],
        shadowStyles[shadow],
        hover && 'cursor-pointer',
        className
      )}
    >
      {children}
    </div>
  );
};

export default Card;