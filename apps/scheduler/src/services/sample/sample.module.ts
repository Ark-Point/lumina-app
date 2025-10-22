import { DatabaseModule } from "@lumina-app/database";
import { Module } from "@nestjs/common";
import { SampleService } from "./sample.service";

@Module({
  imports: [DatabaseModule],
  providers: [SampleService],
  controllers: [],
  exports: [SampleService],
})
export class SampleModule {}
