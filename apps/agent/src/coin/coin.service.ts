import { Injectable, NotFoundException } from "@nestjs/common";
import { BaseService } from "src/base.service";
import { CommonResponseDto } from "src/common/dto/response/common-response.dto";
import { CoinMetadata } from "src/storage/coin/coin-metadata.entity";
import { CoinMetadataRepository } from "src/storage/coin/coin-metadata.repo";
import {
  CoinMetadataResponse,
  ConversationEntry,
  GetMetadataParams,
  ListMetadataQuery,
  RecordMetadataInput,
} from "./dto";

@Injectable()
export class CoinService extends BaseService {
  constructor(private readonly coinMetadataRepo: CoinMetadataRepository) {
    super();
  }
  healthCheck() {
    const statusCode = 200;
    this.logger.debug(`[${this.healthCheck.name}] ${statusCode}`);
    return (new CommonResponseDto().statusCode = statusCode);
  }

  async recordQuestionAndAnswer(
    input: RecordMetadataInput
  ): Promise<CoinMetadataResponse> {
    const ownerAddress = input.ownerAddress.toLowerCase();
    const question = input.question.trim();
    const agentAnswer = input.agentAnswer.trim();
    const description = this.normalizeOptionalString(input.description);
    const symbol = this.normalizeOptionalString(input.symbol);
    const image = this.normalizeOptionalString(input.image);
    const bannerImage = this.normalizeOptionalString(input.bannerImage);
    const featuredImage = this.normalizeOptionalString(input.featuredImage);
    const externalLink = this.normalizeOptionalString(input.externalLink);
    const collaborators =
      input.collaborators && input.collaborators.length > 0
        ? input.collaborators.map((address) => address.toLowerCase())
        : null;

    const existing = await this.coinMetadataRepo.findOneByOwner(
      input.chainId,
      ownerAddress
    );

    const conversationEntry: ConversationEntry = {
      question,
      agentAnswer,
      timestamp: new Date().toISOString(),
    };

    const properties = {
      ...(existing?.properties ?? {}),
      question: conversationEntry.question,
      agentAnswer: conversationEntry.agentAnswer,
      conversations: this.buildConversationHistory(existing, conversationEntry),
    };

    const metadata = await this.coinMetadataRepo.upsert({
      chainId: input.chainId,
      ownerAddress,
      name: input.name,
      symbol,
      description,
      image,
      bannerImage,
      featuredImage,
      externalLink,
      collaborators,
      properties,
    });

    return this.mapToResponse(metadata);
  }

  async listMetadata(
    query: ListMetadataQuery
  ): Promise<CoinMetadataResponse[]> {
    const limit = query.limit ?? 50;
    const offset = query.offset ?? 0;

    const items = await this.coinMetadataRepo.findMany(
      {
        chainId: query.chainId,
        ownerAddress: query.ownerAddress?.toLowerCase(),
      },
      limit,
      offset
    );

    return items.map((item) => this.mapToResponse(item));
  }

  async getMetadata({
    chainId,
    ownerAddress,
    metadataId,
  }: GetMetadataParams): Promise<CoinMetadataResponse> {
    const metadata = await this.coinMetadataRepo.findOneByIdAndOwner(
      chainId,
      ownerAddress.toLowerCase(),
      metadataId
    );

    if (!metadata) {
      throw new NotFoundException(
        `Metadata not found for chainId ${chainId}, owner ${ownerAddress}, metadataId ${metadataId}`
      );
    }

    const data = this.mapToResponse(metadata);

    const keys = Object.keys(data);
    const values = Object.values(data);
    // this.logger.debug(`[${this.getMetadata.name}] keys : `, keys);
    // this.logger.debug(`[${this.getMetadata.name}] values : `, values);

    const result = new Object();
    for (const [index, key] of keys.entries()) {
      if (data[key] === null) continue;
      Object.assign(result, { [key]: data[key] });
    }
    return result as CoinMetadataResponse;
  }

  private mapToResponse(entity: CoinMetadata): CoinMetadataResponse {
    return {
      id: entity.id,
      chainId: entity.chainId,
      ownerAddress: entity.ownerAddress,
      name: entity.name,
      symbol: entity.symbol,
      description: entity.description ?? null,
      image: entity.image ?? null,
      bannerImage: entity.bannerImage ?? null,
      featuredImage: entity.featuredImage ?? null,
      externalLink: entity.externalLink ?? null,
      collaborators: entity.collaborators ?? null,
      properties: entity.properties ?? null,
      createdAt: entity.createdAt.toISOString(),
      updatedAt: entity.updatedAt.toISOString(),
    };
  }

  private buildConversationHistory(
    existing: CoinMetadata | null,
    latest: ConversationEntry
  ): ConversationEntry[] {
    const rawEntries = Array.isArray(existing?.properties?.conversations)
      ? (existing?.properties?.conversations as ConversationEntry[])
      : [];

    const sanitized = rawEntries
      .filter(
        (entry) =>
          entry &&
          typeof entry.question === "string" &&
          typeof entry.agentAnswer === "string"
      )
      .map((entry) => ({
        question: entry.question,
        agentAnswer: entry.agentAnswer,
        timestamp:
          typeof entry.timestamp === "string"
            ? entry.timestamp
            : new Date().toISOString(),
      }));

    const combined = [...sanitized, latest];
    const MAX_HISTORY = 50;
    return combined.length > MAX_HISTORY
      ? combined.slice(combined.length - MAX_HISTORY)
      : combined;
  }

  private normalizeOptionalString(value?: string | null): string | null {
    if (value === undefined || value === null) {
      return null;
    }
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : null;
  }
}
