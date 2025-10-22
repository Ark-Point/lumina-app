import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Index,
} from 'typeorm';

export type StoredRole = 'system' | 'user' | 'assistant';

@Entity('llm_chat_messages')
export class MessageEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index('idx_llm_conversation')
  @Column({ type: 'varchar', length: 255, nullable: true })
  conversationId!: string | null;

  @Column({ type: 'varchar', length: 32 })
  role!: StoredRole;

  @Column({ type: 'text' })
  content!: string;

  @CreateDateColumn()
  createdAt!: Date;
}
