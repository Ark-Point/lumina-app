import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOptionsWhere, Repository } from "typeorm";

import { normalizeAddress } from "../../utils/evm";
import { CoinMetadata } from "./coin-metadata.entity";

export type UpsertCoinMetadataInput = {
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
  properties?: Record<string, any> | null;
};

@Injectable()
export class CoinMetadataRepository {
  constructor(
    @InjectRepository(CoinMetadata)
    private readonly repo: Repository<CoinMetadata>
  ) {}

  /** chainId + ownerAddress로 1건 조회 */
  async findOneByOwner(
    chainId: number,
    ownerAddress: string
  ): Promise<CoinMetadata | null> {
    const owner = normalizeAddress(ownerAddress);
    return this.repo.findOne({ where: { chainId, ownerAddress: owner } });
  }

  async findOneByIdAndOwner(
    chainId: number,
    ownerAddress: string,
    metadataId: string
  ): Promise<CoinMetadata | null> {
    const owner = normalizeAddress(ownerAddress);
    return this.repo.findOne({
      where: { id: metadataId, chainId, ownerAddress: owner },
    });
  }

  /** 최신 생성 순으로 여러 건 조회 (옵션) */
  async findMany(
    where: Partial<Pick<CoinMetadata, "chainId">> & { ownerAddress?: string },
    limit = 50,
    offset = 0
  ) {
    const whereClause: FindOptionsWhere<CoinMetadata> = {};
    if (where.chainId) whereClause.chainId = where.chainId;
    if (where.ownerAddress)
      whereClause.ownerAddress = normalizeAddress(where.ownerAddress);
    return this.repo.find({
      where: whereClause,
      order: { createdAt: "DESC" },
      take: Math.min(limit, 200),
      skip: Math.max(offset, 0),
    });
  }

  /** 존재하면 업데이트, 없으면 생성 (chainId + ownerAddress 유니크 기준) */
  async upsert(data: UpsertCoinMetadataInput): Promise<CoinMetadata> {
    const owner = normalizeAddress(data.ownerAddress);
    const existing = await this.findOneByOwner(data.chainId, owner);
    if (existing) {
      this.repo.merge(existing, {
        name: data.name,
        symbol: data.symbol ?? null,
        description: data.description ?? null,
        image: data.image ?? null,
        bannerImage: data.bannerImage ?? null,
        featuredImage: data.featuredImage ?? null,
        externalLink: data.externalLink ?? null,
        collaborators: data.collaborators ?? null,
        properties: data.properties ?? null,
      });
      return this.repo.save(existing);
    }
    const created = this.repo.create({
      chainId: data.chainId,
      ownerAddress: owner,
      name: data.name,
      symbol: data.symbol ?? null,
      description: data.description ?? null,
      image: data.image ?? null,
      bannerImage: data.bannerImage ?? null,
      featuredImage: data.featuredImage ?? null,
      externalLink: data.externalLink ?? null,
      collaborators: data.collaborators ?? null,
      properties: data.properties ?? null,
    });
    return this.repo.save(created);
  }
}
