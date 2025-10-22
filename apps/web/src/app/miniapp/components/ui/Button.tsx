import type React from "react";

import {
  ButtonSize,
  ButtonVariant,
  Spinner,
  StyledButton,
} from "./components/Button";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  isLoading?: boolean;
  variant?: ButtonVariant;
  size?: ButtonSize;
}

export function Button({
  children,
  className,
  isLoading = false,
  variant = "primary",
  size = "md",
  disabled,
  ...props
}: ButtonProps) {
  return (
    <StyledButton
      variant={variant}
      size={size}
      className={className}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? <Spinner aria-hidden="true" /> : children}
    </StyledButton>
  );
}
