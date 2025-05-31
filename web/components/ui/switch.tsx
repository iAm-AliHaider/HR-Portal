import React from "react";

import {
  Switch as ChakraSwitch,
  SwitchProps as ChakraSwitchProps,
} from "@chakra-ui/react";

export interface SwitchProps extends ChakraSwitchProps {}

const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  ({ colorScheme = "blue", size = "md", ...props }, ref) => {
    return (
      <ChakraSwitch
        ref={ref}
        colorScheme={colorScheme}
        size={size}
        {...props}
      />
    );
  },
);

Switch.displayName = "Switch";

export { Switch };
