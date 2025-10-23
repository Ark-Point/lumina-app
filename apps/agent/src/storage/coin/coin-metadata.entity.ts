import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from "typeorm";

@Unique("coin_metadata_unique_owner_per_chain", ["chainId", "ownerAddress"])
@Entity({ name: "coin_metadata" })
export class CoinMetadata {
  @PrimaryGeneratedColumn("increment", { type: "bigint" })
  id!: string;

  @Column({ type: "integer" })
  chainId!: number;

  @Index("idx_coin_metadata_owner_lower")
  @Column({ type: "varchar", length: 42 })
  ownerAddress!: string; // 0x + 40 hex (소문자 체크섬은 서비스 레벨에서 통일 권장)

  @Column({ type: "varchar", length: 80 })
  name!: string;

  @Column({ type: "varchar", length: 11 })
  symbol!: string;

  @Column({ type: "text", nullable: true })
  description?: string;

  @Column({ type: "text", nullable: true })
  imageUrl?: string;

  @Column({ type: "jsonb", nullable: true })
  properties?: Record<string, any>;

  @CreateDateColumn({ type: "timestamptz", name: "created_at" })
  createdAt!: Date;

  @UpdateDateColumn({ type: "timestamptz", name: "updated_at" })
  updatedAt!: Date;
}
