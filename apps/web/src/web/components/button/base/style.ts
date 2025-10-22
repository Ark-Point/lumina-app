import { SerializedStyles, css } from '@emotion/react';
import styled from '@emotion/styled';

import type { ButtonSize, ButtonVariant } from '.';

const buttonSizesStyles: Record<ButtonSize, SerializedStyles> = {
  sm: css`
    padding-block: 6px;
    padding-inline: 16px;
    /* min-width: 105px; */
  `,
  md: css`
    padding-block: 6px;
    padding-inline: 16px;
    /* min-width: 105px; */
  `,
  lg: css`
    padding-block: 6px;
    padding-inline: 16px;
    /* min-width: 105px; */
  `,
} as const;

const disabledStyle = css`
  background-color: #7a7a7a;
  cursor: default;
  color: rgba(0, 0, 0, 0.5);
`;

const buttonVariantStyles: Record<ButtonVariant, SerializedStyles> = {
  primary: css`
    color: #1a313d;
    background-color: #4dc3ff;

    &:hover {
      background-color: #409fcf;
    }

    &:disabled {
      ${disabledStyle}
    }
  `,
  ghost: css`
    color: #1a313d;
    background-color: #4dc3ff;

    &:hover {
      background-color: #409fcf;
    }

    &:disabled {
      ${disabledStyle}
    }
  `,
  outline: css`
    color: #1a313d;
    background-color: #4dc3ff;

    &:hover {
      background-color: #409fcf;
    }

    &:disabled {
      ${disabledStyle}
    }
  `,
} as const;

const loadingVariantStyles: Record<ButtonVariant, SerializedStyles> = {
  primary: css`
    ${disabledStyle}
    background-color: var(--primary-300);
  `,
  ghost: css`
    ${disabledStyle}
    background-color: var(--primary-300);
  `,
  outline: css`
    ${disabledStyle}
    background-color: var(--primary-300);
  `,
} as const;

const getButtonStyle = (variant: ButtonVariant, size: ButtonSize) => css`
  ${buttonVariantStyles[variant]};
  ${buttonSizesStyles[size]};
`;

export const StyledButton = styled.button<{
  variant: ButtonVariant;
  size: ButtonSize;
  isFullWidth: boolean;
  isLoading: boolean;
  width?: number;
}>`
  border-radius: calc(var(--radius-button) * 1px);
  border-color: transparent;
  cursor: pointer;

  ${({ size, variant }) => getButtonStyle(variant, size)}
  ${({ isFullWidth, width }) =>
    isFullWidth
      ? css`
          width: 100%;
        `
      : css`
          width: ${width ? width + `px` : 'auto'};
          overflow: hidden;
          text-overflow: ellipsis;
        `}

    ${({ isLoading, variant }) =>
    isLoading &&
    css`
      ${loadingVariantStyles[variant]}
      pointer-events: none;
    `}
`;
