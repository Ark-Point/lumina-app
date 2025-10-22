import Loading from "@/web/components/loading";
import { StrictPropsWithChildren } from "@/web/types";
import { ButtonHTMLAttributes } from "react";
import { StyledButton } from "./style";

export type ButtonSize = "sm" | "md" | "lg";

// FIXME: Line, Ghost 타입 추가 될 수도
export type ButtonVariant = "primary" | "ghost" | "outline";

export type BaseButtonProps = {
  size?: ButtonSize;
  variant?: ButtonVariant;
  type?: "button" | "submit" | "reset";
  isFullWidth?: boolean;
  width?: number;
  isLoading?: boolean;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export const BaseButton = ({
  size = "md",
  variant = "primary",
  type = "button",
  isFullWidth = false,
  isLoading = false,
  width,
  color,
  children,
  ...rest
}: StrictPropsWithChildren<BaseButtonProps>) => {
  return (
    <StyledButton
      size={size}
      variant={variant}
      type={type}
      isFullWidth={isFullWidth}
      width={width}
      disabled={!!rest.disabled}
      isLoading={isLoading}
      aria-disabled={!!rest.disabled || isLoading}
      aria-busy={isLoading}
      color={color}
      {...rest}
    >
      {isLoading ? <Loading /> : children}
    </StyledButton>
  );
};
