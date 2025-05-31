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

  // Keep local state in sync with parent value
  useEffect(() => {
    if (value !== undefined) {
      setLocalValue(value);
    }
  }, [value]);
  
  // Notify parent component of initial value if using defaultValue
  useEffect(() => {
    if (defaultValue && onChange && !value) {
      onChange(defaultValue);
    }
  }, [defaultValue, onChange, value]);

  const handleChange = (e) => {
    const newValue = e.target.value;
    setLocalValue(newValue);
    if (onChange) {
      // Call the parent's onChange with the selected value
      onChange(newValue);
    }
  };

  const isInvalid = !!error;

  return (
    <FormControl isInvalid={isInvalid} isRequired={isRequired} mb={4}>
      {label && <FormLabel htmlFor={name}>{label}</FormLabel>}
      <Box position="relative">
        <Select
          id={name}
          name={name}
          value={localValue}
          onChange={handleChange}
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