import React from "react";

import { FormLabel, FormLabelProps } from "@chakra-ui/react";

export interface LabelProps extends FormLabelProps {}

const Label = React.forwardRef<HTMLLabelElement, LabelProps>((props, ref) => {
  return <FormLabel ref={ref} {...props} />;
});

Label.displayName = "Label";

export { Label };
