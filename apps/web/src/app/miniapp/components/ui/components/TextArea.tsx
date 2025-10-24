import styled from "@emotion/styled";

export const StyledTextArea = styled.textarea`
  width: 100%;
  min-height: 5.5rem;
  /* border: 1px solid rgba(229, 231, 235, 0.9); */
  border-top: 1px solid var(--Primitive-Gray-3, #dadadd);
  /* background: var(--Primitive-White, #fff); */
  /* background-color: red; */
  color: #111827;
  padding: 0.75rem 1rem 0.75rem 1rem;
  font-size: 1rem;
  line-height: 1.4;
  resize: none;
  transition:
    border-color 120ms ease,
    box-shadow 120ms ease;

  -ms-overflow-style: none; /* IE/Edge */
  scrollbar-width: none; /* Firefox */

  .no-scrollbar::-webkit-scrollbar {
    display: none; /* Chrome/Safari */
  }

  /* &:focus-visible {
    outline: none;
    border-color: var(--primary, #6366f1);
    box-shadow: 0 0 0 2px
      color-mix(in srgb, var(--primary, #6366f1) 32%, transparent);
  } */

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }

  &::placeholder {
    color: rgba(107, 114, 128, 0.75);
  }

  .dark & {
    background-color: rgba(31, 41, 55, 0.9);
    color: rgba(229, 231, 235, 0.94);
    border-color: rgba(75, 85, 99, 0.85);

    &::placeholder {
      color: rgba(156, 163, 175, 0.75);
    }
  }
`;
