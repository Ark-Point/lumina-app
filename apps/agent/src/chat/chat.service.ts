import { Injectable, Logger, Optional, MessageEvent } from '@nestjs/common';
import { Response } from 'express';
import { interval, map, Observable } from 'rxjs';
import { ChatMessage, ChatRequest } from './dto';
import { LlmClient } from '../llm/llm.client';
import { MessageRepo } from '../storage/message.repo';

@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name);

  constructor(
    private readonly llmClient: LlmClient,
    @Optional() private readonly messageRepo?: MessageRepo,
  ) {}

  private async prepareMessages(request: ChatRequest) {
    const history =
      request.conversationId && this.messageRepo
        ? await this.messageRepo.loadConversation(request.conversationId)
        : [];

    const finalMessages = [...history, ...request.messages];
    const newMessages = request.messages.filter(
      (msg) => msg.role !== 'assistant',
    );

    return { finalMessages, newMessages };
  }

  async createCompletion(request: ChatRequest) {
    const { finalMessages, newMessages } = await this.prepareMessages(request);

    const result = await this.llmClient.createCompletion({
      ...request,
      messages: finalMessages,
    });

    await this.persistConversation(
      request.conversationId,
      newMessages,
      result.content,
    );

    return {
      message: result.content,
      usage: result.usage,
    };
  }

  async streamCompletion(
    request: ChatRequest,
    res: Response,
  ): Promise<void> {
    const { finalMessages, newMessages } = await this.prepareMessages(request);

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('Connection', 'keep-alive');
    res.status(200);
    res.flushHeaders?.();

    try {
      let accumulated = '';
      const stream = this.llmClient.createCompletionStream({
        ...request,
        messages: finalMessages,
      });

      for await (const chunk of stream) {
        accumulated += chunk;
        res.write(`data: ${JSON.stringify({ content: chunk })}\n\n`);
      }

      res.write('data: [DONE]\n\n');
      res.end();

      await this.persistConversation(
        request.conversationId,
        newMessages,
        accumulated,
      );
    } catch (error) {
      const err = error as Error;
      this.logger.error(
        `Streaming completion failed: ${err.message}`,
        err.stack,
      );
      res.write(
        `event: error\ndata: ${JSON.stringify({
          message: 'Failed to stream completion',
        })}\n\n`,
      );
      res.end();
    }
  }

  heartbeat(): Observable<MessageEvent> {
    return interval(15000).pipe(
      map(() => ({
        data: { uptime: process.uptime() },
      })),
    );
  }

  private async persistConversation(
    conversationId: string | undefined,
    userMessages: ChatMessage[],
    assistantReply: string,
  ) {
    if (
      !conversationId ||
      !this.messageRepo ||
      userMessages.length === 0 ||
      !assistantReply
    ) {
      return;
    }

    await this.messageRepo.saveExchange(
      conversationId,
      userMessages,
      assistantReply,
    );
  }
}
