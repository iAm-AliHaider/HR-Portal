import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

export type FieldType = 
  | 'text' 
  | 'email' 
  | 'password' 
  | 'number' 
  | 'textarea' 
  | 'select' 
  | 'checkbox'
  | 'radio'
  | 'date'
  | 'file'
  | 'custom';

export interface FormFieldBase {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  disabled?: boolean;
  hint?: string;
  defaultValue?: any;
  placeholder?: string;
  className?: string;
  validation?: {
    pattern?: RegExp;
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
    customValidator?: (value: any) => string | null;
  };
}

export interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

export interface TextFieldProps extends FormFieldBase {
  type: 'text' | 'email' | 'password' | 'number';
}

export interface TextareaFieldProps extends FormFieldBase {
  type: 'textarea';
  rows?: number;
}

export interface SelectFieldProps extends FormFieldBase {
  type: 'select';
  options: SelectOption[];
  multiple?: boolean;
}

export interface CheckboxFieldProps extends FormFieldBase {
  type: 'checkbox';
  checkboxLabel?: string;
}

export interface RadioFieldProps extends FormFieldBase {
  type: 'radio';
  options: SelectOption[];
  inline?: boolean;
}

export interface DateFieldProps extends FormFieldBase {
  type: 'date';
}

export interface FileFieldProps extends FormFieldBase {
  type: 'file';
  accept?: string;
  multiple?: boolean;
}

export interface CustomFieldProps extends FormFieldBase {
  type: 'custom';
  render: (props: {
    value: any;
    onChange: (value: any) => void;
    error: string | null;
    name: string;
    id: string;
  }) => React.ReactNode;
}

export type FormField = 
  | TextFieldProps 
  | TextareaFieldProps 
  | SelectFieldProps 
  | CheckboxFieldProps
  | RadioFieldProps
  | DateFieldProps
  | FileFieldProps
  | CustomFieldProps;

interface EnhancedFormProps {
  title?: string;
  description?: string;
  fields: FormField[];
  onSubmit: (values: Record<string, any>) => void;
  onChange?: (values: Record<string, any>) => void;
  submitLabel?: string;
  cancelLabel?: string;
  onCancel?: () => void;
  isLoading?: boolean;
  initialValues?: Record<string, any>;
  className?: string;
  layout?: 'vertical' | 'horizontal';
  submitButtonProps?: React.ButtonHTMLAttributes<HTMLButtonElement>;
}

