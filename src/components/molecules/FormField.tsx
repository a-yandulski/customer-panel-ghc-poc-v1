import React from 'react';
import { Input } from '../atoms';
import type { InputProps } from '../../types';

export interface FormFieldProps extends Omit<InputProps, 'onChange' | 'onBlur'> {
  name: string;
  onChange: (name: string, value: string) => void;
  onBlur?: (name: string) => void;
  validationRules?: {
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
    custom?: (value: string) => string | null;
  };
}

/**
 * FormField Molecule Component
 * 
 * Composition: Label + Input + Helper/Error text + Icon
 * Handles validation logic and provides a unified form field experience
 * Includes real-time validation and accessible error reporting
 */
export const FormField: React.FC<FormFieldProps> = ({
  name,
  value,
  onChange,
  onBlur,
  validationRules,
  error: externalError,
  ...inputProps
}) => {
  const [internalError, setInternalError] = React.useState<string>('');
  const [touched, setTouched] = React.useState(false);

  const validate = React.useCallback((inputValue: string): string => {
    if (!validationRules) return '';

    // Required validation
    if (validationRules.required && !inputValue.trim()) {
      return `${inputProps.label || name} is required`;
    }

    // Min length validation
    if (validationRules.minLength && inputValue.length < validationRules.minLength) {
      return `${inputProps.label || name} must be at least ${validationRules.minLength} characters`;
    }

    // Max length validation
    if (validationRules.maxLength && inputValue.length > validationRules.maxLength) {
      return `${inputProps.label || name} must be no more than ${validationRules.maxLength} characters`;
    }

    // Pattern validation
    if (validationRules.pattern && inputValue && !validationRules.pattern.test(inputValue)) {
      return `${inputProps.label || name} format is invalid`;
    }

    // Custom validation
    if (validationRules.custom) {
      const customError = validationRules.custom(inputValue);
      if (customError) return customError;
    }

    return '';
  }, [validationRules, inputProps.label, name]);

  const handleChange = (newValue: string) => {
    onChange(name, newValue);
    
    // Real-time validation
    if (touched) {
      const validationError = validate(newValue);
      setInternalError(validationError);
    }
  };

  const handleBlur = () => {
    setTouched(true);
    const validationError = validate(value);
    setInternalError(validationError);
    
    if (onBlur) {
      onBlur(name);
    }
  };

  // Use external error if provided, otherwise use internal validation error
  const currentError = externalError || (touched ? internalError : '');
  const isSuccess = touched && !currentError && value.length > 0;

  return (
    <Input
      {...inputProps}
      value={value}
      onChange={handleChange}
      onBlur={handleBlur}
      error={currentError}
      success={isSuccess}
      required={validationRules?.required}
    />
  );
};

export default FormField;
