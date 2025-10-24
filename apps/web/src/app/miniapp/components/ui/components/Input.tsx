import styled from "@emotion/styled";

export const StyledInput = styled.input`
  width: 100%;
  height: 2.5rem;
  border-radius: 0.5rem;
  border: 1px solid rgba(229, 231, 235, 0.9);
  background-color: #ffffff;
  color: #111827;
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
  transition:
    border-color 120ms ease,
    box-shadow 120ms ease;

  &::placeholder {
    color: rgba(107, 114, 128, 0.85);
  }

  &:focus-visible {
    outline: none;
    border-color: var(--primary, #6366f1);
    box-shadow: 0 0 0 2px
      color-mix(in srgb, var(--primary, #6366f1) 32%, transparent);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.55;
  }

  .dark & {
    background-color: #111827;
    color: rgba(229, 231, 235, 0.94);
    border-color: rgba(75, 85, 99, 0.85);

    &::placeholder {
      color: rgba(156, 163, 175, 0.7);
    }
  }

  &::file-selector-button {
    border: none;
    background: transparent;
    font-size: 0.875rem;
    font-weight: 500;
    color: #111827;
    margin: 0;
    padding: 0;
  }

  .dark &::file-selector-button {
    color: rgba(229, 231, 235, 0.9);
  }
`;
