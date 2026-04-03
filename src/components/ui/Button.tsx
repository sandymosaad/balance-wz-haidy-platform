'use client';

import * as React from 'react';
import {Loader2} from 'lucide-react';
import {cva, type VariantProps} from 'class-variance-authority';
import {cn} from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-full font-medium transition-all duration-calm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-art-gold disabled:pointer-events-none disabled:opacity-60',
  {
    variants: {
      variant: {
        primary: 'bg-art-terracotta text-art-cream hover:bg-art-gold hover:text-art-charcoal',
        secondary: 'bg-art-sage text-art-taupe hover:bg-art-green',
        outline: 'border border-art-terracotta bg-transparent text-art-terracotta hover:bg-art-beige',
        ghost: 'bg-transparent text-art-taupe hover:bg-art-beige'
      },
      size: {
        sm: 'h-9 px-4 text-sm',
        md: 'h-11 px-6 text-sm',
        lg: 'h-12 px-8 text-base'
      }
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md'
    }
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({className, variant, size, asChild = false, loading = false, children, ...props}, ref) => {
    const styles = cn(buttonVariants({variant, size, className}));

    if (asChild && React.isValidElement(children)) {
      const child = children as React.ReactElement<{className?: string}>;
      return React.cloneElement(child, {
        ...props,
        className: cn(styles, child.props.className)
      });
    }

    return (
      <button
        className={styles}
        ref={ref}
        aria-busy={loading}
        disabled={props.disabled || loading}
        {...props}
      >
        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden /> : null}
        {children}
      </button>
    );
  }
);
Button.displayName = 'Button';
