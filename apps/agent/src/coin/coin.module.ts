import { Module } from "@nestjs/common";
import { StorageModule } from "src/storage/storage.module";
import { CoinController } from "./coin.controller";
import { CoinService } from "./coin.service";

@Module({
  imports: [StorageModule],
  controllers: [CoinController],
  providers: [CoinService],
})
export class CoinModule {}
