"use client";

import React from "react";

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
  Box,
} from "@chakra-ui/react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";

// Accordion Container
export interface AccordionProps extends ChakraAccordionProps {
  type?: "single" | "multiple";
  collapsible?: boolean;
  defaultValue?: string | string[];
}

const Accordion = React.forwardRef<HTMLDivElement, AccordionProps>(
  (
    { type = "single", collapsible = true, defaultValue, children, ...props },
    ref,
  ) => {
    // Convert shadcn props to Chakra props
    const allowMultiple = type === "multiple";
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
  },
);

Accordion.displayName = "Accordion";

// Accordion Item
export interface AccordionItemProps extends ChakraAccordionItemProps {
  value?: string;
}

const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item
    ref={ref}
    className={cn("border-b border-zinc-200 dark:border-zinc-800", className)}
    {...props}
  />
));
AccordionItem.displayName = "AccordionItem";

// Accordion Trigger (Button)
export interface AccordionTriggerProps extends ChakraAccordionButtonProps {}

const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(
        "flex flex-1 items-center justify-between py-4 text-sm font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180",
        className,
      )}
      {...props}
    >
      {children}
      <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
));
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName;

// Accordion Content (Panel)
export interface AccordionContentProps extends ChakraAccordionPanelProps {}

const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className={cn(
      "overflow-hidden text-sm data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down",
      className,
    )}
    {...props}
  >
    <div className="pb-4 pt-0">{children}</div>
  </AccordionPrimitive.Content>
));
AccordionContent.displayName = AccordionPrimitive.Content.displayName;

// Also export the Chakra components for direct use
export {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
  // For pages that directly import Chakra components
  ChakraAccordionButton as AccordionButton,
  ChakraAccordionPanel as AccordionPanel,
  ChakraAccordionIcon as AccordionIcon,
};
