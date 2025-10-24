import { z } from "zod";

const addressRegex = /^0x[0-9a-fA-F]{40}$/;
const txHashRegex = /^0x[0-9a-fA-F]{64}$/;

export const RecordDeploymentSchema = z.object({
  chainId: z.coerce.number().int().positive(),
  ownerAddress: z
    .string()
    .min(1)
    .regex(addressRegex, "ownerAddress must be a valid hex address"),
  txHash: z
    .string()
    .regex(txHashRegex, "txHash must be a valid 32-byte hex string"),
  coinAddress: z
    .string()
    .regex(addressRegex, "coinAddress must be a valid hex address"),
  factory: z.enum(["zora-factory", "oz-erc20"]).optional(),
  name: z.string().max(80).optional(),
  symbol: z.string().max(32).optional(),
});

export type RecordDeploymentInput = z.infer<typeof RecordDeploymentSchema>;

export const SymbolAvailabilityQuerySchema = z.object({
  chainId: z.coerce.number().int().positive(),
  symbol: z.string().min(1).max(32),
});

export type SymbolAvailabilityQuery = z.infer<
  typeof SymbolAvailabilityQuerySchema
>;

export type CoinDeploymentResponse = {
  id: string;
  chainId: number;
  ownerAddress: string;
  txHash: string;
  coinAddress: string;
  factory: "zora-factory" | "oz-erc20";
  name?: string | null;
  symbol?: string | null;
  status: "pending" | "success" | "failed";
  errorMessage?: string | null;
  createdAt: string;
  confirmedAt?: string | null;
};
