import React from 'react';
import { Badge as ChakraBadge, BadgeProps as ChakraBadgeProps } from '@chakra-ui/react';

export interface BadgeProps extends ChakraBadgeProps {
  variant?: 'solid' | 'subtle' | 'outline';
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ variant = 'subtle', colorScheme = 'gray', ...props }, ref) => {
    return (
      <ChakraBadge
        ref={ref}
        variant={variant}
        colorScheme={colorScheme}
        {...props}
      />
    );
  }
);

Badge.displayName = "Badge";

export { Badge }; 
