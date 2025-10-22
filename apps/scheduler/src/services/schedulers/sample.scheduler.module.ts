import { Module } from "@nestjs/common";
import { SampleModule } from "../sample/sample.module";
import { SampleSchedulerJob } from "./sample.scheduler.job";

@Module({
  imports: [SampleModule],
  providers: [SampleSchedulerJob],
})
export class SampleSchedulerModule {}
