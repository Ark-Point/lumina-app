import styled from "@emotion/styled";

export const StyledLabel = styled.label`
  display: inline-block;
  font-size: 0.875rem;
  font-weight: 500;
  line-height: 1.25rem;
  color: inherit;

  &[data-disabled="true"] {
    cursor: not-allowed;
    opacity: 0.7;
  }
`;
