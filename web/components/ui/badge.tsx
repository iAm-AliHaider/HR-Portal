import React from 'react';
import { Badge as ChakraBadge, BadgeProps as ChakraBadgeProps } from '@chakra-ui/react';

export interface BadgeProps extends ChakraBadgeProps {
  variant?: 'solid' | 'subtle' | 'outline' | 'default' | 'secondary' | 'destructive';
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ variant = 'subtle', colorScheme = 'gray', ...props }, ref) => {
    // Map custom variants to Chakra UI variants
    let mappedVariant = variant;
    let mappedColorScheme = colorScheme;

    switch (variant) {
      case 'default':
        mappedVariant = 'subtle';
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
      <ChakraBadge
        ref={ref}
        variant={mappedVariant}
        colorScheme={mappedColorScheme}
        {...props}
      />
    );
  }
);

Badge.displayName = "Badge";

export { Badge }; 
