import { useQuery, UseQueryOptions } from "@tanstack/react-query";

const AGENT_BASE_URL = process.env.NEXT_PUBLIC_LLM_AGENT_URL;

export type CoinDeployment = {
  id: string;
  chainId: number;
  ownerAddress: string;
  txHash: string;
  coinAddress: string;
  factory: string;
  name?: string | null;
  symbol?: string | null;
  createdAt?: string;
  confirmedAt?: string | null;
};

type CoinDeploymentResponse = {
  data: CoinDeployment[];
};

async function fetchCoinDeployments(
  ownerAddress: string
): Promise<CoinDeployment[]> {
  if (!AGENT_BASE_URL) {
    throw new Error("NEXT_PUBLIC_LLM_AGENT_URL is not configured");
  }

  const params = new URLSearchParams({
    ownerAddress,
  });

  const response = await fetch(
    `${AGENT_BASE_URL}/api/coin/deployments?${params.toString()}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "true",
      },
      cache: "no-store",
    }
  );

  if (!response.ok) {
    const errorText = await response.text().catch(() => "");
    throw new Error(
      errorText || `Failed to fetch coin deployments: HTTP ${response.status}`
    );
  }

  const payload = (await response.json()) as
    | CoinDeploymentResponse
    | CoinDeployment[];
  if (Array.isArray(payload)) {
    return payload;
  }
  return payload.data ?? [];
}

export function useCoinDeployments(
  ownerAddress?: string | null,
  options?: UseQueryOptions<CoinDeployment[], Error>
) {
  return useQuery<CoinDeployment[], Error>({
    queryKey: ["coin-deployments", ownerAddress?.toLowerCase()],
    queryFn: () => fetchCoinDeployments(ownerAddress as string),
    enabled: Boolean(ownerAddress),
    refetchOnWindowFocus: false,
    staleTime: 60_000,
    ...options,
  });
}
