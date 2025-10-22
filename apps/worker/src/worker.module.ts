import '@lumina-app/config';
import { DatabaseModule } from '@lumina-app/database';
import { RedisModule } from '@lumina-app/redis';
import { Module } from '@nestjs/common';
import { QueueModule } from './worker/queue.module';

@Module({
  imports: [RedisModule.forRoot(), DatabaseModule.forRoot(), QueueModule],
})
export class WorkerModule {}
