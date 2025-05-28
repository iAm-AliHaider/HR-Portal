"use client"

import React from 'react';
import { 
  Select as ChakraSelect,
  SelectProps as ChakraSelectProps,
  Text
} from '@chakra-ui/react';

export interface SelectProps extends ChakraSelectProps {}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ placeholder, children, ...props }, ref) => {
    return (
      <ChakraSelect
        ref={ref}
        variant="outline"
        size="md"
        focusBorderColor="blue.500"
        placeholder={placeholder}
        {...props}
      >
        {children}
      </ChakraSelect>
    );
  }
);

Select.displayName = "Select";

// For compatibility with shadcn naming
const SelectContent = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

const SelectItem = ({ value, children }: { value: string; children: React.ReactNode }) => {
  return <option value={value}>{children}</option>;
};

const SelectTrigger = React.forwardRef<HTMLSelectElement, SelectProps>(
  (props, ref) => {
    return <Select ref={ref} {...props} />;
  }
);

const SelectValue = ({ placeholder }: { placeholder?: string }) => {
  return <Text color="gray.500">{placeholder}</Text>;
};

SelectContent.displayName = "SelectContent";
SelectItem.displayName = "SelectItem"; 
SelectTrigger.displayName = "SelectTrigger";
SelectValue.displayName = "SelectValue";

export { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
}; 
