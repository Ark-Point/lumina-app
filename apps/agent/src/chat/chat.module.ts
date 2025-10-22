import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { LlmModule } from '../llm/llm.module';
import { StorageModule } from '../storage/storage.module';

@Module({
  imports: [LlmModule, StorageModule],
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatModule {}
