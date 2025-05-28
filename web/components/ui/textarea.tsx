import React from 'react';
import { Textarea as ChakraTextarea, TextareaProps as ChakraTextareaProps } from '@chakra-ui/react';

export interface TextareaProps extends ChakraTextareaProps {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (props, ref) => {
    return (
      <ChakraTextarea
        ref={ref}
        variant="outline"
        size="md"
        focusBorderColor="blue.500"
        {...props}
      />
    );
  }
);

Textarea.displayName = "Textarea";

export { Textarea }; 
