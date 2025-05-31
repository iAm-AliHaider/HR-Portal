import React from "react";

import {
  RadioGroup as ChakraRadioGroup,
  Radio as ChakraRadio,
  RadioGroupProps as ChakraRadioGroupProps,
  RadioProps as ChakraRadioProps,
} from "@chakra-ui/react";

export interface RadioGroupProps extends ChakraRadioGroupProps {}
export interface RadioGroupItemProps extends ChakraRadioProps {}

const RadioGroup = React.forwardRef<HTMLDivElement, RadioGroupProps>(
  ({ colorScheme = "blue", ...props }, ref) => {
    return <ChakraRadioGroup ref={ref} colorScheme={colorScheme} {...props} />;
  },
);

const RadioGroupItem = React.forwardRef<HTMLInputElement, RadioGroupItemProps>(
  ({ colorScheme = "blue", ...props }, ref) => {
    return <ChakraRadio ref={ref} colorScheme={colorScheme} {...props} />;
  },
);

RadioGroup.displayName = "RadioGroup";
RadioGroupItem.displayName = "RadioGroupItem";

export { RadioGroup, RadioGroupItem };
