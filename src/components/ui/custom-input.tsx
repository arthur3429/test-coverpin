import React from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, startIcon, endIcon, className, type = 'text', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-foreground mb-2">
            {label}
          </label>
        )}
        <div className="relative group">
          {startIcon && (
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <div className="h-5 w-5 text-muted-foreground transition-colors group-focus-within:text-primary">
                {startIcon}
              </div>
            </div>
          )}
          <input
            type={type}
            ref={ref}
            className={cn(
              'block w-full rounded-xl border-2 border-border/60 bg-gradient-to-br from-input to-input/80 px-4 py-3 text-sm text-foreground placeholder-muted-foreground/70 transition-all duration-300 shadow-sm backdrop-blur-sm',
              'hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-0.5',
              'focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/15 focus:shadow-xl focus:shadow-primary/10 focus:from-card focus:to-card/90 focus:scale-[1.02]',
              'disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-border/60 disabled:hover:shadow-sm disabled:hover:translate-y-0',
              error && 'border-error/60 hover:border-error focus:border-error focus:ring-error/15 focus:shadow-error/10',
              startIcon && 'pl-11',
              endIcon && 'pr-11',
              className
            )}
            {...props}
          />
          {endIcon && (
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
              <div className="h-5 w-5 text-muted-foreground transition-colors group-focus-within:text-primary">
                {endIcon}
              </div>
            </div>
          )}
        </div>
        {error && (
          <p className="mt-2 text-sm text-error">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;