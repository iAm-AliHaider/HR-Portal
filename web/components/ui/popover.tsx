"use client"

import React from 'react';
import {
  Popover as ChakraPopover,
  PopoverTrigger as ChakraPopoverTrigger,
  PopoverContent as ChakraPopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  PopoverArrow,
  PopoverCloseButton,
  PopoverAnchor as ChakraPopoverAnchor,
  PopoverProps as ChakraPopoverProps,
  PopoverContentProps as ChakraPopoverContentProps
} from '@chakra-ui/react';

// Popover Container
export interface PopoverProps extends ChakraPopoverProps {}

const Popover = ({ children, ...props }: PopoverProps) => {
  return (
    <ChakraPopover {...props}>
      {children}
    </ChakraPopover>
  );
};

// Popover Trigger
const PopoverTrigger = ({ children }: { children: React.ReactNode }) => {
  return (
    <ChakraPopoverTrigger>
      {children}
    </ChakraPopoverTrigger>
  );
};

// Popover Content
export interface PopoverContentProps extends Omit<ChakraPopoverContentProps, 'children'> {
  align?: 'start' | 'center' | 'end';
  sideOffset?: number;
  children?: React.ReactNode;
}

const PopoverContent = React.forwardRef<HTMLDivElement, PopoverContentProps>(
  ({ align, sideOffset, children, ...props }, ref) => {
    return (
      <ChakraPopoverContent ref={ref} {...props}>
        <PopoverArrow />
        {children}
      </ChakraPopoverContent>
    );
  }
);

// Popover Anchor
const PopoverAnchor = ChakraPopoverAnchor;

Popover.displayName = "Popover";
PopoverTrigger.displayName = "PopoverTrigger";
PopoverContent.displayName = "PopoverContent";

export { 
  Popover, 
  PopoverTrigger, 
  PopoverContent, 
  PopoverAnchor,
  // Also export Chakra components for advanced usage
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  PopoverArrow,
  PopoverCloseButton
};
