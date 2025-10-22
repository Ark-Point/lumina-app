"use client";

import { Footer } from "@/app/miniapp/components/ui/Footer";
import { Header } from "@/app/miniapp/components/ui/Header";
import {
  ActionsTab,
  ContextTab,
  HomeTab,
  WalletTab,
} from "@/app/miniapp/components/ui/tabs";
import { USE_WALLET } from "@/app/miniapp/constant/mini-app";
import { keyframes } from "@emotion/react";
import styled from "@emotion/styled";
import { useMiniApp } from "@neynar/react";
import { useEffect } from "react";
import { useNeynarUser } from "../hooks/useNeynarUser";

// --- Types ---
export enum Tab {
  Home = "home",
  Actions = "actions",
  Context = "context",
  Wallet = "wallet",
}

export interface AppProps {
  title?: string;
}

/**
 * App component serves as the main container for the mini app interface.
 *
 * This component orchestrates the overall mini app experience by:
 * - Managing tab navigation and state
 * - Handling Farcaster mini app initialization
 * - Coordinating wallet and context state
 * - Providing error handling and loading states
 * - Rendering the appropriate tab content based on user selection
 *
 * The component integrates with the Neynar SDK for Farcaster functionality
 * and Wagmi for wallet management. It provides a complete mini app
 * experience with multiple tabs for different functionality areas.
 *
 * Features:
 * - Tab-based navigation (Home, Actions, Context, Wallet)
 * - Farcaster mini app integration
 * - Wallet connection management
 * - Error handling and display
 * - Loading states for async operations
 *
 * @param props - Component props
 * @param props.title - Optional title for the mini app (defaults to "Neynar Starter Kit")
 *
 * @example
 * ```tsx
 * <App title="My Mini App" />
 * ```
 */
export default function App(
  { title }: AppProps = { title: "Neynar Starter Kit" }
) {
  // --- Hooks ---
  const { isSDKLoaded, context, setInitialTab, setActiveTab, currentTab } =
    useMiniApp();

  // --- Neynar user hook ---
  const { user: neynarUser } = useNeynarUser(context || undefined);

  // --- Effects ---
  /**
   * Sets the initial tab to "home" when the SDK is loaded.
   *
   * This effect ensures that users start on the home tab when they first
   * load the mini app. It only runs when the SDK is fully loaded to
   * prevent errors during initialization.
   */
  useEffect(() => {
    if (isSDKLoaded) {
      setInitialTab(Tab.Home);
    }
  }, [isSDKLoaded, setInitialTab]);

  // --- Early Returns ---
  if (!isSDKLoaded) {
    return (
      <LoadingScreen>
        <LoadingContent>
          <LoadingSpinner />
          <LoadingMessage>Loading SDK...</LoadingMessage>
        </LoadingContent>
      </LoadingScreen>
    );
  }

  const safeAreaInsets = {
    top: context?.client.safeAreaInsets?.top ?? 0,
    bottom: context?.client.safeAreaInsets?.bottom ?? 0,
    left: context?.client.safeAreaInsets?.left ?? 0,
    right: context?.client.safeAreaInsets?.right ?? 0,
  };

  // --- Render ---
  return (
    <SafeAreaWrapper $insets={safeAreaInsets}>
      {/* Header should be full width */}
      <Header neynarUser={neynarUser} />

      {/* Main content and footer should be centered */}
      <MainContent>
        <MainTitle>{title}</MainTitle>

        {/* Tab content rendering */}
        {currentTab === Tab.Home && <HomeTab />}
        {currentTab === Tab.Actions && <ActionsTab />}
        {currentTab === Tab.Context && <ContextTab />}
        {currentTab === Tab.Wallet && <WalletTab />}

        {/* Footer with navigation */}
        <Footer
          activeTab={currentTab as Tab}
          setActiveTab={setActiveTab}
          showWallet={USE_WALLET}
        />
      </MainContent>
    </SafeAreaWrapper>
  );
}

const SafeAreaWrapper = styled.div<{
  $insets: { top: number; bottom: number; left: number; right: number };
}>`
  padding-top: ${({ $insets }) => `${$insets.top}px`};
  padding-bottom: ${({ $insets }) => `${$insets.bottom}px`};
  padding-left: ${({ $insets }) => `${$insets.left}px`};
  padding-right: ${({ $insets }) => `${$insets.right}px`};
`;

const MainContent = styled.div`
  width: 100%;
  max-width: 32rem;
  margin: 0 auto;
  padding: 0.5rem 1.5rem 5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const MainTitle = styled.h1`
  margin: 0;
  font-size: 1.5rem;
  line-height: 2rem;
  font-weight: 700;
  text-align: center;
`;

const LoadingScreen = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 2rem;
`;

const LoadingContent = styled.div`
  text-align: center;
`;

const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const LoadingSpinner = styled.div`
  height: 2rem;
  width: 2rem;
  margin: 0 auto 1rem;
  border-radius: 9999px;
  border: 3px solid rgba(209, 213, 219, 0.6);
  border-top-color: var(--primary, #6366f1);
  animation: ${spin} 0.75s linear infinite;
`;

const LoadingMessage = styled.p`
  margin: 0;
  font-size: 0.875rem;
  line-height: 1.25rem;
`;
