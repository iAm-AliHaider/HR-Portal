import React from 'react';
import { Button as ChakraButton, ButtonProps as ChakraButtonProps } from '@chakra-ui/react';

export interface ButtonProps extends ChakraButtonProps {
  variant?: 'solid' | 'outline' | 'ghost' | 'link' | 'unstyled' | 'default' | 'primary' | 'secondary' | 'destructive';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'solid', colorScheme = 'blue', size = 'md', ...props }, ref) => {
    // Map custom variants to Chakra UI variants
    let mappedVariant = variant;
    let mappedColorScheme = colorScheme;

    switch (variant) {
      case 'default':
      case 'primary':
        mappedVariant = 'solid';
        mappedColorScheme = 'blue';
        break;
      case 'secondary':
        mappedVariant = 'outline';
        mappedColorScheme = 'gray';
        break;
      case 'destructive':
        mappedVariant = 'solid';
        mappedColorScheme = 'red';
        break;
      default:
        mappedVariant = variant;
        break;
    }

    return (
      <ChakraButton
        ref={ref}
        variant={mappedVariant}
        colorScheme={mappedColorScheme}
        size={size}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button };
