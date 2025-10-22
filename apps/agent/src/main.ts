import 'reflect-metadata';
import '@lumina-app/config';
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule, { cors: true });
  app.setGlobalPrefix('api');

  const port = Number(process.env.LLM_AGENT_PORT || process.env.API_PORT || 3100);
  await app.listen(port);
  logger.log(`LLM Agent listening on http://localhost:${port}/api`);
}

bootstrap();
