import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CoinDeployment } from "./coin/coin-deployment.entity";
import { CoinDeploymentRepository } from "./coin/coin-deployment.repo";
import { CoinMetadata } from "./coin/coin-metadata.entity";
import { CoinMetadataRepository } from "./coin/coin-metadata.repo";
import { MessageEntity } from "./message/message.entity";
import { MessageRepo } from "./message/message.repo";

@Module({
  imports: [
    TypeOrmModule.forFeature([MessageEntity, CoinMetadata, CoinDeployment]),
  ],
  providers: [MessageRepo, CoinMetadataRepository, CoinDeploymentRepository],
  exports: [MessageRepo, CoinMetadataRepository, CoinDeploymentRepository],
})
export class StorageModule {}
