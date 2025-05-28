"use client"

import React from 'react';
import {
  Accordion as ChakraAccordion,
  AccordionItem as ChakraAccordionItem,
  AccordionButton as ChakraAccordionButton,
  AccordionPanel as ChakraAccordionPanel,
  AccordionIcon as ChakraAccordionIcon,
  AccordionProps as ChakraAccordionProps,
  AccordionItemProps as ChakraAccordionItemProps,
  AccordionButtonProps as ChakraAccordionButtonProps,
  AccordionPanelProps as ChakraAccordionPanelProps,
  Box
} from '@chakra-ui/react';

// Accordion Container
export interface AccordionProps extends ChakraAccordionProps {
  type?: 'single' | 'multiple';
  collapsible?: boolean;
  defaultValue?: string | string[];
}

const Accordion = React.forwardRef<HTMLDivElement, AccordionProps>(
  ({ type = 'single', collapsible = true, defaultValue, children, ...props }, ref) => {
    // Convert shadcn props to Chakra props
    const allowMultiple = type === 'multiple';
    let defaultIndex;
    
    if (defaultValue) {
      if (Array.isArray(defaultValue)) {
        // For multiple, try to find indices (simplified)
        defaultIndex = [0];
      } else {
        // For single, try to find index (simplified)
        defaultIndex = 0;
      }
    }

    return (
      <ChakraAccordion
        ref={ref}
        allowMultiple={allowMultiple}
        allowToggle={collapsible}
        defaultIndex={defaultIndex}
        {...props}
      >
        {children}
      </ChakraAccordion>
    );
  }
);

Accordion.displayName = "Accordion";

// Accordion Item
export interface AccordionItemProps extends ChakraAccordionItemProps {
  value?: string;
}

const AccordionItem = React.forwardRef<HTMLDivElement, AccordionItemProps>(
  ({ value, children, ...props }, ref) => {
    return (
      <ChakraAccordionItem ref={ref} {...props}>
        {children}
      </ChakraAccordionItem>
    );
  }
);

AccordionItem.displayName = "AccordionItem";

// Accordion Trigger (Button)
export interface AccordionTriggerProps extends ChakraAccordionButtonProps {}

const AccordionTrigger = React.forwardRef<HTMLButtonElement, AccordionTriggerProps>(
  ({ children, ...props }, ref) => {
    return (
      <ChakraAccordionButton ref={ref} {...props}>
        <Box as="span" flex="1" textAlign="left">
          {children}
        </Box>
        <ChakraAccordionIcon />
      </ChakraAccordionButton>
    );
  }
);

AccordionTrigger.displayName = "AccordionTrigger";

// Accordion Content (Panel)
export interface AccordionContentProps extends ChakraAccordionPanelProps {}

const AccordionContent = React.forwardRef<HTMLDivElement, AccordionContentProps>(
  ({ children, ...props }, ref) => {
    return (
      <ChakraAccordionPanel ref={ref} {...props}>
        {children}
      </ChakraAccordionPanel>
    );
  }
);

AccordionContent.displayName = "AccordionContent";

// Also export the Chakra components for direct use
export {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
  // For pages that directly import Chakra components
  ChakraAccordionButton as AccordionButton,
  ChakraAccordionPanel as AccordionPanel,
  ChakraAccordionIcon as AccordionIcon
}; 
