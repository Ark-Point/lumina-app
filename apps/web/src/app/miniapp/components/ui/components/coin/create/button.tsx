"use client";

import { useState } from "react";
import { baseSepolia } from "viem/chains";
import {
  useAccount,
  usePublicClient,
  useSwitchChain,
  useWalletClient,
} from "wagmi";
// ⬇️ 실제 SDK import는 Zora 문서의 패키지명을 그대로 사용하세요.
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
export function CreateCoinButton(metadata: CreateCoinMetadata) {
  const { address, chainId, isConnected } = useAccount();
  const publicClient = usePublicClient({ chainId: baseSepolia.id }); // viem PublicClient
  const { data: walletClient } = useWalletClient({ chainId: baseSepolia.id }); // viem WalletClient
  const { switchChain } = useSwitchChain();

  const [loading, setLoading] = useState(false);
  const [txHash, setTxHash] = useState<string>();
  const [coinAddress, setCoinAddress] = useState<`0x${string}`>();

  const onClick = async () => {
    try {
      console.log(`
            address=${address}\n
            chainId=${chainId}\n
            isConnected=${isConnected}\n
            `);
      console.log("publicClient: ", publicClient);
      console.log("walletClient: ", walletClient);
      if (!isConnected || !address) throw new Error("Wallet not connected.");
      if (chainId !== baseSepolia.id) {
        // 체인 스위치 유도 (지갑에서 승인)
        await switchChain({ chainId: baseSepolia.id });
      }
      if (!publicClient || !walletClient)
        throw new Error("client initialize Failed... ");

      setLoading(true);

      let createdMetadata = undefined;
      if (metadata?.image) {
        const image = await fetch(metadata?.image);
        const blob = await image.blob();

        const { createMetadataParameters } = await createMetadataBuilder()
          .withName(metadata.name)
          .withSymbol(metadata.symbol)
          .withDescription(metadata.description)
          .withImage(
            new File(
              [/* data for png as bytes or file from user */ blob],
              `${metadata.symbol}.png`,
              { type: "image/png" }
            )
          )
          .withProperties(metadata.properties)
          .upload(createZoraUploaderForCreator(address as Address));
        createdMetadata = createMetadataParameters.metadata;
      } else {
        const appIcon = await fetch("/miniapp/icon.png");
        const blob = await appIcon.blob();

        const { createMetadataParameters } = await createMetadataBuilder()
          .withName(metadata.name)
          .withSymbol(metadata.symbol)
          .withDescription(metadata.description)
          .withImage(
            new File(
              [/* data for png as bytes or file from user */ blob],
              `${metadata.symbol}.png`,
              { type: "image/png" }
            )
          )
          .withProperties(metadata.properties)
          .upload(createZoraUploaderForCreator(address as Address));
        createdMetadata = createMetadataParameters.metadata;
      }
      // Use this directly with the create coin APIs:
      // metadata: createMetadataParameters.metadata
      //   const metadata = createMetadataParameters.metadata;

      const res = await createCoin({
        call: {
          creator: address as `0x${string}`,
          name: metadata.name,
          symbol: metadata.symbol,
          metadata: createdMetadata,
          currency: CreateConstants.ContentCoinCurrencies.ETH, // Base Sepolia는 ETH
          chainId: baseSepolia.id,
          startingMarketCap: CreateConstants.StartingMarketCaps.LOW,
        },
        walletClient, // wagmi -> viem WalletClient
        publicClient, // wagmi -> viem PublicClient
      });

      // SDK가 반환하는 형태에 맞춰 파싱 (문서 예시대로)
      setTxHash(res?.hash);
      setCoinAddress(res?.address);

      // 여기서 서버에 배포 결과 기록 (POST /coins/deploy 등)
      // await fetch('/api/coins/deploy', { method:'POST', ... })
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
        className="rounded px-4 py-2 border"
      >
        {loading ? "발행 중..." : "Create Coin (Zora)"}
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