export const EnhancedForm: React.FC<EnhancedFormProps> = ({
  title,
  description,
  fields,
  onSubmit,
  onChange,
  submitLabel = 'Save',
  cancelLabel = 'Cancel',
  onCancel,
  isLoading = false,
  initialValues = {},
  className,
  layout = 'vertical',
  submitButtonProps,
}) => {
  const [values, setValues] = useState<Record<string, any>>(initialValues);
  const [errors, setErrors] = useState<Record<string, string | null>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Initialize form values from initialValues prop
  useEffect(() => {
    const initialFormValues: Record<string, any> = {};
    
    fields.forEach(field => {
      // Use initialValues if provided, otherwise use field defaultValue, or empty string/false
      if (initialValues && initialValues[field.name] !== undefined) {
        initialFormValues[field.name] = initialValues[field.name];
      } else if (field.defaultValue !== undefined) {
        initialFormValues[field.name] = field.defaultValue;
      } else {
        initialFormValues[field.name] = field.type === 'checkbox' ? false : '';
      }
    });
    
    setValues(initialFormValues);
  }, [fields, initialValues]);

  const validateField = (field: FormField, value: any): string | null => {
    if (field.required && (value === '' || value === null || value === undefined)) {
      return `${field.label} is required`;
    }

    if (!field.validation) return null;

    const { validation } = field;

    if (validation.pattern && typeof value === 'string' && !validation.pattern.test(value)) {
      return `${field.label} doesn't match the required pattern`;
    }

    if (validation.minLength && typeof value === 'string' && value.length < validation.minLength) {
      return `${field.label} should be at least ${validation.minLength} characters`;
    }

    if (validation.maxLength && typeof value === 'string' && value.length > validation.maxLength) {
      return `${field.label} should be no more than ${validation.maxLength} characters`;
    }

    if (validation.min !== undefined && typeof value === 'number' && value < validation.min) {
      return `${field.label} should be at least ${validation.min}`;
    }

    if (validation.max !== undefined && typeof value === 'number' && value > validation.max) {
      return `${field.label} should be no more than ${validation.max}`;
    }

    if (validation.customValidator) {
      return validation.customValidator(value);
    }

    return null;
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string | null> = {};
    let isValid = true;

    fields.forEach(field => {
      const error = validateField(field, values[field.name]);
      newErrors[field.name] = error;
      if (error) isValid = false;
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (name: string, value: any) => {
    setValues(prev => {
      const newValues = { ...prev, [name]: value };
      if (onChange) onChange(newValues);
      return newValues;
    });

    if (touched[name]) {
      const field = fields.find(f => f.name === name);
      if (field) {
        const error = validateField(field, value);
        setErrors(prev => ({ ...prev, [name]: error }));
      }
    }
  };

  const handleBlur = (name: string) => {
    setTouched(prev => ({ ...prev, [name]: true }));
    
    const field = fields.find(f => f.name === name);
    if (field) {
      const error = validateField(field, values[field.name]);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mark all fields as touched
    const newTouched: Record<string, boolean> = {};
    fields.forEach(field => {
      newTouched[field.name] = true;
    });
    setTouched(newTouched);

    // Validate all fields
    if (validateForm()) {
      onSubmit(values);
    }
  };

  const renderField = (field: FormField) => {
    const error = errors[field.name];
    const isInvalid = error !== null && error !== undefined;
    
    const baseInputClasses = cn(
      'block w-full rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm',
      isInvalid ? 'border-red-300' : 'border-gray-300',
      field.disabled ? 'bg-gray-100 cursor-not-allowed' : '',
      field.className
    );

    switch (field.type) {
      case 'text':
      case 'email':
      case 'password':
      case 'number':
        return (
          <input
            type={field.type}
            id={field.name}
            name={field.name}
            value={values[field.name] || ''}
            onChange={e => handleChange(field.name, field.type === 'number' ? (e.target.value === '' ? '' : Number(e.target.value)) : e.target.value)}
            onBlur={() => handleBlur(field.name)}
            required={field.required}
            disabled={field.disabled}
            placeholder={field.placeholder}
            className={baseInputClasses}
          />
        );
        
      case 'textarea':
        return (
          <textarea
            id={field.name}
            name={field.name}
            rows={(field as TextareaFieldProps).rows || 3}
            value={values[field.name] || ''}
            onChange={e => handleChange(field.name, e.target.value)}
            onBlur={() => handleBlur(field.name)}
            required={field.required}
            disabled={field.disabled}
            placeholder={field.placeholder}
            className={baseInputClasses}
          />
        );
        
      case 'select':
        const selectField = field as SelectFieldProps;
        return (
          <select
            id={field.name}
            name={field.name}
            value={values[field.name] || ''}
            onChange={e => handleChange(field.name, e.target.value)}
            onBlur={() => handleBlur(field.name)}
            required={field.required}
            disabled={field.disabled}
            multiple={selectField.multiple}
            className={baseInputClasses}
          >
            {!field.required && (
              <option value="">Select {field.label}</option>
            )}
            {selectField.options.map(option => (
              <option key={option.value} value={option.value} disabled={option.disabled}>
                {option.label}
              </option>
            ))}
          </select>
        );
        
      case 'checkbox':
        const checkboxField = field as CheckboxFieldProps;
        return (
          <div className="flex items-center">
            <input
              type="checkbox"
              id={field.name}
              name={field.name}
              checked={values[field.name] || false}
              onChange={e => handleChange(field.name, e.target.checked)}
              onBlur={() => handleBlur(field.name)}
              required={field.required}
              disabled={field.disabled}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            {checkboxField.checkboxLabel && (
              <label htmlFor={field.name} className="ml-2 block text-sm text-gray-900">
                {checkboxField.checkboxLabel}
              </label>
            )}
          </div>
        );
        
      case 'radio':
        const radioField = field as RadioFieldProps;
        return (
          <div className={cn(radioField.inline ? 'flex space-x-4' : 'space-y-2')}>
            {radioField.options.map(option => (
              <div key={option.value} className="flex items-center">
                <input
                  type="radio"
                  id={`${field.name}-${option.value}`}
                  name={field.name}
                  value={option.value}
                  checked={values[field.name] === option.value}
                  onChange={() => handleChange(field.name, option.value)}
                  onBlur={() => handleBlur(field.name)}
                  required={field.required}
                  disabled={field.disabled || option.disabled}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                />
                <label htmlFor={`${field.name}-${option.value}`} className="ml-2 block text-sm text-gray-900">
                  {option.label}
                </label>
              </div>
            ))}
          </div>
        );
        
      case 'date':
        return (
          <input
            type="date"
            id={field.name}
            name={field.name}
            value={values[field.name] || ''}
            onChange={e => handleChange(field.name, e.target.value)}
            onBlur={() => handleBlur(field.name)}
            required={field.required}
            disabled={field.disabled}
            className={baseInputClasses}
          />
        );
        
      case 'file':
        const fileField = field as FileFieldProps;
        return (
          <input
            type="file"
            id={field.name}
            name={field.name}
            onChange={e => handleChange(field.name, e.target.files)}
            onBlur={() => handleBlur(field.name)}
            required={field.required}
            disabled={field.disabled}
            accept={fileField.accept}
            multiple={fileField.multiple}
            className={cn(
              'block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100',
              field.className
            )}
          />
        );
        
      case 'custom':
        const customField = field as CustomFieldProps;
        return customField.render({
          value: values[field.name],
          onChange: (value) => handleChange(field.name, value),
          error: errors[field.name],
          name: field.name,
          id: field.name,
        });
        
      default:
        return null;
    }
  };

  return (
    <div className={cn('bg-white rounded-xl shadow-sm', className)}>
      <div className="p-6">
        {title && <h2 className="text-xl font-bold mb-2">{title}</h2>}
        {description && <p className="text-gray-500 mb-6">{description}</p>}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {fields.map((field) => {
            const hasError = touched[field.name] && errors[field.name];
            
            return (
              <div 
                key={field.name} 
                className={cn(
                  layout === 'horizontal' ? 'sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start' : '', 
                  'space-y-1'
                )}
              >
                {field.type !== 'checkbox' ? (
                  <label 
                    htmlFor={field.name} 
                    className={cn(
                      "block text-sm font-medium text-gray-700",
                      layout === 'horizontal' ? 'sm:mt-px sm:pt-2' : ''
                    )}
                  >
                    {field.label}
                    {field.required && <span className="text-red-500">*</span>}
                  </label>
                ) : null}
                
                <div className={layout === 'horizontal' ? 'sm:col-span-2' : ''}>
                  {renderField(field)}
                  {field.hint && <p className="mt-1 text-xs text-gray-500">{field.hint}</p>}
                  {hasError && <p className="mt-1 text-xs text-red-600">{errors[field.name]}</p>}
                </div>
              </div>
            );
          })}
          
          <div className={cn(
            'pt-4',
            layout === 'horizontal' ? 'sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start' : '',
            onCancel ? 'flex items-center justify-end space-x-3' : ''
          )}>
            {layout === 'horizontal' && <div></div>}
            <div className={layout === 'horizontal' ? 'sm:col-span-2 flex justify-start space-x-3' : ''}>
              {onCancel && (
                <button
                  type="button"
                  disabled={isLoading}
                  onClick={onCancel}
                  className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  {cancelLabel}
                </button>
              )}
              <button
                type="submit"
                disabled={isLoading}
                className={cn(
                  'inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500',
                  isLoading ? 'opacity-50 cursor-not-allowed' : '',
                  !onCancel ? 'w-full' : ''
                )}
                {...submitButtonProps}
              >
                {isLoading ? (
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : null}
                {submitLabel}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EnhancedForm; 