import {
  APP_ICON_URL,
  APP_NAME,
  APP_URL,
} from "@/app/miniapp/constant/mini-app";
import { farcasterFrame } from "@farcaster/miniapp-wagmi-connector";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import {
  createConfig,
  http,
  useAccount,
  useConnect,
  WagmiProvider,
} from "wagmi";
import { baseSepolia } from "wagmi/chains";
import { coinbaseWallet, metaMask } from "wagmi/connectors";

// Custom hook for Coinbase Wallet detection and auto-connection
function useCoinbaseWalletAutoConnect() {
  const [isCoinbaseWallet, setIsCoinbaseWallet] = useState(false);
  const { connect, connectors } = useConnect();
  const { isConnected } = useAccount();

  useEffect(() => {
    // Check if we're running in Coinbase Wallet
    const checkCoinbaseWallet = () => {
      const isInCoinbaseWallet =
        window.ethereum?.isCoinbaseWallet ||
        window.ethereum?.isCoinbaseWalletExtension ||
        window.ethereum?.isCoinbaseWalletBrowser;
      setIsCoinbaseWallet(!!isInCoinbaseWallet);
    };

    checkCoinbaseWallet();
    window.addEventListener("ethereum#initialized", checkCoinbaseWallet);

    return () => {
      window.removeEventListener("ethereum#initialized", checkCoinbaseWallet);
    };
  }, []);

  useEffect(() => {
    // Auto-connect if in Coinbase Wallet and not already connected
    if (isCoinbaseWallet && !isConnected) {
      connect({ connector: connectors[1] }); // Coinbase Wallet connector
    }
  }, [isCoinbaseWallet, isConnected, connect, connectors]);

  return isCoinbaseWallet;
}

export const config = createConfig({
  chains: [baseSepolia],
  transports: {
    [baseSepolia.id]: http(),
  },
  connectors: [
    farcasterFrame(),
    coinbaseWallet({
      appName: APP_NAME,
      appLogoUrl: APP_ICON_URL,
      preference: "all",
    }),
    metaMask({
      dappMetadata: {
        name: APP_NAME,
        url: APP_URL,
      },
    }),
  ],
});

const queryClient = new QueryClient();

// Wrapper component that provides Coinbase Wallet auto-connection
function CoinbaseWalletAutoConnect({
  children,
}: {
  children: React.ReactNode;
}) {
  useCoinbaseWalletAutoConnect();
  return <>{children}</>;
}

export default function Provider({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <CoinbaseWalletAutoConnect>{children}</CoinbaseWalletAutoConnect>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
