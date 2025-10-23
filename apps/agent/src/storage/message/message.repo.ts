import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ChatMessage } from "../../chat/dto";
import { MessageEntity, StoredRole } from "./message.entity";

@Injectable()
export class MessageRepo {
  constructor(
    @InjectRepository(MessageEntity)
    private readonly repo: Repository<MessageEntity>
  ) {}

  async loadConversation(conversationId: string) {
    const rows = await this.repo.find({
      where: { conversationId },
      order: { createdAt: "ASC" },
    });
    return rows.map((row) => ({
      role: row.role as ChatMessage["role"],
      content: row.content,
    }));
  }

  async saveExchange(
    conversationId: string | undefined,
    userMessages: ChatMessage[],
    assistantReply: string
  ) {
    if (!conversationId) {
      return;
    }

    const toPersist: MessageEntity[] = [
      ...userMessages.map((message) =>
        this.repo.create({
          conversationId,
          role: message.role as StoredRole,
          content: message.content,
        })
      ),
      this.repo.create({
        conversationId,
        role: "assistant",
        content: assistantReply,
      }),
    ];

    if (toPersist.length > 0) {
      await this.repo.save(toPersist);
    }
  }
}
