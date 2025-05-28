import React from 'react';
import { 
  Checkbox as ChakraCheckbox, 
  CheckboxProps as ChakraCheckboxProps 
} from '@chakra-ui/react';

export interface CheckboxProps extends ChakraCheckboxProps {}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  (props, ref) => {
    return (
      <ChakraCheckbox
        ref={ref}
        colorScheme="blue"
        {...props}
      />
    );
  }
);

Checkbox.displayName = "Checkbox";

export { Checkbox }; 