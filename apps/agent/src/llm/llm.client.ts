import { Injectable, Logger } from '@nestjs/common';
import { createParser, ParsedEvent, ReconnectInterval } from 'eventsource-parser';
import { ChatMessage, ChatRequest } from '../chat/dto';

export interface CompletionUsage {
  prompt_tokens?: number;
  completion_tokens?: number;
  total_tokens?: number;
}

export interface CompletionResult {
  content: string;
  usage?: CompletionUsage;
}

export type CompletionStream = AsyncIterable<string>;

export interface CompletionOptions
  extends Omit<ChatRequest, 'messages'> {
  messages: ChatMessage[];
}

@Injectable()
export class LlmClient {
  private readonly logger = new Logger(LlmClient.name);
  private readonly baseUrl =
    process.env.OPENAI_BASE_URL || 'https://api.openai.com';
  private readonly apiKey = process.env.OPENAI_API_KEY;
  private readonly defaultModel =
    process.env.OPENAI_MODEL || 'gpt-4o-mini';
  private readonly endpoint = `${this.baseUrl}/v1/chat/completions`;

  private buildHeaders() {
    if (!this.apiKey) {
      throw new Error(
        'OPENAI_API_KEY is not configured. Please set the environment variable.',
      );
    }

    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.apiKey}`,
    };
  }

  private buildPayload(options: CompletionOptions, stream: boolean) {
    return JSON.stringify({
      model: options.model ?? this.defaultModel,
      messages: options.messages,
      temperature: options.temperature,
      max_tokens: options.max_tokens,
      user: options.user,
      stream,
      tools: options.tools,
      tool_choice: options.tool_choice,
    });
  }

  async createCompletion(options: CompletionOptions): Promise<CompletionResult> {
    const response = await fetch(this.endpoint, {
      method: 'POST',
      headers: this.buildHeaders(),
      body: this.buildPayload(options, false),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      this.logger.error(`LLM request failed: ${errorBody}`);
      throw new Error(`LLM request failed with status ${response.status}`);
    }

    const json = (await response.json()) as any;
    const message = json.choices?.[0]?.message?.content ?? '';
    return {
      content: message,
      usage: json.usage,
    };
  }

  async *createCompletionStream(
    options: CompletionOptions,
  ): CompletionStream {
    const response = await fetch(this.endpoint, {
      method: 'POST',
      headers: this.buildHeaders(),
      body: this.buildPayload(options, true),
    });

    if (!response.ok || !response.body) {
      const errorText = await response.text().catch(() => 'Unknown error');
      this.logger.error(
        `Streaming LLM request failed: ${response.status} ${errorText}`,
      );
      throw new Error(
        `Streaming LLM request failed with status ${response.status}`,
      );
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    let done = false;

    const queued: string[] = [];

    const parser = createParser((event: ParsedEvent | ReconnectInterval) => {
      if (event.type !== 'event') {
        return;
      }

      const data = event.data;

      if (data === '[DONE]') {
        done = true;
        return;
      }

      try {
        const json = JSON.parse(data);
        const delta =
          json.choices?.[0]?.delta?.content ??
          json.choices?.[0]?.message?.content;
        if (delta) {
          queued.push(delta);
        }
      } catch (error) {
        this.logger.warn(`Failed to parse stream chunk: ${error}`);
      }
    });

    while (true) {
      const { value, done: readerDone } = await reader.read();
      if (readerDone) {
        break;
      }
      parser.feed(decoder.decode(value, { stream: true }));
      while (queued.length > 0) {
        const token = queued.shift();
        if (token) {
          yield token;
        }
      }
    }

    if (!done) {
      // final flush for any buffered tokens
      while (queued.length > 0) {
        const token = queued.shift();
        if (token) {
          yield token;
        }
      }
    }
  }
}
