import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '@lumina-app/database';
import { ChatModule } from './chat/chat.module';
import { LlmModule } from './llm/llm.module';
import { StorageModule } from './storage/storage.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule.forRoot(),
    LlmModule,
    ChatModule,
    StorageModule,
  ],
})
export class AppModule {}
