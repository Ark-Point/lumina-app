import * as React from "react";

import { StyledInput } from "./components/Input";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => (
    <StyledInput ref={ref} type={type} className={className} {...props} />
  )
);

Input.displayName = "Input";

export { Input };
