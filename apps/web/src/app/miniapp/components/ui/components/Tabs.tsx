import styled from "@emotion/styled";

export const TabContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  width: 100%;
  max-width: 28rem;
  margin: 0 auto;
  padding: 0 1.5rem;
`;

export const StatusMessage = styled.p`
  margin: 0;
  font-size: 0.875rem;
  line-height: 1.25rem;
  color: inherit;
`;

export const SectionStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;
`;

export const ButtonStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  width: 100%;
`;

export const SelectControl = styled.select`
  width: 100%;
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

  &:focus-visible {
    outline: none;
    border-color: var(--primary, #6366f1);
    box-shadow: 0 0 0 2px
      color-mix(in srgb, var(--primary, #6366f1) 32%, transparent);
  }

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }

  .dark & {
    background-color: rgba(31, 41, 55, 0.9);
    color: rgba(229, 231, 235, 0.94);
    border-color: rgba(75, 85, 99, 0.85);
  }
`;

export const AccountLayout = styled.div`
  display: flex;
  flex-direction: column;
  /* align-items: center; */
  justify-content: flex-start;
  height: calc(100vh - 74px);

  overflow-y: auto;
  overflow-x: hidden;

  &::-webkit-scrollbar {
    display: none;
  }

  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE/Edge(legacy) */

  -webkit-overflow-scrolling: touch;
  overscroll-behavior: contain;
  scrollbar-gutter: stable;
  min-height: 0;
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
`;

export const ChatLayout = styled.div`
  display: flex;
  flex-direction: column;
  /* align-items: center; */
  justify-content: flex-end;
  height: calc(100vh - 74px);
`;

export const ChatContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  width: 100vw;
  /* max-width: 28rem; */
  /* margin: 0 auto; */
  text-align: center;

  overflow-y: auto;
  overflow-x: hidden;

  &::-webkit-scrollbar {
    display: none;
  }

  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE/Edge(legacy) */

  -webkit-overflow-scrolling: touch;
  overscroll-behavior: contain;
  scrollbar-gutter: stable;
  min-height: 0;
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
`;

export const HomeTitle = styled.p`
  margin: 0 0 0.5rem;
  font-size: 1.125rem;
  line-height: 1.5rem;
`;

export const HomeSubtitle = styled.p`
  margin: 0;
  font-size: 0.875rem;
  line-height: 1.25rem;
  color: rgba(107, 114, 128, 0.85);

  .dark & {
    color: rgba(156, 163, 175, 0.8);
  }
`;

export const ContextWrapper = styled.div`
  padding: 0 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

export const ContextHeading = styled.h2`
  margin: 0;
  font-size: 1.125rem;
  font-weight: 600;
  line-height: 1.5rem;
`;

export const ContextCard = styled.div`
  border-radius: 0.75rem;
  padding: 1rem;
  background-color: rgba(243, 244, 246, 0.95);
  border: 1px solid rgba(229, 231, 235, 0.9);

  .dark & {
    background-color: rgba(31, 41, 55, 0.92);
    border-color: rgba(55, 65, 81, 0.85);
  }
`;

export const ContextPre = styled.pre`
  margin: 0;
  font-family:
    ui-monospace, SFMono-Regular, SFMono, Menlo, Monaco, Consolas,
    "Liberation Mono", "Courier New", monospace;
  font-size: 0.75rem;
  line-height: 1.25rem;
  white-space: pre-wrap;
  word-break: break-word;
`;

export const InfoStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  font-size: 0.75rem;
  line-height: 1.125rem;
  width: 100%;
`;

export const InfoText = styled.p`
  margin: 0;
`;

export const InlineCode = styled.code`
  font-family:
    ui-monospace, SFMono-Regular, SFMono, Menlo, Monaco, Consolas,
    "Liberation Mono", "Courier New", monospace;
  padding: 0.125rem 0.375rem;
  border-radius: 0.375rem;
  background-color: rgba(243, 244, 246, 0.9);
  border: 1px solid rgba(229, 231, 235, 0.8);

  .dark & {
    background-color: rgba(31, 41, 55, 0.8);
    border-color: rgba(55, 65, 81, 0.65);
  }
`;
