import React from 'react';
import { Box, BoxProps } from '@chakra-ui/react';

export interface ScrollAreaProps extends BoxProps {}

const ScrollArea = React.forwardRef<HTMLDivElement, ScrollAreaProps>(
  ({ children, ...props }, ref) => {
    return (
      <Box
        ref={ref}
        overflow="auto"
        position="relative"
        {...props}
      >
        {children}
      </Box>
    );
  }
);

ScrollArea.displayName = "ScrollArea";

// For compatibility
const ScrollBar = ({ orientation = "vertical", ...props }: { orientation?: "vertical" | "horizontal"; [key: string]: any }) => {
  // Chakra UI Box handles scrollbars automatically, this is just for compatibility
  return null;
};

ScrollBar.displayName = "ScrollBar";

export { ScrollArea, ScrollBar };
