"use client";

import { useEffect, useState } from "react";
import { useAccount, useChainId, useConnect, useDisconnect } from "wagmi";

import { AccountLayout, TabContainer } from "../components/Tabs";

import { silkscreen } from "@/app/fonts/silkscreen";
import LeftIcon from "@/app/miniapp/asset/profile/profile_left_asset.svg";
import RightIcon from "@/app/miniapp/asset/profile/profile_right_asset.svg";
import { USE_WALLET } from "@/app/miniapp/constant/mini-app";
import styled from "@emotion/styled";
import { useMiniApp } from "@neynar/react";
import Image from "next/image";
import { Label } from "../label";

/**
 * AccountTab component manages wallet-related UI for both EVM and Solana chains.
 *
 * This component provides a comprehensive wallet interface that supports:
 * - EVM wallet connections (Farcaster Frame, Coinbase Wallet, MetaMask)
 * - Solana wallet integration
 * - Message signing for both chains
 * - Transaction sending for both chains
 * - Chain switching for EVM chains
 * - Auto-connection in Farcaster clients
 *
 * The component automatically detects when running in a Farcaster client
 * and attempts to auto-connect using the Farcaster Frame connector.
 *
 * @example
 * ```tsx
 * <AccountTab />
 * ```
 */

export function AccountTab() {
  // --- State ---
  const [evmContractTransactionHash, setEvmContractTransactionHash] = useState<
    string | null
  >(null);

  // --- Hooks ---
  const { context } = useMiniApp();
  const { address, isConnected } = useAccount();
  const chainId = useChainId();

  const { disconnect } = useDisconnect();
  const { connect, connectors } = useConnect();

  // --- Effects ---
  /**
   * Auto-connect when Farcaster context is available.
   *
   * This effect detects when the app is running in a Farcaster client
   * and automatically attempts to connect using the Farcaster Frame connector.
   * It includes comprehensive logging for debugging connection issues.
   */
  useEffect(() => {
    // Check if we're in a Farcaster client environment
    const isInFarcasterClient =
      typeof window !== "undefined" &&
      (window.location.href.includes("warpcast.com") ||
        window.location.href.includes("farcaster") ||
        window.ethereum?.isFarcaster ||
        context?.client);

    if (
      context?.user?.fid &&
      !isConnected &&
      connectors.length > 0 &&
      isInFarcasterClient
    ) {
      console.log("Attempting auto-connection with Farcaster context...");
      console.log("- User FID:", context.user.fid);
      console.log(
        "- Available connectors:",
        connectors.map((c, i) => `${i}: ${c.name}`)
      );
      console.log("- Using connector:", connectors[0].name);
      console.log("- In Farcaster client:", isInFarcasterClient);

      // Use the first connector (farcasterFrame) for auto-connection
      try {
        connect({ connector: connectors[0] });
      } catch (error) {
        console.error("Auto-connection failed:", error);
      }
    } else {
      console.log("Auto-connection conditions not met:");
      console.log("- Has context:", !!context?.user?.fid);
      console.log("- Is connected:", isConnected);
      console.log("- Has connectors:", connectors.length > 0);
      console.log("- In Farcaster client:", isInFarcasterClient);
    }
  }, [context?.user?.fid, isConnected, connectors, connect, context?.client]);

  // --- Early Return ---
  if (!USE_WALLET) {
    return null;
  }

  // --- Render ---
  return (
    <TabContainer>
      {/* {isConnected && (
        <>
          <SendEth />
          <Button
            onClick={sendEvmContractTransaction}
            disabled={!isConnected || isEvmTransactionPending}
            isLoading={isEvmTransactionPending}
          >
            Send Transaction (contract)
          </Button>
          {isEvmTransactionError && renderError(evmTransactionError)}
          {evmContractTransactionHash && (
            <InfoStack>
              <InfoText>
                Hash:{" "}
                <InlineCode>
                  {truncateAddress(evmContractTransactionHash)}
                </InlineCode>
              </InfoText>
              <InfoText>
                Status:{" "}
                {isEvmTransactionConfirming
                  ? "Confirming..."
                  : isEvmTransactionConfirmed
                    ? "Confirmed!"
                    : "Pending"}
              </InfoText>
            </InfoStack>
          )}
          <Button
            onClick={signTyped}
            disabled={!isConnected || isEvmSignTypedDataPending}
            isLoading={isEvmSignTypedDataPending}
          >
            Sign Typed Data
          </Button>
          {isEvmSignTypedDataError && renderError(evmSignTypedDataError)}
          <Button
            onClick={handleSwitchChain}
            disabled={isChainSwitchPending}
            isLoading={isChainSwitchPending}
          >
            Switch to {nextChain.name}
          </Button>
          {isChainSwitchError && renderError(chainSwitchError)}
        </>
      )} */}
      <AccountLayout>
        <AccountTitleWrapper>
          <AccountTitleLeftIconWrapper>
            <Image src={LeftIcon} alt="" width={71} height={28} />
          </AccountTitleLeftIconWrapper>
          <Label
            className={silkscreen.className}
            style={{
              color: `var(--Primitive-Purple-6, #8807FF)`,
              textAlign: `center`,
              // fontFamily: Silkscreen,
              fontSize: `1.75rem`,
              fontStyle: `normal`,
              fontWeight: 400,
              lineHeight: `normal`,
            }}
          >
            Profile
          </Label>
          <AccountTitleRightIconWrapper>
            <Image src={RightIcon} alt="" width={60} height={26} />
          </AccountTitleRightIconWrapper>
        </AccountTitleWrapper>
        <AccountCard></AccountCard>
        <ScoreAndRewardWrapper></ScoreAndRewardWrapper>
        <AccountCoinListCard></AccountCoinListCard>
      </AccountLayout>
    </TabContainer>
  );
}
// color: `var(--Primitive-Purple-6, #8807FF)`,
// textAlign: `center`,
// // fontFamily: Silkscreen,
// fontSize: `2rem`,
// fontStyle: `normal`,
// fontWeight: 400,
// lineHeight: `normal`,
const AccountTitleWrapper = styled.div`
  /* display: inline-flex; */
  display: flex;
  padding: 0.25rem 1rem 0 0;
  align-items: flex-end;
  /* background-color: red; */
  margin: 1.75rem 3.5rem 1rem 2rem;
`;

const AccountTitleLeftIconWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  /* background-color: blue; */
  padding-bottom: 0.75rem;
  padding-right: 0.875rem;
`;

const AccountTitleRightIconWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  /* background-color: blue; */
  padding-bottom: 0.75rem;
  padding-left: 0.875rem;
`;

const AccountCard = styled.div`
  display: flex;
  padding: 1.25rem 1rem;
  justify-content: space-between;
  align-items: flex-start;
  /* align-self: stretch; */
  border-radius: 8px;
  border: 1px solid var(--Primitive-Purple-6, #8807ff);
  background: var(--Primitive-Purple-1, #f4f0ff);
  margin: 0 0 0.625rem 0;
  height: 80px;
`;

const ScoreAndRewardWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  align-self: stretch;
  background-color: red;
  height: 90px;
  margin: 0 0 0.625rem 0;
`;

const AccountCoinListCard = styled.div`
  display: flex;
  padding: 20px 16px 12px 16px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  /* align-self: stretch; */
  border-radius: 8px;
  border: 1px solid var(--Primitive-Gray-4, #babac0);
  background: var(--Primitive-White, #fff);
  margin: 0 0 0.625rem 0;
  height: 245px;
`;
