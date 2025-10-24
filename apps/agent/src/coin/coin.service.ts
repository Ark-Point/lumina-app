import { Injectable } from "@nestjs/common";
import { BaseService } from "src/base.service";
import { CommonResponseDto } from "src/common/dto/response/common-response.dto";
import { CoinDeployment } from "src/storage/coin/coin-deployment.entity";
import { CoinDeploymentRepository } from "src/storage/coin/coin-deployment.repo";
import {
  CoinDeploymentResponse,
  RecordDeploymentInput,
  SymbolAvailabilityQuery,
} from "./dto";

@Injectable()
export class CoinService extends BaseService {
  constructor(private readonly coinDeploymentRepo: CoinDeploymentRepository) {
    super();
  }

  healthCheck() {
    const statusCode = 200;
    this.logger.debug(`[${this.healthCheck.name}] ${statusCode}`);
    return (new CommonResponseDto().statusCode = statusCode);
  }

  async recordDeployment(
    input: RecordDeploymentInput
  ): Promise<CoinDeploymentResponse> {
    const ownerAddress = input.ownerAddress.toLowerCase();
    const factory = input.factory ?? "zora-factory";
    const name = this.normalizeOptionalString(input.name);
    const symbol = this.normalizeOptionalString(input.symbol)?.toUpperCase();

    const deployment = await this.coinDeploymentRepo.recordDeployment({
      chainId: input.chainId,
      ownerAddress,
      txHash: input.txHash,
      coinAddress: input.coinAddress,
      factory,
      name,
      symbol,
    });

    return this.mapDeployment(deployment);
  }

  async isSymbolAvailable({
    chainId,
    symbol,
  }: SymbolAvailabilityQuery): Promise<{ available: boolean }> {
    const normalizedSymbol = symbol.trim().toUpperCase();
    if (!normalizedSymbol) {
      return { available: true };
    }
    const taken = await this.coinDeploymentRepo.isSymbolTaken(
      chainId,
      normalizedSymbol
    );
    return { available: !taken };
  }

  private mapDeployment(entity: CoinDeployment): CoinDeploymentResponse {
    return {
      id: entity.id,
      chainId: entity.chainId,
      ownerAddress: entity.ownerAddress,
      txHash: entity.txHash,
      coinAddress: entity.coinAddress,
      factory: entity.factory,
      name: entity.name ?? null,
      symbol: entity.symbol ?? null,
      status: entity.status,
      errorMessage: entity.errorMessage ?? null,
      createdAt: entity.createdAt.toISOString(),
      confirmedAt: entity.confirmedAt ? entity.confirmedAt.toISOString() : null,
    };
  }

  private normalizeOptionalString(value?: string | null): string | null {
    if (value === undefined || value === null) {
      return null;
    }
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : null;
  }
}
