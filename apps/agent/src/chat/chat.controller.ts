import {
  BadRequestException,
  Body,
  Controller,
  MessageEvent,
  Post,
  Res,
  Sse,
} from '@nestjs/common';
import { Response } from 'express';
import { Observable } from 'rxjs';
import { ChatRequestSchema, ChatRequest } from './dto';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  async chat(@Body() body: unknown) {
    const parsed = ChatRequestSchema.safeParse(body);
    if (!parsed.success) {
      throw new BadRequestException(parsed.error.format());
    }

    const result = await this.chatService.createCompletion(parsed.data);
    return result;
  }

  @Post('stream')
  async chatStream(
    @Body() body: unknown,
    @Res() res: Response,
  ): Promise<void> {
    const parsed = ChatRequestSchema.safeParse(body);
    if (!parsed.success) {
      throw new BadRequestException(parsed.error.format());
    }

    return this.chatService.streamCompletion(parsed.data, res);
  }

  @Sse('events')
  heartbeat(): Observable<MessageEvent> {
    return this.chatService.heartbeat();
  }
}
