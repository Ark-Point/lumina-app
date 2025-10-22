import styled from "@emotion/styled";

export const HeaderContainer = styled.div`
  position: relative;
`;

export const HeaderCard = styled.div`
  margin: 1rem;
  margin-top: 1rem;
  margin-bottom: 1rem;
  padding: 0.5rem 0.75rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 0.75rem;
  border-width: 3px;
  border-style: double;
  border-color: var(--primary, #6366f1);
  background-color: rgba(243, 244, 246, 0.95);

  .dark & {
    background-color: rgba(31, 41, 55, 0.9);
  }
`;

export const HeaderTitle = styled.p`
  margin: 0;
  font-size: 1.125rem;
  font-weight: 300;
`;

export const AvatarButton = styled.button`
  appearance: none;
  border: none;
  background: transparent;
  padding: 0;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
`;

export const AvatarImage = styled.img`
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 9999px;
  object-fit: cover;
  border: 2px solid var(--primary, #6366f1);
`;

export const DropdownContainer = styled.div`
  position: absolute;
  top: calc(100% + 0.25rem);
  right: 1rem;
  z-index: 50;
  width: max-content;
  min-width: 12rem;
  border-radius: 0.75rem;
  background-color: #ffffff;
  border: 1px solid rgba(229, 231, 235, 0.95);
  box-shadow: 0 10px 25px rgba(15, 23, 42, 0.12);

  .dark & {
    background-color: rgba(31, 41, 55, 0.95);
    border-color: rgba(55, 65, 81, 0.85);
    box-shadow: 0 12px 35px rgba(0, 0, 0, 0.4);
  }
`;

export const DropdownContent = styled.div`
  padding: 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  text-align: right;
`;

export const DropdownNameButton = styled.button`
  appearance: none;
  border: none;
  background: transparent;
  padding: 0;
  margin: 0;
  font-weight: 700;
  font-size: 0.875rem;
  cursor: pointer;
  color: inherit;

  &:hover {
    text-decoration: underline;
  }
`;

export const DropdownMeta = styled.p`
  margin: 0;
  font-size: 0.75rem;
  color: rgba(107, 114, 128, 0.9);

  .dark & {
    color: rgba(156, 163, 175, 0.85);
  }
`;
