"use client";

import React from "react";

import {
  Progress as ChakraProgress,
  ProgressProps as ChakraProgressProps,
} from "@chakra-ui/react";

export interface ProgressProps extends ChakraProgressProps {}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ value, colorScheme = "blue", size = "md", ...props }, ref) => {
    return (
      <ChakraProgress
        ref={ref}
        value={value}
        colorScheme={colorScheme}
        size={size}
        {...props}
      />
    );
  },
);

Progress.displayName = "Progress";

export { Progress };
