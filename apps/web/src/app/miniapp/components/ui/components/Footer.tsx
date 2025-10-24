import styled from "@emotion/styled";

export const FooterWrapper = styled.div`
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  // margin: 0 1rem 1rem;
  // padding: 0.5rem;
  // border-radius: 0.75rem;
  // border-width: 3px;
  // border-style: double;
  // border-color: var(--primary, #6366f1);
  // background-color: rgba(243, 244, 246, 0.95);
  border-top: 1px solid #d4d4d4;
  background: #f5f5f5;
  z-index: 50;

  .dark & {
    background-color: rgba(31, 41, 55, 0.92);
  }
`;

export const FooterNav = styled.nav`
  display: flex;
  align-items: center;
  justify-content: space-around;
  // height: 3.5rem;
  height: 74px;
  gap: 0.5rem;
`;

export const FooterButton = styled.button<{ isActive?: boolean }>`
  appearance: none;
  border: none;
  /* background: transparent; */
  background: ${({ isActive }) => (isActive ? "" : "transparent")};
  padding: 0;
  cursor: pointer;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  font-size: 0.75rem;
  line-height: 1rem;
  color: ${({ isActive }) =>
    isActive ? "var(--primary, #6366f1)" : "rgba(107, 114, 128, 0.85)"};
  transition: color 150ms ease;

  span:first-of-type {
    font-size: 1.25rem;
  }

  /* .dark & {
    color: ${({ isActive }) =>
    isActive
      ? "color-mix(in srgb, var(--primary, #6366f1) 80%, #ffffff 20%)"
      : "rgba(156, 163, 175, 0.8)"};
  } */
`;
