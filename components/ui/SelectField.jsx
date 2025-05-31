import React, { useState, useEffect } from 'react';
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  Select,
  Box
} from '@chakra-ui/react';

/**
 * SelectField component with proper handling of select element validation
 * This fixes the React error related to nested select tags and value selection issues
 */
const SelectField = ({
  name,
  label,
  options = [],
  value,
  onChange,
  isRequired = false,
  error,
  placeholder = "Select an option",
  defaultValue,
  ...rest
}) => {
  // Initialize with value prop, default value, or empty string
  const initialValue = value || defaultValue || '';
  const [localValue, setLocalValue] = useState(initialValue);
  const [touched, setTouched] = useState(false);

  // Keep local state in sync with parent value
  useEffect(() => {
    if (value !== undefined) {
      setLocalValue(value);
      
      // If we have a value, consider the field touched
      if (value) {
        setTouched(true);
      }
    }
  }, [value]);
  
  // Notify parent component of initial value if using defaultValue
  useEffect(() => {
    if (defaultValue && onChange && !value) {
      onChange(defaultValue);
      setTouched(true);
    }
  }, [defaultValue, onChange, value]);

  const handleChange = (e) => {
    const newValue = e.target.value;
    setLocalValue(newValue);
    setTouched(true);
    
    console.log(`SelectField ${name} changed to:`, newValue);
    
    if (onChange) {
      // Call the parent's onChange with the selected value
      onChange(newValue);
    }
  };
  
  const handleFocus = () => {
    // When field is focused, don't show error yet
    setTouched(false);
  };
  
  const handleBlur = () => {
    // When field loses focus, mark as touched for validation
    setTouched(true);
  };

  // Only show error if field has been touched or if error is explicitly passed
  const isInvalid = touched && !!error;

  return (
    <FormControl isInvalid={isInvalid} isRequired={isRequired} mb={4}>
      {label && <FormLabel htmlFor={name}>{label}</FormLabel>}
      <Box position="relative">
        <Select
          id={name}
          name={name}
          value={localValue}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          {...rest}
        >
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </Select>
      </Box>
      {isInvalid && <FormErrorMessage>{error}</FormErrorMessage>}
    </FormControl>
  );
};

export default SelectField; 