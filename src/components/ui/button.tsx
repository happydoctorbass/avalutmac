'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'default' | 'secondary' | 'destructive' | 'ghost';
  size?: 'default' | 'sm' | 'icon';
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background',
          'disabled:pointer-events-none disabled:opacity-50',
          variant === 'default' && 'bg-primary text-primary-foreground hover:opacity-90',
          variant === 'secondary' && 'bg-secondary text-secondary-foreground hover:opacity-90',
          variant === 'destructive' && 'bg-destructive text-destructive-foreground hover:opacity-90',
          variant === 'ghost' && 'hover:bg-muted hover:text-foreground',
          size === 'default' && 'h-10 px-4 py-2',
          size === 'sm' && 'h-9 px-3',
          size === 'icon' && 'h-10 w-10',
          className,
        )}
        {...props}
      />
    );
  },
);
Button.displayName = 'Button';

