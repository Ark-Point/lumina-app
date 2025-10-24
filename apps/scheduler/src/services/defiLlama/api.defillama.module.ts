import { DatabaseModule } from "@lumina-app/database";
import { Module } from "@nestjs/common";
import { ApiDefiLlamaService } from "./api.defillama.service";

@Module({
  imports: [DatabaseModule],
  providers: [ApiDefiLlamaService],
  controllers: [],
  exports: [ApiDefiLlamaService],
})
export class ApiDefiLlamaModule {}
