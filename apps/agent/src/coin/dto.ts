import { z } from "zod";

const addressRegex = /^0x[0-9a-fA-F]{40}$/;

export const RecordMetadataSchema = z.object({
  chainId: z.coerce.number().int().positive(),
  ownerAddress: z
    .string()
    .min(1)
    .regex(addressRegex, "ownerAddress must be a valid hex address"),
  name: z.string().min(1).max(80),
  symbol: z.string().min(1).max(32).optional(),
  description: z.string().max(2000).optional(),
  image: z.string().max(2048).optional(),
  bannerImage: z.string().max(2048).optional(),
  featuredImage: z.string().max(2048).optional(),
  externalLink: z.string().max(2048).optional(),
  collaborators: z
    .array(
      z
        .string()
        .regex(addressRegex, "collaborator address must be a valid hex address")
    )
    .max(50)
    .optional(),
  question: z.string().min(1),
  agentAnswer: z.string().min(1),
});

export type RecordMetadataInput = z.infer<typeof RecordMetadataSchema>;

export const GetMetadataParamsSchema = z.object({
  chainId: z.coerce.number().int().positive(),
  ownerAddress: z
    .string()
    .regex(addressRegex, "ownerAddress must be a valid hex address"),
  metadataId: z.string().uuid(),
});

export type GetMetadataParams = z.infer<typeof GetMetadataParamsSchema>;

export const ListMetadataQuerySchema = z.object({
  chainId: z.coerce.number().int().positive().optional(),
  ownerAddress: z
    .string()
    .regex(addressRegex, "ownerAddress must be a valid hex address")
    .optional(),
  limit: z.coerce.number().int().positive().max(200).optional(),
  offset: z.coerce.number().int().nonnegative().optional(),
});

export type ListMetadataQuery = z.infer<typeof ListMetadataQuerySchema>;

export type ConversationEntry = {
  question: string;
  agentAnswer: string;
  timestamp: string;
};

export type CoinMetadataResponse = {
  id: string;
  chainId: number;
  ownerAddress: string;
  name: string;
  symbol?: string | null;
  description?: string | null;
  image?: string | null;
  bannerImage?: string | null;
  featuredImage?: string | null;
  externalLink?: string | null;
  collaborators?: string[] | null;
  properties?: {
    question?: string;
    agentAnswer?: string;
    conversations?: ConversationEntry[];
    [key: string]: unknown;
  } | null;
  createdAt: string;
  updatedAt: string;
};
