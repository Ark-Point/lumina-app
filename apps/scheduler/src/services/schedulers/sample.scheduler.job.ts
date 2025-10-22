import { Injectable, Logger } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";
import { SampleService } from "../sample/sample.service";

@Injectable()
export class SampleSchedulerJob {
  private readonly logger = new Logger(SampleSchedulerJob.name);

  constructor(private readonly sampleService: SampleService) {}

  // 매 5분 (환경변수로 제어 가능)
  @Cron(process.env.CRON_SAMPLE_SCHEDULING ?? "* * * * * *", {
    timeZone: process.env.TZ ?? "Asia/Seoul",
  })
  async handle() {
    try {
      this.logger.log(
        `[${SampleSchedulerJob.name} / ${this.handle.name}] Starting Sample Scheduling ...`
      );

      const response = await this.sampleService.getAPIHealthCheck();

      this.logger.debug(
        `[${SampleSchedulerJob.name} / ${this.handle.name}] api health check : `,
        response
      );
    } catch (e: any) {
      this.logger.error(
        `[${SampleSchedulerJob.name} / ${this.handle.name}] Error :`,
        e?.message ?? e
      );
    }
  }
}
