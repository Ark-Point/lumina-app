import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CoinDeployment } from "./coin/coin-deployment.entity";
import { CoinDeploymentRepository } from "./coin/coin-deployment.repo";
import { MessageEntity } from "./message/message.entity";
import { MessageRepo } from "./message/message.repo";

@Module({
  imports: [TypeOrmModule.forFeature([MessageEntity, CoinDeployment])],
  providers: [MessageRepo, CoinDeploymentRepository],
  exports: [MessageRepo, CoinDeploymentRepository],
})
export class StorageModule {}
