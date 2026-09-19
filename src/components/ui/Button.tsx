import React, { ButtonHTMLAttributes } from 'react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost';
  size?: 'sm' | 'md' | 'full';
  isLoading?: boolean;
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  
  let classes = 'btn';
  
  if (variant === 'primary') classes += ' btn-primary';
  if (variant === 'ghost') classes += ' btn-ghost';
  
  if (size === 'sm') classes += ' btn-sm';
  if (size === 'full') classes += ' btn-full';
  
  if (className) classes += ` ${className}`;

  return (
    <button className={classes} disabled={disabled || isLoading} {...props}>
      {isLoading ? (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
          PROCESSING...
        </span>
      ) : (
        children
      )}
    </button>
  );
}
