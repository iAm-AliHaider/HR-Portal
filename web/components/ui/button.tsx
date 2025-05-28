import React from 'react';
import { Button as ChakraButton, ButtonProps as ChakraButtonProps } from '@chakra-ui/react';

export interface ButtonProps extends ChakraButtonProps {
  variant?: 'solid' | 'outline' | 'ghost' | 'link' | 'unstyled';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'solid', colorScheme = 'blue', size = 'md', ...props }, ref) => {
    return (
      <ChakraButton
        ref={ref}
        variant={variant}
        colorScheme={colorScheme}
        size={size}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button };
