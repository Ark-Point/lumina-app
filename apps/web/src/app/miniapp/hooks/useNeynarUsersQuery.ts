import { useQuery, UseQueryOptions } from "@tanstack/react-query";

const API_BASE = process.env.NEXT_PUBLIC_NEYNAR_API_BASE;
const API_KEY = process.env.NEXT_PUBLIC_NEYNAR_API_KEY;

export type NeynarProfile = {
  fid: number;
  username?: string;
  display_name?: string;
  pfp_url?: string;
  profile?: {
    bio?: {
      text: string;
    };
  };
  follower_count?: number;
  following_count?: number;
};

type NeynarBulkResponse = {
  users: NeynarProfile[];
};

async function fetchNeynarUsers(fids: number[]): Promise<NeynarProfile[]> {
  if (!API_BASE || !API_KEY) {
    throw new Error("Missing Neynar API configuration");
  }

  const params = new URLSearchParams({
    fids: fids.join(","),
  });

  const response = await fetch(
    `${API_BASE}/v2/farcaster/user/bulk?${params.toString()}`,
    {
      method: "GET",
      headers: {
        "x-api-key": API_KEY,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    }
  );

  if (!response.ok) {
    const errorText = await response.text().catch(() => "");
    throw new Error(
      errorText || `Failed to fetch Farcaster users: HTTP ${response.status}`
    );
  }

  const data: NeynarBulkResponse = await response.json();
  return data.users ?? [];
}

export function useNeynarUsersQuery(
  fids: number[] | undefined,
  options?: UseQueryOptions<NeynarProfile[], Error>
) {
  return useQuery<NeynarProfile[], Error>({
    queryKey: ["neynar-users", fids?.sort().join(",") ?? "none"],
    queryFn: () => fetchNeynarUsers(fids ?? []),
    enabled: Boolean(fids && fids.length > 0),
    staleTime: 60_000,
    refetchOnWindowFocus: false,
    ...options,
  });
}
