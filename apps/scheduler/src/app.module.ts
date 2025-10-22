import "@lumina-app/config";
import { DatabaseModule } from "@lumina-app/database";
import { Module } from "@nestjs/common";
import { ScheduleModule } from "@nestjs/schedule";
import { SampleModule } from "./services/sample/sample.module";
import { SampleSchedulerModule } from "./services/schedulers/sample.scheduler.module";

@Module({
  imports: [
    DatabaseModule.forRoot(),
    DatabaseModule.forFeature(),
    ScheduleModule.forRoot(), // 크론/인터벌 구동
    // Domain API services only
    SampleModule,

    // Schedulers
    SampleSchedulerModule,
  ],
})
export class AppModule {}
