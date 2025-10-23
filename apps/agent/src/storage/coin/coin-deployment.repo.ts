import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOptionsWhere, Repository } from "typeorm";

import { normalizeAddress } from "../..//utils/evm";
import { CoinDeployment } from "./coin-deployment.entity";

type CreateDeploymentInput = {
  chainId: number;
  ownerAddress: string;
  txHash: string; // 0x + 64
  coinAddress: string; // 0x + 40
  factory: "zora-factory" | "oz-erc20";
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
      status: "pending",
      errorMessage: null,
      confirmedAt: null,
    });
    return this.repo.save(entity);
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

  /** 소유자 기준 목록 조회 */
  async listByOwner(
    chainId: number,
    ownerAddress: string,
    limit = 50,
    offset = 0
  ) {
    const owner = normalizeAddress(ownerAddress);
    const where: FindOptionsWhere<CoinDeployment> = {
      chainId,
      ownerAddress: owner,
    };
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
}
