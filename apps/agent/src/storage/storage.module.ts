import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessageEntity } from './message.entity';
import { MessageRepo } from './message.repo';

@Module({
  imports: [TypeOrmModule.forFeature([MessageEntity])],
  providers: [MessageRepo],
  exports: [MessageRepo],
})
export class StorageModule {}
