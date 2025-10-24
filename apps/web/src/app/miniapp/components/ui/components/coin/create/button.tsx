"use client";

import Image from "next/image";
import { useState } from "react";
import { baseSepolia } from "viem/chains";
import {
  useAccount,
  usePublicClient,
  useSwitchChain,
  useWalletClient,
} from "wagmi";
// ⬇️ 실제 SDK import는 Zora 문서의 패키지명을 그대로 사용하세요.
import CreateCoinImage from "@/app/miniapp/asset/button/create-coin.png";
import {
  createCoin,
  CreateConstants,
  createMetadataBuilder,
  createZoraUploaderForCreator,
} from "@zoralabs/coins-sdk"; // 예시
import { Address } from "viem";

export interface CreateCoinMetadata {
  name: string;
  symbol: string;
  description: string;
  properties: Record<string, string>;
  image?: string;
}

const LLM_AGENT_URL = process.env.NEXT_PUBLIC_LLM_AGENT_URL;

export function CreateCoinButton(metadata: CreateCoinMetadata) {
  const { address, chainId, isConnected } = useAccount();
  const publicClient = usePublicClient({ chainId: baseSepolia.id }); // viem PublicClient
  const { data: walletClient } = useWalletClient({ chainId: baseSepolia.id }); // viem WalletClient
  const { switchChain } = useSwitchChain();

  const [loading, setLoading] = useState(false);
  const [txHash, setTxHash] = useState<string>();
  const [coinAddress, setCoinAddress] = useState<`0x${string}`>();

  const ensureUniqueSymbol = async (baseSymbol: string): Promise<string> => {
    if (!LLM_AGENT_URL) {
      return baseSymbol;
    }

    const symbolPattern = /^LUM(\d+)([A-Za-z]*)$/;
    let currentSymbol = baseSymbol.trim().toUpperCase();
    let attempts = 0;

    while (attempts < 50) {
      try {
        const params = new URLSearchParams({
          chainId: baseSepolia.id.toString(),
          symbol: currentSymbol,
        });
        const response = await fetch(
          `${LLM_AGENT_URL}/api/coin/symbol/availability?${params.toString()}`
        );

        if (!response.ok) {
          console.warn("Symbol availability check failed:", response.status);
          return currentSymbol;
        }

        const result = await response.json();
        const available =
          typeof result?.data?.available === "boolean"
            ? result.data.available
            : result?.available;

        if (available === true) {
          return currentSymbol;
        }
      } catch (error) {
        console.error("Error checking symbol availability:", error);
        return currentSymbol;
      }

      const match = currentSymbol.match(symbolPattern);
      if (!match) {
        // If the symbol does not follow the expected pattern, append a number.
        currentSymbol = `${currentSymbol}1`;
        attempts += 1;
        continue;
      }

      const [, numericPart, suffix] = match;
      const nextNumber = (parseInt(numericPart, 10) + 1).toString();
      currentSymbol = `LUM${nextNumber}${suffix}`;
      attempts += 1;
    }

    return currentSymbol;
  };

  const onClick = async () => {
    try {
      if (!isConnected || !address) throw new Error("Wallet not connected.");
      if (chainId !== baseSepolia.id) {
        // 체인 스위치 유도 (지갑에서 승인)
        await switchChain({ chainId: baseSepolia.id });
      }
      if (!publicClient || !walletClient)
        throw new Error("client initialize Failed... ");

      const uniqueSymbol = await ensureUniqueSymbol(metadata.symbol);
      const workingMetadata: CreateCoinMetadata = {
        ...metadata,
        symbol: uniqueSymbol,
      };

      setLoading(true);

      let createdMetadata = undefined;
      if (!!workingMetadata?.image) {
        // const image = await fetch(metadata?.image);
        const appIcon = await fetch("/miniapp/icon.png");

        // const blob = await image.blob();
        const blob = await appIcon.blob();

        const { createMetadataParameters } = await createMetadataBuilder()
          .withName(workingMetadata.name)
          .withSymbol(workingMetadata.symbol)
          .withDescription(workingMetadata.description)
          .withImage(
            new File(
              [/* data for png as bytes or file from user */ blob],
              `${workingMetadata.symbol}.png`,
              { type: "image/png" }
            )
          )
          .withProperties(workingMetadata.properties)
          .upload(createZoraUploaderForCreator(address as Address));
        createdMetadata = createMetadataParameters.metadata;
      } else {
        const appIcon = await fetch("/miniapp/icon.png");
        const blob = await appIcon.blob();

        const { createMetadataParameters } = await createMetadataBuilder()
          .withName(workingMetadata.name)
          .withSymbol(workingMetadata.symbol)
          .withDescription(workingMetadata.description)
          .withImage(
            new File(
              [/* data for png as bytes or file from user */ blob],
              `${workingMetadata.symbol}.png`,
              { type: "image/png" }
            )
          )
          .withProperties(workingMetadata.properties)
          .upload(createZoraUploaderForCreator(address as Address));
        createdMetadata = createMetadataParameters.metadata;
      }
      // Use this directly with the create coin APIs:
      // metadata: createMetadataParameters.metadata
      //   const metadata = createMetadataParameters.metadata;

      const res = await createCoin({
        call: {
          creator: address as `0x${string}`,
          name: workingMetadata.name,
          symbol: workingMetadata.symbol,
          metadata: createdMetadata,
          currency: CreateConstants.ContentCoinCurrencies.ETH, // Base Sepolia는 ETH
          chainId: baseSepolia.id,
          startingMarketCap: CreateConstants.StartingMarketCaps.LOW,
        },
        walletClient, // wagmi -> viem WalletClient
        publicClient, // wagmi -> viem PublicClient
        // options: {
        //   skipValidateTransaction: true
        // }
      });

      // SDK가 반환하는 형태에 맞춰 파싱 (문서 예시대로)
      setTxHash(res?.hash);
      setCoinAddress(res?.address);

      if (LLM_AGENT_URL && res?.hash && res?.address) {
        const payload = {
          chainId: baseSepolia.id,
          ownerAddress: address,
          txHash: res.hash,
          coinAddress: res.address,
          factory: "zora-factory" as const,
          name: workingMetadata.name,
          symbol: workingMetadata.symbol,
        };

        const result = await fetch(`${LLM_AGENT_URL}/api/coin/deployments`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }).catch((postError) => {
          console.error("Failed to record deployment:", postError);
        });
        console.log(result);
      } else if (!LLM_AGENT_URL) {
        console.warn(
          "LLM_AGENT_URL is not configured; skipping deployment log."
        );
      }
    } catch (e: any) {
      console.error(e);
      alert(e.message ?? "createCoin 실패");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <button
        onClick={onClick}
        disabled={loading}
        className="relative rounded px-4 py-2 border"
        style={{
          padding: 0,
          border: "none",
          background: "transparent",
          display: "inline-flex",
        }}
        aria-label={loading ? "발행 중..." : "Create Coin"}
      >
        <Image
          src={CreateCoinImage}
          alt="Create Coin"
          width={47}
          height={47}
          style={{ opacity: loading ? 0.6 : 1 }}
        />
      </button>
      {txHash && (
        <div>
          Tx:{" "}
          <a href={`https://sepolia.basescan.org/tx/${txHash}`} target="_blank">
            {txHash}
          </a>
        </div>
      )}
      {coinAddress && (
        <div>
          Coin:{" "}
          <a
            href={`https://sepolia.basescan.org/address/${coinAddress}`}
            target="_blank"
          >
            {coinAddress}
          </a>
        </div>
      )}
    </div>
  );
}
