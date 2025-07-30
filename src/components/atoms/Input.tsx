import React from 'react';
import clsx from 'clsx';
import type { InputProps } from '../../types';

/**
 * Input Field Component
 * 
 * Implements the UI specification for input fields with proper states:
 * - Default: Neutral border (#d1d5db), white background, dark text (#111827)
 * - Hover: Slightly darker border (#9ca3af)
 * - Focused: 2px solid accent border (#38bdf8), shadow
 * - Success: Green border (#22c55e), success icon right
 * - Error: Red border (#ef4444), error icon right, error message below
 * - Disabled: Light neutral background (#f3f4f6), muted text (#9ca3af)
 * 
 * Labels & Helper Text: Label above field, 14px, 500 weight, dark text
 * Accessibility: Label programmatically associated, ARIA attributes, minimum contrast 4.5:1
 */
export const Input: React.FC<InputProps> = ({
  type = 'text',
  value,
  onChange,
  onBlur,
  placeholder,
  disabled = false,
  error,
  success = false,
  label,
  helperText,
  required = false,
  'aria-describedby': ariaDescribedBy,
  ...props
}) => {
  const inputId = React.useId();
  const errorId = `${inputId}-error`;
  const helperId = `${inputId}-helper`;
  
  const describedBy = [
    ariaDescribedBy,
    error ? errorId : null,
    helperText ? helperId : null,
  ].filter(Boolean).join(' ');

  const inputClasses = clsx(
    // Base styling
    'block w-full px-3 py-2 text-base',
    'border rounded-md shadow-sm',
    'placeholder-gray-400',
    'focus:outline-none focus:ring-2 focus:ring-offset-0',
    'transition-all duration-200 ease-in-out',
    
    // State-based styling
    {
      // Default state
      'border-gray-300 bg-white text-gray-900 focus:border-sky-400 focus:ring-sky-400': 
        !error && !success && !disabled,
      
      // Error state
      'border-red-400 bg-white text-gray-900 focus:border-red-400 focus:ring-red-400 pr-10': 
        error && !disabled,
      
      // Success state
      'border-green-500 bg-white text-gray-900 focus:border-green-500 focus:ring-green-500 pr-10': 
        success && !disabled,
      
      // Disabled state
      'border-gray-300 bg-gray-50 text-gray-400 cursor-not-allowed': disabled,
      
      // Hover state (only when not disabled)
      'hover:border-gray-400': !disabled && !error && !success,
    }
  );

  const labelClasses = clsx(
    'block text-sm font-medium text-gray-900 mb-1',
    {
      'text-gray-400': disabled,
    }
  );

  const helperClasses = clsx(
    'mt-1 text-xs',
    {
      'text-gray-600': !error,
      'text-red-600': error,
    }
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className={labelClasses}>
          {label}
          {required && <span className="text-red-500 ml-1" aria-label="required">*</span>}
        </label>
      )}
      
      <div className="relative">
        <input
          id={inputId}
          type={type}
          value={value}
          onChange={handleChange}
          onBlur={onBlur}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className={inputClasses}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={describedBy || undefined}
          {...props}
        />
        
        {/* Success Icon */}
        {success && !error && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <svg
              className="w-5 h-5 text-green-500"
              fill="currentColor"
              viewBox="0 0 20 20"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        )}
        
        {/* Error Icon */}
        {error && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <svg
              className="w-5 h-5 text-red-400"
              fill="currentColor"
              viewBox="0 0 20 20"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        )}
      </div>
      
      {/* Helper Text or Error Message */}
      {(helperText || error) && (
        <p
          id={error ? errorId : helperId}
          className={helperClasses}
          role={error ? 'alert' : undefined}
        >
          {error || helperText}
        </p>
      )}
    </div>
  );
};

export default Input;
