import React from "react";

import { Divider, DividerProps } from "@chakra-ui/react";

export interface SeparatorProps extends DividerProps {}

const Separator = React.forwardRef<HTMLDivElement, SeparatorProps>(
  (props, ref) => {
    return <Divider ref={ref} {...props} />;
  },
);

Separator.displayName = "Separator";

export { Separator };
