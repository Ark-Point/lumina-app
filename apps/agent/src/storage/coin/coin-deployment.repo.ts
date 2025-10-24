import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOptionsWhere, Repository } from "typeorm";

import { normalizeAddress } from "../../utils/evm";
import { CoinDeployment } from "./coin-deployment.entity";

type CreateDeploymentInput = {
  chainId: number;
  ownerAddress: string;
  txHash: string; // 0x + 64
  coinAddress: string; // 0x + 40
  factory: "zora-factory" | "oz-erc20";
  name?: string | null;
  symbol?: string | null;
};

@Injectable()
export class CoinDeploymentRepository {
  constructor(
    @InjectRepository(CoinDeployment)
    private readonly repo: Repository<CoinDeployment>
  ) {}

  /** 배포 레코드 생성(pending) */
  async createPending(input: CreateDeploymentInput): Promise<CoinDeployment> {
    const owner = normalizeAddress(input.ownerAddress);
    const coin = normalizeAddress(input.coinAddress);
    const tx = input.txHash.toLowerCase();
    if (!/^0x[0-9a-f]{64}$/.test(tx)) throw new Error("invalid txHash");

    const entity = this.repo.create({
      chainId: input.chainId,
      ownerAddress: owner,
      txHash: tx,
      coinAddress: coin,
      factory: input.factory,
      name: input.name ?? null,
      symbol: input.symbol ?? null,
      status: "pending",
      errorMessage: null,
      confirmedAt: null,
    });
    return this.repo.save(entity);
  }

  async recordDeployment(
    input: CreateDeploymentInput & { confirmedAt?: Date }
  ): Promise<CoinDeployment> {
    const owner = normalizeAddress(input.ownerAddress);
    const coin = normalizeAddress(input.coinAddress);
    const tx = input.txHash.toLowerCase();
    if (!/^0x[0-9a-f]{64}$/.test(tx)) throw new Error("invalid txHash");

    const existing = await this.findByTx(input.chainId, tx);

    const normalizedSymbol =
      typeof input.symbol === "string"
        ? input.symbol.trim().toUpperCase() || null
        : null;
    const normalizedName =
      typeof input.name === "string" ? input.name.trim() || null : null;

    if (existing) {
      existing.coinAddress = coin;
      existing.factory = input.factory;
      existing.name = normalizedName;
      existing.symbol = normalizedSymbol;
      existing.status = "success";
      existing.errorMessage = null;
      existing.confirmedAt = input.confirmedAt ?? new Date();
      return this.repo.save(existing);
    }

    const created = this.repo.create({
      chainId: input.chainId,
      ownerAddress: owner,
      txHash: tx,
      coinAddress: coin,
      factory: input.factory,
      name: normalizedName,
      symbol: normalizedSymbol,
      status: "success",
      errorMessage: null,
      confirmedAt: input.confirmedAt ?? new Date(),
    });
    return this.repo.save(created);
  }

  /** txHash로 1건 조회 */
  async findByTx(
    chainId: number,
    txHash: string
  ): Promise<CoinDeployment | null> {
    return this.repo.findOne({
      where: { chainId, txHash: txHash.toLowerCase() },
    });
  }

  /** 코인 주소로 최신 1건 조회 */
  async findLatestByCoin(
    chainId: number,
    coinAddress: string
  ): Promise<CoinDeployment | null> {
    const coin = normalizeAddress(coinAddress);
    return this.repo.findOne({
      where: { chainId, coinAddress: coin },
      order: { createdAt: "DESC" },
    });
  }

  /** 소유자 기준 목록 조회 (체인 옵션) */
  async listByOwner(
    ownerAddress: string,
    { chainId, limit = 50, offset = 0 }: { chainId?: number; limit?: number; offset?: number } = {}
  ) {
    const owner = normalizeAddress(ownerAddress);
    const where: FindOptionsWhere<CoinDeployment> = {
      ownerAddress: owner,
    };
    if (typeof chainId === "number") {
      where.chainId = chainId;
    }
    return this.repo.find({
      where,
      order: { createdAt: "DESC" },
      take: Math.min(limit, 200),
      skip: Math.max(offset, 0),
    });
  }

  /** 상태 업데이트: success */
  async markSuccess(
    chainId: number,
    txHash: string,
    confirmedAt?: Date
  ): Promise<CoinDeployment | null> {
    const rec = await this.findByTx(chainId, txHash);
    if (!rec) return null;
    rec.status = "success";
    rec.errorMessage = null;
    rec.confirmedAt = confirmedAt ?? new Date();
    return this.repo.save(rec);
  }

  /** 상태 업데이트: failed (에러 메시지 포함) */
  async markFailed(
    chainId: number,
    txHash: string,
    reason: string
  ): Promise<CoinDeployment | null> {
    const rec = await this.findByTx(chainId, txHash);
    if (!rec) return null;
    rec.status = "failed";
    rec.errorMessage = reason.slice(0, 2000);
    rec.confirmedAt = rec.confirmedAt ?? null;
    return this.repo.save(rec);
  }

  async isSymbolTaken(chainId: number, symbol: string): Promise<boolean> {
    const normalized = symbol.trim().toUpperCase();
    if (!normalized) return false;
    const existing = await this.repo.findOne({
      where: { chainId, symbol: normalized },
    });
    return Boolean(existing);
  }
}
