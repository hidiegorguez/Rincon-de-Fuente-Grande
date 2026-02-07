import { forwardRef } from 'react';
import type { ButtonHTMLAttributes, CSSProperties } from 'react';
import { Link } from 'react-router-dom';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  href?: string;
  isExternal?: boolean;
  fullWidth?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'border-2 border-primary-500 bg-primary-500 text-white hover:bg-primary-600 shadow-md hover:shadow-lg',
  secondary:
    'bg-accent-500 text-white hover:bg-accent-600 shadow-md hover:shadow-lg',
  outline:
    'border-2 border-primary-200 text-primary-200 hover:bg-primary-100 hover:text-white',
  ghost:
    'text-primary-500 hover:bg-primary-50',
};

const sizeStylesCSS: Record<ButtonSize, CSSProperties> = {
  sm: { padding: '0.5rem 1rem', fontSize: '0.875rem' },
  md: { padding: '0.75rem 1.5rem', fontSize: '1rem' },
  lg: { padding: '1rem 2rem', fontSize: '1.125rem' },
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      href,
      isExternal = false,
      fullWidth = false,
      className = '',
      disabled,
      style,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-semibold rounded-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

    const combinedStyles = `${baseStyles} ${variantStyles[variant]} ${
      fullWidth ? 'w-full' : ''
    } ${className}`;

    const combinedInlineStyles: CSSProperties = {
      ...sizeStylesCSS[size],
      ...style,
    };

    if (href) {
      if (isExternal) {
        return (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={combinedStyles}
            style={combinedInlineStyles}
          >
            {children}
          </a>
        );
      }
      return (
        <Link to={href} className={combinedStyles} style={combinedInlineStyles}>
          {children}
        </Link>
      );
    }

    return (
      <button
        ref={ref}
        className={combinedStyles}
        style={combinedInlineStyles}
        disabled={disabled}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
