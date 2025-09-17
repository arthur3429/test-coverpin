import React from 'react';
import { cn } from '@/lib/utils';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: SelectOption[];
  placeholder?: string;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, placeholder, className, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-foreground mb-2">
            {label}
          </label>
        )}
        <div className="relative group">
          <select
            ref={ref}
            className={cn(
              'block w-full appearance-none rounded-xl border-2 border-border/60 bg-gradient-to-br from-input to-input/80 px-4 py-3 text-sm text-foreground transition-all duration-300 shadow-sm cursor-pointer backdrop-blur-sm',
              'hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-0.5',
              'focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/15 focus:shadow-xl focus:shadow-primary/10 focus:from-card focus:to-card/90',
              'disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-border/60 disabled:hover:shadow-sm disabled:hover:translate-y-0',
              error && 'border-error/60 hover:border-error focus:border-error focus:ring-error/15 focus:shadow-error/10',
              className
            )}
            {...props}
          >
            {placeholder && (
              <option value="" disabled className="text-muted-foreground">
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option key={option.value} value={option.value} className="bg-card text-foreground">
                {option.label}
              </option>
            ))}
          </select>
          
          {/* Custom dropdown arrow */}
          <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
            <svg
              className="h-5 w-5 text-muted-foreground transition-colors group-focus-within:text-primary group-hover:text-primary/70"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>
        {error && (
          <p className="mt-2 text-sm text-error font-medium">{error}</p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';

export default Select;