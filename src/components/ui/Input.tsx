import React, { InputHTMLAttributes, forwardRef } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className={`input-group ${className}`}>
        {label && <label className="input-label">{label}</label>}
        <input
          ref={ref}
          className={`input-field ${error ? 'error' : ''}`}
          {...props}
        />
        {error && <p className="input-error">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
export default Input;
