import { css } from "@emotion/react";
import styled from "@emotion/styled";

export type ButtonVariant = "primary" | "secondary" | "outline";
export type ButtonSize = "sm" | "md" | "lg";

export const buttonVariantStyles: Record<ButtonVariant, ReturnType<typeof css>> =
  {
    primary: css`
      color: #ffffff;
      background-color: var(--primary, #6366f1);
      border: 1px solid transparent;

      &:hover {
        background-color: color-mix(
          in srgb,
          var(--primary, #6366f1) 88%,
          #000 12%
        );
      }

      &:focus-visible {
        box-shadow: 0 0 0 2px
          color-mix(in srgb, var(--primary, #6366f1) 35%, transparent);
      }

      .dark & {
        background-color: color-mix(
          in srgb,
          var(--primary, #6366f1) 92%,
          #000 8%
        );
        color: var(--primary-foreground, #111827);
      }
    `,
    secondary: css`
      color: var(--foreground, #111827);
      background-color: rgba(229, 231, 235, 0.95);
      border: 1px solid rgba(209, 213, 219, 0.8);

      &:hover {
        background-color: rgba(209, 213, 219, 1);
      }

      &:focus-visible {
        box-shadow: 0 0 0 2px rgba(156, 163, 175, 0.35);
      }

      .dark & {
        background-color: rgba(75, 85, 99, 0.85);
        color: rgba(243, 244, 246, 0.95);
        border-color: rgba(75, 85, 99, 0.85);

        &:hover {
          background-color: rgba(75, 85, 99, 1);
        }
      }
    `,
    outline: css`
      color: var(--foreground, #111827);
      background-color: transparent;
      border: 1px solid rgba(209, 213, 219, 0.85);

      &:hover {
        background-color: rgba(249, 250, 251, 0.8);
      }

      &:focus-visible {
        box-shadow: 0 0 0 2px rgba(156, 163, 175, 0.35);
      }

      .dark & {
        border-color: rgba(75, 85, 99, 0.9);
        color: rgba(243, 244, 246, 0.95);

        &:hover {
          background-color: rgba(31, 41, 55, 0.75);
        }
      }
    `,
  };

export const buttonSizeStyles: Record<ButtonSize, ReturnType<typeof css>> = {
  sm: css`
    padding: 0.375rem 0.75rem;
    font-size: 0.75rem;
    line-height: 1.125rem;
  `,
  md: css`
    padding: 0.5rem 1rem;
    font-size: 0.875rem;
    line-height: 1.25rem;
  `,
  lg: css`
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
    line-height: 1.5rem;
  `,
};

export interface StyledButtonProps {
  variant: ButtonVariant;
  size: ButtonSize;
  isLoading?: boolean;
}

export const StyledButton = styled.button<StyledButtonProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.75rem;
  font-weight: 600;
  transition: background-color 150ms ease, color 150ms ease,
    box-shadow 150ms ease, border-color 150ms ease;
  cursor: pointer;
  width: 100%;
  max-width: 20rem;
  margin: 0 auto;
  position: relative;

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }

  ${({ size }) => buttonSizeStyles[size]}
  ${({ variant }) => buttonVariantStyles[variant]}
`;

export const Spinner = styled.div`
  height: 1.25rem;
  width: 1.25rem;
  border-radius: 9999px;
  border-width: 2px;
  border-style: solid;
  border-color: rgba(255, 255, 255, 0.7);
  border-top-color: transparent;
  animation: spin 1s linear infinite;

  .dark & {
    border-color: rgba(255, 255, 255, 0.75);
    border-top-color: transparent;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;
