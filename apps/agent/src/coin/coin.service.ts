import { Injectable } from "@nestjs/common";
import { BaseService } from "src/base.service";
import { CommonResponseDto } from "src/common/dto/response/common-response.dto";
import { CoinDeploymentRepository } from "src/storage/coin/coin-deployment.repo";
import { CoinMetadataRepository } from "src/storage/coin/coin-metadata.repo";

@Injectable()
export class CoinService extends BaseService {
  constructor(
    private readonly coinMetadataRepo: CoinMetadataRepository,
    private readonly coinDeploymentRepo: CoinDeploymentRepository
  ) {
    super();
  }
  healthCheck() {
    const statusCode = 200;
    this.logger.debug(`[${this.healthCheck.name}] ${statusCode}`);
    return (new CommonResponseDto().statusCode = statusCode);
  }
}
