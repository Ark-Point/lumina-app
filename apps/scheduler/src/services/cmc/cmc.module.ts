import { DatabaseModule } from "@lumina-app/database";
import { Module } from "@nestjs/common";

import { CMCService } from "./cmc.service";

@Module({
  imports: [DatabaseModule],
  providers: [CMCService],
  controllers: [],
  exports: [CMCService],
})
export class CMCModule {}
